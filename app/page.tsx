'use client';

import { useEffect, useState } from 'react';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const roasts = [
  'Sein „kurzes Meeting“ hat drei Akte und eine Post-Credit-Szene.',
  'Sein Coolness-Score lädt noch. Seit Montag.',
  'Er sagt „Lass uns kurz syncen“ und öffnet dann 47 Tabs.',
];

function isStandalone() {
  const safariNavigator = navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    safariNavigator.standalone === true
  );
}

export default function Home() {
  const [standalone, setStandalone] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [verdict, setVerdict] = useState('Super uncool. Urteil rechtskräftig.');

  useEffect(() => {
    const displayMode = window.matchMedia('(display-mode: standalone)');
    const syncDisplayMode = () => setStandalone(isStandalone());
    const captureInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    syncDisplayMode();
    displayMode.addEventListener('change', syncDisplayMode);
    window.addEventListener('beforeinstallprompt', captureInstall);

    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register(new URL('sw.js', document.baseURI), {
        scope: './',
      });
    }

    return () => {
      displayMode.removeEventListener('change', syncDisplayMode);
      window.removeEventListener('beforeinstallprompt', captureInstall);
    };
  }, []);

  const install = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
      return;
    }

    document.querySelector('#installation')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (standalone) {
    return (
      <main className="reveal-shell">
        <div className="noise" aria-hidden="true" />
        <section className="reveal-card" aria-labelledby="reveal-title">
          <p className="eyebrow acid">INSTALLATION ERFOLGREICH</p>
          <h1 id="reveal-title">
            Plot Twist.
            <span>Ansi ist super uncool.</span>
          </h1>
          <div className="verdict" aria-live="polite">
            {verdict}
          </div>
          <ul className="roast-list">
            {roasts.map((roast, index) => (
              <li key={roast}>
                <span>0{index + 1}</span>
                {roast}
              </li>
            ))}
          </ul>
          <button
            className="reveal-button"
            type="button"
            onClick={() =>
              setVerdict('Okay, okay … eigentlich ist Ansi schon ziemlich cool. 🕶️')
            }
          >
            Einspruch einlegen
          </button>
          <p className="fine-print">
            Ein freundschaftlicher Büro-Roast. Keine Anzis wurden verletzt.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="landing-shell">
      <nav className="topbar" aria-label="Seitennavigation">
        <a className="wordmark" href="#top" aria-label="Ansi Fanclub Startseite">
          ANSI<span>!</span>
        </a>
        <button type="button" className="nav-install" onClick={install}>
          App installieren
        </button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">UNABHÄNGIG GEPRÜFT*</p>
          <h1>Der coolste Boss der Welt.</h1>
          <p className="lede">
            Visionär. Multitalent. Besitzer eines Kalenders, der vermutlich mehr
            leistet als wir alle zusammen.
          </p>
          <button type="button" className="primary-button" onClick={install}>
            Beweis als App laden <span aria-hidden="true">↗</span>
          </button>
          <p className="microcopy">
            * geprüft von einem sehr kleinen, völlig unparteiischen Fanclub
          </p>
        </div>

        <div className="portrait-wrap">
          <div className="portrait-label">BOSS OF THE YEAR · ∞</div>
          {/* oxlint-disable-next-line next/no-img-element -- static PWA asset */}
          <img
            className="portrait"
            src="boss-fictional.webp"
            alt="Fiktive Illustration eines coolen Chefs mit Sonnenbrille"
            width="1200"
            height="1200"
          />
          <div className="sticker" aria-hidden="true">
            11/10
          </div>
        </div>
      </section>

      <section className="scoreboard" aria-label="Ansi in Zahlen">
        <div>
          <strong>100%</strong>
          <span>Boss Energy</span>
        </div>
        <div>
          <strong>0</strong>
          <span>langweilige Ideen</span>
        </div>
        <div>
          <strong>∞</strong>
          <span>Tabs gleichzeitig</span>
        </div>
      </section>

      <section className="install-section" id="installation">
        <div className="install-intro">
          <p className="eyebrow acid">DIE BEWEIS-APP</p>
          <h2>Nimm Ansi überallhin mit.</h2>
          <p>
            Kein App Store. Keine Anmeldung. Nur ein Icon auf deinem Home-Bildschirm
            und die ganze Wahrheit.
          </p>
        </div>

        <div className="steps">
          <article>
            <span>iPhone / iPad</span>
            <ol>
              <li>Diese Seite in Safari öffnen</li>
              <li>Auf „Teilen“ tippen</li>
              <li>„Zum Home-Bildschirm“ wählen</li>
            </ol>
          </article>
          <article>
            <span>Android / Desktop</span>
            <ol>
              <li>Diese Seite in Chrome öffnen</li>
              <li>Im Menü „App installieren“ wählen</li>
              <li>Ansi-Icon öffnen</li>
            </ol>
          </article>
        </div>
      </section>

      <footer>
        <span>Made with questionable objectivity.</span>
        <span>© {new Date().getFullYear()} Ansi Fanclub</span>
      </footer>
    </main>
  );
}
