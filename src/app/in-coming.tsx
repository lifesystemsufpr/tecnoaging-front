/* app/em-breve/page.tsx */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EQUILIBRIUM — Página em construção",
  description: "Em breve • Saúde e equilíbrio",
};

export default function EmBrevePage() {
  return (
    <div className="wrap">
      {/* Main */}
      <main className="main">
        <div className="card">
          <h1>Página em construção</h1>
          <p className="subtitle">
            Estamos finalizando este módulo. Em breve você poderá registrar e
            acompanhar avaliações com foco em <strong>equilíbrio</strong> e{" "}
            <strong>saúde</strong>.
          </p>

          <div className="progress" aria-label="Progresso">
            <span />
            <span />
            <span />
          </div>

          <ul className="whatsComing">
            <li>
              <Check /> 30s Sit-to-Stand
            </li>
            <li>
              <Check /> Gráficos de evolução
            </li>
            <li>
              <Check /> Exportação de relatórios
            </li>
          </ul>

          <div className="actions">
            <a className="btnGhost" href="/">
              Voltar ao início
            </a>
            <a className="btnPrimary" href="mailto:contato@ufpr.br">
              Avise-me quando lançar
            </a>
          </div>

          <small className="hint">
            Precisa de algo agora? Fale com o time e habilitamos um preview.
          </small>
        </div>
      </main>

      <style jsx>{`
        /* ---------- Paleta (inspirada no screenshot) ---------- */
        :root {
          --eq-primary-900: #0f45f4;
          --eq-primary-700: #1a56ff;
          --eq-primary-600: #2e6bff;
          --eq-accent: #57e0ff;
          --eq-bg: #f7f9ff;
          --eq-ink: #0f1b3f;
          --eq-muted: #5b6b95;
          --eq-surface: #ffffff;
          --ring: 0 0 0 3px rgba(87, 224, 255, 0.35);
        }

        * {
          box-sizing: border-box;
        }

        /* ---------- Main ---------- */
        .main {
          grid-area: main;
          padding: 28px;
        }

        .card {
          max-width: 860px;
          margin: 40px auto;
          background: var(--eq-surface);
          border: 1px solid #e6ecfb;
          border-radius: 18px;
          padding: 38px 28px;
          box-shadow: 0 20px 50px -22px rgba(16, 52, 214, 0.25);
          text-align: center;
        }

        .heroIcon {
          width: 84px;
          height: 84px;
          border-radius: 20px;
          margin: -70px auto 18px;
          background: linear-gradient(135deg, var(--eq-primary-700), #3f7bff);
          display: grid;
          place-items: center;
          color: white;
          box-shadow: 0 10px 30px -10px rgba(11, 43, 255, 0.5);
        }

        h1 {
          margin: 6px 0 6px;
          font-size: 1.9rem;
          letter-spacing: 0.3px;
        }

        .subtitle {
          margin: 0 auto 18px;
          max-width: 56ch;
          color: var(--eq-muted);
          line-height: 1.55;
        }

        .progress {
          display: inline-flex;
          gap: 8px;
          margin: 12px 0 6px;
        }
        .progress span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--eq-accent);
          opacity: 0.55;
          animation: pulse 1.4s infinite ease-in-out;
        }
        .progress span:nth-child(2) {
          animation-delay: 0.15s;
        }
        .progress span:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes pulse {
          0%,
          80%,
          100% {
            transform: scale(0.9);
            opacity: 0.35;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .whatsComing {
          display: grid;
          gap: 8px;
          margin: 20px auto 10px;
          text-align: left;
          max-width: 520px;
          color: #3d4b77;
        }
        .whatsComing li {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 14px;
          flex-wrap: wrap;
        }

        .btnPrimary,
        .btnGhost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 14px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 700;
          letter-spacing: 0.2px;
          border: 1px solid transparent;
        }

        .btnPrimary {
          color: black;
          background: linear-gradient(
            135deg,
            var(--eq-primary-700),
            var(--eq-primary-600)
          );
          border-radius: 12px;
          border-color: var(--eq-primary-600);
          box-shadow: 0 10px 24px -12px rgba(39, 96, 255, 0.6);
        }
        .btnPrimary:focus-visible {
          outline: none;
          box-shadow:
            var(--ring),
            0 10px 24px -12px rgba(39, 96, 255, 0.6);
        }

        .btnGhost {
          color: var(--eq-primary-700);
          background: white;
          border-color: #cfe0ff;
        }

        .hint {
          display: block;
          margin-top: 12px;
          color: #7080a6;
        }

        /* ---------- Responsivo ---------- */
        @media (max-width: 980px) {
          .wrap {
            grid-template-columns: 1fr;
            grid-template-rows: 56px auto auto;
            grid-template-areas:
              "topbar"
              "main"
              "sidebar";
          }
          .sidebar {
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
          }
        }
      `}</style>
    </div>
  );
}

/* -------------------- UI bits -------------------- */

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M9.6 16.2L5.4 12l1.4-1.4l2.8 2.8l7.6-7.6L19 7.2l-9.4 9z" />
    </svg>
  );
}
