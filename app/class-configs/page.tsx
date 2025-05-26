'use client';

import { useState } from 'react';

interface ClassInfo {
  className: string;
  age: number;
  childrenCount: number;
}

export default function ClassConfigsPage() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [newClass, setNewClass] = useState<ClassInfo>({
    className: '',
    age: 0,
    childrenCount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClass({ ...newClass, [name]: name === 'age' || name === 'childrenCount' ? Number(value) : value });
  };

  const handleAddClass = () => {
    if (!newClass.className || newClass.age <= 0 || newClass.childrenCount <= 0) return;
    setClasses([...classes, newClass]);
    setNewClass({ className: '', age: 0, childrenCount: 0 });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">クラス構成の設定</h2>

      <div className="mb-3">
        <label className="form-label">クラス名</label>
        <input
          type="text"
          name="className"
          className="form-control"
          value={newClass.className}
          onChange={handleChange}
        />
      </div>

      <div className="row mb-3">
        <div className="col">
          <label className="form-label">園児の年齢</label>
          <input
            type="number"
            name="age"
            className="form-control"
            value={newClass.age}
            onChange={handleChange}
          />
        </div>
        <div className="col">
          <label className="form-label">園児数</label>
          <input
            type="number"
            name="childrenCount"
            className="form-control"
            value={newClass.childrenCount}
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="btn btn-success mb-4" onClick={handleAddClass}>
        クラスを追加
      </button>

      {classes.length > 0 && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">登録済みクラス</h5>
            <ul className="list-group list-group-flush">
              {classes.map((cls, index) => (
                <li key={index} className="list-group-item">
                  {cls.className}（{cls.age}歳）・園児数：{cls.childrenCount}人
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
