// src/ErrorBoundary.jsx
//
// React error boundaries MUST be class components (this is one of the
// few remaining cases where you can't use a function component + hooks).
// This catches errors thrown during rendering anywhere inside it, and
// shows a fallback UI instead of crashing the whole page to blank white.

import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  // React calls this automatically when a child component throws
  // during rendering.
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message }
  }

  componentDidCatch(error, info) {
    // In a real production app, you'd send this to an error-tracking
    // service (e.g. Sentry). For now, just log it.
    console.error('Caught by ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong.</h2>
          <p>
            The dashboard hit an unexpected error. Try refreshing the page.
          </p>
          <p style={{ color: '#999', fontSize: '0.85rem' }}>
            Details: {this.state.errorMessage}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary