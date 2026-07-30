const DIMENSION_DEFINITIONS = Object.freeze([
  Object.freeze({
    id: "bowelRhythm",
    label: "排便节奏",
    color: "#B7791F",
    fallback: "偶尔不够规律",
    aliases: Object.freeze({ 便秘: "排便不够规律", 经常不规律或排便费力: "排便不够规律" }),
    states: Object.freeze({
      规律顺畅: Object.freeze({
        score: 90,
        note: "你自述近期排便节奏较规律。",
        suggestion: "继续保持规律用餐和饮水，并留意适合自己的日常节奏。"
      }),
      偶尔不够规律: Object.freeze({
        score: 68,
        note: "你自述近期排便节奏偶尔不够规律。",
        suggestion: "尝试固定每天较从容的如厕时段，并在三餐中逐步增加蔬菜、全谷物和饮水。"
      }),
      排便不够规律: Object.freeze({
        score: 44,
        note: "你自述近期排便不够规律。",
        suggestion: "先记录几天的饮水、用餐和排便节奏；若长期困扰日常生活，可向专业人员咨询。"
      })
    })
  }),
  Object.freeze({
    id: "gutComfort",
    label: "肠道舒适",
    color: "#178F83",
    fallback: "偶有胀闷",
    aliases: Object.freeze({ 偶有胀满: "偶有胀闷", 经常胀满或不适: "经常感觉不舒适" }),
    states: Object.freeze({
      大多舒适: Object.freeze({
        score: 90,
        note: "你自述近期腹部大多感觉舒适。",
        suggestion: "延续让自己感觉舒适的用餐份量与速度，并继续观察不同食物后的个人感受。"
      }),
      偶有胀闷: Object.freeze({
        score: 68,
        note: "你自述近期腹部偶有胀闷感。",
        suggestion: "用餐时放慢速度、避免一次吃得过多，并记录哪些安排更符合自己的舒适感。"
      }),
      经常感觉不舒适: Object.freeze({
        score: 44,
        note: "你自述近期腹部经常感觉不舒适。",
        suggestion: "暂时选择熟悉、清淡且份量适中的餐食；若持续影响进食或生活，请寻求专业支持。"
      })
    })
  }),
  Object.freeze({
    id: "complexionSelfReport",
    label: "气色自我感受",
    color: "#C0566B",
    fallback: "自觉气色偶尔偏暗",
    aliases: Object.freeze({
      脸黄: "自觉气色偏暗或偏黄",
      自觉偏暗或偏黄: "自觉气色偏暗或偏黄",
      自觉明亮有精神: "自觉气色明亮"
    }),
    states: Object.freeze({
      自觉气色明亮: Object.freeze({
        score: 90,
        note: "你自述近期气色看起来较明亮。",
        suggestion: "继续保持规律三餐、充足饮水和稳定休息，记录让自己感觉良好的日常安排。"
      }),
      自觉气色偶尔偏暗: Object.freeze({
        score: 68,
        note: "你自述近期气色偶尔看起来偏暗。",
        suggestion: "先从规律吃饭和休息入手，每餐尽量安排多样食材，不用依据外观自行下结论。"
      }),
      自觉气色偏暗或偏黄: Object.freeze({
        score: 44,
        note: "你自述近期气色看起来偏暗或偏黄。",
        suggestion: "把这项感受与近期作息、饮食一并记录；若变化持续或伴随明显不适，请咨询专业人员。"
      })
    })
  }),
  Object.freeze({
    id: "sleep",
    label: "睡眠感受",
    color: "#3B6FB6",
    fallback: "有时仍觉疲惫",
    aliases: Object.freeze({ 睡不好: "常常睡不够或难入睡" }),
    states: Object.freeze({
      精神比较充足: Object.freeze({
        score: 90,
        note: "你自述近期醒来后的休息感较充足。",
        suggestion: "保持当前较稳定的休息安排，睡前留出一段安静的收尾时间。"
      }),
      有时仍觉疲惫: Object.freeze({
        score: 68,
        note: "你自述近期醒来后有时仍感疲惫。",
        suggestion: "今晚尝试提前十五分钟结束高强度事务，让入睡前的节奏慢下来。"
      }),
      常常睡不够或难入睡: Object.freeze({
        score: 44,
        note: "你自述近期常常睡不够或难入睡。",
        suggestion: "先连续三天固定上床和起床时段；若长期影响白天生活，请寻求专业支持。"
      })
    })
  }),
  Object.freeze({
    id: "stress",
    label: "压力感受",
    color: "#7A5AA6",
    fallback: "偶有紧绷",
    aliases: Object.freeze({ 焦虑: "持续紧张", 持续忙碌或压力较大: "持续紧张" }),
    states: Object.freeze({
      轻松平稳: Object.freeze({
        score: 90,
        note: "你自述近期整体感受较轻松平稳。",
        suggestion: "继续保留让自己放松的日常片段，为忙碌时段预留缓冲。"
      }),
      偶有紧绷: Object.freeze({
        score: 68,
        note: "你自述近期偶尔感到紧绷。",
        suggestion: "在日程中明确留出十分钟空档，用来慢走、安静坐一会儿或整理思路。"
      }),
      持续紧张: Object.freeze({
        score: 44,
        note: "你自述近期持续紧张。",
        suggestion: "先减少一项非必要安排，并联系可信任的人交流；若持续影响生活，请寻求专业支持。"
      })
    })
  }),
  Object.freeze({
    id: "mood",
    label: "情绪活力",
    color: "#D06B32",
    fallback: "偶有低落或提不起劲",
    aliases: Object.freeze({
      抑郁: "持续低落",
      偶有低落: "偶有低落或提不起劲",
      持续低落或缺少活力: "持续低落",
      轻松有活力: "情绪活力较好"
    }),
    states: Object.freeze({
      情绪活力较好: Object.freeze({
        score: 90,
        note: "你自述近期情绪与活力较平稳。",
        suggestion: "继续保留能带来轻松感和活力的日常活动，也给自己留出休息空间。"
      }),
      偶有低落或提不起劲: Object.freeze({
        score: 68,
        note: "你自述近期偶有低落或提不起劲。",
        suggestion: "今天安排一件负担较小、能够完成的事，并找可信任的人说说近期感受。"
      }),
      持续低落: Object.freeze({
        score: 44,
        note: "你自述近期持续低落。",
        suggestion: "请尽快寻求心理或医疗专业支持，并联系可信任的人陪伴；食养建议不能替代专业支持。"
      })
    })
  })
]);

const PRAISE = Object.freeze({
  steady: "你在近期日常安排中保持了不少稳定节奏，这份持续关注值得肯定。",
  mixed: "你已经留意到近期生活节奏，并愿意从具体小事开始，这份观察值得肯定。",
  changing: "你愿意如实记录近期状态，并为下一步行动留出空间，这份记录值得肯定。"
});

const DISCLAIMER =
  "本报告仅根据你主动选择的六项近期自述生成。照片只用于视觉展示，不参与任何状态判断；内容仅作日常食养与生活记录参考，不能替代心理或医疗专业支持。";

function getAnswersSource(answers) {
  return answers !== null && typeof answers === "object" && !Array.isArray(answers)
    ? answers
    : {};
}

function resolveState(definition, source) {
  const selected = source[definition.id];
  const normalized = Object.hasOwn(definition.aliases, selected)
    ? definition.aliases[selected]
    : selected;

  return Object.hasOwn(definition.states, normalized)
    ? definition.states[normalized]
    : definition.states[definition.fallback];
}

function buildHighlights(dimensions) {
  const strongDimensions = dimensions.filter(({ score }) => score >= 80);

  if (strongDimensions.length === 0) {
    return ["你已完成六项近期状态记录，为接下来的日常安排提供了清晰起点。"];
  }

  return strongDimensions.map(({ label, note }) => `${label}：${note}`);
}

export function buildVisualReport(answers) {
  const source = getAnswersSource(answers);
  const resolved = DIMENSION_DEFINITIONS.map((definition) => ({
    definition,
    state: resolveState(definition, source)
  }));
  const dimensions = resolved.map(({ definition, state }) =>
    Object.freeze({
      id: definition.id,
      label: definition.label,
      score: state.score,
      color: definition.color,
      note: state.note
    })
  );
  const overall = Math.round(
    dimensions.reduce((total, dimension) => total + dimension.score, 0) /
      dimensions.length
  );
  const praise = overall >= 82 ? PRAISE.steady : overall >= 60 ? PRAISE.mixed : PRAISE.changing;

  return Object.freeze({
    overall,
    dimensions: Object.freeze(dimensions),
    praise,
    highlights: Object.freeze(buildHighlights(dimensions)),
    suggestions: Object.freeze(resolved.map(({ state }) => state.suggestion)),
    disclaimer: DISCLAIMER
  });
}
