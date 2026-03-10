import { useState } from "react";
import { loadTemplates } from "./templateLoader";
import type { LetterTemplate } from "./types";
import TemplateForm from "./components/TemplateForm";
import LetterPreview from "./components/LetterPreview";
import PinScreen from "./components/PinScreen";

const letterTemplates = loadTemplates();

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<LetterTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const template =
      letterTemplates.find((t) => t.id === e.target.value) ?? null;
    setSelectedTemplate(template);
    setFormValues({});
  };

  if (!authenticated) {
    return <PinScreen onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📄 DocGen</h1>
      </header>

      <div className="app-body">
        {/* Sidebar — template selector + dynamic form */}
        <aside className="sidebar">
          <label htmlFor="template-select" className="label">
            Select a Template
          </label>
          <select
            id="template-select"
            className="select"
            value={selectedTemplate?.id ?? ""}
            onChange={handleTemplateChange}
          >
            <option value="" disabled>
              -- Choose a template --
            </option>
            {letterTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {selectedTemplate && (
            <TemplateForm
              template={selectedTemplate}
              values={formValues}
              onChange={setFormValues}
            />
          )}
        </aside>

        {/* Main — A4 live preview */}
        <main className="preview-panel">
          {selectedTemplate ? (
            <LetterPreview template={selectedTemplate} values={formValues} />
          ) : (
            <div className="empty-state">
              <p>Select a template to get started.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
