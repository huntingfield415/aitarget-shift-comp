'use client';

export default function SettingsPage() {
  return (
    <div className="container mt-5">
      <h2 className="mb-4">設定画面</h2>

      <div className="list-group">
        <a href="/init" className="list-group-item list-group-item-action">保育園名の設定</a>
        <a href="/class-configs" className="list-group-item list-group-item-action">クラス構成</a>
        <a href="/staff-configs" className="list-group-item list-group-item-action">保育士管理</a>
        <a href="/shift-template" className="list-group-item list-group-item-action">シフトテンプレート</a>
        <a href="/generate" className="list-group-item list-group-item-action">シフト生成（AI連携）</a>
      </div>
    </div>
  );
}
