import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  Check,
  Copy,
  Download,
  HeartHandshake,
  Leaf,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { buildVisualReport } from "../lib/report.js";

const WECHAT_ID = "pansun28";

export default function ResultView({ result, answers, onRestart }) {
  const report = useMemo(() => buildVisualReport(answers), [answers]);
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [actionError, setActionError] = useState("");
  const needsMoodSupport = answers.mood === "持续低落";

  async function copyWechat() {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
      setCopied(true);
      setActionError("");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setActionError(`复制失败，请手动复制微信号“${WECHAT_ID}”。`);
    }
  }

  async function downloadReport() {
    setIsDownloading(true);
    setActionError("");
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#091313",
      });
      const link = document.createElement("a");
      link.download = "苏华食养六维状态报告.png";
      link.href = dataUrl;
      link.click();
    } catch {
      setActionError("报告图片生成失败，请稍后重试。");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <section className="result-view">
      <header className="result-header">
        <div>
          <p className="eyebrow">REPORT COMPLETE · 六维本人自述</p>
          <h1>你的食养状态光谱</h1>
        </div>
        <button className="icon-button" type="button" onClick={onRestart} title="重新生成" aria-label="重新生成">
          <RefreshCw size={19} />
        </button>
      </header>

      <div className="report-canvas" ref={cardRef}>
        <section className="report-hero">
          <div className="portrait-panel">
            <img src={result.image} alt="根据上传自拍生成的视觉肖像" />
            <div className="portrait-shade" />
            <span className="portrait-label"><Leaf size={15} /> 苏华食养</span>
            <div className="portrait-caption">
              <small>GENERATED PORTRAIT</small>
              <strong>视觉肖像</strong>
              <p>仅作报告视觉呈现，不参与状态判断</p>
            </div>
          </div>

          <div className="spectrum-panel">
            <div className="report-brand"><Sparkles size={17} /><span>SELF-REPORTED SPECTRUM</span></div>
            <div className="overall-row">
              <div><strong>{report.overall}</strong><span>/ 100</span></div>
              <p>综合观察值<small>由六项本人自述等权汇总</small></p>
            </div>
            <div className="radar-wrap" aria-label="六维本人自述雷达图">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={report.dimensions} outerRadius="66%">
                  <PolarGrid stroke="rgba(197, 224, 217, 0.2)" />
                  <PolarAngleAxis dataKey="label" tick={{ fill: "#dce9e5", fontSize: 12 }} />
                  <Radar dataKey="score" stroke="#72f0cc" fill="#41cfa8" fillOpacity={0.34} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="dimension-section">
          <div className="section-heading">
            <span>01</span><div><small>六维状态</small><h2>本人自述数据条</h2></div>
          </div>
          <div className="dimension-grid">
            {report.dimensions.map((dimension) => (
              <article className="dimension-item" key={dimension.id}>
                <div className="dimension-top"><strong>{dimension.label}</strong><span>{dimension.score}</span></div>
                <div className="dimension-track"><span style={{ width: `${dimension.score}%`, backgroundColor: dimension.color }} /></div>
                <p>{dimension.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="insight-section">
          <div className="praise-panel">
            <span className="section-number">02 · 今日寄语</span>
            <blockquote>{report.praise}</blockquote>
            <p>{result.praise}</p>
          </div>
          <div className="suggestion-panel">
            <div className="section-heading compact">
              <span>03</span><div><small>日常起点</small><h2>给你的食养建议</h2></div>
            </div>
            <div className="suggestion-list">
              {report.suggestions.map((suggestion, index) => (
                <div className="suggestion" key={`${suggestion}-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span><p>{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {needsMoodSupport && (
          <aside className="support-alert" role="note">
            <HeartHandshake size={24} />
            <div><strong>请把专业支持放在优先位置</strong><p>你自述近期情绪持续低落。请尽快联系心理或医疗专业人员，也可以请可信任的人陪伴。食养建议不能替代专业支持。</p></div>
          </aside>
        )}

        <section className="contact-section">
          <div className="contact-copy">
            <MessageCircle size={24} />
            <div><small>进一步交流</small><h2>微信 {WECHAT_ID}</h2><p>{result.cta}</p></div>
          </div>
          <div className="qr-block">
            <img src="/pansun28-wechat.png" alt="微信号 pansun28 的二维码图片" crossOrigin="anonymous" />
            <div><strong>扫码获取微信号</strong><span>也可复制：{WECHAT_ID}</span></div>
          </div>
        </section>

        <footer className="report-disclaimer">
          <ShieldCheck size={17} />
          <p>{report.disclaimer} 报告仅依据本人自述，照片不用于健康推断。</p>
        </footer>
      </div>

      <div className="result-actions">
        <button className="button button-primary" type="button" onClick={downloadReport} disabled={isDownloading}>
          <Download size={18} /> {isDownloading ? "正在生成图片" : "下载完整报告"}
        </button>
        <button className="button button-secondary" type="button" onClick={copyWechat}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? "已复制微信号" : `复制微信号 ${WECHAT_ID}`}
        </button>
      </div>
      {actionError && <p className="error-message" role="alert">{actionError}</p>}
      <p className="result-footnote">二维码用于获取微信号，不保证能够直接添加好友。</p>
    </section>
  );
}
