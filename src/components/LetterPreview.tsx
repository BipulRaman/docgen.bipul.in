import { useRef, useMemo, useCallback } from "react";
import type { LetterTemplate } from "../types";
import { renderTemplate } from "../placeholders";
import { exportToPdf } from "../exportPdf";

interface Props {
  template: LetterTemplate;
  values: Record<string, string>;
}

function LetterPreview({ template, values }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);

  const renderedHtml = useMemo(
    () => renderTemplate(template.html, values),
    [template.html, values]
  );

  const handleExport = useCallback(async () => {
    if (!previewRef.current) return;
    await exportToPdf(previewRef.current, template.name);
  }, [template.name]);

  return (
    <div className="preview-wrapper">
      <div className="preview-toolbar">
        <span className="preview-title">{template.name} — Preview</span>
        <button className="btn-export" onClick={handleExport} type="button">
          Export PDF
        </button>
      </div>

      <div className="a4-page" ref={previewRef}>
        <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      </div>
    </div>
  );
}

export default LetterPreview;
