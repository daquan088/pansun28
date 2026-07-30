// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import StatusForm, { STATUS_GROUPS } from "./StatusForm";

afterEach(cleanup);

describe("StatusForm", () => {
  it("renders six explicit self-report dimensions", () => {
    render(<StatusForm values={{}} onChange={() => {}} />);

    expect(STATUS_GROUPS.map(({ id }) => id)).toEqual([
      "bowelRhythm",
      "gutComfort",
      "complexionSelfReport",
      "sleep",
      "stress",
      "mood",
    ]);
    expect(screen.getByText("以下均为本人自述")).toBeInTheDocument();
    expect(screen.getByText(/不是照片识别，也不构成诊断/)).toBeInTheDocument();
    expect(screen.getByLabelText("持续低落")).toBeInTheDocument();
  });

  it("reports the selected dimension and value", () => {
    const onChange = vi.fn();
    render(<StatusForm values={{}} onChange={onChange} />);

    fireEvent.click(screen.getByLabelText("自觉气色偏暗或偏黄"));
    expect(onChange).toHaveBeenCalledWith("complexionSelfReport", "自觉气色偏暗或偏黄");
  });
});
