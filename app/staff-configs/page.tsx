'use client';

import { useState } from 'react';

export default function StaffConfigsPage() {
  const [staffName, setStaffName] = useState('');
  const [staffList, setStaffList] = useState<string[]>([]);

  const handleAddStaff = () => {
    if (!staffName.trim()) return;
    setStaffList([...staffList, staffName.trim()]);
    setStaffName('');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">保育士の設定</h2>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="保育士名または番号"
          value={staffName}
          onChange={(e) => setStaffName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddStaff}>
          追加
        </button>
      </div>

      {staffList.length > 0 && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">登録済み保育士</h5>
            <ul className="list-group list-group-flush">
              {staffList.map((name, index) => (
                <li key={index} className="list-group-item">{name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
