import { useEffect, useState } from 'react'

/**
 * ObfuscatedEmail renders a clickable email link that is hidden from static HTML
 * scrapers and bots by assembling the address dynamically after client-side mount.
 */
export default function ObfuscatedEmail({ style, className, children, ...props }) {
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Assemble after mount so static scanners and SSR/HTML parses see nothing
    const user = 'Morivana.daily'
    const domain = 'gmail.com'
    setEmail(`${user}@${domain}`)
  }, [])

  const handleClick = (e) => {
    if (!email) {
      e.preventDefault()
    }
  }

  return (
    <a
      href={email ? `mailto:${email}` : '#'}
      onClick={handleClick}
      style={style}
      className={className}
      {...props}
    >
      {typeof children === 'function'
        ? children(email)
        : (children || email || 'Contact Support')}
    </a>
  )
}
