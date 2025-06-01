import React, { useState } from 'react'
import { Form } from './components/Form'
import { Table } from './components/Table'
import type { Record } from './api/records'

const App: React.FC = () => {
  const [recordsFromForm, setRecordsFromForm] = useState<Record[]>([])

  const handleNewRecord = (newRec: Record) => {
    setRecordsFromForm(prev => [newRec, ...prev])
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-wrapper">
          <div className="header-left">
            <div className="header-title-main">Профильное задание</div>
            <div className="header-subtitle">Семёнов Глеб Михайлович</div>
            <div className="header-tags">
              <div className="header-tag">React</div>
              <div className="header-tag">TypeScript</div>
              <div className="header-tag">JavaScript</div>
            </div>
          </div>
          <div className="header-logo">
            <img
              src="https://internship.vk.company/_next/static/media/vk-vacancy-title-block.c576fd6e.svg"
              alt="VK Logo"
            />
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="form-section card">
          <Form onNew={handleNewRecord} />
        </section>
        <section className="table-section card">
          <Table extraRecords={recordsFromForm} />
        </section>
      </main>
    </div>
  )
}

export default App
