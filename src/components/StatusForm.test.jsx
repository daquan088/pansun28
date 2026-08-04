// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import StatusForm, { STATUS_GROUPS } from "./StatusForm";

afterEach(cleanup);

describe("StatusForm", () => {
  it("renders nine explicit self-report questions", () => {
    render(<StatusForm values={{}} onChange={() => {}} />);

    expect(STATUS_GROUPS.map(({ id }) => id)).toEqual([
      "bowelRhythm",
      "bowelEase",
      "gutComfort",
      "postMealGut",
      "complexionSelfReport",
      "complexionPattern",
      "sleep",
      "stress",
      "mood",
    ]);
    expect(screen.getByText("以下均为本人自述与日常观察")).toBeInTheDocument();
    expect(screen.getByText(/不是舌照识别，也不构成诊断/)).toBeInTheDocument();
    expect(screen.getByLabelText("持续低落")).toBeInTheDocument();
    expect(screen.getByLabelText("经常费力、久蹲或有排不尽感")).toBeInTheDocument();
    expect(screen.getByLabelText("持续感觉明显偏厚或偏少")).toBeInTheDocument();
  });

  it("reports the selected dimension and value", () => {
    const onChange = vi.fn();
    render(<StatusForm values={{}} onChange={onChange} />);

    fireEvent.click(screen.getByLabelText("自觉持续明显偏淡或偏红"));
    expect(onChange).toHaveBeenCalledWith("complexionSelfReport", "自觉持续明显偏淡或偏红");
  });
});
