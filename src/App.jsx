import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, ShieldCheck } from "lucide-react";
import ProgressSidebar from "./components/ProgressSidebar";
import ResultView from "./components/ResultView";
import StatusForm, { STATUS_GROUPS } from "./components/StatusForm";
import UploadField from "./components/UploadField";

const EMPTY_STATES = Object.fromEntries(STATUS_GROUPS.map((group) => [group.id, ""]));
const ACCEPTED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const STEP_COPY = [
  { title: "上传照片", description: "选择一张清晰正面照" },
  { title: "状态自述", description: "主动选择四类日常信息" },
  { title: "确认提交", description: "阅读并确认隐私说明" },
  { title: "查看结果", description: "获取你的状态观察卡" },
];

export function createAnalyzeFormData(photo, answers) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("answers", JSON.stringify(answers));
  formData.append("consent", JSON.stringify(true));
  return formData;
}

export function parseAnalyzeResponse(payload) {
  const advice = payload?.advice;
  if (
    payload?.ok !== true
    || typeof payload.image !== "string"
    || typeof advice?.praise !== "string"
    || !Array.isArray(advice?.suggestions)
    || typeof advice?.cta !== "string"
    || typeof advice?.disclaimer !== "string"
  ) {
    throw new Error("服务返回的数据不完整，请重新生成。");
  }
  return { image: payload.image, ...advice };
}

export default function App() {
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [states, setStates] = useState(EMPTY_STATES);
  const [consented, setConsented] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const previewRef = useRef("");

  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  const completedStates = useMemo(
    () => STATUS_GROUPS.filter((group) => states[group.id]).length,
    [states],
  );

  function selectPhoto(file) {
    setError("");
    if (!file) return;
    if (!ACCEPTED_PHOTO_TYPES.has(file.type)) {
      setError("请选择 JPG、PNG 或 WebP 图片。");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("照片大小不能超过 10MB，请压缩后重试。");
      return;
    }
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const nextUrl = URL.createObjectURL(file);
    previewRef.current = nextUrl;
    setPreviewUrl(nextUrl);
    setPhoto(file);
  }

  function updateState(groupId, value) {
    setError("");
    setStates((current) => ({ ...current, [groupId]: value }));
  }

  function moveNext() {
    setError("");
    if (step === 0 && !photo) {
      setError("请先上传一张清晰的正面照。");
      return;
    }
    if (step === 1 && completedStates !== STATUS_GROUPS.length) {
      setError("请完成饮食、睡眠、活动和压力四项选择。");
      return;
    }
    setStep((current) => Math.min(current + 1, 2));
  }

  async function submitAnalysis() {
    if (!consented) {
      setError("请勾选隐私同意后再生成观察卡。");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setProgress(8);
    const progressTimer = window.setInterval(() => {
      setProgress((current) => Math.min(current + Math.max(2, Math.round((88 - current) / 7)), 88));
    }, 420);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: createAnalyzeFormData(photo, states),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error?.message || payload?.message || "生成失败，请稍后重试。");
      }

      setProgress(100);
      setResult(parseAnalyzeResponse(payload));
      setStep(3);
    } catch (requestError) {
      setError(requestError.message || "网络连接异常，请检查后重试。");
    } finally {
      window.clearInterval(progressTimer);
      setIsSubmitting(false);
    }
  }

  function startOver() {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = "";
    setPhoto(null);
    setPreviewUrl("");
    setStates(EMPTY_STATES);
    setConsented(false);
    setResult(null);
    setProgress(0);
    setError("");
    setStep(0);
  }

  return (
    <div className="app-shell">
      <ProgressSidebar steps={STEP_COPY} currentStep={step} />

      <main className="workspace">
        <div className="workspace-inner">
          {step < 3 && (
            <header className="page-header">
              <p className="eyebrow">苏华食养状态观察卡</p>
              <h1>{STEP_COPY[step].title}</h1>
              <p>
                {step === 0 && "照片只用于生成视觉卡，不用于分析健康状况。"}
                {step === 1 && "选择最接近你近期感受的选项，没有好坏之分。"}
                {step === 2 && "确认信息与隐私说明，生成你的专属观察卡。"}
              </p>
            </header>
          )}

          {step === 0 && (
            <UploadField file={photo} previewUrl={previewUrl} onSelect={selectPhoto} />
          )}

          {step === 1 && (
            <StatusForm values={states} onChange={updateState} />
          )}

          {step === 2 && (
            <section className="confirm-panel" aria-labelledby="confirm-title">
              <div className="confirm-summary">
                <img src={previewUrl} alt="待分析照片预览" />
                <div>
                  <span className="summary-kicker"><Check size={16} /> 信息已就绪</span>
                  <h2 id="confirm-title">生成前，请确认隐私说明</h2>
                  <p>观察建议仅来自你主动选择的饮食、睡眠、活动和压力信息。</p>
                </div>
              </div>
              <label className={`consent-row ${consented ? "is-checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={consented}
                  onChange={(event) => {
                    setConsented(event.target.checked);
                    setError("");
                  }}
                  disabled={isSubmitting}
                />
                <span className="custom-checkbox" aria-hidden="true"><Check size={15} /></span>
                <span>
                  我已阅读并同意：照片仅用于生成本次个性化观察卡，不用于疾病诊断或健康推断。
                </span>
              </label>
              <div className="privacy-note">
                <ShieldCheck size={19} />
                <p>请勿上传他人照片。照片与自述信息将按服务隐私规则处理。</p>
              </div>
            </section>
          )}

          {step === 3 && result && <ResultView result={result} onRestart={startOver} />}

          {isSubmitting && (
            <div className="progress-overlay" role="status" aria-live="polite">
              <div className="progress-dialog">
                <LoaderCircle className="spin" size={30} />
                <h2>正在生成状态观察卡</h2>
                <p>正在整理你的主动选择并生成专属视觉卡…</p>
                <div className="progress-track" aria-label={`生成进度 ${progress}%`}>
                  <span style={{ width: `${progress}%` }} />
                </div>
                <strong>{progress}%</strong>
              </div>
            </div>
          )}

          {error && <p className="error-message" role="alert">{error}</p>}

          {step < 3 && (
            <footer className="form-actions">
              {step > 0 ? (
                <button className="button button-secondary" type="button" onClick={() => { setError(""); setStep(step - 1); }} disabled={isSubmitting}>
                  <ArrowLeft size={18} /> 上一步
                </button>
              ) : <span />}
              {step < 2 ? (
                <button className="button button-primary" type="button" onClick={moveNext}>
                  下一步 <ArrowRight size={18} />
                </button>
              ) : (
                <button className="button button-primary" type="button" onClick={submitAnalysis} disabled={!consented || isSubmitting}>
                  {isSubmitting ? <LoaderCircle className="spin" size={18} /> : <Check size={18} />}
                  生成观察卡
                </button>
              )}
            </footer>
          )}
        </div>
      </main>
    </div>
  );
}
