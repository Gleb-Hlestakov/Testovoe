import React, { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { Record } from '../api/records'

interface FormValues {
  field1: string
  field2: string
  field3: string
  field4: string
  field5: string
}

interface FormProps {
  onNew: (rec: Record) => void
}

export const Form: React.FC<FormProps> = ({ onNew }) => {
  const [values, setValues] = useState<FormValues>({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: '',
  })
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
    try {
      const response = await fetch('http://localhost:4000/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}`)
      }
      const newRecord: Record = await response.json()
      onNew(newRecord)
      setValues({
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
      })
    } catch (err: any) {
      setError(err.message || 'Неизвестная ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Поле 1:</label>
        <input
          name="field1"
          value={values.field1}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Поле 2:</label>
        <input
          name="field2"
          value={values.field2}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Поле 3:</label>
        <input
          name="field3"
          value={values.field3}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Поле 4:</label>
        <input
          name="field4"
          value={values.field4}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Поле 5:</label>
        <input
          name="field5"
          value={values.field5}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Сохраняем...' : 'Добавить запись'}
      </button>
      {error && <div className="load-message">Ошибка: {error}</div>}
    </form>
  )
}
