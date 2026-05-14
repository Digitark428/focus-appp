import { useFocus } from "../context/FocusContext";

// === HOLOGRAPHIC BUDDHA HEAD ===
// Animated SVG used as the signup logo. Extracted as a sub-component so the
// signup file stays focused on layout & form.
function BuddhaHologram() {
  const nodes = [
    { cx: 40, cy: 36, r: 1.1 }, { cx: 46, cy: 40, r: 1.2 }, { cx: 50, cy: 34, r: 1.4 },
    { cx: 54, cy: 40, r: 1.2 }, { cx: 60, cy: 36, r: 1.1 }, { cx: 36, cy: 44, r: 1.0 },
    { cx: 42, cy: 46, r: 1.0 }, { cx: 50, cy: 44, r: 1.3 }, { cx: 58, cy: 46, r: 1.0 },
    { cx: 64, cy: 44, r: 1.0 }, { cx: 34, cy: 52, r: 0.9 }, { cx: 40, cy: 54, r: 1.0 },
    { cx: 46, cy: 56, r: 1.0 }, { cx: 54, cy: 56, r: 1.0 }, { cx: 60, cy: 54, r: 1.0 },
    { cx: 66, cy: 52, r: 0.9 },
  ];

  return (
    <div
      className="relative mx-auto mb-3 w-16 h-20 flex items-center justify-center"
      style={{ animation: "hologram-flicker 4s ease-in-out infinite" }}
    >
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-60"
        style={{
          background: "radial-gradient(circle, #A78BFA 0%, transparent 70%)",
          animation: "brain-pulse 3s ease-in-out infinite",
        }}
      />
      <div style={{ animation: "brain-breathe 4s ease-in-out infinite" }}>
        <svg width="64" height="80" viewBox="0 0 100 130" fill="none">
          <defs>
            <filter id="buddhaNeon" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="buddhaNodes" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#buddhaNeon)" stroke="#A78BFA" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Topknot flame (ushnisha) */}
            <path d="M 50 4 L 47 12 Q 50 14, 53 12 L 50 4 Z" />
            <ellipse cx="50" cy="20" rx="7" ry="6" />
            {/* Head dome */}
            <path d="M 50 26 C 33 26, 24 38, 24 56 C 24 70, 28 80, 34 86 L 36 88 C 38 96, 42 102, 46 105 C 48 106, 52 106, 54 105 C 58 102, 62 96, 64 88 L 66 86 C 72 80, 76 70, 76 56 C 76 38, 67 26, 50 26 Z" />
            {/* Ears */}
            <path d="M 26 60 C 22 62, 21 70, 24 76 C 26 80, 30 80, 32 78" />
            <path d="M 74 60 C 78 62, 79 70, 76 76 C 74 80, 70 80, 68 78" />
            {/* Third eye */}
            <circle cx="50" cy="64" r="1.2" fill="#A78BFA" stroke="none" />
            {/* Eyes — closed gentle curves */}
            <path d="M 38 73 Q 42 70, 46 73" />
            <path d="M 54 73 Q 58 70, 62 73" />
            {/* Nose */}
            <path d="M 50 78 L 47 90 Q 47 92, 50 92" />
            {/* Mouth */}
            <path d="M 44 99 Q 50 102, 56 99" />
            <path d="M 46 102 Q 50 104, 54 102" opacity="0.6" />
          </g>

          {/* Neural network on the upper skull */}
          <g stroke="#A78BFA" strokeWidth="0.4" opacity="0.7">
            <line x1="40" y1="36" x2="46" y2="40" />
            <line x1="46" y1="40" x2="50" y2="34" />
            <line x1="50" y1="34" x2="54" y2="40" />
            <line x1="54" y1="40" x2="60" y2="36" />
            <line x1="40" y1="36" x2="36" y2="44" />
            <line x1="36" y1="44" x2="42" y2="46" />
            <line x1="42" y1="46" x2="46" y2="40" />
            <line x1="42" y1="46" x2="50" y2="44" />
            <line x1="50" y1="44" x2="54" y2="40" />
            <line x1="50" y1="44" x2="58" y2="46" />
            <line x1="58" y1="46" x2="60" y2="36" />
            <line x1="58" y1="46" x2="64" y2="44" />
            <line x1="36" y1="44" x2="34" y2="52" />
            <line x1="34" y1="52" x2="40" y2="54" />
            <line x1="40" y1="54" x2="42" y2="46" />
            <line x1="40" y1="54" x2="46" y2="56" />
            <line x1="46" y1="56" x2="50" y2="44" />
            <line x1="46" y1="56" x2="54" y2="56" />
            <line x1="54" y1="56" x2="58" y2="46" />
            <line x1="54" y1="56" x2="60" y2="54" />
            <line x1="60" y1="54" x2="64" y2="44" />
            <line x1="60" y1="54" x2="66" y2="52" />
            <line x1="66" y1="52" x2="64" y2="44" />
          </g>

          {/* Glowing nodes */}
          <g filter="url(#buddhaNodes)">
            {nodes.map((n, i) => (
              <circle
                key={i}
                cx={n.cx} cy={n.cy} r={n.r} fill="#FFFFFF"
                style={{ filter: "drop-shadow(0 0 2.5px #A78BFA)" }}
              >
                <animate
                  attributeName="opacity"
                  values="0.55;1;0.55"
                  dur={`${1.8 + (i % 5) * 0.4}s`}
                  repeatCount="indefinite"
                  begin={`${(i * 0.13) % 3}s`}
                />
              </circle>
            ))}
          </g>

          {/* Holographic projection base */}
          <ellipse cx="50" cy="124" rx="22" ry="1.8" fill="#A78BFA" opacity="0.5" style={{ filter: "blur(2px)" }} />
          <ellipse cx="50" cy="125" rx="14" ry="0.9" fill="#A78BFA" opacity="0.85" style={{ filter: "blur(0.8px)" }} />
        </svg>
      </div>
    </div>
  );
}

export default function SignupScreen() {
  const { signupForm, setSignupForm, handleSignup, handleBetaBypass } = useFocus();
  const disabled = !signupForm.firstName || !signupForm.lastName || !signupForm.birthDate || !signupForm.email;

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-violet-500" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-cyan-500 opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <BuddhaHologram />
          <p className="text-xs text-white/40 mt-3 tracking-[0.25em] uppercase">
            Reprenez le contrôle de votre journée
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-3">
          <h2 className="text-lg font-light mb-1">Créer un compte</h2>
          <p className="text-xs text-white/40 mb-4">Quelques informations pour commencer</p>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text" placeholder="Prénom" value={signupForm.firstName}
              onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
            />
            <input
              type="text" placeholder="Nom" value={signupForm.lastName}
              onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1 block ml-1">Date de naissance</label>
            <input
              type="date" value={signupForm.birthDate}
              onChange={(e) => setSignupForm({ ...signupForm, birthDate: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
            />
          </div>

          <input
            type="email" placeholder="Adresse mail" value={signupForm.email}
            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
          />

          <button
            onClick={handleSignup} disabled={disabled}
            className="w-full mt-4 py-3.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Créer mon compte
          </button>

          <p className="text-[11px] text-white/40 text-center mt-3">
            ✨ 7 jours d'essai gratuit · sans carte bancaire
          </p>
          <p className="text-[10px] text-white/30 text-center mt-1">
            3,99 € / mois ensuite · sans engagement
          </p>
        </div>

        <button
          onClick={handleBetaBypass}
          className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-yellow-400/30 text-[11px] text-yellow-300/80 hover:bg-yellow-400/5 hover:border-yellow-400/50 transition flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          Accès bêta · entrer sans inscription
        </button>

        <footer className="mt-8 text-center">
          <p className="text-[10px] text-white/25 tracking-[0.15em] uppercase">propulsé par</p>
          <p
            className="mt-1 text-sm font-bold tracking-[0.08em]"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.45) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            DIGIT'ARK<span style={{ WebkitTextFillColor: "rgba(255,255,255,0.85)" }}>.</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
