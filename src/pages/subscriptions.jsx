
import React, { useEffect, useState } from 'react'
import '../styles/subscriptions.css'
import {
  subscribeListener,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptionsOnce,
} from '../services/subscriptionService'

export default function Subscriptions() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', features: '', currency: '', period: '' })

  useEffect(() => {
    let unsub
    try {
      unsub = subscribeListener((data) => {
        setList(data)
        setLoading(false)
      })
    } catch (err) {
      console.error(err)
      setError('Failed to subscribe to subscriptions')
      setLoading(false)
    }

    // fallback: get once if realtime fails
    getSubscriptionsOnce().then((data) => {
      if (!data || data.length === 0) return
      setList(data)
      setLoading(false)
    }).catch(() => {})

    return () => unsub && unsub()
  }, [])

  function openCreate() {
    setEditing(null)
    setForm({ name: '', price: '', features: '', currency: '', period: '' })
    setShowForm(true)
  }

  function openEdit(item) {
    setEditing(item)
    setForm({
      name: item.name || '',
      price: item.price || '',
      features: (item.features || []).join('\n'),
      currency: item.currency || '',
      period: item.period || ''
    })
    setShowForm(true)
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    const payload = {
      name: form.name,
      price: Number(form.price) || 0,
      features: form.features.split('\n').map((s) => s.trim()).filter(Boolean),
      currency: form.currency,
      period: form.period
    }
    try {
      if (editing) {
        await updateSubscription(editing.id, payload)
      } else {
        await createSubscription(payload)
      }
      setShowForm(false)
    } catch (err) {
      console.error(err)
      setError('Save failed')
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Delete this subscription plan?')) return
    try {
      await deleteSubscription(id)
    } catch (err) {
      console.error(err)
      setError('Delete failed')
    }
  }

  return (
    <div className="subscriptions-page">
      <header className="subs-header">
        <h2>Subscription Plans</h2>
        <div>
          <button className="primary" onClick={openCreate}>New Plan</button>
        </div>
      </header>

      {loading && <div className="muted">Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="subs-grid">
        {list && list.length > 0 ? (
          list.map((s) => (
            <article className="glass-card" key={s.id}>
              <div className="card-top">
                <h3 className="plan-name">{s.name}</h3>
                <div className="plan-price">${s.price}</div>
              </div>
              <ul className="plan-features">
                {(s.features || []).map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <div className="card-actions">
                <button onClick={() => openEdit(s)}>Edit</button>
                <button className="danger" onClick={() => onDelete(s.id)}>Delete</button>
              </div>
            </article>
          ))
        ) : (
          <div className="muted">No subscription plans found.</div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? 'Edit Plan' : 'New Plan'}</h3>
            <form onSubmit={onSubmit} className="plan-form">
              <label>
                Name
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <label>
                Price
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </label>
              <label>
                Currency
                <input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} placeholder="e.g. dt, $" />
              </label>
              <label>
                Period
                <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="e.g. Monthly, Annually" />
              </label>
              <label>
                Features (one per line)
                <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={6} />
              </label>
              <div className="form-actions">
                <button type="submit" className="primary">Save</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
