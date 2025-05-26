
'use client'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function PreviewPage() {
  const classes = [
    {
      name: 'さくら組',
      age: '3歳児',
      childrenCount: 15,
      teachers: ['山田先生', '佐藤先生'],
    },
    {
      name: 'もも組',
      age: '4歳児',
      childrenCount: 17,
      teachers: ['鈴木先生'],
    },
  ]

  return (
    <div className="container py-5">
      <h1 className="mb-4">デザインプレビュー画面</h1>
      <p className="mb-4">この画面で現状のUIレイアウトを確認できます。</p>
      <div className="row">
        {classes.map((classItem, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{classItem.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  <span className="badge bg-primary me-2">{classItem.age}</span>
                  <span className="badge bg-secondary">園児数: {classItem.childrenCount}人</span>
                </h6>
                <p className="card-text mt-3">担任: {classItem.teachers.join(', ')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
