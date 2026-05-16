import { useFocus } from "../context/FocusContext";
import TempoLogo from "../components/TempoLogo";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../utils/tempoTheme";

export default function SignupScreen() {
  const { signupForm, setSignupForm, handleSignup, handleBetaBypass } = useFocus();
  const disabled = !signupForm.firstName || !signupForm.lastName || !signupForm.birthDate || !signupForm.email;

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${TEMPO.border}`,
    color: TEMPO.text,
  };

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden flex items-center justify-center p-6"
      style={{ background: TEMPO_GRADIENTS.bgRadial }}
    >
      {/* Halo doré ambiant */}
      <div
        className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-50"
        style={{
          background: `radial-gradient(circle, ${TEMPO.gold}20 0%, transparent 60%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(circle, ${TEMPO.bgAlt} 0%, transparent 60%)`,
          filter: "blur(50px)",
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo Tempo + wordmark */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <TempoLogo size={96} animated />
          </div>
          <h1
            className="text-4xl tracking-tight"
            style={{ fontWeight: 300, letterSpacing: "-0.02em", color: TEMPO.text }}
          >
            Tempo<span style={{ color: TEMPO.gold }}>.</span>
          </h1>
          <p
            className="text-[10px] uppercase mt-3"
            style={{ color: TEMPO.textDim, letterSpacing: "0.3em" }}
          >
            Reprenez le contrôle<br />de votre journée
          </p>
        </div>

        {/* Carte d'inscription */}
        <div
          className="rounded-3xl p-6 space-y-3 backdrop-blur-xl"
          style={{
            background: TEMPO_GRADIENTS.card,
            border: `1px solid ${TEMPO.border}`,
            boxShadow: TEMPO_SHADOWS.card,
          }}
        >
          <h2 className="text-lg font-light mb-1" style={{ color: TEMPO.text }}>
            Créer un compte
          </h2>
          <p className="text-xs mb-4" style={{ color: TEMPO.textDim }}>
            Quelques informations pour commencer
          </p>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text" placeholder="Prénom" value={signupForm.firstName}
              onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
              style={inputStyle}
            />
            <input
              type="text" placeholder="Nom" value={signupForm.lastName}
              onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs mb-1 block ml-1" style={{ color: TEMPO.textDim }}>
              Date de naissance
            </label>
            <input
              type="date" value={signupForm.birthDate}
              onChange={(e) => setSignupForm({ ...signupForm, birthDate: e.target.value })}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
              style={inputStyle}
            />
          </div>

          <input
            type="email" placeholder="Adresse mail" value={signupForm.email}
            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
            style={inputStyle}
          />

          {/* CTA doré premium */}
          <button
            onClick={handleSignup} disabled={disabled}
            className="w-full mt-4 py-3.5 rounded-xl text-sm font-medium transition active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: disabled ? "rgba(255,255,255,0.08)" : TEMPO_GRADIENTS.gold,
              color: disabled ? TEMPO.textDim : "#1A1206",
              boxShadow: disabled ? "none" : TEMPO_SHADOWS.gold,
            }}
          >
            Créer mon compte
          </button>

          <p className="text-[11px] text-center mt-3" style={{ color: TEMPO.textDim }}>
            ✨ 7 jours d'essai gratuit · sans carte bancaire
          </p>
          <p className="text-[10px] text-center mt-1" style={{ color: TEMPO.textMuted }}>
            3,99 € / mois ensuite · sans engagement
          </p>
        </div>

        {/* Accès bêta */}
        <button
          onClick={handleBetaBypass}
          className="w-full mt-4 py-2.5 rounded-xl border border-dashed text-[11px] transition flex items-center justify-center gap-2"
          style={{ borderColor: TEMPO.gold + "40", color: TEMPO.gold + "cc" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: TEMPO.gold }}
          />
          Accès bêta · entrer sans inscription
        </button>

        <footer className="mt-8 text-center">
          <p className="text-[10px] uppercase" style={{ color: TEMPO.textMuted, letterSpacing: "0.15em" }}>
            propulsé par
          </p>
          <p
            className="mt-1 text-sm font-bold tracking-[0.08em]"
            style={{
              background: `linear-gradient(180deg, ${TEMPO.text} 0%, ${TEMPO.textDim} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            DIGIT'ARK<span style={{ color: TEMPO.gold, WebkitTextFillColor: TEMPO.gold }}>.</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
