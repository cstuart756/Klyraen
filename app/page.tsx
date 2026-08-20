import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-shell">
      <header className="site-header">
        <div className="brand-lockup">
          <span className="brand-mark">K</span>
          <div>
            <strong>KLYRAEN</strong>
            <span>AI MUSIC STUDIO</span>
          </div>
        </div>
        <div className="beta-kicker">PRIVATE BETA / WAVE 01</div>
        <span className="live-indicator"><i /> SYSTEM ONLINE</span>
      </header>
      <div className="landing-grid">
        <section className="landing-content">
          <p className="eyebrow">A studio for unfinished ideas</p>
          <h1>Turn a feeling <em>into a track.</em></h1>
          <p className="landing-lede">
            Shape raw emotion into sound with a private AI music studio built
            for the space between impulse and intention.
          </p>
          <div className="genre-row" aria-label="Supported music directions">
            <span>DRUM &amp; BASS</span>
            <span>TECHNO</span>
            <span>AMBIENT</span>
          </div>
          <div className="landing-actions">
            <Link className="primary-action" href="/beta">
              Enter private beta <span aria-hidden="true">-&gt;</span>
            </Link>
            <Link className="quiet-action" href="/api/health">
              System status <span aria-hidden="true">+</span>
            </Link>
          </div>
          <div className="landing-statline">
            <span><b>01</b> PROMPT TO AUDIO</span>
            <span><b>02</b> PRIVATE BY DEFAULT</span>
          </div>
        </section>
        <aside className="signal-card" aria-label="Klyraen audio signal preview">
          <div className="signal-card-top">
            <span>LIVE / SIGNAL 001</span>
            <span>00:30</span>
          </div>
          <div className="signal-orbit">
            <div className="signal-core">K</div>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
          </div>
          <div className="waveform" aria-hidden="true">
            {[28, 48, 74, 40, 92, 58, 36, 80, 52, 96, 42, 66, 30, 76, 48, 86, 34, 62, 44, 72].map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="signal-card-bottom">
            <span>ATMOSPHERIC / 124 BPM</span>
            <span className="signal-dot" />
          </div>
        </aside>
      </div>
      <div className="landing-footer">
        <span>WAVE 1 / THREE TESTERS</span>
        <span>EU STAGING INFRASTRUCTURE</span>
        <span>BUILD 0.1.0</span>
      </div>
    </main>
  );
}
