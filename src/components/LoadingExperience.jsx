import { Sparkles } from "lucide-react";

export const MIN_LOADING_MS = 20_000;
export const WAITING_PROGRESS = 92;

const PHASES = [
  { until: 24, title: "正在整理六项本人自述", detail: "将你的主动选择编排为清晰的观察维度" },
  { until: 52, title: "正在绘制六维状态光谱", detail: "让每项近期感受在同一视图中呈现" },
  { until: 78, title: "正在组织食养建议", detail: "结合自述生成可以从日常开始的小行动" },
  { until: 91, title: "正在渲染专属视觉报告", detail: "生成肖像与报告版式需要一点时间" },
  { until: 100, title: "正在完成视觉卡", detail: "接口仍在处理真实结果，请稍候" },
];

export function progressAt(elapsedMs) {
  if (elapsedMs <= 0) return 1;
  const ratio = Math.min(elapsedMs / MIN_LOADING_MS, 1);
  return Math.min(WAITING_PROGRESS, Math.max(1, Math.round(1 + 91 * (1 - ((1 - ratio) ** 2.1)))));
}

export function phaseFor(progress) {
  return PHASES.find(({ until }) => progress <= until) || PHASES.at(-1);
}

export default function LoadingExperience({ progress }) {
  const phase = phaseFor(progress);

  return (
    <div className="loading-stage" role="status" aria-live="polite" aria-label={`报告生成进度 ${progress}%`}>
      <div className="compass" aria-hidden="true">
        <span className="compass-ring ring-one" />
        <span className="compass-ring ring-two" />
        <span className="compass-ring ring-three" />
        <span className="compass-axis axis-one" />
        <span className="compass-axis axis-two" />
        <span className="compass-core"><Sparkles size={28} /></span>
      </div>
      <div className="loading-copy">
        <p className="loading-kicker">SU HUA · VISUAL REPORT</p>
        <h2>{phase.title}</h2>
        <p>{phase.detail}</p>
        <div className="loading-progress">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="loading-meta">
          <strong>{progress}%</strong>
          <span>{progress === WAITING_PROGRESS ? "正在完成视觉卡" : "请保持页面开启"}</span>
        </div>
      </div>
    </div>
  );
}
