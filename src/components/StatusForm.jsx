import {
  Activity,
  BedDouble,
  CloudSun,
  HeartPulse,
  ScanFace,
  Waves,
} from "lucide-react";

export const STATUS_GROUPS = [
  {
    id: "bowelRhythm",
    label: "排便节奏",
    prompt: "最近一周，你感受到的排便节奏是？",
    icon: Activity,
    options: ["规律顺畅", "偶尔不够规律", "排便不够规律"],
  },
  {
    id: "gutComfort",
    label: "肠道舒适",
    prompt: "最近一周，你的腹部舒适感是？",
    icon: Waves,
    options: ["大多舒适", "偶有胀闷", "经常感觉不舒适"],
  },
  {
    id: "complexionSelfReport",
    label: "气色自我感受",
    prompt: "不参考照片，你自己如何感受近期气色？",
    icon: ScanFace,
    options: ["自觉气色明亮", "自觉气色偶尔偏暗", "自觉气色偏暗或偏黄"],
  },
  {
    id: "sleep",
    label: "睡眠感受",
    prompt: "近期醒来后的感受如何？",
    icon: BedDouble,
    options: ["精神比较充足", "有时仍觉疲惫", "常常睡不够或难入睡"],
  },
  {
    id: "stress",
    label: "压力感受",
    prompt: "近期整体紧张和压力感如何？",
    icon: HeartPulse,
    options: ["轻松平稳", "偶有紧绷", "持续紧张"],
  },
  {
    id: "mood",
    label: "情绪活力",
    prompt: "近期情绪和活力更接近哪种状态？",
    icon: CloudSun,
    options: ["情绪活力较好", "偶有低落或提不起劲", "持续低落"],
  },
];

export default function StatusForm({ values, onChange }) {
  return (
    <section className="status-form" aria-label="六项本人状态自述">
      <div className="self-report-notice">
        <ScanFace size={18} />
        <p><strong>以下均为本人自述</strong>，不是照片识别，也不构成诊断。请选择最接近最近一周感受的选项。</p>
      </div>
      <div className="status-grid">
        {STATUS_GROUPS.map(({ id, label, prompt, icon: Icon, options }, groupIndex) => (
          <fieldset className="status-group" key={id}>
            <legend>
              <span className="question-icon"><Icon size={18} /></span>
              <span><small>{String(groupIndex + 1).padStart(2, "0")} / 06</small><strong>{label}</strong></span>
            </legend>
            <p className="question-prompt">{prompt}</p>
            <div className="choice-grid">
              {options.map((option) => (
                <label className={`choice ${values[id] === option ? "is-selected" : ""}`} key={option}>
                  <input
                    type="radio"
                    name={id}
                    value={option}
                    checked={values[id] === option}
                    onChange={() => onChange(id, option)}
                  />
                  <span className="radio-dot" aria-hidden="true" />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </section>
  );
}
