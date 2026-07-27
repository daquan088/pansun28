import { describe, expect, it } from "vitest";
import { createAnalyzeFormData, parseAnalyzeResponse } from "../App";

describe("analyze API contract", () => {
  it("creates the expected multipart fields", () => {
    const photo = new Blob(["photo"], { type: "image/jpeg" });
    const answers = { diet: "规律舒适", sleep: "精神比较充足" };
    const formData = createAnalyzeFormData(photo, answers);

    expect(JSON.parse(formData.get("answers"))).toEqual(answers);
    expect(JSON.parse(formData.get("consent"))).toBe(true);
    expect(formData.get("photo")).toBeInstanceOf(Blob);
    expect([...formData.keys()]).toEqual(["photo", "answers", "consent"]);
  });

  it("normalizes a successful response", () => {
    const payload = {
      ok: true,
      image: "data:image/png;base64,abc",
      advice: {
        praise: "你正在认真照顾自己的日常。",
        suggestions: ["按时吃饭", "早点休息", "散步十分钟"],
        cta: "私信关键词“食养”",
        disclaimer: "内容仅作生活方式参考。",
      },
    };

    expect(parseAnalyzeResponse(payload)).toEqual({ image: payload.image, ...payload.advice });
  });

  it("rejects incomplete responses", () => {
    expect(() => parseAnalyzeResponse({ ok: true, image: "x", advice: {} })).toThrow("数据不完整");
  });
});
