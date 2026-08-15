import Link from "next/link";

const missions = [
  "Create music from at least three different prompts.",
  "Listen to each complete result and rate the quality.",
  "Tell us whether the result matched your prompt.",
  "Try creating a second version.",
  "Report anything confusing or broken.",
];

export default function BetaWelcomePage() {
  return (
    <main className="beta-shell">
      <div className="beta-kicker">KLYRAEN / PRIVATE BETA / WAVE 1</div>
      <div className="beta-grid">
        <section>
          <p className="eyebrow">A small room for a new sound</p>
          <h1>Make something you would actually want to hear.</h1>
          <p className="beta-lede">
            Welcome to Klyraen. You are one of three first-wave testers helping
            shape the studio before it opens more widely.
          </p>
          <Link className="primary-action" href="/studio">
            Enter Klyraen Studio <span aria-hidden="true">-&gt;</span>
          </Link>
        </section>
        <aside className="beta-panel">
          <div className="credit-count">100</div>
          <div className="credit-label">beta credits</div>
          <div className="panel-rule" />
          <p className="panel-title">During the beta, try to:</p>
          <ol>
            {missions.map((mission, index) => (
              <li key={mission}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {mission}
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </main>
  );
}
