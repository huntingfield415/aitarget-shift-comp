'use client';

import { useState } from 'react';

export default function ShiftTemplatePage() {
  const [templateName, setTemplateName] = useState('');
  const [templates, setTemplates] = useState<string[]>([]);

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    setTemplates([...templates, templateName.trim()]);
    setTemplateName('');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">シフトテンプレートの保存</h2>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="テンプレート名（例：4月用）"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleSaveTemplate}>
          保存
        </button>
      </div>

      {templates.length > 0 && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">保存済みテンプレート</h5>
            <ul className="list-group list-group-flush">
              {templates.map((name, index) => (
                <li key={index} className="list-group-item">{name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
