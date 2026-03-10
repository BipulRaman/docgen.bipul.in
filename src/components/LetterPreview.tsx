import { useMemo } from "react";
import type { LetterTemplate } from "../types";
import { renderTemplate } from "../placeholders";
import { exportToPdf } from "../exportPdf";

interface Props {
  template: LetterTemplate;
  values: Record<string, string>;
}

function LetterPreview({ template, values }: Props) {
  const renderedHtml = useMemo(
    () => renderTemplate(template.html, values),
    [template.html, values]
  );

  return (
    <div className="preview-wrapper">
      <div className="preview-toolbar">
        <span className="preview-title">{template.name} — Preview</span>
        <button className="btn-export" onClick={exportToPdf} type="button">
          Export PDF
        </button>
      </div>

      <div className="letter-page">
        <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      </div>
    </div>
  );
}

export default LetterPreview;
