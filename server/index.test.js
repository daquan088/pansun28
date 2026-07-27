import { afterAll, beforeAll, describe, expect, it } from "vitest";
import sharp from "sharp";
import { createApp } from "./index.js";
import { IMAGE_TIMEOUT_MS } from "./image-api.js";

const originalEnvironment = {
  XIAOJI_API_KEY: process.env.XIAOJI_API_KEY,
  XIAOJI_BASE_URL: process.env.XIAOJI_BASE_URL,
  XIAOJI_IMAGE_MODEL: process.env.XIAOJI_IMAGE_MODEL,
};

let inputPng;
let generatedPng;

beforeAll(async () => {
  inputPng = await sharp({
    create: { width: 2000, height: 1200, channels: 3, background: "#8aa06b" },
  }).png().toBuffer();
  generatedPng = await sharp({
    create: { width: 24, height: 16, channels: 3, background: "#d9c5a2" },
  }).png().toBuffer();
});

afterAll(() => {
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

async function withServer(app, callback) {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const { port } = server.address();
  try {
    return await callback(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

function analyzeForm(overrides = {}) {
  const form = new FormData();
  form.append("photo", overrides.photo ?? new Blob([inputPng], { type: "image/png" }), "portrait.png");
  form.append("answers", overrides.answers ?? JSON.stringify({
    sleep: "睡眠不足",
    digestion: "饮食规律",
    energy: "有些疲累",
    mood: "压力较高",
  }));
  form.append("consent", overrides.consent ?? "true");
  return form;
}

describe("Suhua image API", () => {
  it("reports whether the server has an API key without exposing it", async () => {
    process.env.XIAOJI_API_KEY = "health-secret";
    await withServer(createApp(), async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/health`);
      expect(response.status).toBe(200);
      expect(response.headers.get("cache-control")).toContain("no-store");
      const text = await response.text();
      expect(JSON.parse(text)).toEqual({ ok: true });
      expect(text).not.toContain("health-secret");
    });
  });

  it("sanitizes the photo and returns the documented contract from b64_json", async () => {
    process.env.XIAOJI_API_KEY = "server-only-secret";
    process.env.XIAOJI_BASE_URL = "https://xiaoji.baziapi.site/v1/";
    delete process.env.XIAOJI_IMAGE_MODEL;
    let upstreamCalled = false;

    const upstreamFetch = async (url, init) => {
      upstreamCalled = true;
      expect(url.toString()).toBe("https://xiaoji.baziapi.site/v1/images/edits");
      expect(init.headers.Authorization).toBe("Bearer server-only-secret");
      expect(init.signal).toBeInstanceOf(AbortSignal);
      expect(init.body.get("model")).toBe("gpt-image-2");
      const prompt = init.body.get("prompt");
      expect(prompt).toContain("保留人物身份、年龄、肤色和体型");
      expect(prompt).toContain("不得进行或暗示面相分析、健康诊断或医疗分析");
      expect(prompt).toContain("不要出现任何文字");

      const uploaded = Buffer.from(await init.body.get("image").arrayBuffer());
      const metadata = await sharp(uploaded).metadata();
      expect(metadata.format).toBe("jpeg");
      expect(metadata.width).toBe(1600);
      expect(metadata.height).toBe(960);
      expect(metadata.exif).toBeUndefined();

      return Response.json({ data: [{ b64_json: generatedPng.toString("base64") }] });
    };

    await withServer(createApp({ fetchImpl: upstreamFetch }), async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/analyze`, { method: "POST", body: analyzeForm() });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.ok).toBe(true);
      expect(body.image).toMatch(/^data:image\/jpeg;base64,/);
      expect(body.advice).toEqual({
        praise: expect.any(String),
        suggestions: expect.arrayContaining([expect.any(String)]),
        cta: expect.stringContaining("食养"),
        disclaimer: expect.stringContaining("自述状态"),
      });
      expect(body.advice.suggestions).toHaveLength(3);
      expect(JSON.stringify(body)).not.toContain("server-only-secret");
    });
    expect(upstreamCalled).toBe(true);
  });

  it("downloads an upstream URL and embeds it as a data URL", async () => {
    process.env.XIAOJI_API_KEY = "url-secret";
    process.env.XIAOJI_BASE_URL = "https://xiaoji.baziapi.site";
    process.env.XIAOJI_IMAGE_MODEL = "custom-image-model";
    let requestCount = 0;
    const upstreamFetch = async (url, init) => {
      requestCount += 1;
      if (requestCount === 1) {
        expect(init.body.get("model")).toBe("custom-image-model");
        return Response.json({ data: [{ url: "https://cdn.example.test/result.png" }] });
      }
      expect(url.toString()).toBe("https://cdn.example.test/result.png");
      expect(init.redirect).toBe("follow");
      return new Response(generatedPng, { headers: { "content-type": "image/png" } });
    };

    await withServer(createApp({ fetchImpl: upstreamFetch }), async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/analyze`, { method: "POST", body: analyzeForm() });
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.image).toMatch(/^data:image\/jpeg;base64,/);
    });
    expect(requestCount).toBe(2);
  });

  it("rejects processing unless consent is JSON true", async () => {
    process.env.XIAOJI_API_KEY = "unused-secret";
    let upstreamCalled = false;
    await withServer(createApp({ fetchImpl: async () => { upstreamCalled = true; } }), async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/analyze`, {
        method: "POST",
        body: analyzeForm({ consent: "false" }),
      });
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: { code: "CONSENT_REQUIRED", message: expect.any(String) },
      });
    });
    expect(upstreamCalled).toBe(false);
  });

  it("rejects invalid photos and answers before calling upstream", async () => {
    process.env.XIAOJI_API_KEY = "unused-secret";
    const upstreamFetch = async () => { throw new Error("must not be called"); };
    await withServer(createApp({ fetchImpl: upstreamFetch }), async (baseUrl) => {
      const badAnswers = await fetch(`${baseUrl}/api/analyze`, {
        method: "POST",
        body: analyzeForm({ answers: JSON.stringify({ sleep: "好" }) }),
      });
      expect(badAnswers.status).toBe(400);
      expect((await badAnswers.json()).error.code).toBe("INVALID_ANSWERS");

      const badPhoto = await fetch(`${baseUrl}/api/analyze`, {
        method: "POST",
        body: analyzeForm({ photo: new Blob(["not an image"], { type: "image/png" }) }),
      });
      expect(badPhoto.status).toBe(400);
      expect((await badPhoto.json()).error.code).toBe("INVALID_PHOTO");
    });
  });

  it("does not expose API keys or upstream details in failures", async () => {
    process.env.XIAOJI_API_KEY = "never-return-this-key";
    await withServer(createApp({
      fetchImpl: async () => new Response("vendor database stack trace", { status: 500 }),
    }), async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/analyze`, { method: "POST", body: analyzeForm() });
      const text = await response.text();
      expect(response.status).toBe(502);
      expect(text).not.toContain("never-return-this-key");
      expect(text).not.toContain("vendor database stack trace");
      expect(JSON.parse(text).error.code).toBe("IMAGE_GENERATION_FAILED");
    });
  });

  it("uses the required 125 second image timeout", () => {
    expect(IMAGE_TIMEOUT_MS).toBe(125_000);
  });
});
