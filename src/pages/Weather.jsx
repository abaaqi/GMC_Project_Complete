import Icon from '../components/icons.jsx'
import { useResource } from '../hooks/useResource.js'
import {
  weatherNow as mockNow,
  weatherForecast as mockForecast,
  weatherAdvisories as mockAdvisories,
} from '../data/mockData.js'
import './dash.css'
import './Weather.css'

const mockWeather = { now: mockNow, forecast: mockForecast, advisories: mockAdvisories }

const detailIcons = [
  { key: 'feelsLike', label: 'Feels like', icon: 'thermometer', unit: '°C' },
  { key: 'humidity', label: 'Humidity', icon: 'droplets', unit: '%' },
  { key: 'wind', label: 'Wind', icon: 'wind', unit: ' km/h' },
  { key: 'rainChance', label: 'Rain chance', icon: 'cloud-rain', unit: '%' },
  { key: 'uv', label: 'UV index', icon: 'sun', unit: '' },
]

export default function Weather() {
  const { data } = useResource('/weather', mockWeather)
  const weatherNow = data.now || mockNow
  const weatherForecast = data.forecast || mockForecast
  const weatherAdvisories = data.advisories || mockAdvisories

  return (
    <div className="weather-page">
      <div className="weather-top">
        {/* Current conditions hero */}
        <section className="weather-now">
          <div className="weather-now-glow" aria-hidden="true" />
          <div className="weather-now-main">
            <div>
              <span className="weather-now-place">
                <Icon name="map-pin" size={14} /> {weatherNow.place}
              </span>
              <div className="weather-now-temp mono">
                {weatherNow.temp}<span className="weather-now-deg">°C</span>
              </div>
              <span className="weather-now-cond">{weatherNow.condition}</span>
            </div>
            <span className="weather-now-icon">
              <Icon name="cloud-sun" size={72} />
            </span>
          </div>

          <div className="weather-now-details">
            {detailIcons.map((d) => (
              <div key={d.key} className="weather-detail">
                <Icon name={d.icon} size={16} />
                <span className="weather-detail-label">{d.label}</span>
                <span className="weather-detail-val mono">
                  {weatherNow[d.key]}{d.unit}
                </span>
              </div>
            ))}
            <div className="weather-detail">
              <Icon name="sun" size={16} />
              <span className="weather-detail-label">Sun</span>
              <span className="weather-detail-val mono">
                {weatherNow.sunrise}–{weatherNow.sunset}
              </span>
            </div>
          </div>
        </section>

        {/* Advisories */}
        <section className="weather-advisories">
          <h2 className="weather-section-title">Crop advisories</h2>
          {weatherAdvisories.map((a) => (
            <article key={a.id} className={`advisory sev-${a.severity}`}>
              <span className="advisory-icon">
                <Icon name={a.icon} size={18} />
              </span>
              <div className="advisory-body">
                <h3 className="advisory-title">{a.title}</h3>
                <p className="advisory-text">{a.body}</p>
              </div>
            </article>
          ))}
        </section>
      </div>

      {/* 7-day forecast */}
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">7-day forecast</h2>
            <p className="panel-sub">Plan irrigation and field work around the week ahead</p>
          </div>
        </div>
        <div className="forecast-row">
          {weatherForecast.map((d, i) => (
            <article key={i} className={`forecast-day ${i === 0 ? 'is-today' : ''}`}>
              <span className="forecast-name">{d.day}</span>
              <span className="forecast-icon">
                <Icon name={d.icon} size={28} />
              </span>
              <span className="forecast-cond">{d.condition}</span>
              <div className="forecast-temps">
                <span className="forecast-hi mono">{d.hi}°</span>
                <span className="forecast-lo mono">{d.lo}°</span>
              </div>
              <span className="forecast-rain mono">
                <Icon name="droplet" size={11} /> {d.rain}%
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
