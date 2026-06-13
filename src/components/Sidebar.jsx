import { NavLink, useNavigate } from 'react-router-dom'
import Icon from './icons.jsx'
import { Logo } from './ui.jsx'
import PulseLine from './PulseLine.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { navItems, farmProfile } from '../data/mockData.js'
import './Sidebar.css'

/** Two-letter initials from a name, e.g. "Abdul-Baaqi Jempeji" → "AJ". */
function initials(name = '') {
  const parts = name.trim().split(/\s+/)
  return (((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()) || 'MF'
}

/** Dashboard sidebar — brand, nav, live farm status, profile, logout. */
export default function Sidebar({ open, onClose }) {
  const { user, farm, logout } = useAuth()
  const navigate = useNavigate()

  const ownerName = user?.name || farmProfile.owner
  const farmName = farm?.name || farmProfile.name
  const zones = farm?.zones ?? farmProfile.zones

  async function handleLogout() {
    await logout()
    onClose?.()
    navigate('/login')
  }

  return (
    <>
      <div className={`sidebar-scrim ${open ? 'is-open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar-head">
          <Logo to="/app" dark />
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="sidebar-status">
          <div className="sidebar-status-row">
            <span className="badge badge-live on-dark">
              <span className="badge-dot" />
              Live
            </span>
            <span className="sidebar-status-zones">{zones} zones online</span>
          </div>
          <PulseLine height={26} />
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-link-icon">
                <Icon name={item.icon} size={19} />
              </span>
              <span className="sidebar-link-label">{item.label}</span>
              {item.badge && <span className="sidebar-link-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <button className="sidebar-profile">
            <span className="sidebar-avatar">{initials(ownerName)}</span>
            <span className="sidebar-profile-meta">
              <span className="sidebar-profile-name">{ownerName}</span>
              <span className="sidebar-profile-farm">{farmName}</span>
            </span>
            <Icon name="settings" size={16} className="sidebar-profile-gear" />
          </button>
          <button className="sidebar-exit" onClick={handleLogout}>
            <Icon name="log-out" size={16} />
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}
