import { Activity, BedDouble, Salad, Sparkles } from "lucide-react";

export const STATUS_GROUPS = [
  { id: "diet", label: "饮食", prompt: "近期吃饭的状态更接近哪一种？", icon: Salad, options: ["规律舒适", "偶尔不规律", "经常外食或应付"] },
  { id: "sleep", label: "睡眠", prompt: "近期醒来后的感受如何？", icon: BedDouble, options: ["精神比较充足", "有时仍觉疲惫", "常常睡不够或难入睡"] },
  { id: "activity", label: "活动", prompt: "近期日常活动量如何？", icon: Activity, options: ["每天都有活动", "偶尔散步活动", "大部分时间久坐"] },
  { id: "stress", label: "压力", prompt: "近期整体压力感如何？", icon: Sparkles, options: ["轻松平稳", "偶有紧绷", "持续忙碌或压力较大"] },
];

export default function StatusForm({ values, onChange }) {
  return (
    <section className="status-form" aria-label="日常状态选择">
      {STATUS_GROUPS.map(({ id, label, prompt, icon: Icon, options }, groupIndex) => (
        <fieldset className="status-group" key={id}>
          <legend>
            <span className="question-index">{String(groupIndex + 1).padStart(2, "0")}</span>
            <span className="question-icon"><Icon size={19} /></span>
            <span><strong>{label}</strong><small>{prompt}</small></span>
          </legend>
          <div className="choice-grid">
            {options.map((option) => (
              <label className={`choice ${values[id] === option ? "is-selected" : ""}`} key={option}>
                <input type="radio" name={id} value={option} checked={values[id] === option} onChange={() => onChange(id, option)} />
                <span className="radio-dot" aria-hidden="true" />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </section>
  );
}
