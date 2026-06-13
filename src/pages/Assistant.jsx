import { useState, useRef, useEffect } from 'react'
import Icon from '../components/icons.jsx'
import { api } from '../lib/api.js'
import { USE_MOCK } from '../lib/config.js'
import { assistantSeed, assistantSuggestions, assistantCanned } from '../data/mockData.js'
import './dash.css'
import './Assistant.css'

/* Keyword-matched reply used in mock mode. In live mode the message is
   sent to POST /api/assistant, which returns the reply. */
function replyFor(text) {
  const t = text.toLowerCase()
  if (t.includes('irrigat') || t.includes('water') || t.includes('grape')) return assistantCanned.irrigate
  if (t.includes('thrip') || t.includes('pest') || t.includes('onion')) return assistantCanned.thrips
  if (t.includes('fertil') || t.includes('sugarcane') || t.includes('nutrient')) return assistantCanned.fertilizer
  return assistantCanned.default
}

export default function Assistant() {
  const [messages, setMessages] = useState(assistantSeed)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  async function send(text) {
    const content = (text ?? input).trim()
    if (!content) return
    setMessages((m) => [...m, { role: 'user', text: content }])
    setInput('')
    setTyping(true)

    if (USE_MOCK) {
      setTimeout(() => {
        setMessages((m) => [...m, { role: 'assistant', text: replyFor(content) }])
        setTyping(false)
      }, 1100)
      return
    }

    try {
      const { reply } = await api.post('/assistant', { message: content })
      setMessages((m) => [...m, { role: 'assistant', text: reply }])
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: `Sorry — I couldn't reach the assistant service. (${err.message})` },
      ])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div className="assistant-page">
      <div className="assistant-shell panel">
        <div className="assistant-head">
          <div className="assistant-avatar">
            <Icon name="sparkles" size={18} />
          </div>
          <div className="assistant-head-meta">
            <span className="assistant-head-name">MahaFarm Assistant</span>
            <span className="assistant-head-status">
              <span className="assistant-online-dot" /> Online · grounded in your fields
            </span>
          </div>
        </div>

        <div className="assistant-thread">
          {messages.map((m, i) => (
            <div key={i} className={`msg msg-${m.role}`}>
              {m.role === 'assistant' && (
                <span className="msg-avatar">
                  <Icon name="sparkles" size={14} />
                </span>
              )}
              <div className="msg-bubble">{m.text}</div>
            </div>
          ))}
          {typing && (
            <div className="msg msg-assistant">
              <span className="msg-avatar">
                <Icon name="sparkles" size={14} />
              </span>
              <div className="msg-bubble msg-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {messages.length <= 1 && (
          <div className="assistant-suggestions">
            {assistantSuggestions.map((s) => (
              <button key={s} className="assistant-chip" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          className="assistant-input"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <input
            type="text"
            placeholder="Ask about irrigation, pests, fertilizer…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Message the assistant"
          />
          <button type="submit" className="assistant-send" aria-label="Send" disabled={!input.trim()}>
            <Icon name="send" size={17} />
          </button>
        </form>
      </div>

      <p className="assistant-note">
        <Icon name="info" size={13} /> Demo assistant with sample responses. Phase 2 connects it to
        live farm data and a language model.
      </p>
    </div>
  )
}
