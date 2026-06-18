import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Something went wrong' }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[KAGE]', error, info.componentStack)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, message: '' })
    this.props.onReset?.()
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        role="alert"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 24,
          background: '#050505',
          color: '#e8e8f0',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 11,
            letterSpacing: '0.35em',
            color: '#c41e3a',
            textTransform: 'uppercase',
          }}
        >
          Shadow disrupted
        </p>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, maxWidth: 320 }}>
          {this.state.message}
        </p>
        <button
          type="button"
          onClick={this.handleRetry}
          style={{
            marginTop: 8,
            minHeight: 48,
            minWidth: 140,
            padding: '12px 20px',
            borderRadius: 8,
            border: '1px solid #c41e3a',
            background: 'rgba(196,30,58,0.12)',
            color: '#e85d4c',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 9,
            letterSpacing: '0.25em',
            cursor: 'pointer',
          }}
        >
          RELOAD KAGE
        </button>
      </div>
    )
  }
}
