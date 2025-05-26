'use client';

export default function StatsPage() {
  return (
    <div className="container mt-5">
      <h2 className="mb-4">統計情報</h2>

      <div className="card">
        <div className="card-body">
          <p className="card-text">今月のシフト生成回数：5回</p>
          <p className="card-text">最も多く勤務した保育士：佐藤</p>
        </div>
      </div>
    </div>
  );
}
