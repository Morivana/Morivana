import { useState, useEffect } from 'react'

// Launch target: 45 days from site creation
const TARGET_DATE = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()

// Pre-compute initial value so the element always renders (GSAP needs it in DOM)
function calcTimeLeft(targetDate) {
  const diff = new Date(targetDate) - new Date()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownTimer({ targetDate = TARGET_DATE }) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(targetDate))

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const units = ['days', 'hours', 'minutes', 'seconds']

  return (
    <div className="countdown hero-countdown">
      {units.map((unit, i) => (
        <div key={unit} style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          <div className="countdown-block">
            <span className="countdown-num">
              {String(timeLeft[unit] ?? 0).padStart(2, '0')}
            </span>
            <span className="countdown-label">{unit}</span>
          </div>
          {i < units.length - 1 && (
            <span className="countdown-sep" style={{ marginLeft: 8, marginRight: 8 }}>:</span>
          )}
        </div>
      ))}
    </div>
  )
}
