import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useFocus } from "../context/FocusContext";
import TempoLogo from "../components/TempoLogo";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../utils/tempoTheme";

// ============================================================
//  SignupScreen — Écran d'accueil unifié : inscription, connexion
//  et "mot de passe oublié". Le mode est piloté par `authMode`
//  dans le FocusContext, ce qui permet de garder la session
//  cohérente avec le reste de l'application.
//
//  L'envoi d'email réel pour "mot de passe oublié" n'est pas
//  implémenté ici (uniquement la structure UI et l'action), pour
//  permettre de brancher un service tier plus tard sans toucher
//  aux composants — la signature `handleForgotPassword` reste
//  identique côté API.
// ============================================================
export default function SignupScreen() {
  const {
    authMode, setAuthMode, authError, setAuthError,
    signupForm, setSignupForm, handleSignup,
    loginForm, setLoginForm, handleLogin,
    forgotForm, setForgotForm, handleForgotPassword,
    handleBetaBypass,
  } = useFocus();

  const [showPwd, setShowPwd] = useState(false);
  const [showPwdConfirm, setShowPwdConfirm] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${TEMPO.border}`,
    color: TEMPO.text,
  };

  // Bascule de mode → on réinitialise les erreurs / messages éphémères.
  const switchMode = (mode) => {
    setAuthError(null);
    setForgotSent(false);
    setAuthMode(mode);
  };

  // === Inscription ===
  const signupDisabled =
    !signupForm.firstName || !signupForm.lastName || !signupForm.birthDate
    || !signupForm.email || !signupForm.password || !signupForm.confirmPassword;

  const renderSignup = () => (
    <>
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

      <div className="mt-3">
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
        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition mt-3"
        style={inputStyle}
      />

      <div className="relative mt-3">
        <input
          type={showPwd ? "text" : "password"}
          placeholder="Mot de passe (min. 6 caractères)"
          value={signupForm.password}
          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
          className="w-full rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none transition"
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => setShowPwd((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
          tabIndex={-1}
        >
          {showPwd
            ? <EyeOff size={15} style={{ color: TEMPO.textDim }} />
            : <Eye size={15} style={{ color: TEMPO.textDim }} />}
        </button>
      </div>

      <div className="relative mt-3">
        <input
          type={showPwdConfirm ? "text" : "password"}
          placeholder="Confirmer le mot de passe"
          value={signupForm.confirmPassword}
          onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
          className="w-full rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none transition"
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => setShowPwdConfirm((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
          tabIndex={-1}
        >
          {showPwdConfirm
            ? <EyeOff size={15} style={{ color: TEMPO.textDim }} />
            : <Eye size={15} style={{ color: TEMPO.textDim }} />}
        </button>
      </div>

      {authError && (
        <p className="text-[11px] mt-3 text-center" style={{ color: TEMPO.danger }}>
          {authError}
        </p>
      )}

      <button
        onClick={handleSignup}
        disabled={signupDisabled}
        className="w-full mt-4 py-3.5 rounded-xl text-sm font-medium transition active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: signupDisabled ? "rgba(255,255,255,0.08)" : TEMPO_GRADIENTS.gold,
          color: signupDisabled ? TEMPO.textDim : "#1A1206",
          boxShadow: signupDisabled ? "none" : TEMPO_SHADOWS.gold,
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

      <p className="text-[12px] text-center mt-4" style={{ color: TEMPO.textDim }}>
        Déjà un compte ?{" "}
        <button onClick={() => switchMode("login")} style={{ color: TEMPO.gold }}>
          Se connecter
        </button>
      </p>
    </>
  );

  // === Connexion ===
  const loginDisabled = !loginForm.email || !loginForm.password;

  const renderLogin = () => (
    <>
      <h2 className="text-lg font-light mb-1" style={{ color: TEMPO.text }}>
        Connexion
      </h2>
      <p className="text-xs mb-4" style={{ color: TEMPO.textDim }}>
        Retrouvez votre rythme
      </p>

      <input
        type="email" placeholder="Adresse mail" value={loginForm.email}
        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
        style={inputStyle}
      />

      <div className="relative mt-3">
        <input
          type={showPwd ? "text" : "password"}
          placeholder="Mot de passe"
          value={loginForm.password}
          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          className="w-full rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none transition"
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => setShowPwd((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
          tabIndex={-1}
        >
          {showPwd
            ? <EyeOff size={15} style={{ color: TEMPO.textDim }} />
            : <Eye size={15} style={{ color: TEMPO.textDim }} />}
        </button>
      </div>

      {authError && (
        <p className="text-[11px] mt-3 text-center" style={{ color: TEMPO.danger }}>
          {authError}
        </p>
      )}

      <button
        onClick={handleLogin}
        disabled={loginDisabled}
        className="w-full mt-4 py-3.5 rounded-xl text-sm font-medium transition active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: loginDisabled ? "rgba(255,255,255,0.08)" : TEMPO_GRADIENTS.gold,
          color: loginDisabled ? TEMPO.textDim : "#1A1206",
          boxShadow: loginDisabled ? "none" : TEMPO_SHADOWS.gold,
        }}
      >
        Se connecter
      </button>

      <div className="flex items-center justify-between mt-3">
        <button
          onClick={() => switchMode("forgot")}
          className="text-[11px]"
          style={{ color: TEMPO.textDim }}
        >
          Mot de passe oublié ?
        </button>
        <button
          onClick={() => switchMode("signup")}
          className="text-[11px]"
          style={{ color: TEMPO.gold }}
        >
          Créer un compte
        </button>
      </div>
    </>
  );

  // === Mot de passe oublié (structure préparée, pas d'envoi mail) ===
  const renderForgot = () => (
    <>
      <h2 className="text-lg font-light mb-1" style={{ color: TEMPO.text }}>
        Mot de passe oublié
      </h2>
      <p className="text-xs mb-4" style={{ color: TEMPO.textDim }}>
        {forgotSent
          ? "Si un compte existe avec cet email, vous recevrez une procédure de réinitialisation."
          : "Saisissez l'email associé à votre compte"}
      </p>

      {!forgotSent && (
        <>
          <input
            type="email" placeholder="Adresse mail" value={forgotForm.email}
            onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
            style={inputStyle}
          />

          {authError && (
            <p className="text-[11px] mt-3 text-center" style={{ color: TEMPO.danger }}>
              {authError}
            </p>
          )}

          <button
            onClick={() => {
              if (handleForgotPassword()) setForgotSent(true);
            }}
            disabled={!forgotForm.email}
            className="w-full mt-4 py-3.5 rounded-xl text-sm font-medium transition active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: forgotForm.email ? TEMPO_GRADIENTS.gold : "rgba(255,255,255,0.08)",
              color: forgotForm.email ? "#1A1206" : TEMPO.textDim,
              boxShadow: forgotForm.email ? TEMPO_SHADOWS.gold : "none",
            }}
          >
            Envoyer le lien de réinitialisation
          </button>
        </>
      )}

      <button
        onClick={() => switchMode("login")}
        className="w-full mt-3 py-2.5 rounded-xl text-[12px] border transition"
        style={{ borderColor: TEMPO.border, color: TEMPO.text }}
      >
        Retour à la connexion
      </button>
    </>
  );

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
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <TempoLogo size={88} animated />
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

        {/* Carte d'authentification — mode pilote par authMode */}
        <div
          className="rounded-3xl p-6 backdrop-blur-xl"
          style={{
            background: TEMPO_GRADIENTS.card,
            border: `1px solid ${TEMPO.border}`,
            boxShadow: TEMPO_SHADOWS.card,
          }}
        >
          {authMode === "signup" && renderSignup()}
          {authMode === "login" && renderLogin()}
          {authMode === "forgot" && renderForgot()}
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
