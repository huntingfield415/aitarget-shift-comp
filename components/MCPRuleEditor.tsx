import { useState } from 'react'

export default function MCPRuleEditor({ rule, onSave }: { rule: any; onSave: (updated: any) => void }) {
  const [value, setValue] = useState(JSON.stringify(rule.value, null, 2))

  const handleSave = () => {
    try {
      const parsed = JSON.parse(value)
      onSave({ ...rule, value: parsed })
    } catch (e) {
      alert('JSONの形式が正しくありません')
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4>{rule.rule_name}</h4>
      <textarea
        style={{ width: '100%', height: '100px' }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleSave}>保存</button>
    </div>
  )
}
