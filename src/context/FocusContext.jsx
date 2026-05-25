import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_COMPLETIONS, DEFAULT_DAY_METRICS, DEFAULT_FLOATING, DEFAULT_TASKS,
  MEDITATIONS, TASK_CATEGORIES,
} from "../constants/tasks";
import {
  cascadeShift, cascadeWouldOverflow, detectExistingConflicts, findConflicts,
  fromMin, todayIndex, toMin,
} from "../utils/time";
import { getDayThemes } from "../utils/themes";

const FocusContext = createContext(null);
export const useFocus = () => {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error("useFocus must be used inside <FocusProvider>");
  return ctx;
};

const DEMO_TASK_DURATION = 30; // seconds per task in demo mode
const TRIAL_DAYS = 7;
const LONG_PRESS_MS = 350;

export function FocusProvider({ children }) {
  // ── Auth ─────────────────────────────────────────────────────────────────
  // Tente de restaurer la session depuis le localStorage.
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("tempo.session.user");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [signupForm, setSignupForm] = useState({
    firstName: "", lastName: "", birthDate: "", email: "",
    password: "", confirmPassword: "",
  });
  // Auth mode for landing screen: "signup" | "login" | "forgot"
  const [authMode, setAuthMode] = useState("signup");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [forgotForm, setForgotForm] = useState({ email: "" });
  const [authError, setAuthError] = useState(null);
  const [profileDraft, setProfileDraft] = useState(null);
  // Password change in profile
  const [passwordForm, setPasswordForm] = useState({
    current: "", next: "", confirm: "",
  });
  const [passwordChangeMessage, setPasswordChangeMessage] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "", expiry: "", cvc: "", name: "",
  });

  // ── Navigation (which screen is on top) ──────────────────────────────────
  const [showProfile, setShowProfile] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showPlanning, setShowPlanning] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [activeMeditation, setActiveMeditation] = useState(null);

  // ── Theming ─────────────────────────────────────────────────────────────
  const [customTheme, setCustomTheme] = useState("default");

  // ── Tasks per day ────────────────────────────────────────────────────────
  const [selectedDay, setSelectedDay] = useState(todayIndex());
  const [weekTasks, setWeekTasks] = useState(DEFAULT_TASKS);
  const [weekFloatingTasks, setWeekFloatingTasks] = useState(DEFAULT_FLOATING);
  const [completions, setCompletions] = useState(DEFAULT_COMPLETIONS);
  const [dayMetrics, setDayMetrics] = useState(DEFAULT_DAY_METRICS);

  // ── Custom reusable templates ────────────────────────────────────────────
  const [customTaskTemplates, setCustomTaskTemplates] = useState([]);
  const [showCustomTaskEditor, setShowCustomTaskEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: "", color: "#D9B36A", durationMin: 30, iconKey: "Zap",
  });

  // ── Time / running state ─────────────────────────────────────────────────
  const [isRunning, setIsRunning] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [demoElapsed, setDemoElapsed] = useState(0);
  const [now, setNow] = useState(new Date());
  const [pausedAt, setPausedAt] = useState(null);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [skipPauseConfirm, setSkipPauseConfirm] = useState(false);

  // ── Task forms / pickers ─────────────────────────────────────────────────
  const [showAdd, setShowAdd] = useState(false);
  const [isFloatingForm, setIsFloatingForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Mode d'ajout — single source of truth pour séparer strictement les
  // trois flows de création.
  //   null         = aucun ajout en cours
  //   "chooser"    = l'utilisateur choisit le type (perso / prédéfinie / sans horaire)
  //   "custom"     = saisie d'une tâche personnalisée (nom libre + horaires)
  //   "predefined" = sélection catégorie puis sous-catégorie via picker
  //   "floating"   = saisie d'une tâche sans horaire
  //   "edit"       = édition d'une tâche existante (préserve son type)
  const [addFlowMode, setAddFlowMode] = useState(null);

  const [taskForm, setTaskForm] = useState({
    name: "", start: "", end: "", notes: "",
    meditationId: null, category: null, subcategory: null,
  });
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [pickerStep, setPickerStep] = useState("category");
  const [pickedCategory, setPickedCategory] = useState(null);

  // ── End-of-task / day summary ────────────────────────────────────────────
  const [endTaskPopup, setEndTaskPopup] = useState(null);
  const [showExtendChoice, setShowExtendChoice] = useState(false);
  const [extendMinutes, setExtendMinutes] = useState(30);
  const [showDaySummary, setShowDaySummary] = useState(false);
  const [showNoTasksWarning, setShowNoTasksWarning] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [validationBurst, setValidationBurst] = useState(null);
  const [taskTransition, setTaskTransition] = useState(null);

  // ── Conflicts ────────────────────────────────────────────────────────────
  const [conflictDialog, setConflictDialog] = useState(null);

  // ── Drag & drop ──────────────────────────────────────────────────────────
  const [dragState, setDragState] = useState(null);
  const [swapToast, setSwapToast] = useState(null);
  const dragRefs = useRef({});
  const dragLongPressTimer = useRef(null);

  // ── Audio ────────────────────────────────────────────────────────────────
  const [activeAmbient, setActiveAmbient] = useState(null);
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [customTracks, setCustomTracks] = useState([]);
  const [activeCustomTrack, setActiveCustomTrack] = useState(null);
  const [voiceOn, setVoiceOn] = useState(true);

  // ── Refs ────────────────────────────────────────────────────────────────
  const notifiedRef = useRef(new Set());
  const lastEndedRef = useRef(new Set());
  const popupOpenedAtRef = useRef(null);
  const popupTriggerKindRef = useRef(null);
  const summaryShownRef = useRef(new Set());
  const logoTapsRef = useRef({ count: 0, lastTap: 0 });

  // ────────────────────────────────────────────────────────────────────────
  // Derived values
  // ────────────────────────────────────────────────────────────────────────
  const activeDayThemes = useMemo(() => getDayThemes(customTheme), [customTheme]);
  const dayTheme = activeDayThemes[selectedDay];
  const tasks = weekTasks[selectedDay] || [];
  const floatingTasks = weekFloatingTasks[selectedDay] || [];
  const dayCompletions = completions[selectedDay] || {};
  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => toMin(a.start) - toMin(b.start)),
    [tasks],
  );

  // Helpers that mutate weekly state for the *currently selected* day.
  const setTasks = (newTasks) => {
    const updated = typeof newTasks === "function" ? newTasks(tasks) : newTasks;
    setWeekTasks((w) => ({ ...w, [selectedDay]: updated }));
  };
  const setFloatingTasks = (newList) => {
    const updated = typeof newList === "function" ? newList(floatingTasks) : newList;
    setWeekFloatingTasks((w) => ({ ...w, [selectedDay]: updated }));
  };

  // Trial countdown.
  const trialDaysLeft = (() => {
    if (!user?.trialStart) return 0;
    const elapsed = (Date.now() - user.trialStart) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(TRIAL_DAYS - elapsed));
  })();
  const trialExpired = user && !user.isSubscribed && trialDaysLeft <= 0;

  // ────────────────────────────────────────────────────────────────────────
  // Current / next task detection
  // ────────────────────────────────────────────────────────────────────────
  let currentTask = null;
  let progress = 0;
  let remainingSec = 0;
  let nextTask = null;

  if (demoMode) {
    const totalDemoTime = sortedTasks.length * DEMO_TASK_DURATION;
    if (demoElapsed < totalDemoTime) {
      const idx = Math.floor(demoElapsed / DEMO_TASK_DURATION);
      currentTask = sortedTasks[idx];
      const elapsedInTask = demoElapsed % DEMO_TASK_DURATION;
      progress = (elapsedInTask / DEMO_TASK_DURATION) * 100;
      remainingSec = DEMO_TASK_DURATION - elapsedInTask;
      nextTask = sortedTasks[idx + 1];
    }
  } else {
    const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    currentTask = sortedTasks.find(
      (t) => nowMin >= toMin(t.start) && nowMin < toMin(t.end) && !dayCompletions[t.id],
    );
    if (currentTask) {
      const start = toMin(currentTask.start);
      const end = toMin(currentTask.end);
      progress = ((nowMin - start) / (end - start)) * 100;
      remainingSec = Math.max(0, Math.floor((end - nowMin) * 60));
    }
    const currentIdx = currentTask ? sortedTasks.indexOf(currentTask) : -1;
    if (currentIdx >= 0) {
      nextTask = sortedTasks.slice(currentIdx + 1).find((t) => !dayCompletions[t.id]);
    } else {
      nextTask = sortedTasks.find((t) => toMin(t.start) > nowMin && !dayCompletions[t.id])
        || sortedTasks.find((t) => !dayCompletions[t.id] && toMin(t.end) > nowMin);
    }
  }

  // Per-task progress (0-100).
  const getTaskProgress = (task) => {
    if (dayCompletions[task.id]) return 100;
    if (demoMode) {
      const idx = sortedTasks.indexOf(task);
      const taskStart = idx * DEMO_TASK_DURATION;
      const taskEnd = taskStart + DEMO_TASK_DURATION;
      if (demoElapsed >= taskEnd) return 100;
      if (demoElapsed <= taskStart) return 0;
      return ((demoElapsed - taskStart) / DEMO_TASK_DURATION) * 100;
    }
    const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const start = toMin(task.start);
    const end = toMin(task.end);
    if (nowMin >= end) return 100;
    if (nowMin <= start) return 0;
    return ((nowMin - start) / (end - start)) * 100;
  };
  const isPastTask = (task) => getTaskProgress(task) >= 100;

  // Existing conflicts in current day.
  const existingConflicts = useMemo(() => detectExistingConflicts(tasks), [tasks]);

  // ────────────────────────────────────────────────────────────────────────
  // Effects
  // ────────────────────────────────────────────────────────────────────────

  // Master timer loop — ticks every second when the day is running.
  useEffect(() => {
    if (!isRunning) return undefined;
    const id = setInterval(() => {
      setNow(new Date());
      if (demoMode) setDemoElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, demoMode]);

  // Voice notification 10 min (or 10 sec in demo) before a task's end.
  useEffect(() => {
    if (!isRunning || !currentTask || !voiceOn) return;
    const threshold = demoMode ? 10 : 600;
    const key = `${currentTask.id}-warn`;
    if (remainingSec === threshold && !notifiedRef.current.has(key)) {
      notifiedRef.current.add(key);
      if ("speechSynthesis" in window) {
        const text = demoMode
          ? "Il vous reste 10 secondes avant la prochaine tâche."
          : "Il vous reste 10 minutes avant la prochaine tâche.";
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "fr-FR";
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      }
    }
  }, [remainingSec, currentTask, isRunning, voiceOn, demoMode]);

  // Detect when a task hits 100% — open the validation popup.
  useEffect(() => {
    if (!isRunning) return;
    sortedTasks.forEach((task) => {
      const prog = getTaskProgress(task);
      if (prog >= 100 && !lastEndedRef.current.has(task.id) && !dayCompletions[task.id]) {
        lastEndedRef.current.add(task.id);
        popupOpenedAtRef.current = Date.now();
        popupTriggerKindRef.current = "natural";
        setEndTaskPopup(task);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, demoElapsed, isRunning]);

  // Detect end of day → show summary popup.
  useEffect(() => {
    if (!isRunning || tasks.length === 0) return undefined;
    if (summaryShownRef.current.has(selectedDay)) return undefined;
    const allHandled = tasks.every((t) => dayCompletions[t.id]);
    if (allHandled) {
      summaryShownRef.current.add(selectedDay);
      const id = setTimeout(() => setShowDaySummary(true), 1200);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [dayCompletions, tasks, isRunning, selectedDay]);

  // Drag listeners while a drag is active.
  useEffect(() => {
    if (!dragState) return undefined;

    const onMouseMove = (e) => onDragPointerMove(e.clientY);
    const onTouchMove = (e) => {
      e.preventDefault();
      onDragPointerMove(e.touches[0].clientY);
    };
    const onUp = () => onDragPointerUp();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragState, tasks]);

  // ────────────────────────────────────────────────────────────────────────
  // Garde-fou d'invariant : addFlowMode contrôle la visibilité des modaux
  // d'ajout. Si addFlowMode retombe à null sans passer par closeAddFlow,
  // on force la fermeture des modaux/picker associés. Cela évite qu'un
  // changement d'état involontaire (ex: setUser/setShowProfile pendant
  // qu'un modal est ouvert) ne laisse un picker orphelin visible.
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (addFlowMode === null) {
      if (showCategoryPicker) setShowCategoryPicker(false);
      if (showAdd) setShowAdd(false);
    }
    if (addFlowMode === "chooser" && showAdd) {
      // Le chooser remplace l'AddModal, pas l'inverse.
      setShowAdd(false);
    }
    if (addFlowMode !== "predefined" && showCategoryPicker) {
      // Le picker n'a de sens que dans le flow predefined.
      setShowCategoryPicker(false);
      setPickerStep("category");
      setPickedCategory(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addFlowMode]);

  // ────────────────────────────────────────────────────────────────────────
  // Auth actions
  // ────────────────────────────────────────────────────────────────────────

  // Persiste la session utilisateur localement (et les comptes connus).
  // NOTE: structure préparée pour basculer ultérieurement sur un backend
  // sans toucher aux composants (signature des actions inchangée).
  useEffect(() => {
    try {
      if (user) localStorage.setItem("tempo.session.user", JSON.stringify(user));
      else localStorage.removeItem("tempo.session.user");
    } catch { /* storage indisponible */ }
  }, [user]);

  const readAccounts = () => {
    try { return JSON.parse(localStorage.getItem("tempo.accounts") || "[]"); }
    catch { return []; }
  };
  const writeAccounts = (list) => {
    try { localStorage.setItem("tempo.accounts", JSON.stringify(list)); }
    catch { /* ignore */ }
  };

  const handleSignup = () => {
    setAuthError(null);
    const { firstName, lastName, birthDate, email, password, confirmPassword } = signupForm;
    if (!firstName || !lastName || !birthDate || !email || !password || !confirmPassword) {
      setAuthError("Veuillez remplir tous les champs.");
      return;
    }
    if (password.length < 6) {
      setAuthError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setAuthError("Les mots de passe ne correspondent pas.");
      return;
    }
    const accounts = readAccounts();
    if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      setAuthError("Un compte existe déjà avec cet email.");
      return;
    }
    const newAccount = {
      firstName, lastName, birthDate, email, password,
      city: "", photo: null, bio: "",
      trialStart: Date.now(), isSubscribed: false,
    };
    writeAccounts([...accounts, newAccount]);
    // eslint-disable-next-line no-unused-vars
    const { password: _pw, ...sessionUser } = newAccount;
    setUser(sessionUser);
    setSignupForm({
      firstName: "", lastName: "", birthDate: "", email: "",
      password: "", confirmPassword: "",
    });
  };

  const handleLogin = () => {
    setAuthError(null);
    const { email, password } = loginForm;
    if (!email || !password) {
      setAuthError("Veuillez renseigner email et mot de passe.");
      return;
    }
    const accounts = readAccounts();
    const match = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password,
    );
    if (!match) {
      setAuthError("Identifiants incorrects.");
      return;
    }
    // eslint-disable-next-line no-unused-vars
    const { password: _pw, ...sessionUser } = match;
    setUser(sessionUser);
    setLoginForm({ email: "", password: "" });
  };

  // Architecture "mot de passe oublié" — pas d'envoi réel d'email pour
  // l'instant ; on confirme uniquement que la demande est reçue.
  // Quand un service mail sera branché, il suffira de remplacer ce corps.
  const handleForgotPassword = () => {
    setAuthError(null);
    const { email } = forgotForm;
    if (!email) {
      setAuthError("Veuillez saisir votre email.");
      return false;
    }
    // Toujours répondre la même chose (sécurité : ne pas révéler l'existence).
    setForgotForm({ email: "" });
    return true;
  };

  const handleLogout = () => {
    setUser(null);
    setShowProfile(false);
    setShowStats(false);
    setShowPlanning(false);
    setShowMenu(false);
    setShowSubscription(false);
    setShowCustomization(false);
    setFocusMode(false);
    setActiveMeditation(null);
    setIsRunning(false);
    setAuthMode("login");
    // Coupe aussi tout flow d'ajout en cours pour ne pas laisser un
    // modal/picker orphelin lors d'un retour rapide sur l'app.
    setAddFlowMode(null);
    setShowAdd(false);
    setShowCategoryPicker(false);
    setEditingTask(null);
    setIsFloatingForm(false);
  };

  // Modification du mot de passe depuis le profil.
  const changePassword = () => {
    setPasswordChangeMessage(null);
    const { current, next, confirm } = passwordForm;
    if (!current || !next || !confirm) {
      setPasswordChangeMessage({ type: "error", text: "Veuillez remplir tous les champs." });
      return;
    }
    if (next.length < 6) {
      setPasswordChangeMessage({ type: "error", text: "Le nouveau mot de passe doit contenir au moins 6 caractères." });
      return;
    }
    if (next !== confirm) {
      setPasswordChangeMessage({ type: "error", text: "La confirmation ne correspond pas." });
      return;
    }
    const accounts = readAccounts();
    const idx = accounts.findIndex((a) => a.email.toLowerCase() === user.email.toLowerCase());
    if (idx === -1) {
      // Cas bêta / compte non persisté : on accepte en local pour ne pas bloquer.
      setPasswordChangeMessage({ type: "success", text: "Mot de passe mis à jour." });
      setPasswordForm({ current: "", next: "", confirm: "" });
      return;
    }
    if (accounts[idx].password !== current) {
      setPasswordChangeMessage({ type: "error", text: "Mot de passe actuel incorrect." });
      return;
    }
    accounts[idx] = { ...accounts[idx], password: next };
    writeAccounts(accounts);
    setPasswordChangeMessage({ type: "success", text: "Mot de passe mis à jour." });
    setPasswordForm({ current: "", next: "", confirm: "" });
  };

  const handleBetaBypass = () => {
    setUser({
      firstName: "Alex",
      lastName: "Demo",
      birthDate: "1990-01-01",
      email: "beta@tempo.app",
      city: "",
      photo: null,
      bio: "",
      trialStart: Date.now(),
      isSubscribed: false,
    });
  };

  const activateSubscription = () => {
    if (!paymentForm.cardNumber || !paymentForm.expiry || !paymentForm.cvc || !paymentForm.name) return;
    setUser({ ...user, isSubscribed: true, subscriptionStart: Date.now() });
    setPaymentForm({ cardNumber: "", expiry: "", cvc: "", name: "" });
    setShowSubscription(false);
  };

  // ────────────────────────────────────────────────────────────────────────
  // Task CRUD — Wizard de création
  //
  // Trois flows STRICTEMENT séparés :
  //
  //   openAddChooser()   → ouvre l'écran de choix du TYPE de tâche
  //                        (custom / predefined / floating)
  //   startCustomFlow()  → flow "Tâche personnalisée" (saisie libre)
  //   startPredefinedFlow() → flow "Tâches prédéfinies" (picker → modal)
  //   startFloatingFlow() → flow "Sans horaire"
  //   openEdit(task)     → édition d'une tâche existante
  //
  // closeAddFlow() = sortie centralisée (annule tout, reset state).
  // ────────────────────────────────────────────────────────────────────────

  // Calcule l'heure de début suggérée (fin de la dernière tâche du jour).
  const computeSuggestedStart = () => {
    if (sortedTasks.length === 0) return "";
    const lastTask = sortedTasks.reduce(
      (latest, t) => (toMin(t.end) > toMin(latest.end) ? t : latest),
      sortedTasks[0],
    );
    return lastTask.end;
  };

  // Reset complet du form, indépendant du flow choisi.
  const resetTaskForm = (overrides = {}) => {
    setTaskForm({
      name: "", start: "", end: "",
      notes: "", meditationId: null,
      category: null, subcategory: null,
      ...overrides,
    });
  };

  // Étape 0 : choix du type de tâche.
  const openAddChooser = () => {
    setEditingTask(null);
    setIsFloatingForm(false);
    setShowCategoryPicker(false);
    setPickerStep("category");
    setPickedCategory(null);
    resetTaskForm();
    setShowAdd(false);
    setAddFlowMode("chooser");
  };

  // Flow 1 : tâche personnalisée (libre).
  const startCustomFlow = () => {
    setIsFloatingForm(false);
    setShowCategoryPicker(false);
    setPickerStep("category");
    setPickedCategory(null);
    resetTaskForm({ start: computeSuggestedStart() });
    setAddFlowMode("custom");
    setShowAdd(true);
  };

  // Flow 2 : tâche prédéfinie. Ouvre directement le picker, qui pré-remplira
  // le form puis basculera vers le modal de saisie (étape "horaires").
  const startPredefinedFlow = () => {
    setIsFloatingForm(false);
    setPickerStep("category");
    setPickedCategory(null);
    resetTaskForm({ start: computeSuggestedStart() });
    setShowAdd(false);
    setAddFlowMode("predefined");
    setShowCategoryPicker(true);
  };

  // Flow 3 : tâche sans horaire (flottante).
  const startFloatingFlow = () => {
    setIsFloatingForm(true);
    setShowCategoryPicker(false);
    setPickerStep("category");
    setPickedCategory(null);
    resetTaskForm();
    setAddFlowMode("floating");
    setShowAdd(true);
  };

  // Compat : openAdd / openAddFloating conservent leur signature pour les
  // composants existants, mais redirigent vers le wizard.
  const openAdd = () => openAddChooser();

  const openAddFloating = (prefill = null) => {
    setEditingTask(null);
    setIsFloatingForm(true);
    setShowCategoryPicker(false);
    setPickerStep("category");
    setPickedCategory(null);
    resetTaskForm({
      name: prefill?.name || "",
      notes: prefill?.notes || "",
      category: prefill?.category || null,
      subcategory: prefill?.subcategory || null,
    });
    setAddFlowMode("floating");
    setShowAdd(true);
  };

  const openEdit = (task, floating = false) => {
    setEditingTask(task);
    setIsFloatingForm(floating);
    setShowCategoryPicker(false);
    setPickerStep("category");
    setPickedCategory(null);
    setTaskForm({
      name: task.name, start: task.start || "", end: task.end || "",
      notes: task.notes || "",
      meditationId: task.meditationId || null,
      category: task.category || null, subcategory: task.subcategory || null,
    });
    setAddFlowMode("edit");
    setShowAdd(true);
  };

  // Appelée par le CategoryPickerModal lorsqu'une sous-catégorie est choisie.
  // Bascule du picker (flow predefined) vers le modal de saisie horaires.
  const applyPredefinedSelection = (category, subcategory) => {
    setTaskForm((prev) => ({
      ...prev,
      name: subcategory.name,
      category: category.id,
      subcategory: subcategory.name,
      meditationId: subcategory.meditationId || prev.meditationId,
    }));
    setShowCategoryPicker(false);
    setPickedCategory(null);
    setPickerStep("category");
    setShowAdd(true);
  };

  // Sortie centralisée — ferme TOUT et reset le state.
  // C'est la SEULE fonction qui doit être appelée pour quitter un flow.
  const closeAddFlow = () => {
    setShowAdd(false);
    setShowCategoryPicker(false);
    setPickerStep("category");
    setPickedCategory(null);
    setEditingTask(null);
    setIsFloatingForm(false);
    setAddFlowMode(null);
    // On reset aussi le taskForm pour qu'aucune valeur ne persiste dans le DOM
    // entre deux ouvertures.
    resetTaskForm();
  };

  const saveTask = () => {
    // === FLOATING TASK ===
    if (isFloatingForm) {
      if (!taskForm.name) return;
      const cat = TASK_CATEGORIES.find((c) => c.id === taskForm.category);
      const taskColor = cat?.color || "#D9B36A";
      if (editingTask) {
        setFloatingTasks(
          floatingTasks.map((t) => (t.id === editingTask.id ? { ...t, ...taskForm, color: taskColor } : t)),
        );
      } else {
        setFloatingTasks([
          ...floatingTasks,
          { id: Date.now(), ...taskForm, color: taskColor, floating: true },
        ]);
      }
      closeAddFlow();
      return;
    }

    if (!taskForm.name || !taskForm.start || !taskForm.end) return;
    if (toMin(taskForm.start) >= toMin(taskForm.end)) {
      setConflictDialog({
        type: "invalid",
        message: "L'heure de fin doit être après l'heure de début.",
      });
      return;
    }
    const cat = TASK_CATEGORIES.find((c) => c.id === taskForm.category);
    const taskColor = taskForm.customColor || cat?.color || "#D9B36A";

    // ===== EDITING =====
    if (editingTask) {
      const otherTasks = tasks.filter((t) => t.id !== editingTask.id);
      const conflicts = findConflicts(otherTasks, taskForm.start, taskForm.end);
      if (conflicts.length === 0) {
        setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...t, ...taskForm, color: taskColor } : t)));
        lastEndedRef.current.delete(editingTask.id);
        setNow(new Date());
        closeAddFlow();
        return;
      }
      const earliestConflict = conflicts.reduce(
        (earliest, t) => (toMin(t.start) < toMin(earliest.start) ? t : earliest),
        conflicts[0],
      );
      const shiftMin = toMin(taskForm.end) - toMin(earliestConflict.start);
      const overflow = cascadeWouldOverflow(otherTasks, toMin(earliestConflict.start), shiftMin);
      setConflictDialog({
        type: "edit",
        pendingTask: { ...editingTask, ...taskForm, color: taskColor },
        conflicts,
        shiftMin,
        overflow,
      });
      return;
    }

    // ===== ADDING =====
    const conflicts = findConflicts(tasks, taskForm.start, taskForm.end);
    if (conflicts.length === 0) {
      setTasks([...tasks, { id: Date.now(), ...taskForm, color: taskColor }]);
      closeAddFlow();
      return;
    }
    const fullyCovered = conflicts.filter(
      (t) => toMin(taskForm.start) <= toMin(t.start) && toMin(taskForm.end) >= toMin(t.end),
    );
    if (fullyCovered.length > 0) {
      setConflictDialog({
        type: "fullyCovered",
        pendingTask: { id: Date.now(), ...taskForm, color: taskColor },
        conflicts: fullyCovered,
      });
      return;
    }
    const earliestConflict = conflicts.reduce(
      (earliest, t) => (toMin(t.start) < toMin(earliest.start) ? t : earliest),
      conflicts[0],
    );
    const shiftMin = toMin(taskForm.end) - toMin(earliestConflict.start);
    const overflow = cascadeWouldOverflow(tasks, toMin(earliestConflict.start), shiftMin);
    if (overflow) {
      setConflictDialog({
        type: "overflow",
        pendingTask: { id: Date.now(), ...taskForm, color: taskColor },
        shiftMin,
      });
      return;
    }
    const shifted = cascadeShift(tasks, toMin(earliestConflict.start), shiftMin);
    setTasks([...shifted, { id: Date.now(), ...taskForm, color: taskColor }]);
    closeAddFlow();
  };

  const applyEditWithCascade = () => {
    if (!conflictDialog || conflictDialog.type !== "edit") return;
    const { pendingTask, shiftMin, conflicts } = conflictDialog;
    const otherTasks = tasks.filter((t) => t.id !== pendingTask.id);
    const earliestConflictStart = Math.min(...conflicts.map((c) => toMin(c.start)));
    const shifted = cascadeShift(otherTasks, earliestConflictStart, shiftMin);
    setTasks([...shifted, pendingTask]);
    shifted.forEach((t) => lastEndedRef.current.delete(t.id));
    lastEndedRef.current.delete(pendingTask.id);
    setNow(new Date());
    setConflictDialog(null);
    closeAddFlow();
  };

  const autoRepairConflicts = () => {
    let working = [...tasks].sort((a, b) => toMin(a.start) - toMin(b.start));
    let safety = 0;
    while (safety < 50) {
      safety++;
      let foundConflict = false;
      for (let i = 0; i < working.length - 1; i++) {
        const cur = working[i];
        const next = working[i + 1];
        if (toMin(next.start) < toMin(cur.end)) {
          const shift = toMin(cur.end) - toMin(next.start);
          if (toMin(next.end) + shift > 24 * 60) return false;
          working = working.map((t, idx) => (idx > i
            ? { ...t, start: fromMin(toMin(t.start) + shift), end: fromMin(toMin(t.end) + shift) }
            : t));
          foundConflict = true;
          break;
        }
      }
      if (!foundConflict) break;
    }
    setTasks(working);
    return true;
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const resetDay = () => {
    setWeekTasks((w) => ({ ...w, [selectedDay]: [] }));
    setCompletions((c) => ({ ...c, [selectedDay]: {} }));
    setDayMetrics((prev) => ({ ...prev, [selectedDay]: {} }));
    setIsRunning(false);
    setPausedAt(null);
    setDemoMode(false);
    setDemoElapsed(0);
    lastEndedRef.current.clear();
    notifiedRef.current.clear();
    summaryShownRef.current.delete(selectedDay);
    popupOpenedAtRef.current = null;
    popupTriggerKindRef.current = null;
    setEndTaskPopup(null);
    setShowExtendChoice(false);
    setExpandedId(null);
    setShowDaySummary(false);
    setTaskTransition(null);
    setShowResetConfirm(false);
  };

  // ────────────────────────────────────────────────────────────────────────
  // Template CRUD
  // ────────────────────────────────────────────────────────────────────────
  const openNewTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm({ name: "", color: "#D9B36A", durationMin: 30, iconKey: "Zap" });
    setShowCustomTaskEditor(true);
  };
  const openEditTemplate = (tpl) => {
    setEditingTemplate(tpl);
    setTemplateForm({ name: tpl.name, color: tpl.color, durationMin: tpl.durationMin, iconKey: tpl.iconKey });
    setShowCustomTaskEditor(true);
  };
  const saveTemplate = () => {
    if (!templateForm.name.trim()) return;
    if (editingTemplate) {
      setCustomTaskTemplates(customTaskTemplates.map((t) => (t.id === editingTemplate.id ? { ...t, ...templateForm } : t)));
    } else {
      setCustomTaskTemplates([...customTaskTemplates, { id: Date.now(), ...templateForm }]);
    }
    setShowCustomTaskEditor(false);
    setEditingTemplate(null);
  };
  const deleteTemplate = (id) => setCustomTaskTemplates(customTaskTemplates.filter((t) => t.id !== id));
  const insertTemplate = (tpl) => {
    let suggestedStart = "";
    if (sortedTasks.length > 0) {
      const lastTask = sortedTasks.reduce(
        (latest, t) => (toMin(t.end) > toMin(latest.end) ? t : latest),
        sortedTasks[0],
      );
      suggestedStart = lastTask.end;
    }
    const suggestedEnd = suggestedStart ? fromMin(toMin(suggestedStart) + tpl.durationMin) : "";
    // Bascule du picker (predefined) vers le flow custom avec le template
    // pré-rempli. Le state est explicitement remis à zéro pour éviter toute
    // fuite (ex. pickedCategory orphelin).
    setIsFloatingForm(false);
    setEditingTask(null);
    setShowCategoryPicker(false);
    setPickerStep("category");
    setPickedCategory(null);
    setTaskForm({
      name: tpl.name, start: suggestedStart, end: suggestedEnd,
      notes: "", meditationId: null, category: null, subcategory: null,
      customIconKey: tpl.iconKey, customColor: tpl.color,
    });
    setAddFlowMode("custom");
    setShowAdd(true);
  };

  // ────────────────────────────────────────────────────────────────────────
  // Day flow: start, pause, resume, demo
  // ────────────────────────────────────────────────────────────────────────
  const startDay = () => {
    setNow(new Date());
    setIsRunning(true);
    if (demoMode) setDemoElapsed(0);
    notifiedRef.current.clear();
    setDayMetrics((prev) => ({
      ...prev,
      [selectedDay]: {
        pauseMin: 0,
        delayMin: 0,
        originalTasks: tasks.map((t) => ({ id: t.id, start: t.start, end: t.end })),
        startedAt: Date.now(),
      },
    }));
    summaryShownRef.current.delete(selectedDay);
  };

  const confirmPause = () => {
    setPausedAt(Date.now());
    setIsRunning(false);
    setShowPauseConfirm(false);
  };

  const togglePlay = () => {
    if (!isRunning) {
      // === RESUME ===
      if (pausedAt && !demoMode) {
        const pauseSec = Math.floor((Date.now() - pausedAt) / 1000);
        const pauseMin = Math.ceil(pauseSec / 60);
        if (pauseMin > 0) {
          const pausedAtDate = new Date(pausedAt);
          const pauseSnapMin = pausedAtDate.getHours() * 60 + pausedAtDate.getMinutes();
          const nowMin = new Date().getHours() * 60 + new Date().getMinutes();

          const updated = tasks.map((t) => {
            if (dayCompletions[t.id]) return t;
            const tStart = toMin(t.start);
            const tEnd = toMin(t.end);
            if (tEnd <= pauseSnapMin) return t;
            if (tStart <= pauseSnapMin && tEnd > pauseSnapMin) {
              return { ...t, end: fromMin(tEnd + pauseMin) };
            }
            if (tStart > pauseSnapMin) {
              return { ...t, start: fromMin(tStart + pauseMin), end: fromMin(tEnd + pauseMin) };
            }
            return t;
          });
          setTasks(updated);
          updated.forEach((t) => { if (toMin(t.end) > nowMin) lastEndedRef.current.delete(t.id); });
          setDayMetrics((prev) => ({
            ...prev,
            [selectedDay]: {
              ...(prev[selectedDay] || {}),
              pauseMin: ((prev[selectedDay] || {}).pauseMin || 0) + pauseMin,
            },
          }));
        }
      }
      setPausedAt(null);
      if (demoMode) setDemoElapsed(0);
      setNow(new Date());
      setIsRunning(true);
      notifiedRef.current.clear();
    } else if (skipPauseConfirm || demoMode) {
      confirmPause();
    } else {
      setShowPauseConfirm(true);
    }
  };

  const toggleDemo = () => {
    setDemoMode(!demoMode);
    setDemoElapsed(0);
    notifiedRef.current.clear();
    lastEndedRef.current.clear();
  };

  const handleLogoTap = () => {
    const tapNow = Date.now();
    if (tapNow - logoTapsRef.current.lastTap < 600) {
      logoTapsRef.current.count++;
    } else {
      logoTapsRef.current.count = 1;
    }
    logoTapsRef.current.lastTap = tapNow;
    if (logoTapsRef.current.count >= 5) {
      logoTapsRef.current.count = 0;
      toggleDemo();
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // End-of-task actions
  // ────────────────────────────────────────────────────────────────────────

  // Shift remaining tasks by the popup response delay (only for natural endings).
  const shiftUpcomingByResponseDelay = (endedTaskId) => {
    if (popupTriggerKindRef.current !== "natural" || !popupOpenedAtRef.current) return;
    const delaySec = Math.floor((Date.now() - popupOpenedAtRef.current) / 1000);
    popupOpenedAtRef.current = null;
    popupTriggerKindRef.current = null;
    if (delaySec <= 0) return;
    const delayMin = Math.ceil(delaySec / 60);
    const sorted = [...tasks].sort((a, b) => toMin(a.start) - toMin(b.start));
    const idx = sorted.findIndex((t) => t.id === endedTaskId);
    if (idx === -1) return;
    const updated = sorted.map((t, i) => {
      if (i <= idx) return t;
      return { ...t, start: fromMin(toMin(t.start) + delayMin), end: fromMin(toMin(t.end) + delayMin) };
    });
    setTasks(updated);
    sorted.slice(idx + 1).forEach((t) => lastEndedRef.current.delete(t.id));
  };

  // Briefly show a transition overlay between two tasks.
  const triggerTaskTransition = (completedTaskId, computedTasks = null) => {
    const taskList = computedTasks || tasks;
    const completedTask = taskList.find((t) => t.id === completedTaskId);
    if (!completedTask) return;
    const upcoming = [...taskList]
      .sort((a, b) => toMin(a.start) - toMin(b.start))
      .filter((t) => t.id !== completedTaskId && !dayCompletions[t.id]);
    const nextOne = upcoming[0];
    if (!nextOne) return;
    setTaskTransition({
      fromName: completedTask.name,
      fromColor: completedTask.color,
      toName: nextOne.name,
      toColor: nextOne.color,
      toStart: nextOne.start,
    });
    setTimeout(() => setTaskTransition(null), 5000);
  };

  const markTaskDone = (taskId) => {
    setCompletions({ ...completions, [selectedDay]: { ...dayCompletions, [taskId]: "done" } });
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setValidationBurst({ color: task.color, ts: Date.now() });
      setTimeout(() => setValidationBurst(null), 1800);
    }
    shiftUpcomingByResponseDelay(taskId);
    setEndTaskPopup(null);
    setShowExtendChoice(false);
    setTimeout(() => triggerTaskTransition(taskId), 1900);
  };

  const markTaskSkipped = (taskId) => {
    setCompletions({ ...completions, [selectedDay]: { ...dayCompletions, [taskId]: "skipped" } });
    shiftUpcomingByResponseDelay(taskId);
    setEndTaskPopup(null);
    setShowExtendChoice(false);
    setTimeout(() => triggerTaskTransition(taskId), 400);
  };

  const extendTask = (task, minutesToAdd) => {
    let delayMin = 0;
    if (popupTriggerKindRef.current === "natural" && popupOpenedAtRef.current) {
      const delaySec = Math.floor((Date.now() - popupOpenedAtRef.current) / 1000);
      delayMin = Math.ceil(delaySec / 60);
    }
    popupOpenedAtRef.current = null;
    popupTriggerKindRef.current = null;
    const totalShift = minutesToAdd + delayMin;
    const sorted = [...tasks].sort((a, b) => toMin(a.start) - toMin(b.start));
    const idx = sorted.findIndex((t) => t.id === task.id);
    const updated = sorted.map((t, i) => {
      if (i < idx) return t;
      if (i === idx) return { ...t, end: fromMin(toMin(t.end) + totalShift) };
      return { ...t, start: fromMin(toMin(t.start) + totalShift), end: fromMin(toMin(t.end) + totalShift) };
    });
    setTasks(updated);
    lastEndedRef.current.delete(task.id);
    sorted.slice(idx + 1).forEach((t) => lastEndedRef.current.delete(t.id));
    setEndTaskPopup(null);
    setShowExtendChoice(false);
  };

  const finishEarly = (task) => {
    const sorted = [...tasks].sort((a, b) => toMin(a.start) - toMin(b.start));
    const idx = sorted.findIndex((t) => t.id === task.id);
    if (idx === -1) return;
    let nowMinutes;
    if (demoMode) {
      const elapsedInTask = demoElapsed % DEMO_TASK_DURATION;
      const fakeProgressRatio = elapsedInTask / DEMO_TASK_DURATION;
      const taskDur = toMin(sorted[idx].end) - toMin(sorted[idx].start);
      nowMinutes = toMin(sorted[idx].start) + fakeProgressRatio * taskDur;
    } else {
      nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    }
    const nowMinRounded = Math.ceil(nowMinutes);
    let shift = 0;
    if (idx + 1 < sorted.length) {
      const nextStart = toMin(sorted[idx + 1].start);
      shift = Math.max(0, nextStart - nowMinRounded);
    }
    const updated = sorted.map((t, i) => {
      if (i < idx) return t;
      if (i === idx) return { ...t, end: fromMin(Math.max(toMin(t.start) + 1, nowMinRounded)) };
      return { ...t, start: fromMin(toMin(t.start) - shift), end: fromMin(toMin(t.end) - shift) };
    });
    setTasks(updated);
    setCompletions({ ...completions, [selectedDay]: { ...dayCompletions, [task.id]: "done" } });
    setValidationBurst({ color: task.color, ts: Date.now() });
    setTimeout(() => setValidationBurst(null), 1800);
    lastEndedRef.current.add(task.id);
    popupOpenedAtRef.current = null;
    popupTriggerKindRef.current = null;
    setEndTaskPopup(null);
    setShowExtendChoice(false);
    setNow(new Date());
    setTimeout(() => triggerTaskTransition(task.id, updated), 1900);
  };

  // ────────────────────────────────────────────────────────────────────────
  // Drag & drop
  // ────────────────────────────────────────────────────────────────────────
  const getTaskIdAtY = (y) => {
    for (const [taskId, el] of Object.entries(dragRefs.current)) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (y >= rect.top && y <= rect.bottom) return taskId;
    }
    return null;
  };

  const swapTaskTimes = (idA, idB) => {
    const taskA = tasks.find((t) => String(t.id) === String(idA));
    const taskB = tasks.find((t) => String(t.id) === String(idB));
    if (!taskA || !taskB) return;
    setTasks(tasks.map((t) => {
      if (String(t.id) === String(idA)) return { ...t, start: taskB.start, end: taskB.end };
      if (String(t.id) === String(idB)) return { ...t, start: taskA.start, end: taskA.end };
      return t;
    }));
    setSwapToast({ nameA: taskA.name, nameB: taskB.name, ts: Date.now() });
    setTimeout(() => setSwapToast(null), 2500);
  };

  const onDragPointerMove = (clientY) => {
    setDragState((prev) => {
      if (!prev) return prev;
      const overId = getTaskIdAtY(clientY);
      return {
        ...prev,
        currentY: clientY,
        overTaskId: overId && String(overId) !== String(prev.taskId) ? overId : null,
      };
    });
  };

  const onDragPointerUp = () => {
    setDragState((prev) => {
      if (!prev) return prev;
      if (prev.overTaskId && String(prev.overTaskId) !== String(prev.taskId)) {
        swapTaskTimes(prev.taskId, prev.overTaskId);
        setExpandedId(null);
      }
      dragLongPressTimer.current = null;
      document.body.style.userSelect = "";
      return null;
    });
  };

  const startLongPress = (task, clientY) => {
    dragLongPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(40);
      document.body.style.userSelect = "none";
      setExpandedId(null);
      setDragState({ taskId: task.id, startY: clientY, currentY: clientY, overTaskId: null });
    }, LONG_PRESS_MS);
  };

  const cancelLongPress = () => {
    if (dragLongPressTimer.current) {
      clearTimeout(dragLongPressTimer.current);
      dragLongPressTimer.current = null;
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // Audio actions
  // ────────────────────────────────────────────────────────────────────────
  const activateAmbient = (id) => {
    setActiveCustomTrack(null);
    setActiveAmbient(activeAmbient === id ? null : id);
  };
  const activateCustom = (id) => {
    setActiveAmbient(null);
    setActiveCustomTrack(activeCustomTrack === id ? null : id);
  };
  const handleMusicUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newTracks = files.map((file) => ({
      id: `custom-${Date.now()}-${Math.random()}`,
      name: file.name.replace(/\.(mp3|wav|m4a|ogg)$/i, ""),
      url: URL.createObjectURL(file),
    }));
    setCustomTracks([...customTracks, ...newTracks]);
    e.target.value = "";
  };
  const removeCustomTrack = (id) => {
    if (activeCustomTrack === id) setActiveCustomTrack(null);
    const track = customTracks.find((t) => t.id === id);
    if (track) URL.revokeObjectURL(track.url);
    setCustomTracks(customTracks.filter((t) => t.id !== id));
  };

  // ────────────────────────────────────────────────────────────────────────
  // Profile / photo upload
  // ────────────────────────────────────────────────────────────────────────
  // Si un brouillon profil est ouvert, on met la photo dans le brouillon.
  // Sinon (ex. clic depuis le dashboard) on l'écrit directement sur user
  // pour qu'elle soit immédiatement visible et persistée.
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const photo = ev.target.result;
      if (profileDraft) setProfileDraft({ ...profileDraft, photo });
      else setUser((u) => (u ? { ...u, photo } : u));
    };
    reader.readAsDataURL(file);
  };

  // ────────────────────────────────────────────────────────────────────────
  // Goals / stats
  // ────────────────────────────────────────────────────────────────────────
  const computeDayGoal = (dayIdx) => {
    const dayT = weekTasks[dayIdx] || [];
    if (dayT.length === 0) return { done: 0, total: 0, percent: 0 };
    const dayComp = completions[dayIdx] || {};
    const done = dayT.filter((t) => dayComp[t.id] === "done").length;
    return { done, total: dayT.length, percent: Math.round((done / dayT.length) * 100) };
  };
  const dailyGoal = computeDayGoal(selectedDay);
  const computeWeekGoal = () => {
    let totalDone = 0; let totalCount = 0;
    activeDayThemes.forEach((_, idx) => {
      const g = computeDayGoal(idx);
      totalDone += g.done;
      totalCount += g.total;
    });
    return {
      done: totalDone, total: totalCount,
      percent: totalCount > 0 ? Math.round((totalDone / totalCount) * 100) : 0,
    };
  };
  const weeklyGoal = computeWeekGoal();

  const computeStats = () => {
    const stats = activeDayThemes.map((theme, idx) => {
      const dayT = weekTasks[idx] || [];
      const totalMinutes = dayT.reduce((s, t) => s + (toMin(t.end) - toMin(t.start)), 0);
      const goal = computeDayGoal(idx);
      return { ...theme, totalMinutes, taskCount: dayT.length, completion: goal.percent, idx };
    });
    const categoryTotals = {};
    Object.values(weekTasks).flat().forEach((t) => {
      const dur = toMin(t.end) - toMin(t.start);
      const key = t.category ? TASK_CATEGORIES.find((c) => c.id === t.category)?.name || t.name : t.name;
      categoryTotals[key] = (categoryTotals[key] || 0) + dur;
    });
    const topCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const totalWeekTasks = Object.values(weekTasks).flat().length;
    const totalWeekMinutes = stats.reduce((s, d) => s + d.totalMinutes, 0);
    const dayWithTasks = stats.filter((s) => s.taskCount > 0);
    const avgCompletion = dayWithTasks.length > 0
      ? dayWithTasks.reduce((s, d) => s + d.completion, 0) / dayWithTasks.length
      : 0;
    const bestDay = [...stats].sort((a, b) => b.completion - a.completion)[0];
    return { stats, topCategories, totalWeekTasks, totalWeekMinutes, avgCompletion, bestDay };
  };

  // Voice toggle (for menu).
  const toggleVoice = () => setVoiceOn((v) => !v);

  // ────────────────────────────────────────────────────────────────────────
  // Public context value
  // ────────────────────────────────────────────────────────────────────────
  const value = {
    // Auth
    user, setUser,
    signupForm, setSignupForm,
    loginForm, setLoginForm,
    forgotForm, setForgotForm,
    authMode, setAuthMode,
    authError, setAuthError,
    profileDraft, setProfileDraft,
    passwordForm, setPasswordForm,
    passwordChangeMessage, setPasswordChangeMessage,
    changePassword,
    paymentForm, setPaymentForm,
    handleSignup, handleLogin, handleForgotPassword, handleLogout,
    handleBetaBypass, activateSubscription,
    trialDaysLeft, trialExpired,

    // Navigation
    showProfile, setShowProfile,
    showStats, setShowStats,
    showPlanning, setShowPlanning,
    showMenu, setShowMenu,
    showSubscription, setShowSubscription,
    showCustomization, setShowCustomization,
    focusMode, setFocusMode,
    activeMeditation, setActiveMeditation,

    // Theming
    customTheme, setCustomTheme,
    activeDayThemes, dayTheme,

    // Tasks
    selectedDay, setSelectedDay,
    weekTasks, weekFloatingTasks,
    tasks, sortedTasks, floatingTasks, dayCompletions,
    completions, setCompletions,
    dayMetrics, setDayMetrics,
    setTasks, setFloatingTasks,
    existingConflicts,
    getTaskProgress, isPastTask,
    currentTask, nextTask, progress, remainingSec,

    // Forms
    showAdd, setShowAdd,
    isFloatingForm, setIsFloatingForm,
    editingTask, setEditingTask,
    expandedId, setExpandedId,
    taskForm, setTaskForm,
    showCategoryPicker, setShowCategoryPicker,
    pickerStep, setPickerStep,
    pickedCategory, setPickedCategory,
    openAdd, openAddFloating, openEdit,
    openAddChooser, startCustomFlow, startPredefinedFlow, startFloatingFlow,
    applyPredefinedSelection,
    addFlowMode, setAddFlowMode,
    saveTask, applyEditWithCascade, autoRepairConflicts, deleteTask, resetDay,
    closeAddFlow,

    // Templates
    customTaskTemplates, setCustomTaskTemplates,
    showCustomTaskEditor, setShowCustomTaskEditor,
    editingTemplate, templateForm, setTemplateForm,
    openNewTemplate, openEditTemplate, saveTemplate, deleteTemplate, insertTemplate,

    // Day flow
    isRunning, demoMode, demoElapsed, now,
    pausedAt, showPauseConfirm, setShowPauseConfirm,
    skipPauseConfirm, setSkipPauseConfirm,
    startDay, confirmPause, togglePlay, toggleDemo,
    handleLogoTap,

    // End-of-task
    endTaskPopup, setEndTaskPopup,
    showExtendChoice, setShowExtendChoice,
    extendMinutes, setExtendMinutes,
    showDaySummary, setShowDaySummary,
    showNoTasksWarning, setShowNoTasksWarning,
    showResetConfirm, setShowResetConfirm,
    validationBurst, taskTransition, setTaskTransition,
    markTaskDone, markTaskSkipped, extendTask, finishEarly,

    // Refs needed by JSX (manual popup trigger from a task card)
    popupOpenedAtRef, popupTriggerKindRef,

    // Conflicts
    conflictDialog, setConflictDialog,

    // Drag & drop
    dragState, dragRefs, swapToast,
    startLongPress, cancelLongPress,

    // Audio
    activeAmbient, ambientVolume, setAmbientVolume,
    customTracks, activeCustomTrack,
    activateAmbient, activateCustom,
    handleMusicUpload, removeCustomTrack,
    voiceOn, toggleVoice,

    // Profile
    handlePhotoUpload,

    // Goals / stats
    dailyGoal, weeklyGoal, computeStats, computeDayGoal,

    // Constants exposed for components
    MEDITATIONS, TASK_CATEGORIES,

    // Demo
    DEMO_TASK_DURATION,
  };

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}
