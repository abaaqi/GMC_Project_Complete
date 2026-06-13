import { Link } from 'react-router-dom'
import Icon from '../components/icons.jsx'
import { Logo } from '../components/ui.jsx'
import PulseLine from '../components/PulseLine.jsx'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound-nav">
        <Logo to="/" dark />
      </div>
      <div className="notfound-inner">
        <span className="notfound-eyebrow mono">Error 404</span>
        <h1 className="notfound-code mono">4<span className="notfound-sprout">0</span>4</h1>
        <div className="notfound-pulse">
          <PulseLine height={36} />
        </div>
        <h2 className="notfound-title">This field lies fallow</h2>
        <p className="notfound-text">
          The page you’re looking for isn’t here. It may have been moved, or the link was mistyped.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">
            <Icon name="arrow-right" size={16} /> Back to home
          </Link>
          <Link to="/app" className="btn btn-ghost on-dark">
            Open dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
