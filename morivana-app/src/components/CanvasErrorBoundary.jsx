import React from 'react'

/**
 * CanvasErrorBoundary
 * Catches WebGL/Canvas/Three.js errors during initialization or rendering,
 * and renders a high-quality 2D fallback image of the product.
 */
export default class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[CanvasErrorBoundary] caught a WebGL/Three.js render error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            pointerEvents: 'none',
          }}
        >
          <img
            src="/packaging_highres.webp"
            alt="Morivana Pouch (Fallback Preview)"
            style={{
              maxHeight: '75%',
              maxWidth: '85%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.25))',
              pointerEvents: 'auto',
            }}
          />
        </div>
      )
    }

    return this.props.children
  }
}
