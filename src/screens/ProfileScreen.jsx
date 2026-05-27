import { Calendar, Camera, ChevronLeft, Eye, EyeOff, KeyRound, LogOut, Mail, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { useFocus } from "../context/FocusContext";
import { calcAge } from "../utils/time";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../utils/tempoTheme";

export default function ProfileScreen() {
  const {
    user, setUser, profileDraft, setProfileDraft,
    setShowProfile, handlePhotoUpload,
    passwordForm, setPasswordForm,
    passwordChangeMessage, setPasswordChangeMessage,
    changePassword, handleLogout,
  } = useFocus();

  const draft = profileDraft || user;
  const [showPwdSection, setShowPwdSection] = useState(false);
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });

  const closeWithoutSaving = () => {
    setShowProfile(false);
    setProfileDraft(null);
    setShowPwdSection(false);
    setPasswordChangeMessage(null);
    setPasswordForm({ current: "", next: "", confirm: "" });
  };
  const save = () => {
    setUser(draft);
    setShowProfile(false);
    setProfileDraft(null);
  };

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition";
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${TEMPO.border}`,
    color: TEMPO.text,
  };
  const labelStyle = { color: TEMPO.textDim };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: TEMPO_GRADIENTS.bgRadial, color: TEMPO.text }}
    >
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{ background: TEMPO.gold }}
        />
      </div>

      <div
        className="
          relative z-10 mx-auto pt-14
          px-6 max-w-md
          lg:px-10 lg:max-w-3xl
        "
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 9rem)" }}
      >
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={closeWithoutSaving}
            className="w-10 h-10 rounded-full flex items-center justify-center transition hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${TEMPO.border}` }}
          >
            <ChevronLeft size={18} style={{ color: TEMPO.text }} />
          </button>
          <h2 className="text-lg font-light" style={{ color: TEMPO.text }}>Mon profil</h2>
          <div className="w-10" />
        </header>

        <div className="flex flex-col items-center mb-8">
          <label className="relative cursor-pointer group">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border-2 flex items-center justify-center"
              style={{
                borderColor: TEMPO.gold + "70",
                background: "rgba(255,255,255,0.04)",
                boxShadow: `0 0 24px ${TEMPO.gold}30`,
              }}
            >
              {draft.photo ? (
                <img src={draft.photo} alt="profil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-light" style={{ color: TEMPO.gold }}>
                  {draft.firstName?.[0]}{draft.lastName?.[0]}
                </span>
              )}
            </div>
            <div
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full flex items-center justify-center group-hover:scale-110 transition"
              style={{
                background: TEMPO_GRADIENTS.gold,
                color: "#1A1206",
                boxShadow: TEMPO_SHADOWS.goldSm,
              }}
            >
              <Camera size={15} />
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
          <p className="mt-3 text-xl font-light" style={{ color: TEMPO.text }}>
            {draft.firstName} {draft.lastName}
          </p>
          <p className="text-xs mt-1" style={{ color: TEMPO.textDim }}>{draft.email}</p>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1.5 block ml-1" style={labelStyle}>Prénom</label>
              <input
                type="text" value={draft.firstName}
                onChange={(e) => setProfileDraft({ ...draft, firstName: e.target.value })}
                className={inputCls} style={inputStyle}
              />
            </div>
            <div>
              <label className="text-xs mb-1.5 block ml-1" style={labelStyle}>Nom</label>
              <input
                type="text" value={draft.lastName}
                onChange={(e) => setProfileDraft({ ...draft, lastName: e.target.value })}
                className={inputCls} style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1.5 ml-1 flex items-center gap-1.5" style={labelStyle}>
              <Calendar size={11} /> Date de naissance · {calcAge(draft.birthDate)} ans
            </label>
            <input
              type="date" value={draft.birthDate}
              onChange={(e) => setProfileDraft({ ...draft, birthDate: e.target.value })}
              className={inputCls} style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs mb-1.5 ml-1 flex items-center gap-1.5" style={labelStyle}>
              <Mail size={11} /> Adresse mail
            </label>
            <input
              type="email" value={draft.email}
              onChange={(e) => setProfileDraft({ ...draft, email: e.target.value })}
              className={inputCls} style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs mb-1.5 ml-1 flex items-center gap-1.5" style={labelStyle}>
              <MapPin size={11} /> Ville
            </label>
            <input
              type="text" placeholder="Paris, Lyon, Marseille..." value={draft.city || ""}
              onChange={(e) => setProfileDraft({ ...draft, city: e.target.value })}
              className={inputCls} style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs mb-1.5 ml-1 flex items-center gap-1.5" style={labelStyle}>
              <Sparkles size={11} /> Bio
            </label>
            <textarea
              placeholder="Quelques mots sur vous..." value={draft.bio || ""}
              onChange={(e) => setProfileDraft({ ...draft, bio: e.target.value })} rows={3}
              className={`${inputCls} resize-none`} style={inputStyle}
            />
          </div>
        </div>

        {/* Section Mot de passe — collapsible pour ne pas alourdir l'UI */}
        <div className="mt-6">
          <button
            onClick={() => {
              setShowPwdSection((v) => !v);
              setPasswordChangeMessage(null);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition hover:bg-white/5"
            style={{ borderColor: TEMPO.border }}
          >
            <KeyRound size={14} style={{ color: TEMPO.gold }} />
            <span className="text-sm flex-1 text-left" style={{ color: TEMPO.text }}>
              Modifier le mot de passe
            </span>
            <span className="text-[11px]" style={{ color: TEMPO.textDim }}>
              {showPwdSection ? "Fermer" : "Ouvrir"}
            </span>
          </button>

          {showPwdSection && (
            <div
              className="mt-3 p-4 rounded-2xl border space-y-3"
              style={{ borderColor: TEMPO.border, background: "rgba(255,255,255,0.025)" }}
            >
              {[
                { key: "current", label: "Mot de passe actuel" },
                { key: "next", label: "Nouveau mot de passe (min. 6 car.)" },
                { key: "confirm", label: "Confirmer le nouveau mot de passe" },
              ].map(({ key, label }) => (
                <div key={key} className="relative">
                  <label className="text-xs mb-1.5 block ml-1" style={labelStyle}>{label}</label>
                  <input
                    type={showPwd[key] ? "text" : "password"}
                    value={passwordForm[key]}
                    onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                    className={`${inputCls} pr-11`}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => ({ ...s, [key]: !s[key] }))}
                    className="absolute right-3 bottom-2.5 p-1"
                    tabIndex={-1}
                  >
                    {showPwd[key]
                      ? <EyeOff size={15} style={{ color: TEMPO.textDim }} />
                      : <Eye size={15} style={{ color: TEMPO.textDim }} />}
                  </button>
                </div>
              ))}

              {passwordChangeMessage && (
                <p
                  className="text-[11px] text-center"
                  style={{
                    color: passwordChangeMessage.type === "success"
                      ? TEMPO.success
                      : TEMPO.danger,
                  }}
                >
                  {passwordChangeMessage.text}
                </p>
              )}

              <button
                onClick={changePassword}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition active:scale-[0.98]"
                style={{
                  background: TEMPO_GRADIENTS.gold,
                  color: "#1A1206",
                  boxShadow: TEMPO_SHADOWS.goldSm,
                }}
              >
                Mettre à jour le mot de passe
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={closeWithoutSaving}
            className="flex-1 py-3 rounded-xl border text-sm transition hover:bg-white/5"
            style={{ borderColor: TEMPO.border, color: TEMPO.text }}
          >
            Annuler
          </button>
          <button
            onClick={save}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition active:scale-[0.98]"
            style={{
              background: TEMPO_GRADIENTS.gold,
              color: "#1A1206",
              boxShadow: TEMPO_SHADOWS.gold,
            }}
          >
            Enregistrer
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-3 py-3 rounded-xl text-sm hover:bg-red-500/10 transition flex items-center justify-center gap-2"
          style={{ color: "#F87171cc" }}
        >
          <LogOut size={14} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}
