import { useMemo } from "react";
import type { LetterTemplate } from "../types";
import { extractPlaceholders } from "../placeholders";

interface Props {
  template: LetterTemplate;
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

function TemplateForm({ template, values, onChange }: Props) {
  const fields = useMemo(
    () => extractPlaceholders(template.html),
    [template.html]
  );

  const handleChange = (key: string, value: string) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <form className="template-form" onSubmit={(e) => e.preventDefault()}>
      <h2 className="form-title">{template.name}</h2>

      {fields.map((field) => (
        <div className="form-group" key={field.key}>
          <label htmlFor={field.key} className="form-label">
            {field.label}
          </label>

          {field.type === "textarea" ? (
            <textarea
              id={field.key}
              className="form-input"
              rows={3}
              value={values[field.key] ?? ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
          ) : (
            <input
              id={field.key}
              className="form-input"
              type={field.type}
              value={values[field.key] ?? ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
          )}
        </div>
      ))}
    </form>
  );
}

export default TemplateForm;
