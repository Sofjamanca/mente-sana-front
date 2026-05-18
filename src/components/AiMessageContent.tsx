type UiMessage = {
  title?: string;
  summary?: string;
  steps?: string[];
  closing?: string;
} | null;

interface AiMessageContentProps {
  plainMessage?: string | null;
  uiMessage?: UiMessage;
  className?: string;
}

const AiMessageContent = ({ plainMessage, uiMessage, className }: AiMessageContentProps) => {
  const title = uiMessage?.title?.trim() || "";
  const summary = uiMessage?.summary?.trim() || "";
  const steps = Array.isArray(uiMessage?.steps)
    ? uiMessage!.steps!.map((step) => step?.trim()).filter(Boolean).slice(0, 5)
    : [];
  const closing = uiMessage?.closing?.trim() || "";

  const hasStructured = Boolean(title || summary || steps.length > 0 || closing);

  if (!hasStructured) {
    const fallbackParagraphs = (plainMessage || "")
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
    return (
      <div className={`${className || ""} ai-message ai-message--plain`.trim()}>
        {fallbackParagraphs.map((paragraph, index) => (
          <p key={`plain-${index}`} className="ai-message__plain-paragraph">{paragraph}</p>
        ))}
      </div>
    );
  }

  return (
    <div className={`${className || ""} ai-message ai-message--structured`.trim()}>
      {title ? <h4 className="ai-message__title">{title}</h4> : null}
      {summary ? <p className="ai-message__summary">{summary}</p> : null}
      {steps.length > 0 ? (
        <ol className="ai-message__steps">
          {steps.map((step, index) => (
            <li key={`step-${index}`} className="ai-message__step">
              <span className="ai-message__step-index">Paso {index + 1}</span>
              <p className="ai-message__step-text">{step}</p>
            </li>
          ))}
        </ol>
      ) : null}
      {closing ? <p className="ai-message__closing">{closing}</p> : null}
    </div>
  );
};

export default AiMessageContent;
