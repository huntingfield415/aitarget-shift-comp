'use client';

export default function GeneratePage() {
  return (
    <div className="container mt-5">
      <h2 className="mb-4">AIによるシフト生成（Dify連携）</h2>
      <div className="card">
        <div className="card-body">
          <iframe
            src="https://app.dify.ai/chat/your-app-id?user_id=保育園ID"
            width="100%"
            height="600"
            frameBorder="0"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
