import React from "react";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS, TEMPO_GRADIENTS as G } from "../utils/tempoTheme";

// ============================================================
//  ErrorBoundary — Récupération propre en cas de crash React.
//  Évite l'écran bleu vide : affiche un message + bouton de
//  reset. La session Supabase est préservée (pas de logout).
// ============================================================
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("[Tempo] UI crash:", error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  handleHardReload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: TEMPO_GRADIENTS.bgRadial, color: TEMPO.text }}
      >
        <div
          className="rounded-3xl p-6 w-full max-w-sm text-center"
          style={{
            background: "linear-gradient(180deg, #0F2342 0%, #0B1D3A 100%)",
            border: `1px solid ${TEMPO.gold}50`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.4), ${TEMPO_SHADOWS.cardHi}`,
          }}
        >
          <div
            className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
            style={{
              background: TEMPO.gold + "15",
              border: `1px solid ${TEMPO.gold}40`,
            }}
          >
            ⚠️
          </div>
          <h3 className="text-xl font-light mb-2" style={{ color: TEMPO.text }}>
            Une erreur est survenue
          </h3>
          <p className="text-sm leading-relaxed mb-5" style={{ color: TEMPO.textDim }}>
            L'application a rencontré un problème inattendu. Vos données sont en sécurité.
          </p>
          <div className="space-y-2">
            <button
              onClick={this.handleReset}
              className="w-full py-3 rounded-xl text-sm font-medium transition hover:scale-[1.02]"
              style={{
                background: G.gold,
                color: "#1A1206",
                boxShadow: TEMPO_SHADOWS.gold,
              }}
            >
              Reprendre
            </button>
            <button
              onClick={this.handleHardReload}
              className="w-full py-3 rounded-xl text-sm font-medium border transition hover:bg-white/5"
              style={{ borderColor: TEMPO.border, color: TEMPO.text }}
            >
              Recharger l'application
            </button>
          </div>
        </div>
      </div>
    );
  }
}
