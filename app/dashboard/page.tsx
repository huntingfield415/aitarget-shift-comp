'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerate = () => {
    setMessage('シフトを自動生成しました。');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-3">シフト自動生成</h2>

      {message && (
        <div className="alert alert-info mt-3" role="alert">
          {message}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">登録済みクラス</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">うめ組（3歳）・園児数: 15人</li>
            <li className="list-group-item">さくら組（4歳）・園児数: 18人</li>
          </ul>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-primary" onClick={handleGenerate}>
          シフト生成
        </button>
        <button className="btn btn-secondary">
          テンプレートを適用
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted">生成結果</h6>
          <p className="card-text">ここに最新のシフト結果を表示</p>
        </div>
      </div>
    </div>
  );
}
