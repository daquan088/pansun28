// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  RadarChart: ({ children }) => <div>{children}</div>,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
  Radar: () => null,
}));

import ResultView from "./ResultView";

const result = {
  image: "data:image/png;base64,abc",
  praise: "感谢你认真记录自己的状态。",
  suggestions: ["建议一"],
  cta: "欢迎进一步交流。",
  disclaimer: "仅作参考。",
  contact: {
    wechatId: "pansun28",
    qrUrl: "/pansun28-wechat.png",
    label: "扫码获取微信号",
  },
};

const answers = {
  bowelRhythm: "偶尔不够规律",
  gutComfort: "偶有胀闷",
  complexionSelfReport: "自觉气色偶尔偏暗",
  sleep: "有时仍觉疲惫",
  stress: "偶有紧绷",
  mood: "持续低落",
};

describe("ResultView", () => {
  it("renders six-axis report data, contact details, and professional support", () => {
    render(<ResultView result={result} answers={answers} onRestart={() => {}} />);

    expect(screen.getByLabelText("六维本人自述雷达图")).toBeInTheDocument();
    expect(screen.getByText("综合观察值")).toBeInTheDocument();
    expect(screen.getByText("请把专业支持放在优先位置")).toBeInTheDocument();
    expect(screen.getByText("扫码获取微信号")).toBeInTheDocument();
    expect(screen.getAllByText(/pansun28/).length).toBeGreaterThan(0);
    expect(screen.getByText(/报告仅依据本人自述，照片不用于健康推断/)).toBeInTheDocument();
  });
});
