'use client';

import { useState } from 'react';

export default function InitPage() {
  const [schoolName, setSchoolName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">保育園シフト 初期設定</h2>

      {isSubmitted ? (
        <div className="alert alert-success" role="alert">
          初期設定が完了しました。次回以降はこの設定をもとに開始されます。
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">保育園名（登録後は変更できません）</label>
            <input
              type="text"
              className="form-control"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            設定を保存して開始
          </button>
        </form>
      )}
    </div>
  );
}
