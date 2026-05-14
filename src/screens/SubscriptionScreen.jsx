import { CheckCircle2, ChevronLeft } from "lucide-react";
import { useFocus } from "../context/FocusContext";

export default function SubscriptionScreen() {
  const {
    user, setUser, setShowSubscription, trialDaysLeft, trialExpired,
    paymentForm, setPaymentForm, activateSubscription, dayTheme,
  } = useFocus();

  const forced = trialExpired;

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: dayTheme.glow }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-50"
          style={{ background: dayTheme.accent }}
        />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-8">
        <header className="flex items-center justify-between mb-8">
          {!forced ? (
            <button
              onClick={() => setShowSubscription(false)}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
            >
              <ChevronLeft size={18} />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <h2 className="text-lg font-light">
            {user.isSubscribed ? "Mon abonnement" : "Activer Focus"}
          </h2>
          <div className="w-10" />
        </header>

        {user.isSubscribed ? (
          <>
            <div
              className="rounded-3xl border p-6 mb-6"
              style={{
                borderColor: dayTheme.accent + "40",
                background: `linear-gradient(135deg, ${dayTheme.accent}15 0%, transparent 100%)`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: dayTheme.accent + "30" }}
                >
                  <CheckCircle2 size={20} style={{ color: dayTheme.accent }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-0.5">Abonnement</p>
                  <p className="text-base font-medium" style={{ color: dayTheme.accent }}>Actif</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/50">Plan</span><span>Focus mensuel</span></div>
                <div className="flex justify-between"><span className="text-white/50">Tarif</span><span>3,99 € / mois</span></div>
                <div className="flex justify-between"><span className="text-white/50">Engagement</span><span>Aucun</span></div>
              </div>
            </div>

            <button
              onClick={() => setUser({ ...user, isSubscribed: false })}
              className="w-full py-3 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              Annuler mon abonnement
            </button>
            <p className="text-[11px] text-white/30 text-center mt-3 italic">
              L'annulation prend effet à la fin de la période en cours.
            </p>
          </>
        ) : (
          <>
            <div
              className="rounded-3xl border p-6 mb-5"
              style={{
                borderColor: dayTheme.accent + "40",
                background: `linear-gradient(135deg, ${dayTheme.accent}15 0%, transparent 100%)`,
                boxShadow: `0 20px 60px ${dayTheme.accent}20`,
              }}
            >
              {forced ? (
                <>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">Essai terminé</p>
                  <h3 className="text-2xl font-light mb-1">Continuons ensemble</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Votre essai gratuit de 7 jours est terminé. Activez votre abonnement pour continuer à utiliser Focus.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                    Essai gratuit · {trialDaysLeft} {trialDaysLeft > 1 ? "jours" : "jour"} restant{trialDaysLeft > 1 ? "s" : ""}
                  </p>
                  <h3 className="text-2xl font-light mb-1">Activer mon abonnement</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Continuez à profiter de Focus après votre période d'essai.
                  </p>
                </>
              )}

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-extralight" style={{ color: dayTheme.accent }}>3,99 €</span>
                <span className="text-sm text-white/50">/ mois</span>
              </div>
              <p className="text-[11px] text-white/40 mt-1">Sans engagement · annulable à tout moment</p>
            </div>

            <div className="space-y-3 mb-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 ml-1">Informations de paiement</p>

              <input
                type="text" placeholder="Nom sur la carte" value={paymentForm.name}
                onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-white/30"
              />

              <input
                type="text" inputMode="numeric" placeholder="Numéro de carte"
                value={paymentForm.cardNumber}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                  const formatted = v.replace(/(.{4})/g, "$1 ").trim();
                  setPaymentForm({ ...paymentForm, cardNumber: formatted });
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-white/30 font-mono tabular-nums"
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-white/30 font-mono tabular-nums"
                />
                <input
                  type="text" inputMode="numeric" placeholder="CVC"
                  value={paymentForm.cvc}
                  onChange={(e) => setPaymentForm({ ...paymentForm, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-white/30 font-mono tabular-nums"
                />
              </div>
            </div>

            <button
              onClick={activateSubscription}
              disabled={!paymentForm.cardNumber || !paymentForm.expiry || !paymentForm.cvc || !paymentForm.name}
              className="w-full py-4 rounded-xl text-sm font-medium transition hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: dayTheme.accent, color: "#000" }}
            >
              Activer mon abonnement · 3,99 € / mois
            </button>

            <p className="text-[11px] text-white/30 text-center mt-3 leading-relaxed">
              Vous serez débité aujourd'hui de 3,99 €.
              Annulable à tout moment depuis votre compte.
            </p>

            {forced && (
              <button
                onClick={() => setUser(null)}
                className="w-full mt-4 py-2.5 text-xs text-white/40 hover:text-white/60 transition"
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
