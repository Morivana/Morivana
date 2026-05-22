import React from 'react'

export function Sphere3D({ size = 40, light = false }) {
  const id = React.useId().replace(/:/g, '')
  const shadowColor = light ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.5)'
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <defs>
        <radialGradient id={`sphere-${id}`} cx="35%" cy="35%" r="65%">
          {light ? (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#dbdbdb" />
              <stop offset="100%" stopColor="#a0a0a0" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#d8d8d8" />
              <stop offset="75%" stopColor="#4f4f4f" />
              <stop offset="100%" stopColor="#121212" />
            </>
          )}
        </radialGradient>
      </defs>
      <circle cx="20" cy="22" r="15" fill={shadowColor} filter="blur(1.5px)" opacity="0.6" />
      <circle cx="20" cy="18" r="15" fill={`url(#sphere-${id})`} />
    </svg>
  )
}

export function Cube3D({ size = 40, light = false }) {
  const topColor = light ? '#ffffff' : '#eaeaea'
  const rightColor = light ? '#ababab' : '#3d3d3d'
  const leftColor = light ? '#d4d4d4' : '#7f7f7f'
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <polygon points="6,27 20,33 34,27 20,21" fill="rgba(0,0,0,0.25)" filter="blur(1px)" />
      {/* Top Face */}
      <polygon points="20,9 33,15 20,21 7,15" fill={topColor} />
      {/* Left Face */}
      <polygon points="7,15 20,21 20,31 7,25" fill={leftColor} />
      {/* Right Face */}
      <polygon points="20,21 33,15 33,25 20,31" fill={rightColor} />
    </svg>
  )
}

export function Cylinder3D({ size = 40, light = false }) {
  const id = React.useId().replace(/:/g, '')
  const topColor = light ? '#f7f7f7' : '#eaeaea'
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`cyl-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          {light ? (
            <>
              <stop offset="0%" stopColor="#c5c5c5" />
              <stop offset="30%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#d5d5d5" />
              <stop offset="100%" stopColor="#959595" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="30%" stopColor="#eaeaea" />
              <stop offset="70%" stopColor="#5a5a5a" />
              <stop offset="100%" stopColor="#111111" />
            </>
          )}
        </linearGradient>
      </defs>
      <ellipse cx="20" cy="30" rx="13" ry="3.5" fill="rgba(0,0,0,0.25)" filter="blur(1.5px)" />
      <path d="M7,15 L7,28 C7,30 12.8,31 20,31 C27.2,31 33,30 33,28 L33,15 Z" fill={`url(#cyl-${id})`} />
      <ellipse cx="20" cy="15" rx="13" ry="4" fill={topColor} stroke={light ? '#eaeaea' : '#ffffff'} strokeWidth="0.5" />
    </svg>
  )
}

export function Torus3D({ size = 40, light = false }) {
  const id = React.useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`torus-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          {light ? (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#dfdfdf" />
              <stop offset="85%" stopColor="#a3a3a3" />
              <stop offset="100%" stopColor="#7a7a7a" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#858585" />
              <stop offset="75%" stopColor="#252525" />
              <stop offset="100%" stopColor="#080808" />
            </>
          )}
        </linearGradient>
      </defs>
      <ellipse cx="20" cy="29" rx="14" ry="4.5" fill="rgba(0,0,0,0.25)" filter="blur(1.5px)" />
      <path fillRule="evenodd" clipRule="evenodd" d="M20,6 C11.2,6 4,12.3 4,20 C4,27.7 11.2,34 20,34 C28.8,34 36,27.7 36,20 C36,12.3 28.8,6 20,6 Z M20,13 C15.6,13 12,16.1 12,20 C12,23.9 15.6,27 20,27 C24.4,27 28,23.9 28,20 C28,16.1 24.4,13 20,13 Z" fill={`url(#torus-${id})`} />
    </svg>
  )
}

export function Cone3D({ size = 40, light = false }) {
  const id = React.useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`cone-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          {light ? (
            <>
              <stop offset="0%" stopColor="#c5c5c5" />
              <stop offset="35%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#d0d0d0" />
              <stop offset="100%" stopColor="#8a8a8a" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#151515" />
              <stop offset="35%" stopColor="#eaeaea" />
              <stop offset="75%" stopColor="#454545" />
              <stop offset="100%" stopColor="#0b0b0b" />
            </>
          )}
        </linearGradient>
      </defs>
      <ellipse cx="20" cy="30" rx="12" ry="3.5" fill="rgba(0,0,0,0.25)" filter="blur(1px)" />
      <path d="M20,7 L32,27 C32,29 26.6,30 20,30 C13.4,30 8,29 8,27 Z" fill={`url(#cone-${id})`} />
    </svg>
  )
}

export function Pyramid3D({ size = 40, light = false }) {
  const leftColor = light ? '#e0e0e0' : '#777777'
  const rightColor = light ? '#a3a3a3' : '#2e2e2e'
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <polygon points="7,28 20,34 33,28 20,23" fill="rgba(0,0,0,0.25)" filter="blur(1px)" />
      {/* Left Face */}
      <polygon points="20,7 20,30 7,25" fill={leftColor} />
      {/* Right Face */}
      <polygon points="20,7 33,25 20,30" fill={rightColor} />
    </svg>
  )
}

export function Capsule3D({ size = 40, light = false }) {
  const id = React.useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`capsule-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          {light ? (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#e5e5e5" />
              <stop offset="80%" stopColor="#a0a0a0" />
              <stop offset="100%" stopColor="#707070" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#ababab" />
              <stop offset="65%" stopColor="#2c2c2c" />
              <stop offset="100%" stopColor="#060606" />
            </>
          )}
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="20" height="20" rx="10" fill="rgba(0,0,0,0.2)" transform="rotate(45 20 20) translate(0 3)" filter="blur(1.5px)" />
      <rect x="13" y="7" width="14" height="26" rx="7" fill={`url(#capsule-${id})`} transform="rotate(45 20 20)" />
    </svg>
  )
}

export function DoubleCone3D({ size = 40, light = false }) {
  const topLeft = light ? '#ffffff' : '#9c9c9c'
  const topRight = light ? '#dfdfdf' : '#6a6a6a'
  const bottomLeft = light ? '#c0c0c0' : '#545454'
  const bottomRight = light ? '#959595' : '#272727'
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <ellipse cx="20" cy="32" rx="11" ry="3" fill="rgba(0,0,0,0.2)" filter="blur(1px)" />
      {/* Top Left Face */}
      <polygon points="20,7 20,20 9,20" fill={topLeft} />
      {/* Top Right Face */}
      <polygon points="20,7 31,20 20,20" fill={topRight} />
      {/* Bottom Left Face */}
      <polygon points="20,30 9,20 20,20" fill={bottomLeft} />
      {/* Bottom Right Face */}
      <polygon points="20,30 20,20 31,20" fill={bottomRight} />
    </svg>
  )
}

export function Helix3D({ size = 40, light = false }) {
  const id = React.useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`helix-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          {light ? (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#c5c5c5" />
              <stop offset="100%" stopColor="#858585" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#666666" />
              <stop offset="80%" stopColor="#1e1e1e" />
              <stop offset="100%" stopColor="#050505" />
            </>
          )}
        </linearGradient>
      </defs>
      <ellipse cx="20" cy="31" rx="12" ry="2.5" fill="rgba(0,0,0,0.2)" filter="blur(1px)" />
      <path d="M12,23 C12,27 28,27 28,23 C28,19 12,19 12,15 C12,11 28,11 28,7" fill="none" stroke={`url(#helix-${id})`} strokeWidth="5.5" strokeLinecap="round" />
    </svg>
  )
}
