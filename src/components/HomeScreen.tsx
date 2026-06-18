import { NeonDivider } from './NeonDivider'

const NAV_ITEMS = [
  { label: 'Enter', kanji: '入', index: '01' },
  { label: 'Archive', kanji: '蔵', index: '02' },
  { label: 'Signal', kanji: '信', index: '03' },
] as const

export function HomeScreen() {
  return (
    <main className="relative flex h-full w-full flex-col items-center justify-between px-6 py-10 sm:px-12 sm:py-14">
      {/* Ambient background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-[0.07]"
          style={{
            background:
              'radial-gradient(circle, #00f0ff 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-1/4 right-0 h-[400px] w-[400px] rounded-full opacity-[0.05]"
          style={{
            background:
              'radial-gradient(circle, #ff00aa 0%, transparent 70%)',
          }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,240,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Header */}
      <header
        className="relative z-10 flex w-full max-w-4xl items-center justify-between opacity-0 animate-fade-up"
        style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
      >
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_#00f0ff]" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-mist uppercase">
            Sys.Online
          </span>
        </div>
        <time
          className="font-mono text-[10px] tracking-widest text-mist"
          dateTime="2087"
        >
          2087.06.18
        </time>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Kanji emblem */}
        <div
          className="relative opacity-0 animate-fade-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          <div
            className="absolute inset-0 blur-2xl opacity-30 animate-pulse-glow"
            style={{ background: 'radial-gradient(circle, #00f0ff, transparent)' }}
          />
          <span
            className="relative block font-jp text-7xl font-light tracking-widest text-white/90 sm:text-8xl"
            style={{ textShadow: '0 0 40px #00f0ff33' }}
          >
            影
          </span>
        </div>

        {/* Title */}
        <div
          className="flex flex-col items-center gap-3 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          <h1
            className="font-display text-4xl font-medium tracking-[0.5em] text-white sm:text-5xl animate-flicker"
            style={{
              textShadow:
                '0 0 20px #00f0ff55, 0 0 60px #00f0ff22, 0 0 80px #ff00aa11',
            }}
          >
            KAGE
          </h1>
          <p className="font-jp text-sm font-light tracking-[0.2em] text-ghost">
            影 —&nbsp;the shadow between worlds
          </p>
        </div>

        {/* Dividers */}
        <div
          className="flex w-48 flex-col gap-2 sm:w-64 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
        >
          <NeonDivider color="cyan" delay={900} />
          <NeonDivider color="magenta" delay={1100} />
        </div>

        {/* Tagline */}
        <p
          className="max-w-xs font-mono text-[11px] leading-relaxed tracking-wider text-mist opacity-0 animate-fade-up sm:max-w-sm sm:text-xs"
          style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
        >
          <span className="text-cyan">[</span>
          retro neural interface
          <span className="text-cyan">]</span>
          &nbsp;·&nbsp;
          <span className="text-magenta">[</span>
          samurai protocol active
          <span className="text-magenta">]</span>
        </p>
      </section>

      {/* Navigation */}
      <nav
        className="relative z-10 w-full max-w-4xl opacity-0 animate-fade-up"
        style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}
      >
        <ul className="flex flex-col gap-1 sm:flex-row sm:gap-0">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.label} className="flex-1">
              <button
                type="button"
                className="group relative flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-300 hover:bg-white/[0.02] sm:flex-col sm:items-center sm:gap-2 sm:py-6"
              >
                {/* Hover line */}
                <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan to-magenta transition-all duration-500 group-hover:w-full" />

                <span className="font-mono text-[9px] tracking-[0.25em] text-mist">
                  {item.index}
                </span>

                <span
                  className="font-jp text-2xl font-light text-white/20 transition-all duration-300 group-hover:text-cyan group-hover:drop-shadow-[0_0_12px_#00f0ff66]"
                >
                  {item.kanji}
                </span>

                <span className="font-display text-[10px] tracking-[0.35em] text-ghost uppercase transition-colors duration-300 group-hover:text-white">
                  {item.label}
                </span>

                {/* Connector dot for desktop */}
                {i < NAV_ITEMS.length - 1 && (
                  <span className="absolute right-0 top-1/2 hidden h-1 w-1 -translate-y-1/2 rounded-full bg-mist/30 sm:block" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <footer
        className="relative z-10 flex w-full max-w-4xl items-center justify-between opacity-0 animate-fade-up"
        style={{ animationDelay: '1.4s', animationFillMode: 'forwards' }}
      >
        <span className="font-mono text-[9px] tracking-widest text-mist/60">
          v0.1.0
        </span>
        <div className="flex items-center gap-2">
          <span className="h-1 w-1 animate-pulse-glow rounded-full bg-magenta shadow-[0_0_6px_#ff00aa]" />
          <span className="font-mono text-[9px] tracking-widest text-mist/60">
            NEURAL LINK STABLE
          </span>
        </div>
      </footer>
    </main>
  )
}
