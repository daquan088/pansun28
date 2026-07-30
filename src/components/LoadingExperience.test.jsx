// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoadingExperience, {
  MIN_LOADING_MS,
  WAITING_PROGRESS,
  phaseFor,
  progressAt,
} from "./LoadingExperience";

describe("cinematic loading experience", () => {
  it("moves smoothly from 1% to the 92% waiting boundary over 20 seconds", () => {
    expect(MIN_LOADING_MS).toBe(20_000);
    expect(progressAt(0)).toBe(1);
    expect(progressAt(5_000)).toBeGreaterThan(1);
    expect(progressAt(10_000)).toBeGreaterThan(progressAt(5_000));
    expect(progressAt(19_000)).toBeLessThanOrEqual(WAITING_PROGRESS);
    expect(progressAt(MIN_LOADING_MS)).toBe(WAITING_PROGRESS);
    expect(progressAt(60_000)).toBe(WAITING_PROGRESS);
  });

  it("states that the visual card is still being completed at 92%", () => {
    render(<LoadingExperience progress={WAITING_PROGRESS} />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "报告生成进度 92%");
    expect(screen.getAllByText("正在完成视觉卡").length).toBeGreaterThan(0);
    expect(phaseFor(WAITING_PROGRESS).detail).toContain("真实结果");
  });
});
