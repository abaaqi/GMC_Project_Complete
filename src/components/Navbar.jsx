import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Icon from './icons.jsx'
import { Logo } from './ui.jsx'
import './Navbar.css'

const links = [
  { href: '#features', label: 'Platform' },
  { href: '#how', label: 'How it works' },
  { href: '#impact', label: 'Impact' },
  { href: '#pricing', label: 'Pricing' },
]

/** Marketing top navigation with scroll-aware styling + mobile menu. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => (document.body.style.overflow = '')
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-inner shell">
        <Logo />

        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="nav-login">
            Log in
          </Link>
          <Link to="/app" className="btn btn-primary btn-sm">
            Open dashboard
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>

        <button
          className="nav-burger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <Icon name={open ? 'x' : 'menu'} size={22} />
        </button>
      </div>

      {open && (
        <div className="nav-mobile">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-mobile-link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="nav-mobile-actions">
            <Link to="/login" className="btn btn-ghost btn-block" onClick={() => setOpen(false)}>
              Log in
            </Link>
            <Link to="/app" className="btn btn-primary btn-block" onClick={() => setOpen(false)}>
              Open dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
