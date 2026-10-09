import React, { useState } from "react";
import "./clearspacehomevariant.css";

type IconName = "aperture" | "sliders" | "arrow" | "copy" | "shield" | "lock" | "close";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    aperture: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="3" />
        <path d="m5.9 5.9 4 4M14.1 14.1l4 4M18.1 5.9l-4 4M9.9 14.1l-4 4" />
      </>
    ),
    sliders: (
      <>
        <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
        <circle cx="15" cy="7" r="2" />
        <circle cx="9" cy="17" r="2" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    copy: (
      <>
        <rect x="8" y="8" width="11" height="12" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 19 6v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

export default function ClearspaceHomeVariant() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <main className="cv-page">
      <div className="cv-shell">
        <header className="cv-header">
          <div className="cv-brand">
            <span className="cv-brand-mark"><Icon name="aperture" size={17} /></span>
            <span className="cv-brand-name">clearspace</span>
          </div>
          <div className="cv-header-actions">
            <span className="cv-live-status"><i />PRIVATE BY DEFAULT</span>
            <button
              className={`cv-settings-button${settingsOpen ? " is-open" : ""}`}
              type="button"
              aria-label="Open privacy settings"
              aria-expanded={settingsOpen}
              onClick={() => setSettingsOpen((open) => !open)}
            >
              <Icon name="sliders" size={17} />
            </button>
            {settingsOpen && (
              <div className="cv-settings-popover">
                <span className="cv-popover-kicker">YOUR PRIVACY</span>
                <strong>Nothing leaves your phone.</strong>
                <p>Clearspace sorts photo details on this device, never with visual AI.</p>
                <button type="button" onClick={() => setSettingsOpen(false)}>Done</button>
              </div>
            )}
          </div>
        </header>

        <section className="cv-hero" aria-labelledby="cv-title">
          <div className="cv-hero-copy">
            <span className="cv-eyebrow"><span />A CALMER CAMERA ROLL</span>
            <h1 id="cv-title">Keep the<br /><em>moments.</em><br />Clear the rest.</h1>
            <p>A calmer camera roll starts with one good choice.</p>
          </div>
          <div className="cv-still-life" aria-hidden="true">
            <div className="cv-orbit cv-orbit-one" />
            <div className="cv-orbit cv-orbit-two" />
            <div className="cv-photo cv-photo-back">
              <div className="cv-photo-sky" />
              <div className="cv-photo-hill" />
              <div className="cv-photo-sun" />
            </div>
            <div className="cv-photo cv-photo-front">
              <div className="cv-photo-sky cv-sky-warm" />
              <div className="cv-photo-hill cv-hill-dark" />
              <div className="cv-photo-sun cv-sun-small" />
            </div>
            <span className="cv-art-label">01 / KEEP</span>
          </div>
        </section>

        <section className="cv-review-section" aria-label="Photo review">
          <div className="cv-section-label">
            <span>READY WHEN YOU ARE</span>
            <span className="cv-section-number">01</span>
          </div>
          <button className="cv-review-card" type="button" onClick={() => setReviewOpen(true)}>
            <span className="cv-review-icon"><Icon name="copy" size={20} /></span>
            <span className="cv-review-copy">
              <strong>Similar moments</strong>
              <span>Find quick bursts and choose the version worth keeping.</span>
              <span className="cv-review-link">Scan on this device <span>↗</span></span>
            </span>
            <span className="cv-review-arrow"><Icon name="arrow" size={18} /></span>
          </button>
        </section>

        <section className="cv-library-section" aria-labelledby="cv-library-title">
          <div className="cv-library-heading">
            <h2 id="cv-library-title">Your library</h2>
            <span>LOCAL ONLY</span>
          </div>
          <div className="cv-library-card">
            <span className="cv-shield"><Icon name="shield" size={21} /></span>
            <div className="cv-library-copy">
              <strong>Nothing leaves your phone</strong>
              <p>Suggestions use capture time, photo dimensions, favourites and local file size — not visual AI.</p>
            </div>
            <span className="cv-library-check" aria-label="Protected"><span>✓</span></span>
          </div>
        </section>

        <footer className="cv-footer">
          <Icon name="lock" size={13} />
          <span>Review every choice before anything is deleted.</span>
        </footer>
      </div>

      {reviewOpen && (
        <div className="cv-dialog-scrim" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setReviewOpen(false);
        }}>
          <section className="cv-dialog" role="dialog" aria-modal="true" aria-labelledby="cv-dialog-title">
            <button className="cv-dialog-close" type="button" aria-label="Close" onClick={() => setReviewOpen(false)}>
              <Icon name="close" size={18} />
            </button>
            <span className="cv-dialog-icon"><Icon name="aperture" size={22} /></span>
            <span className="cv-popover-kicker">ON-DEVICE REVIEW</span>
            <h2 id="cv-dialog-title">Your photos stay yours.</h2>
            <p>Open Clearspace on your phone to scan nearby shots and review every suggestion before anything is removed.</p>
            <button className="cv-dialog-done" type="button" onClick={() => setReviewOpen(false)}>Got it</button>
          </section>
        </div>
      )}
    </main>
  );
}
