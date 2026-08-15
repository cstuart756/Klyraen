import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-shell">
      <div className="beta-kicker">KLYRAEN / PRIVATE BETA</div>
      <section className="landing-content">
        <p className="eyebrow">A studio for unfinished ideas</p>
        <h1>Turn a feeling into a track.</h1>
        <p className="landing-lede">
          Klyraen is currently available to invited testers shaping the first
          generation of the studio.
        </p>
        <div className="landing-actions">
          <Link className="primary-action" href="/beta">
            Enter private beta <span aria-hidden="true">-&gt;</span>
          </Link>
          <Link className="quiet-action" href="/api/health">
            System status
          </Link>
        </div>
      </section>
      <div className="landing-footer">
        <span>WAVE 1 / THREE TESTERS</span>
        <span>EU STAGING INFRASTRUCTURE</span>
      </div>
    </main>
  );
}
