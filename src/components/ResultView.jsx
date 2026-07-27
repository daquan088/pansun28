import { Check, Copy, Download, Leaf, RefreshCw, ShieldCheck } from "lucide-react";
import { toPng } from "html-to-image";
import { useRef, useState } from "react";

export default function ResultView({ result, onRestart }) {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [actionError, setActionError] = useState("");
  const keyword = "食养";
  const suggestions = result.suggestions.slice(0, 3);

  async function copyKeyword() {
    try {
      await navigator.clipboard.writeText(keyword);
      setCopied(true);
      setActionError("");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setActionError(`复制失败，请手动复制“${keyword}”。`);
    }
  }

  async function downloadCard() {
    setIsDownloading(true);
    setActionError("");
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = "苏华食养状态观察卡.png";
      link.href = dataUrl;
      link.click();
    } catch {
      setActionError("分享卡下载失败，请稍后重试。");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <section className="result-view">
      <header className="result-header">
        <div>
          <p className="eyebrow">已完成 · 苏华食养状态观察卡</p>
          <h1>这是属于你的日常观察</h1>
        </div>
        <button className="icon-button" type="button" onClick={onRestart} title="重新生成" aria-label="重新生成">
          <RefreshCw size={19} />
        </button>
      </header>

      <div className="share-card" ref={cardRef}>
        <div className="portrait-panel">
          <img src={result.image} alt="根据上传照片生成的视觉卡肖像" />
          <span className="portrait-label"><Leaf size={15} /> 苏华食养</span>
        </div>
        <div className="card-content">
          <div className="card-title">
            <span><Leaf size={18} /></span>
            <div><small>SU HUA DAILY NOTE</small><strong>食养状态观察卡</strong></div>
          </div>
          <blockquote>{result.praise || "你正在认真留意自己的日常，这份觉察本身就值得肯定。"}</blockquote>
          <div className="suggestion-list">
            <h2>今天可以从这些小事开始</h2>
            {suggestions.map((suggestion, index) => (
              <div className="suggestion" key={`${suggestion}-${index}`}>
                <span>{index + 1}</span><p>{suggestion}</p>
              </div>
            ))}
          </div>
          <p className="card-source">建议来自你主动选择的日常状态信息。</p>
        </div>
        <p className="card-disclaimer"><ShieldCheck size={15} /> {result.disclaimer || "照片不用于疾病诊断或健康推断，本卡仅作生活方式参考。"}</p>
      </div>

      <div className="result-actions">
        <button className="button button-primary" type="button" onClick={downloadCard} disabled={isDownloading}>
          <Download size={18} /> {isDownloading ? "正在生成图片…" : "下载分享卡"}
        </button>
        <button className="button button-secondary" type="button" onClick={copyKeyword}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? "已复制“食养”" : (result.cta || `复制私信关键词“${keyword}”`)}
        </button>
      </div>
      {actionError && <p className="error-message" role="alert">{actionError}</p>}
      <p className="result-footnote">生活方式建议不替代专业医疗建议；如有不适，请及时咨询专业人士。</p>
    </section>
  );
}
