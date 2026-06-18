export function AppHeader() {
  return (
    <header
      style={{
        flexShrink: 0,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(10,10,10,0.97)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 1px 20px rgba(0,249,255,0.1)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.5em',
            color: '#f0f0f8',
            textShadow: '0 0 16px rgba(0,249,255,0.6)',
          }}
        >
          KAGE
        </span>
        <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />
        <span
          style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: 20,
            color: 'rgba(255,255,255,0.55)',
            textShadow: '0 0 12px rgba(0,249,255,0.4)',
          }}
        >
          影
        </span>
      </div>
    </header>
  )
}
