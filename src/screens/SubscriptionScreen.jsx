import { CheckCircle2, ChevronLeft } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../utils/tempoTheme";

export default function SubscriptionScreen() {
  const {
    user, setUser, setShowSubscription, trialDaysLeft, trialExpired,
    paymentForm, setPaymentForm, activateSubscription,
  } = useFocus();

  const forced = trialExpired;

  const inputCls = "w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none transition";
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${TEMPO.border}`,
    color: TEMPO.text,
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: TEMPO_GRADIENTS.bgRadial, color: TEMPO.text }}
    >
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: TEMPO.gold }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-50"
          style={{ background: TEMPO.goldGlow }}
        />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-8">
        <header className="flex items-center justify-between mb-8">
          {!forced ? (
            <button
              onClick={() => setShowSubscription(false)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition hover:bg-white/10"
              style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${TEMPO.border}` }}
            >
              <ChevronLeft size={18} style={{ color: TEMPO.text }} />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <h2 className="text-lg font-light" style={{ color: TEMPO.text }}>
            {user.isSubscribed ? "Mon abonnement" : "Activer Tempo."}
          </h2>
          <div className="w-10" />
        </header>

        {user.isSubscribed ? (
          <>
            <div
              className="rounded-3xl border p-6 mb-6"
              style={{
                borderColor: TEMPO.gold + "40",
                background: `linear-gradient(135deg, ${TEMPO.gold}15 0%, transparent 100%)`,
                boxShadow: TEMPO_SHADOWS.card,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: TEMPO.gold + "30" }}
                >
                  <CheckCircle2 size={20} style={{ color: TEMPO.gold }} />
                </div>
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.22em] mb-0.5"
                    style={{ color: TEMPO.textDim }}
                  >
                    Abonnement
                  </p>
                  <p className="text-base font-medium" style={{ color: TEMPO.gold }}>Actif</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: TEMPO.textDim }}>Plan</span>
                  <span style={{ color: TEMPO.text }}>Tempo mensuel</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: TEMPO.textDim }}>Tarif</span>
                  <span style={{ color: TEMPO.text }}>3,99 € / mois</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: TEMPO.textDim }}>Engagement</span>
                  <span style={{ color: TEMPO.text }}>Aucun</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setUser({ ...user, isSubscribed: false })}
              className="w-full py-3 rounded-xl text-sm hover:bg-red-500/10 transition"
              style={{ color: TEMPO.textDim }}
            >
              Annuler mon abonnement
            </button>
            <p
              className="text-[11px] text-center mt-3 italic"
              style={{ color: TEMPO.textMuted }}
            >
              L'annulation prend effet à la fin de la période en cours.
            </p>
          </>
        ) : (
          <>
            <div
              className="rounded-3xl border p-6 mb-5"
              style={{
                borderColor: TEMPO.gold + "40",
                background: `linear-gradient(135deg, ${TEMPO.gold}15 0%, transparent 100%)`,
                boxShadow: `0 20px 60px ${TEMPO.gold}20, ${TEMPO_SHADOWS.card}`,
              }}
            >
              {forced ? (
                <>
                  <p
                    className="text-[10px] uppercase tracking-[0.22em] mb-2"
                    style={{ color: TEMPO.textDim }}
                  >
                    Essai terminé
                  </p>
                  <h3 className="text-2xl font-light mb-1" style={{ color: TEMPO.text }}>
                    Continuons ensemble
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: TEMPO.textDim }}>
                    Votre essai gratuit de 7 jours est terminé. Activez votre abonnement
                    pour continuer à utiliser Tempo.
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="text-[10px] uppercase tracking-[0.22em] mb-2"
                    style={{ color: TEMPO.textDim }}
                  >
                    Essai gratuit · {trialDaysLeft} {trialDaysLeft > 1 ? "jours" : "jour"} restant{trialDaysLeft > 1 ? "s" : ""}
                  </p>
                  <h3 className="text-2xl font-light mb-1" style={{ color: TEMPO.text }}>
                    Activer mon abonnement
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: TEMPO.textDim }}>
                    Continuez à profiter de Tempo après votre période d'essai.
                  </p>
                </>
              )}

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-extralight" style={{ color: TEMPO.gold }}>
                  3,99 €
                </span>
                <span className="text-sm" style={{ color: TEMPO.textDim }}>/ mois</span>
              </div>
              <p className="text-[11px] mt-1" style={{ color: TEMPO.textMuted }}>
                Sans engagement · annulable à tout moment
              </p>
            </div>

            <div className="space-y-3 mb-5">
              <p
                className="text-[10px] uppercase tracking-[0.22em] ml-1"
                style={{ color: TEMPO.textDim }}
              >
                Informations de paiement
              </p>

              <input
                type="text" placeholder="Nom sur la carte" value={paymentForm.name}
                onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                className={inputCls} style={inputStyle}
              />

              <input
                type="text" inputMode="numeric" placeholder="Numéro de carte"
                value={paymentForm.cardNumber}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                  const formatted = v.replace(/(.{4})/g, "$1 ").trim();
                  setPaymentForm({ ...paymentForm, cardNumber: formatted });
                }}
                className={`${inputCls} font-mono tabular-nums`} style={inputStyle}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text" inputMode="numeric" placeholder="MM / AA"
                  value={paymentForm.expiry}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    const formatted = v.length > 2 ? `${v.slice(0, 2)} / ${v.slice(2)}` : v;
                    setPaymentForm({ ...paymentForm, expiry: formatted });
                  }}
                  className={`${inputCls} font-mono tabular-nums`} style={inputStyle}
                />
                <input
                  type="text" inputMode="numeric" placeholder="CVC"
                  value={paymentForm.cvc}
                  onChange={(e) => setPaymentForm({ ...paymentForm, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  className={`${inputCls} font-mono tabular-nums`} style={inputStyle}
                />
              </div>
            </div>

            <button
              onClick={activateSubscription}
              disabled={!paymentForm.cardNumber || !paymentForm.expiry || !paymentForm.cvc || !paymentForm.name}
              className="w-full py-4 rounded-xl text-sm font-medium transition hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: TEMPO_GRADIENTS.gold,
                color: "#1A1206",
                boxShadow: TEMPO_SHADOWS.gold,
              }}
            >
              Activer mon abonnement · 3,99 € / mois
            </button>

            <p
              className="text-[11px] text-center mt-3 leading-relaxed"
              style={{ color: TEMPO.textMuted }}
            >
              Vous serez débité aujourd'hui de 3,99 €.
              Annulable à tout moment depuis votre compte.
            </p>

            {forced && (
              <button
                onClick={() => setUser(null)}
                className="w-full mt-4 py-2.5 text-xs transition hover:text-white/70"
                style={{ color: TEMPO.textDim }}
              >
                Se déconnecter
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
