import { Calendar, Camera, ChevronLeft, LogOut, Mail, MapPin, Sparkles } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { calcAge } from "../utils/time";

export default function ProfileScreen() {
  const {
    user, setUser, profileDraft, setProfileDraft,
    setShowProfile, handlePhotoUpload, dayTheme,
  } = useFocus();

  const draft = profileDraft || user;
  const closeWithoutSaving = () => { setShowProfile(false); setProfileDraft(null); };
  const save = () => { setUser(draft); setShowProfile(false); setProfileDraft(null); };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{ background: dayTheme.glow }}
        />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-8">
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={closeWithoutSaving}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-lg font-light">Mon profil</h2>
          <div className="w-10" />
        </header>

        <div className="flex flex-col items-center mb-8">
          <label className="relative cursor-pointer group">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border-2 flex items-center justify-center"
              style={{ borderColor: dayTheme.accent + "60", background: "rgba(255,255,255,0.05)" }}
            >
              {draft.photo ? (
                <img src={draft.photo} alt="profil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-light text-white/60">
                  {draft.firstName?.[0]}{draft.lastName?.[0]}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition">
              <Camera size={15} />
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
          <p className="mt-3 text-xl font-light">{draft.firstName} {draft.lastName}</p>
          <p className="text-xs text-white/40 mt-1">{draft.email}</p>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block ml-1">Prénom</label>
              <input
                type="text" value={draft.firstName}
                onChange={(e) => setProfileDraft({ ...draft, firstName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block ml-1">Nom</label>
              <input
                type="text" value={draft.lastName}
                onChange={(e) => setProfileDraft({ ...draft, lastName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1.5 ml-1 flex items-center gap-1.5">
              <Calendar size={11} /> Date de naissance · {calcAge(draft.birthDate)} ans
            </label>
            <input
              type="date" value={draft.birthDate}
              onChange={(e) => setProfileDraft({ ...draft, birthDate: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1.5 ml-1 flex items-center gap-1.5">
              <Mail size={11} /> Adresse mail
            </label>
            <input
              type="email" value={draft.email}
              onChange={(e) => setProfileDraft({ ...draft, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1.5 ml-1 flex items-center gap-1.5">
              <MapPin size={11} /> Ville
            </label>
            <input
              type="text" placeholder="Paris, Lyon, Marseille..." value={draft.city || ""}
              onChange={(e) => setProfileDraft({ ...draft, city: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1.5 ml-1 flex items-center gap-1.5">
              <Sparkles size={11} /> Bio
            </label>
            <textarea
              placeholder="Quelques mots sur vous..." value={draft.bio || ""}
              onChange={(e) => setProfileDraft({ ...draft, bio: e.target.value })} rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={closeWithoutSaving}
            className="flex-1 py-3 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition"
          >
            Annuler
          </button>
          <button
            onClick={save}
            className="flex-1 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition"
          >
            Enregistrer
          </button>
        </div>

        <button
          onClick={() => setUser(null)}
          className="w-full mt-3 py-3 rounded-xl text-sm text-red-400/80 hover:bg-red-500/10 transition flex items-center justify-center gap-2"
        >
          <LogOut size={14} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}
