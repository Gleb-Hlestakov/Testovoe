import React, { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { Record as ApiRecord } from '../api/records'

const fieldNames = [
  'field1',
  'field2',
  'field3',
  'field4',
  'field5',
  'field6',
  'field7',
]

const fieldLabels: Record<string, string> = {
  field1: 'Поле 1',
  field2: 'Поле 2',
  field3: 'Поле 3',
  field4: 'Поле 4',
  field5: 'Поле 5',
  field6: 'Поле 6',
  field7: 'Поле 7',
}

interface FormValues {
  [key: string]: string
}

interface FormProps {
  onNew: (rec: ApiRecord) => void
}

export const Form: React.FC<FormProps> = ({ onNew }) => {
  const initialValues: FormValues = fieldNames.reduce((acc: FormValues, name: string) => {
    acc[name] = ''
    return acc
  }, {})

  const [values, setValues] = useState<FormValues>(initialValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const nonEmptyCount = Object.values(values).filter(v => v.trim() !== '').length
    if (nonEmptyCount < 5) {
      setError(`Нужно заполнить хотя бы 5 любых полей, сейчас заполнено ${nonEmptyCount}`)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:4000/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}`)
      }
      const newRecord: ApiRecord = await response.json()
      onNew(newRecord)
      setValues(initialValues)
    } catch (err: any) {
      setError(err.message || 'Неизвестная ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-section">
      {fieldNames.map(name => (
        <div key={name} style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '0.5rem' }}>
            {fieldLabels[name]}:
          </label>
          <input
            name={name}
            value={values[name]}
            onChange={handleChange}
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
        className="btn-submit"
      >
        {loading ? 'Сохраняем…' : 'Добавить запись'}
      </button>
      {error && (
        <div style={{ color: 'red', marginTop: '0.5rem' }}>
          Ошибка: {error}
        </div>
      )}
    </form>
  )
}
