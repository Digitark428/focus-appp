import { useState, useEffect, useRef } from "react";
import {
  Plus, Play, Pause, Trash2, Volume2, VolumeX, Zap, Maximize2, X,
  Pencil, ChevronDown, StickyNote, Mail, MapPin, Calendar, LogOut, Sparkles,
  ChevronLeft, ChevronRight, Camera, BarChart3, Wind, CloudRain, Coffee, Trees, Music,
  Brain, Flame, Heart, Moon, TrendingUp, Award, Clock, CheckCircle2,
  Upload, Headphones, Search, Briefcase, Dumbbell, Utensils, BookOpen,
  Bike, Waves, Mountain, Activity, Footprints, Target, ShoppingCart,
  Home, GraduationCap, Palette, Pill, Plane, Users, Phone, Hammer,
  Check, CalendarPlus, RotateCcw
} from "lucide-react";

const DAY_NAMES = [
  { name: "Lundi",    short: "Lun", mood: "Recommencement" },
  { name: "Mardi",    short: "Mar", mood: "Concentration" },
  { name: "Mercredi", short: "Mer", mood: "Équilibre" },
  { name: "Jeudi",    short: "Jeu", mood: "Élan" },
  { name: "Vendredi", short: "Ven", mood: "Énergie" },
  { name: "Samedi",   short: "Sam", mood: "Liberté" },
  { name: "Dimanche", short: "Dim", mood: "Repos" },
];

// Color palettes — each defines 7 colors (one per day of the week)
const CUSTOM_THEMES = {
  default: {
    label: "Original",
    description: "Le thème classique de Focus",
    colors: ["#A78BFA", "#60A5FA", "#34D399", "#FBBF24", "#FB923C", "#F472B6", "#94A3B8"],
  },
  ocean: {
    label: "Océan",
    description: "Bleus profonds, calme et sérénité",
    colors: ["#67E8F9", "#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6", "#A78BFA", "#C7D2FE"],
  },
  forest: {
    label: "Forêt",
    description: "Verts naturels, ancrage et croissance",
    colors: ["#86EFAC", "#34D399", "#10B981", "#059669", "#65A30D", "#A3E635", "#D9F99D"],
  },
  sunset: {
    label: "Crépuscule",
    description: "Couleurs chaudes du coucher de soleil",
    colors: ["#FCA5A5", "#F87171", "#FB923C", "#FBBF24", "#F59E0B", "#EC4899", "#F472B6"],
  },
  rose: {
    label: "Rose tendre",
    description: "Doux et romantique",
    colors: ["#FBCFE8", "#F9A8D4", "#F472B6", "#EC4899", "#DB2777", "#BE185D", "#FECDD3"],
  },
  monochrome: {
    label: "Monochrome",
    description: "Élégance pure, niveaux de gris",
    colors: ["#E5E5E5", "#D4D4D4", "#A3A3A3", "#737373", "#525252", "#404040", "#262626"],
  },
};

// Helper that returns the active DAY_THEMES based on the current custom theme
const getDayThemes = (themeKey) => {
  const palette = CUSTOM_THEMES[themeKey] || CUSTOM_THEMES.default;
  return DAY_NAMES.map((d, i) => ({
    ...d,
    glow: palette.colors[i],
    accent: palette.colors[i],
  }));
};

const DAY_THEMES = getDayThemes("default"); // initial export, will be overridden by hook

// === SOLAR AMBIANCE ===
// Returns a light atmosphere object based on the current real hour.
// Sun position is expressed as a vertical percentage (0% = top, 100% = bottom).
const getSolarAmbiance = (date) => {
  const h = date.getHours() + date.getMinutes() / 60; // fractional hour 0..24

  // Night: 0–5 and 22–24
  if (h < 5 || h >= 22) {
    return {
      phase: "night",
      sunY: 110, // off-screen below
      coreOpacity: 0,
      haloOpacity: 0,
      bgGradient: "transparent",
      glowColor: "transparent",
      glowIntensity: 0,
    };
  }

  // Dawn: 5–7
  if (h < 7) {
    const t = (h - 5) / 2; // 0→1
    return {
      phase: "dawn",
      sunY: 18 - t * 6,          // 18% → 12%
      coreOpacity: 0.10 + t * 0.12,
      haloOpacity: 0.18 + t * 0.15,
      bgGradient: `radial-gradient(ellipse 80% 40% at 50% ${18 - t * 6}%, rgba(251,113,133,${0.10 + t * 0.08}) 0%, rgba(251,146,60,${0.07 + t * 0.06}) 30%, transparent 70%)`,
      glowColor: `rgba(251,146,60,${0.12 + t * 0.10})`,
      glowIntensity: 0.15 + t * 0.15,
      accentColor: "#FB923C",
    };
  }

  // Morning: 7–11
  if (h < 11) {
    const t = (h - 7) / 4; // 0→1
    return {
      phase: "morning",
      sunY: 12 - t * 4,           // 12% → 8%
      coreOpacity: 0.22 + t * 0.10,
      haloOpacity: 0.33 + t * 0.08,
      bgGradient: `radial-gradient(ellipse 70% 35% at 50% ${12 - t * 4}%, rgba(253,186,116,${0.12 + t * 0.06}) 0%, rgba(251,146,60,${0.08 + t * 0.04}) 35%, transparent 65%)`,
      glowColor: `rgba(253,186,116,${0.18 + t * 0.08})`,
      glowIntensity: 0.30 + t * 0.12,
      accentColor: "#FCD34D",
    };
  }

  // Midday: 11–14
  if (h < 14) {
    const t = (h - 11) / 3; // 0→1
    return {
      phase: "midday",
      sunY: 8 + t * 8,             // 8% → 16% (slightly more centered than top)
      coreOpacity: 0.32 + t * 0.04,
      haloOpacity: 0.41 - t * 0.04,
      bgGradient: `radial-gradient(ellipse 60% 30% at 50% ${8 + t * 8}%, rgba(253,230,138,${0.14}) 0%, rgba(251,191,36,${0.08}) 40%, transparent 65%)`,
      glowColor: `rgba(253,230,138,${0.22})`,
      glowIntensity: 0.42,
      accentColor: "#FDE68A",
    };
  }

  // Afternoon: 14–18
  if (h < 18) {
    const t = (h - 14) / 4; // 0→1
    return {
      phase: "afternoon",
      sunY: 16 + t * 20,           // 16% → 36%
      coreOpacity: 0.36 - t * 0.10,
      haloOpacity: 0.37 - t * 0.06,
      bgGradient: `radial-gradient(ellipse 65% 35% at 50% ${16 + t * 20}%, rgba(251,191,36,${0.12 - t * 0.04}) 0%, rgba(251,146,60,${0.08 - t * 0.02}) 40%, transparent 65%)`,
      glowColor: `rgba(251,146,60,${0.18 - t * 0.06})`,
      glowIntensity: 0.42 - t * 0.12,
      accentColor: "#FBBF24",
    };
  }

  // Sunset / dusk: 18–22
  {
    const t = (h - 18) / 4; // 0→1
    return {
      phase: "sunset",
      sunY: 36 + t * 40,           // 36% → 76% (sinking toward bottom)
      coreOpacity: 0.26 - t * 0.20,
      haloOpacity: 0.31 - t * 0.25,
      bgGradient: `radial-gradient(ellipse 75% 40% at 50% ${36 + t * 40}%, rgba(251,113,133,${0.14 - t * 0.12}) 0%, rgba(251,146,60,${0.12 - t * 0.10}) 30%, rgba(180,83,9,${0.06 - t * 0.05}) 55%, transparent 70%)`,
      glowColor: `rgba(251,113,133,${0.16 - t * 0.14})`,
      glowIntensity: 0.30 - t * 0.28,
      accentColor: "#FB923C",
    };
  }
};

const todayIndex = () => {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
};

const AMBIENT_SOUNDS = [
  { id: "rain", name: "Pluie douce", icon: CloudRain, color: "#60A5FA" },
  { id: "forest", name: "Forêt", icon: Trees, color: "#34D399" },
  { id: "cafe", name: "Café", icon: Coffee, color: "#FB923C" },
  { id: "lofi", name: "Lo-Fi", icon: Music, color: "#A78BFA" },
  { id: "wind", name: "Vent", icon: Wind, color: "#94A3B8" },
];

const MEDITATIONS = [
  { id: "breath-478", name: "Respiration 4-7-8", duration: 5, icon: Wind, color: "#60A5FA",
    description: "Inspirez 4s · Retenez 7s · Expirez 8s",
    script: "Installez-vous confortablement... Fermez les yeux..." },
  { id: "body-scan", name: "Scan corporel", duration: 10, icon: Heart, color: "#F472B6",
    description: "Détendez chaque partie du corps", script: "Commencez par détendre votre tête..." },
  { id: "focus", name: "Concentration", duration: 5, icon: Brain, color: "#A78BFA",
    description: "Préparez votre esprit au travail", script: "Concentrez-vous sur votre respiration..." },
  { id: "energy", name: "Énergie matinale", duration: 7, icon: Flame, color: "#FB923C",
    description: "Démarrez la journée avec vitalité", script: "Sentez l'énergie circuler..." },
  { id: "sleep", name: "Détente du soir", duration: 12, icon: Moon, color: "#94A3B8",
    description: "Préparez le corps au sommeil", script: "Relâchez les tensions..." },
];

// Available icons for custom task templates
const CUSTOM_TASK_ICONS = [
  { key: "Zap", icon: Zap }, { key: "Star", icon: Sparkles }, { key: "Flame", icon: Flame },
  { key: "Heart", icon: Heart }, { key: "Brain", icon: Brain }, { key: "Target", icon: Target },
  { key: "Music", icon: Music }, { key: "Coffee", icon: Coffee }, { key: "Dumbbell", icon: Dumbbell },
  { key: "Briefcase", icon: Briefcase }, { key: "BookOpen", icon: BookOpen }, { key: "Camera", icon: Camera },
  { key: "Phone", icon: Phone }, { key: "Home", icon: Home }, { key: "Plane", icon: Plane },
  { key: "ShoppingCart", icon: ShoppingCart }, { key: "Users", icon: Users }, { key: "Clock", icon: Clock },
  { key: "Moon", icon: Moon }, { key: "Award", icon: Award }, { key: "Palette", icon: Palette },
  { key: "Mountain", icon: Mountain }, { key: "Bike", icon: Bike }, { key: "GraduationCap", icon: GraduationCap },
];

// Preset color swatches for custom tasks
const CUSTOM_TASK_COLORS = [
  "#A78BFA", "#60A5FA", "#34D399", "#FBBF24", "#FB923C",
  "#F472B6", "#F87171", "#22D3EE", "#A3E635", "#E879F9",
  "#38BDF8", "#4ADE80", "#FCD34D", "#FDA4AF", "#C4B5FD",
  "#6EE7B7", "#FCA5A1", "#93C5FD", "#FDE68A", "#FFFFFF",
];

const TASK_CATEGORIES = [
  { id: "sport", name: "Sport", icon: Dumbbell, color: "#FF6B6B",
    subcategories: [
      { name: "Musculation", icon: Dumbbell }, { name: "Cardio", icon: Activity },
      { name: "Course à pied", icon: Footprints }, { name: "Vélo", icon: Bike },
      { name: "Natation", icon: Waves }, { name: "Yoga", icon: Heart },
      { name: "Pilates", icon: Activity }, { name: "CrossFit", icon: Flame },
      { name: "HIIT", icon: Zap }, { name: "Boxe", icon: Target },
      { name: "Football", icon: Target }, { name: "Basketball", icon: Target },
      { name: "Tennis", icon: Target }, { name: "Randonnée", icon: Mountain },
      { name: "Escalade", icon: Mountain }, { name: "Stretching", icon: Activity },
      { name: "Marche active", icon: Footprints }, { name: "Danse", icon: Music },
      { name: "Arts martiaux", icon: Target }, { name: "Skateboard", icon: Activity },
    ] },
  { id: "work", name: "Travail", icon: Briefcase, color: "#4ECDC4",
    subcategories: [
      { name: "Travail concentré", icon: Brain }, { name: "Réunion", icon: Users },
      { name: "Mails", icon: Mail }, { name: "Appels", icon: Phone },
      { name: "Brainstorming", icon: Sparkles }, { name: "Présentation", icon: BarChart3 },
      { name: "Création", icon: Palette }, { name: "Administratif", icon: BookOpen },
    ] },
  { id: "meditation", name: "Méditation", icon: Brain, color: "#A78BFA",
    subcategories: [
      { name: "Respiration 4-7-8", icon: Wind, meditationId: "breath-478" },
      { name: "Scan corporel", icon: Heart, meditationId: "body-scan" },
      { name: "Concentration", icon: Brain, meditationId: "focus" },
      { name: "Énergie matinale", icon: Flame, meditationId: "energy" },
      { name: "Détente du soir", icon: Moon, meditationId: "sleep" },
    ] },
  { id: "meal", name: "Repas", icon: Utensils, color: "#FFE66D",
    subcategories: [
      { name: "Petit déjeuner", icon: Utensils }, { name: "Déjeuner", icon: Utensils },
      { name: "Dîner", icon: Utensils }, { name: "Collation", icon: Utensils },
      { name: "Préparation repas", icon: Hammer },
    ] },
  { id: "study", name: "Étude", icon: GraduationCap, color: "#60A5FA",
    subcategories: [
      { name: "Lecture", icon: BookOpen }, { name: "Révisions", icon: GraduationCap },
      { name: "Cours en ligne", icon: GraduationCap }, { name: "Devoirs", icon: BookOpen },
      { name: "Recherche", icon: Search }, { name: "Apprendre une langue", icon: GraduationCap },
    ] },
  { id: "errand", name: "Courses & vie", icon: ShoppingCart, color: "#FB923C",
    subcategories: [
      { name: "Courses", icon: ShoppingCart }, { name: "Ménage", icon: Home },
      { name: "Lessive", icon: Home }, { name: "Cuisine", icon: Utensils },
      { name: "Rangement", icon: Home }, { name: "Bricolage", icon: Hammer },
    ] },
  { id: "wellness", name: "Bien-être", icon: Heart, color: "#F472B6",
    subcategories: [
      { name: "Douche", icon: Waves }, { name: "Skincare", icon: Sparkles },
      { name: "Médicaments", icon: Pill }, { name: "Journal", icon: BookOpen },
      { name: "Gratitude", icon: Heart }, { name: "Sieste", icon: Moon },
    ] },
  { id: "social", name: "Social & loisirs", icon: Users, color: "#34D399",
    subcategories: [
      { name: "Famille", icon: Users }, { name: "Amis", icon: Users },
      { name: "Appel proches", icon: Phone }, { name: "Sortie", icon: Plane },
      { name: "Lecture loisir", icon: BookOpen }, { name: "Jeu vidéo", icon: Target },
      { name: "Film / Série", icon: Music },
    ] },
  {
    id: "break",
    name: "Pause",
    icon: Moon,
    color: "#FFFFFF",
    isPause: true, // special design flag
    tagline: "Détendez-vous, prenez l'air et revenez en forme.",
    subcategories: [
      { name: "Pause courte", icon: Coffee },
      { name: "Pause déjeuner", icon: Utensils },
      { name: "Sieste", icon: Moon },
      { name: "Promenade", icon: Footprints },
      { name: "Air frais", icon: Wind },
    ],
  },
];

const DEFAULT_TASKS = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

// minutes helpers
const toMin = (hm) => { const [h, m] = hm.split(":").map(Number); return h * 60 + m; };
const fromMin = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

// === BRAIN GEOMETRY ===
// Pseudo-random generator (deterministic)
const seededRandom = (seed) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// Generate all nodes + links for a given total days count, distributed across cycles.
// Each cycle = up to 70 nodes in a distinct cluster region of the brain shape.
const generateBrainGeometry = (totalDays) => {
  if (totalDays === 0) return { nodes: [], links: [] };

  const nodes = []; // { x, y, cycleIdx, dayIdx, color }
  const links = []; // { from, to, cycleIdx }

  const totalCycles = Math.ceil(totalDays / BRAIN_CYCLE_DAYS);
  const totalNodesNeeded = Math.floor((totalDays / BRAIN_CYCLE_DAYS) * BRAIN_NODES_PER_CYCLE);

  // The brain is drawn in viewBox 0..200 (square). The HEAD silhouette occupies it.
  // Neurons appear ONLY in the upper skull region (top half of head, like in reference image).
  // Skull region: roughly x: 50..150, y: 35..90
  const clusterAnchors = [
    { x: 100, y: 50 },   // 1: top crown center
    { x: 75, y: 55 },    // 2: top left
    { x: 125, y: 55 },   // 3: top right
    { x: 60, y: 70 },    // 4: mid left
    { x: 140, y: 70 },   // 5: mid right
    { x: 100, y: 65 },   // 6: center
    { x: 70, y: 80 },    // 7: lower left
    { x: 130, y: 80 },   // 8: lower right
    { x: 100, y: 80 },   // 9: lower center
    { x: 85, y: 45 },    // 10: top inner left
    { x: 115, y: 45 },   // 11: top inner right
    { x: 100, y: 75 },   // 12: deep center
  ];

  for (let cIdx = 0; cIdx < totalCycles; cIdx++) {
    const rng = seededRandom(cIdx * 7919 + 13);
    const color = BRAIN_CYCLE_COLORS[cIdx % BRAIN_CYCLE_COLORS.length];
    const anchor = clusterAnchors[cIdx % clusterAnchors.length];

    // How many nodes in this cycle so far
    const cycleStartDay = cIdx * BRAIN_CYCLE_DAYS;
    const cycleEndDay = Math.min((cIdx + 1) * BRAIN_CYCLE_DAYS, totalDays);
    const daysInThisCycle = cycleEndDay - cycleStartDay;
    if (daysInThisCycle <= 0) continue;
    const nodesInThisCycle = Math.floor((daysInThisCycle / BRAIN_CYCLE_DAYS) * BRAIN_NODES_PER_CYCLE);

    const cycleNodeStartIdx = nodes.length;
    for (let n = 0; n < nodesInThisCycle; n++) {
      // Spread nodes around anchor with gaussian-like falloff
      const angle = rng() * Math.PI * 2;
      const radius = 6 + rng() * 16; // cluster radius (smaller, denser)
      const x = anchor.x + Math.cos(angle) * radius;
      const y = anchor.y + Math.sin(angle) * radius;
      // STRICT clamp to upper skull region only
      const cx = Math.max(52, Math.min(148, x));
      const cy = Math.max(38, Math.min(88, y));
      nodes.push({
        x: cx,
        y: cy,
        cycleIdx: cIdx,
        dayIdx: cycleStartDay + Math.floor(n / (BRAIN_NODES_PER_CYCLE / BRAIN_CYCLE_DAYS)),
        color,
        size: 1.2 + rng() * 1.6,
        twinkleDelay: rng() * 4,
      });
    }

    // Generate links — each new node links to 1-3 nearby nodes in the same cycle
    for (let n = 1; n < nodesInThisCycle; n++) {
      const fromIdx = cycleNodeStartIdx + n;
      const linksCount = 1 + Math.floor(rng() * 2);
      // Find 2-3 closest existing nodes in this cycle
      const candidates = [];
      for (let m = 0; m < n; m++) {
        const otherIdx = cycleNodeStartIdx + m;
        const dx = nodes[fromIdx].x - nodes[otherIdx].x;
        const dy = nodes[fromIdx].y - nodes[otherIdx].y;
        candidates.push({ idx: otherIdx, dist: Math.sqrt(dx * dx + dy * dy) });
      }
      candidates.sort((a, b) => a.dist - b.dist);
      for (let l = 0; l < Math.min(linksCount, candidates.length); l++) {
        links.push({ from: fromIdx, to: candidates[l].idx, cycleIdx: cIdx, color });
      }
    }

    // After cycle 1, add 1-2 inter-cycle bridges to the previous cycle's cluster
    if (cIdx > 0 && cycleNodeStartIdx > 0 && nodesInThisCycle > 5) {
      const prevCycleNodes = nodes.slice(0, cycleNodeStartIdx).filter(n => n.cycleIdx === cIdx - 1);
      if (prevCycleNodes.length > 0) {
        const bridgeCount = 1 + Math.floor(rng() * 2);
        for (let b = 0; b < bridgeCount; b++) {
          const fromIdx = cycleNodeStartIdx + Math.floor(rng() * Math.min(5, nodesInThisCycle));
          const prevNode = prevCycleNodes[Math.floor(rng() * prevCycleNodes.length)];
          const toIdx = nodes.indexOf(prevNode);
          if (toIdx !== -1) {
            links.push({ from: fromIdx, to: toIdx, cycleIdx: cIdx, color, isBridge: true });
          }
        }
      }
    }
  }

  return { nodes, links };
};

// === BRAIN — 28-day habit cycles ===
const BRAIN_CYCLE_DAYS = 28;
const BRAIN_NODES_PER_CYCLE = 70; // total nodes added during one cycle (~2-3 per day)
const BRAIN_LINKS_PER_NODE_AVG = 1.8; // avg connections per node

// 12 cycle colors (one per cycle, then loops)
const BRAIN_CYCLE_COLORS = [
  "#A78BFA", // 1 - violet
  "#60A5FA", // 2 - blue
  "#34D399", // 3 - green
  "#FBBF24", // 4 - amber
  "#FB923C", // 5 - orange
  "#F472B6", // 6 - pink
  "#F87171", // 7 - red
  "#22D3EE", // 8 - cyan
  "#A3E635", // 9 - lime
  "#FBBF77", // 10 - peach
  "#C084FC", // 11 - magenta
  "#FFFFFF", // 12 - white (legendary final cycle)
];

// Tutorial steps — `target` is a data-tour attribute name on a DOM element to spotlight
const TUTORIAL_STEPS = [
  {
    title: "Bienvenue 👋",
    body: "Voici un tour rapide pour découvrir Focus. Cela prend moins d'une minute. Vous pouvez passer à tout moment.",
    target: null, // centered modal, no spotlight
  },
  {
    title: "Votre cerveau 🧠",
    body: "Chaque journée où vous validez au moins 80% de vos tâches active une nouvelle connexion neuronale. Sur 28 jours, un cycle complet se forme. Au fil du temps, votre cerveau évolue avec de nouvelles couleurs.",
    target: "brain",
  },
  {
    title: "Votre menu",
    body: "Votre profil, vos statistiques de la semaine et votre abonnement sont accessibles depuis ici.",
    target: "menu",
  },
  {
    title: "Les jours de la semaine",
    body: "Chaque jour a sa couleur et son ambiance. Naviguez entre les jours pour planifier toute votre semaine.",
    target: "week",
  },
  {
    title: "Programmer une tâche",
    body: "Cliquez sur le bouton + pour ajouter une nouvelle tâche : choisissez sa catégorie, son heure de début et sa durée.",
    target: "addBtn",
  },
  {
    title: "Vos tâches",
    body: "Toutes vos tâches du jour s'affichent en timeline. Vous pourrez les modifier, les supprimer ou ajouter des notes.",
    target: "timeline",
  },
  {
    title: "Démarrer la journée",
    body: "Quand votre planning est prêt, cliquez ici pour lancer votre journée. Si vous démarrez avant l'heure de votre première tâche, un compte à rebours vous indiquera le temps restant.",
    target: "startBtn",
  },
  {
    title: "Tâche en cours",
    body: "Une fois la journée lancée, ce grand cercle affiche le temps restant sur la tâche en cours. Les barres en dessous progressent du vert au rouge selon le temps écoulé.",
    target: null,
  },
  {
    title: "Mettre en pause",
    body: "Besoin d'une pause ? Cliquez sur le bouton pause qui apparaîtra. Toutes vos tâches restantes seront automatiquement décalées du temps de votre pause.",
    target: null,
  },
  {
    title: "Fin d'une tâche",
    body: "À la fin de chaque tâche, on vous demande si vous avez rempli votre objectif. Vous pouvez confirmer, ajouter du temps, ou la passer.",
    target: null,
  },
  {
    title: "Bilan de fin de journée",
    body: "Une fois toutes vos tâches accomplies, un bilan personnalisé vous attend avec votre taux de respect, votre temps de pause et un message de coaching. Bonne route avec Focus !",
    target: null,
  },
];

export default function FocusApp() {
  const [user, setUser] = useState(null);
  const [signupForm, setSignupForm] = useState({ firstName: "", lastName: "", birthDate: "", email: "" });

  // === TUTORIAL ===
  const [tutorialStep, setTutorialStep] = useState(null); // null = inactive, 0..N = active step
  const [tutorialRect, setTutorialRect] = useState(null); // { top, left, width, height } of target element

  const [showProfile, setShowProfile] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [customTheme, setCustomTheme] = useState("default"); // 'default' | 'ocean' | 'forest' | 'rose' | 'monochrome' | 'sunset'
  const [paymentForm, setPaymentForm] = useState({ cardNumber: "", expiry: "", cvc: "", name: "" });
  const logoTapsRef = useRef({ count: 0, lastTap: 0 });
  const [profileDraft, setProfileDraft] = useState(null);

  const [selectedDay, setSelectedDay] = useState(todayIndex());
  const [weekTasks, setWeekTasks] = useState(DEFAULT_TASKS);
  const tasks = weekTasks[selectedDay] || [];
  const setTasks = (newTasks) => {
    const updated = typeof newTasks === "function" ? newTasks(tasks) : newTasks;
    setWeekTasks({ ...weekTasks, [selectedDay]: updated });
  };

  // === FLOATING TASKS (sans horaire) — one list per day ===
  // These never affect the main schedule
  const DEFAULT_FLOATING = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  const [weekFloatingTasks, setWeekFloatingTasks] = useState(DEFAULT_FLOATING);
  const floatingTasks = weekFloatingTasks[selectedDay] || [];
  const setFloatingTasks = (newList) => {
    const updated = typeof newList === "function" ? newList(floatingTasks) : newList;
    setWeekFloatingTasks({ ...weekFloatingTasks, [selectedDay]: updated });
  };

  // === CUSTOM REUSABLE TASKS ===
  // Each: { id, name, color, durationMin, iconKey }
  const [customTaskTemplates, setCustomTaskTemplates] = useState([]);
  const [showCustomTaskEditor, setShowCustomTaskEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null); // null = new, object = editing
  const [templateForm, setTemplateForm] = useState({ name: "", color: "#A78BFA", durationMin: 30, iconKey: "Zap" });

  // === COMPLETION TRACKING ===
  // { dayIndex: { taskId: 'done' | 'skipped' } }
  const [completions, setCompletions] = useState({ 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} });

  // === BRAIN STATE ===
  // validatedDates: Set of date strings (YYYY-MM-DD) where the user reached >= 80% completion
  // We use date strings so we can't game the system by validating the same day twice
  const [validatedDates, setValidatedDates] = useState(new Set());
  const lastBrainCheckRef = useRef(null); // last day-key we already evaluated, to avoid double-counting
  const [showBrain, setShowBrain] = useState(false);
  const [brainPreviewCycle, setBrainPreviewCycle] = useState(null); // null = real data, 1..12 = preview that many full cycles
  const [brainNewNodeBurst, setBrainNewNodeBurst] = useState(null); // {ts} when a new day is validated
  const dayCompletions = completions[selectedDay] || {};

  const [isRunning, setIsRunning] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [demoElapsed, setDemoElapsed] = useState(0);
  const [now, setNow] = useState(new Date());
  const [showAdd, setShowAdd] = useState(false);
  const [isFloatingForm, setIsFloatingForm] = useState(false); // true = "sans horaire" mode
  const [editingTask, setEditingTask] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // === DRAG & DROP ===
  const [dragState, setDragState] = useState(null);
  const [swapToast, setSwapToast] = useState(null); // { nameA, nameB, ts }
  // dragState = { taskId, startY, currentY, overTaskId }
  const dragRefs = useRef({}); // taskId → DOM element ref
  const dragLongPressTimer = useRef(null); // timer for long-press detection
  const LONG_PRESS_MS = 350; // ms to hold before drag starts
  const [voiceOn, setVoiceOn] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [taskForm, setTaskForm] = useState({ name: "", start: "", end: "", notes: "", meditationId: null, category: null, subcategory: null });

  // === CONFLICT RESOLUTION ===
  const [conflictDialog, setConflictDialog] = useState(null); // { type, pendingTask, conflicts, shift }
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [pickerStep, setPickerStep] = useState("category");
  const [pickedCategory, setPickedCategory] = useState(null);
  const [activeMeditation, setActiveMeditation] = useState(null);
  const notifiedRef = useRef(new Set());

  // === END-OF-TASK POPUP ===
  const [endTaskPopup, setEndTaskPopup] = useState(null); // task object that just ended
  const [showExtendChoice, setShowExtendChoice] = useState(false);
  const [extendMinutes, setExtendMinutes] = useState(30);
  const lastEndedRef = useRef(new Set()); // tasks already proposed
  const popupOpenedAtRef = useRef(null); // timestamp when popup was opened (to calc response delay)
  const popupTriggerKindRef = useRef(null); // 'natural' | 'manual' — only natural-end pauses the day
  const [pausedAt, setPausedAt] = useState(null); // timestamp when the day was paused (null = not paused)
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [skipPauseConfirm, setSkipPauseConfirm] = useState(false); // user chose "don't ask again"

  // === DAY TRACKING (per-day metrics) ===
  // { dayIndex: { pauseMin: number, delayMin: number, originalTasks: [{ id, start, end }] } }
  const [dayMetrics, setDayMetrics] = useState({ 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} });

  // === END-OF-DAY SUMMARY POPUP ===
  const [showDaySummary, setShowDaySummary] = useState(false);
  const summaryShownRef = useRef(new Set()); // dayIndex that already saw summary today

  // === NO-TASKS WARNING ===
  const [showNoTasksWarning, setShowNoTasksWarning] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // === VALIDATION BURST (visual feedback when a task is marked done) ===
  const [validationBurst, setValidationBurst] = useState(null);
  // === TASK TRANSITION OVERLAY ===
  // Shows briefly between two tasks: "Bravo ✓ Prochaine tâche : XYZ"
  const [taskTransition, setTaskTransition] = useState(null); // { fromName, fromColor, toName, toColor, toStart }

  const [activeAmbient, setActiveAmbient] = useState(null);
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [customTracks, setCustomTracks] = useState([]);
  const [activeCustomTrack, setActiveCustomTrack] = useState(null);
  const audioCtxRef = useRef(null);
  const audioNodesRef = useRef(null);
  const customAudioRef = useRef(null);

  const DEMO_TASK_DURATION = 30;
  // Solar ambiance — recomputed whenever `now` ticks (every second)
  const solar = getSolarAmbiance(now);
  // Active theme palette derived from customTheme state
  const activeDayThemes = getDayThemes(customTheme);
  const dayTheme = activeDayThemes[selectedDay];

  // === Audio: custom music ===
  useEffect(() => {
    if (customAudioRef.current) { customAudioRef.current.pause(); customAudioRef.current = null; }
    if (!activeCustomTrack) return;
    const track = customTracks.find(t => t.id === activeCustomTrack);
    if (!track) return;
    const audio = new Audio(track.url);
    audio.loop = true; audio.volume = ambientVolume;
    audio.play().catch(() => {});
    customAudioRef.current = audio;
    return () => { audio.pause(); };
  }, [activeCustomTrack, customTracks]);

  useEffect(() => {
    if (customAudioRef.current) customAudioRef.current.volume = ambientVolume;
  }, [ambientVolume]);

  // === Audio: ambient sounds ===
  useEffect(() => {
    if (audioNodesRef.current) {
      audioNodesRef.current.stop && audioNodesRef.current.stop();
      audioNodesRef.current = null;
    }
    if (!activeAmbient) return;
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const masterGain = ctx.createGain();
    masterGain.gain.value = ambientVolume;
    masterGain.connect(ctx.destination);
    let stopFn = () => {};

    if (activeAmbient === "rain" || activeAmbient === "wind" || activeAmbient === "forest") {
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0990460;
        b1 = 0.96300 * b1 + white * 0.2965164;
        b2 = 0.57000 * b2 + white * 1.0526913;
        output[i] = (b0 + b1 + b2 + white * 0.1848) * 0.15;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer; noise.loop = true;
      const filter = ctx.createBiquadFilter();
      if (activeAmbient === "rain") { filter.type = "highpass"; filter.frequency.value = 800; }
      else if (activeAmbient === "wind") { filter.type = "lowpass"; filter.frequency.value = 400; }
      else { filter.type = "bandpass"; filter.frequency.value = 1200; filter.Q.value = 0.5; }
      noise.connect(filter); filter.connect(masterGain);
      noise.start();
      stopFn = () => { try { noise.stop(); } catch (e) {} };
    } else if (activeAmbient === "lofi") {
      const osc1 = ctx.createOscillator(), osc2 = ctx.createOscillator();
      osc1.type = "sine"; osc2.type = "sine";
      osc1.frequency.value = 110; osc2.frequency.value = 165;
      const g1 = ctx.createGain(), g2 = ctx.createGain();
      g1.gain.value = 0.15; g2.gain.value = 0.1;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.15;
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.05;
      lfo.connect(lfoGain); lfoGain.connect(g1.gain);
      osc1.connect(g1); osc2.connect(g2);
      g1.connect(masterGain); g2.connect(masterGain);
      osc1.start(); osc2.start(); lfo.start();
      stopFn = () => { try { osc1.stop(); osc2.stop(); lfo.stop(); } catch (e) {} };
    } else if (activeAmbient === "cafe") {
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = (Math.random() * 2 - 1) * 0.2;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer; noise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass"; filter.frequency.value = 600; filter.Q.value = 0.8;
      const rumble = ctx.createOscillator();
      rumble.type = "sine"; rumble.frequency.value = 60;
      const rumbleGain = ctx.createGain(); rumbleGain.gain.value = 0.05;
      noise.connect(filter); filter.connect(masterGain);
      rumble.connect(rumbleGain); rumbleGain.connect(masterGain);
      noise.start(); rumble.start();
      stopFn = () => { try { noise.stop(); rumble.stop(); } catch (e) {} };
    }
    audioNodesRef.current = { stop: stopFn };
    return () => stopFn();
  }, [activeAmbient]);

  // === Timer loop ===
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setNow(new Date());
      if (demoMode) setDemoElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, demoMode]);

  // === TUTORIAL: measure target position when step changes ===
  useEffect(() => {
    if (tutorialStep === null) {
      setTutorialRect(null);
      return;
    }
    const step = TUTORIAL_STEPS[tutorialStep];
    if (!step?.target) {
      setTutorialRect(null);
      return;
    }

    const measure = () => {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (!el) {
        setTutorialRect(null);
        return;
      }
      // Scroll element into view smoothly if not visible
      const r = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const isVisible = r.top >= 0 && r.bottom <= viewportH;
      if (!isVisible) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Re-measure after scroll
        setTimeout(() => {
          const r2 = el.getBoundingClientRect();
          setTutorialRect({ top: r2.top, left: r2.left, width: r2.width, height: r2.height });
        }, 400);
      } else {
        setTutorialRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [tutorialStep]);

  // Start the day directly (no more visualization)
  const startDay = () => {
    setNow(new Date());
    setIsRunning(true);
    if (demoMode) setDemoElapsed(0);
    notifiedRef.current.clear();
    // Capture original task times for delay calculation later
    setDayMetrics({
      ...dayMetrics,
      [selectedDay]: {
        pauseMin: 0,
        delayMin: 0,
        originalTasks: tasks.map(t => ({ id: t.id, start: t.start, end: t.end })),
        startedAt: Date.now(),
      },
    });
    // Reset summary marker so it can re-show if user restarts
    summaryShownRef.current.delete(selectedDay);
  };

  const sortedTasks = [...tasks].sort((a, b) => toMin(a.start) - toMin(b.start));

  // === Find current task / progress ===
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
    // A task is "current" only if we're in its time window AND it hasn't been validated yet
    currentTask = sortedTasks.find((t) =>
      nowMin >= toMin(t.start) && nowMin < toMin(t.end) && !dayCompletions[t.id]
    );
    if (currentTask) {
      const start = toMin(currentTask.start);
      const end = toMin(currentTask.end);
      progress = ((nowMin - start) / (end - start)) * 100;
      remainingSec = Math.max(0, Math.floor((end - nowMin) * 60));
    }
    // Next task: the next non-completed task that hasn't started yet
    const currentIdx = currentTask ? sortedTasks.indexOf(currentTask) : -1;
    if (currentIdx >= 0) {
      nextTask = sortedTasks.slice(currentIdx + 1).find(t => !dayCompletions[t.id]);
    } else {
      nextTask = sortedTasks.find(t => toMin(t.start) > nowMin && !dayCompletions[t.id])
                 || sortedTasks.find(t => !dayCompletions[t.id] && toMin(t.end) > nowMin);
    }
  }

  const getTaskProgress = (task) => {
    // If task has been validated/skipped, freeze progress at 100%
    if (dayCompletions[task.id]) return 100;
    if (demoMode) {
      const idx = sortedTasks.indexOf(task);
      const taskStart = idx * DEMO_TASK_DURATION;
      const taskEnd = taskStart + DEMO_TASK_DURATION;
      if (demoElapsed >= taskEnd) return 100;
      if (demoElapsed <= taskStart) return 0;
      return ((demoElapsed - taskStart) / DEMO_TASK_DURATION) * 100;
    } else {
      const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
      const start = toMin(task.start);
      const end = toMin(task.end);
      if (nowMin >= end) return 100;
      if (nowMin <= start) return 0;
      return ((nowMin - start) / (end - start)) * 100;
    }
  };

  const isPastTask = (task) => getTaskProgress(task) >= 100;

  // === Voice notification 10 min before end ===
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
        u.lang = "fr-FR"; u.rate = 0.95;
        window.speechSynthesis.speak(u);
      }
    }
  }, [remainingSec, currentTask, isRunning, voiceOn, demoMode]);

  // === END-OF-TASK DETECTION ===
  // When a task hits 100% progress, open the validation popup
  useEffect(() => {
    if (!isRunning) return;
    sortedTasks.forEach((task) => {
      const prog = getTaskProgress(task);
      if (prog >= 100 && !lastEndedRef.current.has(task.id) && !dayCompletions[task.id]) {
        lastEndedRef.current.add(task.id);
        // Mark the moment the popup opens so we can shift later tasks by the response delay
        popupOpenedAtRef.current = Date.now();
        popupTriggerKindRef.current = "natural";
        setEndTaskPopup(task);
      }
    });
  }, [now, demoElapsed, isRunning]);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const calcAge = (birthDate) => {
    if (!birthDate) return "";
    const d = new Date(birthDate); const t = new Date();
    let a = t.getFullYear() - d.getFullYear();
    const m = t.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < d.getDate())) a--;
    return a;
  };

  // === TRIAL: 7-day countdown ===
  const TRIAL_DAYS = 7;
  const trialDaysLeft = (() => {
    if (!user?.trialStart) return 0;
    const elapsed = (Date.now() - user.trialStart) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(TRIAL_DAYS - elapsed));
  })();
  const trialExpired = user && !user.isSubscribed && trialDaysLeft <= 0;

  // === BRAIN PROGRESSION ===
  const brainTotalDays = validatedDates.size;
  const brainCurrentCycleIdx = Math.floor(brainTotalDays / BRAIN_CYCLE_DAYS); // 0-indexed
  const brainDayInCycle = brainTotalDays % BRAIN_CYCLE_DAYS; // 0..27
  const brainCycleProgress = brainDayInCycle / BRAIN_CYCLE_DAYS; // 0..1
  const brainCurrentColor = BRAIN_CYCLE_COLORS[brainCurrentCycleIdx % BRAIN_CYCLE_COLORS.length];

  // Activate subscription (mock — in real app this would hit a payment processor)
  const activateSubscription = () => {
    if (!paymentForm.cardNumber || !paymentForm.expiry || !paymentForm.cvc || !paymentForm.name) return;
    setUser({ ...user, isSubscribed: true, subscriptionStart: Date.now() });
    setPaymentForm({ cardNumber: "", expiry: "", cvc: "", name: "" });
    setShowSubscription(false);
  };

  const handleSignup = () => {
    if (!signupForm.firstName || !signupForm.lastName || !signupForm.birthDate || !signupForm.email) return;
    setUser({
      ...signupForm,
      city: "",
      photo: null,
      bio: "",
      trialStart: Date.now(),
      isSubscribed: false,
    });
    setTutorialStep(0); // launch tutorial on first connection
  };

  const openAdd = () => {
    setEditingTask(null);
    setIsFloatingForm(false);
    // Pre-fill the start time with the latest task's end time, if any
    let suggestedStart = "";
    if (sortedTasks.length > 0) {
      const lastTask = sortedTasks.reduce((latest, t) =>
        toMin(t.end) > toMin(latest.end) ? t : latest, sortedTasks[0]);
      suggestedStart = lastTask.end;
    }
    setTaskForm({
      name: "", start: suggestedStart, end: "",
      notes: "", meditationId: null, category: null, subcategory: null,
    });
    setShowAdd(true);
  };

  const openAddFloating = (prefill = null) => {
    setEditingTask(null);
    setIsFloatingForm(true);
    setTaskForm({
      name: prefill?.name || "", start: "", end: "",
      notes: prefill?.notes || "", meditationId: null,
      category: prefill?.category || null, subcategory: prefill?.subcategory || null,
    });
    setShowAdd(true);
  };

  const openEdit = (task, floating = false) => {
    setEditingTask(task);
    setIsFloatingForm(floating);
    setTaskForm({
      name: task.name, start: task.start || "", end: task.end || "",
      notes: task.notes || "",
      meditationId: task.meditationId || null,
      category: task.category || null, subcategory: task.subcategory || null,
    });
    setShowAdd(true);
  };

  // === Helper: check if two time windows overlap ===
  const overlaps = (aStart, aEnd, bStart, bEnd) => {
    return toMin(aStart) < toMin(bEnd) && toMin(bStart) < toMin(aEnd);
  };

  // === Helper: find tasks that would conflict with given start/end ===
  const findConflicts = (taskList, candidateStart, candidateEnd, excludeId = null) => {
    return taskList.filter(t =>
      t.id !== excludeId && overlaps(t.start, t.end, candidateStart, candidateEnd)
    );
  };

  // === Helper: cascade-shift all tasks starting from a given time, by N minutes ===
  // Tasks whose start >= reference time get pushed back by `shiftMin` minutes
  const cascadeShift = (taskList, fromMinTime, shiftMin) => {
    return taskList.map(t => {
      if (toMin(t.start) >= fromMinTime) {
        return {
          ...t,
          start: fromMin(toMin(t.start) + shiftMin),
          end: fromMin(toMin(t.end) + shiftMin),
        };
      }
      return t;
    });
  };

  // === Helper: check if cascade would push any task past midnight ===
  const cascadeWouldOverflow = (taskList, fromMinTime, shiftMin) => {
    return taskList.some(t =>
      toMin(t.start) >= fromMinTime && toMin(t.end) + shiftMin > 24 * 60
    );
  };

  const saveTask = () => {
    // === FLOATING TASK (sans horaire) ===
    if (isFloatingForm) {
      if (!taskForm.name) return;
      const cat = TASK_CATEGORIES.find(c => c.id === taskForm.category);
      const taskColor = cat?.color || "#FB923C"; // default orange for floating
      if (editingTask) {
        setFloatingTasks(floatingTasks.map(t =>
          t.id === editingTask.id ? { ...t, ...taskForm, color: taskColor } : t
        ));
      } else {
        setFloatingTasks([...floatingTasks, {
          id: Date.now(), ...taskForm, color: taskColor, floating: true
        }]);
      }
      setShowAdd(false);
      setEditingTask(null);
      setIsFloatingForm(false);
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
    const cat = TASK_CATEGORIES.find(c => c.id === taskForm.category);
    const taskColor = taskForm.customColor || cat?.color || "#A78BFA";

    // ===== EDITING AN EXISTING TASK =====
    if (editingTask) {
      const otherTasks = tasks.filter(t => t.id !== editingTask.id);
      const conflicts = findConflicts(otherTasks, taskForm.start, taskForm.end);

      if (conflicts.length === 0) {
        // No conflict → just save
        setTasks(tasks.map(t => t.id === editingTask.id
          ? { ...t, ...taskForm, color: taskColor }
          : t));
        // If we're editing the currently-running task or one already past, refresh detection
        lastEndedRef.current.delete(editingTask.id);
        setNow(new Date());
        setShowAdd(false);
        setEditingTask(null);
        return;
      }

      // CONFLICT → propose cascade or cancel
      // Calculate how much we'd need to push the first conflicting task
      const earliestConflict = conflicts.reduce((earliest, t) =>
        toMin(t.start) < toMin(earliest.start) ? t : earliest, conflicts[0]);
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

    // ===== ADDING A NEW TASK =====
    const conflicts = findConflicts(tasks, taskForm.start, taskForm.end);

    if (conflicts.length === 0) {
      // No conflict → just insert
      setTasks([...tasks, { id: Date.now(), ...taskForm, color: taskColor }]);
      setShowAdd(false);
      return;
    }

    // Detect: if the new task COMPLETELY covers an existing one → that's absurd, block
    const fullyCovered = conflicts.filter(t =>
      toMin(taskForm.start) <= toMin(t.start) && toMin(taskForm.end) >= toMin(t.end)
    );
    if (fullyCovered.length > 0) {
      setConflictDialog({
        type: "fullyCovered",
        pendingTask: { id: Date.now(), ...taskForm, color: taskColor },
        conflicts: fullyCovered,
      });
      return;
    }

    // Otherwise: it's an insertion that pushes following tasks → cascade automatically
    // (this matches the agreed UX: insertions cascade silently)
    const earliestConflict = conflicts.reduce((earliest, t) =>
      toMin(t.start) < toMin(earliest.start) ? t : earliest, conflicts[0]);
    const shiftMin = toMin(taskForm.end) - toMin(earliestConflict.start);
    const overflow = cascadeWouldOverflow(tasks, toMin(earliestConflict.start), shiftMin);

    if (overflow) {
      // Cascade would push past midnight → block
      setConflictDialog({
        type: "overflow",
        pendingTask: { id: Date.now(), ...taskForm, color: taskColor },
        shiftMin,
      });
      return;
    }

    // Safe to cascade
    const shifted = cascadeShift(tasks, toMin(earliestConflict.start), shiftMin);
    setTasks([...shifted, { id: Date.now(), ...taskForm, color: taskColor }]);
    setShowAdd(false);
  };

  // Apply edit with cascade (called from conflict dialog "Cascade" choice)
  const applyEditWithCascade = () => {
    if (!conflictDialog || conflictDialog.type !== "edit") return;
    const { pendingTask, shiftMin, conflicts } = conflictDialog;
    const otherTasks = tasks.filter(t => t.id !== pendingTask.id);
    const earliestConflictStart = Math.min(...conflicts.map(c => toMin(c.start)));
    const shifted = cascadeShift(otherTasks, earliestConflictStart, shiftMin);
    setTasks([...shifted, pendingTask]);
    // Refresh "current task" detection and re-allow popup detection for shifted tasks
    shifted.forEach(t => lastEndedRef.current.delete(t.id));
    lastEndedRef.current.delete(pendingTask.id);
    setNow(new Date());
    setConflictDialog(null);
    setShowAdd(false);
    setEditingTask(null);
  };

  // === Detect existing conflicts in the current task list ===
  // Returns array of conflict pairs: [{ taskA, taskB }, ...]
  const detectExistingConflicts = () => {
    const conflicts = [];
    const sorted = [...tasks].sort((a, b) => toMin(a.start) - toMin(b.start));
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        if (overlaps(sorted[i].start, sorted[i].end, sorted[j].start, sorted[j].end)) {
          conflicts.push({ taskA: sorted[i], taskB: sorted[j] });
        }
      }
    }
    return conflicts;
  };
  const existingConflicts = detectExistingConflicts();

  // Auto-repair: cascade-shift to resolve all conflicts
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
          if (toMin(next.end) + shift > 24 * 60) {
            // Cannot repair — would overflow midnight
            return false;
          }
          working = working.map((t, idx) =>
            idx > i ? {
              ...t,
              start: fromMin(toMin(t.start) + shift),
              end: fromMin(toMin(t.end) + shift),
            } : t
          );
          foundConflict = true;
          break;
        }
      }
      if (!foundConflict) break;
    }
    setTasks(working);
    return true;
  };

  // === DRAG & DROP HANDLERS ===

  // Swap timeslots between two tasks (exchanges start/end, keeps everything else)
  const swapTaskTimes = (idA, idB) => {
    const taskA = tasks.find(t => t.id === idA);
    const taskB = tasks.find(t => t.id === idB);
    if (!taskA || !taskB) return;

    setTasks(tasks.map(t => {
      if (t.id === idA) return { ...t, start: taskB.start, end: taskB.end };
      if (t.id === idB) return { ...t, start: taskA.start, end: taskA.end };
      return t;
    }));

    // Brief visual confirmation
    setSwapToast({ nameA: taskA.name, nameB: taskB.name, ts: Date.now() });
    setTimeout(() => setSwapToast(null), 2500);
  };

  // Get which task the pointer is currently hovering
  const getTaskIdAtY = (y) => {
    for (const [taskId, el] of Object.entries(dragRefs.current)) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (y >= rect.top && y <= rect.bottom) return taskId;
    }
    return null;
  };

  const onDragPointerMove = (clientY) => {
    if (!dragState) return;
    const overId = getTaskIdAtY(clientY);
    setDragState(prev => ({
      ...prev,
      currentY: clientY,
      overTaskId: overId && overId !== prev.taskId ? overId : null,
    }));
  };

  const onDragPointerUp = () => {
    if (!dragState) return;
    if (dragState.overTaskId && dragState.overTaskId !== dragState.taskId) {
      swapTaskTimes(dragState.taskId, dragState.overTaskId);
      // Collapse both cards
      setExpandedId(null);
    }
    setDragState(null);
    dragLongPressTimer.current = null;
    document.body.style.userSelect = "";
  };

  // Attach global move/up listeners when drag is active
  useEffect(() => {
    if (!dragState) return;
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
  }, [dragState, tasks]);

  const startLongPress = (task, clientY) => {
    dragLongPressTimer.current = setTimeout(() => {
      // Vibrate if supported (mobile haptic feedback)
      if (navigator.vibrate) navigator.vibrate(40);
      document.body.style.userSelect = "none";
      setExpandedId(null); // collapse open card
      setDragState({ taskId: task.id, startY: clientY, currentY: clientY, overTaskId: null });
    }, LONG_PRESS_MS);
  };

  const cancelLongPress = () => {
    if (dragLongPressTimer.current) {
      clearTimeout(dragLongPressTimer.current);
      dragLongPressTimer.current = null;
    }
  };

  // === CUSTOM TASK TEMPLATE CRUD ===
  const openNewTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm({ name: "", color: "#A78BFA", durationMin: 30, iconKey: "Zap" });
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
      setCustomTaskTemplates(customTaskTemplates.map(t =>
        t.id === editingTemplate.id ? { ...t, ...templateForm } : t
      ));
    } else {
      setCustomTaskTemplates([...customTaskTemplates, { id: Date.now(), ...templateForm }]);
    }
    setShowCustomTaskEditor(false);
    setEditingTemplate(null);
  };

  const deleteTemplate = (id) => {
    setCustomTaskTemplates(customTaskTemplates.filter(t => t.id !== id));
  };

  // Insert a custom template into the day's schedule
  const insertTemplate = (tpl) => {
    // Pre-fill form with template data; user still picks the time slot
    let suggestedStart = "";
    if (sortedTasks.length > 0) {
      const lastTask = sortedTasks.reduce((latest, t) =>
        toMin(t.end) > toMin(latest.end) ? t : latest, sortedTasks[0]);
      suggestedStart = lastTask.end;
    }
    // Pre-calculate end time from duration
    let suggestedEnd = "";
    if (suggestedStart) {
      suggestedEnd = fromMin(toMin(suggestedStart) + tpl.durationMin);
    }
    setIsFloatingForm(false);
    setEditingTask(null);
    setTaskForm({
      name: tpl.name, start: suggestedStart, end: suggestedEnd,
      notes: "", meditationId: null, category: null, subcategory: null,
      customIconKey: tpl.iconKey, customColor: tpl.color,
    });
    setShowAdd(true);
    setShowCategoryPicker(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  // === RESET DAY ===
  const resetDay = () => {
    // Clear tasks for current day
    setWeekTasks({ ...weekTasks, [selectedDay]: [] });
    // Clear completions for current day
    setCompletions({ ...completions, [selectedDay]: {} });
    // Clear metrics for current day
    setDayMetrics(prev => ({ ...prev, [selectedDay]: {} }));
    // Stop the day if running
    setIsRunning(false);
    setPausedAt(null);
    setDemoMode(false);
    setDemoElapsed(0);
    // Clear refs
    lastEndedRef.current.clear();
    notifiedRef.current.clear();
    summaryShownRef.current.delete(selectedDay);
    popupOpenedAtRef.current = null;
    popupTriggerKindRef.current = null;
    // Close any open popup
    setEndTaskPopup(null);
    setShowExtendChoice(false);
    setExpandedId(null);
    setShowDaySummary(false);
    setTaskTransition(null);
    setShowResetConfirm(false);
  };

  const toggleDemo = () => {
    setDemoMode(!demoMode);
    setDemoElapsed(0);
    notifiedRef.current.clear();
    lastEndedRef.current.clear();
  };

  // Actually pause the day (called after user confirmation)
  const confirmPause = () => {
    setPausedAt(Date.now());
    setIsRunning(false);
    setShowPauseConfirm(false);
  };

  const togglePlay = () => {
    if (!isRunning) {
      // === RESUME ===
      if (pausedAt && !demoMode) {
        // Calculate how long the pause lasted
        const pauseSec = Math.floor((Date.now() - pausedAt) / 1000);
        const pauseMin = Math.ceil(pauseSec / 60); // round up to next minute
        if (pauseMin > 0) {
          // The "pause snapshot time": when the user clicked pause (real-world time)
          const pausedAtDate = new Date(pausedAt);
          const pauseSnapMin = pausedAtDate.getHours() * 60 + pausedAtDate.getMinutes();
          const nowMin = new Date().getHours() * 60 + new Date().getMinutes();

          // A task should be shifted if its end time is still in the future
          // OR if it was supposed to run during the pause window (start was before now but task wasn't done).
          const updated = tasks.map(t => {
            // Skip tasks already completed or marked
            if (dayCompletions[t.id]) return t;

            const tStart = toMin(t.start);
            const tEnd = toMin(t.end);

            // Case 1: task was fully in the past before pause started → no shift
            if (tEnd <= pauseSnapMin) return t;

            // Case 2: task was in progress when pause started (start <= pauseSnap < end)
            //   → keep its start, push only the end
            if (tStart <= pauseSnapMin && tEnd > pauseSnapMin) {
              return { ...t, end: fromMin(tEnd + pauseMin) };
            }

            // Case 3: task was in the future relative to pause moment (start > pauseSnap)
            //   → push BOTH start and end (this covers the "pause overshoots into next task" case)
            if (tStart > pauseSnapMin) {
              return {
                ...t,
                start: fromMin(tStart + pauseMin),
                end: fromMin(tEnd + pauseMin),
              };
            }

            return t;
          });
          setTasks(updated);
          // Re-allow popup detection for any task whose end has moved into the future
          updated.forEach(t => {
            if (toMin(t.end) > nowMin) lastEndedRef.current.delete(t.id);
          });
          // Track pause time in day metrics
          setDayMetrics(prev => ({
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
    } else {
      // === PAUSE === (with confirmation, unless user opted out)
      if (skipPauseConfirm || demoMode) {
        confirmPause();
      } else {
        setShowPauseConfirm(true);
      }
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfileDraft({ ...profileDraft, photo: ev.target.result });
    reader.readAsDataURL(file);
  };

  const handleMusicUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newTracks = files.map(file => ({
      id: `custom-${Date.now()}-${Math.random()}`,
      name: file.name.replace(/\.(mp3|wav|m4a|ogg)$/i, ""),
      url: URL.createObjectURL(file),
    }));
    setCustomTracks([...customTracks, ...newTracks]);
    e.target.value = "";
  };

  const removeCustomTrack = (id) => {
    if (activeCustomTrack === id) setActiveCustomTrack(null);
    const track = customTracks.find(t => t.id === id);
    if (track) URL.revokeObjectURL(track.url);
    setCustomTracks(customTracks.filter(t => t.id !== id));
  };

  const activateAmbient = (id) => {
    setActiveCustomTrack(null);
    setActiveAmbient(activeAmbient === id ? null : id);
  };
  const activateCustom = (id) => {
    setActiveAmbient(null);
    setActiveCustomTrack(activeCustomTrack === id ? null : id);
  };

  // ============================================================
  // === END-OF-TASK ACTIONS ===
  // ============================================================

  // When user finally responds to a natural-end popup, calculate how long they took
  // and shift all upcoming tasks by that delay so nothing runs in the background.
  const shiftUpcomingByResponseDelay = (endedTaskId) => {
    if (popupTriggerKindRef.current !== "natural" || !popupOpenedAtRef.current) return;
    const delaySec = Math.floor((Date.now() - popupOpenedAtRef.current) / 1000);
    popupOpenedAtRef.current = null;
    popupTriggerKindRef.current = null;
    if (delaySec <= 0) return;

    // Round up to the next minute for clean times
    const delayMin = Math.ceil(delaySec / 60);
    const sorted = [...tasks].sort((a, b) => toMin(a.start) - toMin(b.start));
    const idx = sorted.findIndex(t => t.id === endedTaskId);
    if (idx === -1) return;

    const updated = sorted.map((t, i) => {
      if (i <= idx) return t; // ended task stays as-is
      return {
        ...t,
        start: fromMin(toMin(t.start) + delayMin),
        end: fromMin(toMin(t.end) + delayMin),
      };
    });
    setTasks(updated);
    // Allow re-detection on next natural end of subsequent tasks
    sorted.slice(idx + 1).forEach(t => lastEndedRef.current.delete(t.id));
  };

  // Check if this was the last task of the day → trigger summary popup
  // Auto-detect end of day: when all tasks are completed/skipped, show summary
  useEffect(() => {
    if (!isRunning || tasks.length === 0) return;
    if (summaryShownRef.current.has(selectedDay)) return;
    const allHandled = tasks.every(t => dayCompletions[t.id]);
    if (allHandled) {
      summaryShownRef.current.add(selectedDay);
      // Slight delay to let the burst animation play
      const id = setTimeout(() => setShowDaySummary(true), 1200);
      return () => clearTimeout(id);
    }
  }, [dayCompletions, tasks, isRunning, selectedDay]);

  // === BRAIN: validate today when ≥80% of tasks are done ===
  useEffect(() => {
    if (!isRunning || tasks.length === 0) return;
    const doneCount = tasks.filter(t => dayCompletions[t.id] === "done").length;
    const ratio = doneCount / tasks.length;
    if (ratio < 0.8) return;

    // Use today's real-world date as the unique key
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Already validated today? skip
    if (validatedDates.has(dateKey)) return;
    if (lastBrainCheckRef.current === dateKey) return;

    lastBrainCheckRef.current = dateKey;
    const newSet = new Set(validatedDates);
    newSet.add(dateKey);
    setValidatedDates(newSet);
    setBrainNewNodeBurst({ ts: Date.now() });
    setTimeout(() => setBrainNewNodeBurst(null), 2400);
  }, [dayCompletions, tasks, isRunning]);

  const checkAndTriggerDaySummary = (taskId) => {
    // kept for compatibility — actual logic now lives in the useEffect above
  };

  // === Trigger the brief between-task transition overlay ===
  // Called after a task is validated. Computes the next non-completed task and shows a 5s overlay.
  const triggerTaskTransition = (completedTaskId, computedTasks = null) => {
    const taskList = computedTasks || tasks;
    const completedTask = taskList.find(t => t.id === completedTaskId);
    if (!completedTask) return;

    // Find the next task that is not already completed
    const upcoming = [...taskList]
      .sort((a, b) => toMin(a.start) - toMin(b.start))
      .filter(t => t.id !== completedTaskId
        && !dayCompletions[t.id]
        && t.id !== completedTaskId);
    const nextOne = upcoming[0];

    // Only show transition if there is a next task
    if (!nextOne) return;

    setTaskTransition({
      fromName: completedTask.name,
      fromColor: completedTask.color,
      toName: nextOne.name,
      toColor: nextOne.color,
      toStart: nextOne.start,
    });
    // Auto-dismiss after 5 seconds
    setTimeout(() => setTaskTransition(null), 5000);
  };

  const markTaskDone = (taskId) => {
    setCompletions({
      ...completions,
      [selectedDay]: { ...dayCompletions, [taskId]: "done" },
    });
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setValidationBurst({ color: task.color, ts: Date.now() });
      setTimeout(() => setValidationBurst(null), 1800);
    }
    shiftUpcomingByResponseDelay(taskId);
    setEndTaskPopup(null);
    setShowExtendChoice(false);
    checkAndTriggerDaySummary(taskId);
    // Show transition overlay if there's a next task
    setTimeout(() => triggerTaskTransition(taskId), 1900);
  };

  const markTaskSkipped = (taskId) => {
    setCompletions({
      ...completions,
      [selectedDay]: { ...dayCompletions, [taskId]: "skipped" },
    });
    shiftUpcomingByResponseDelay(taskId);
    setEndTaskPopup(null);
    setShowExtendChoice(false);
    checkAndTriggerDaySummary(taskId);
    // Show transition overlay if there's a next task
    setTimeout(() => triggerTaskTransition(taskId), 400);
  };

  const extendTask = (task, minutesToAdd) => {
    // If the popup was triggered naturally, include the response delay too
    let delayMin = 0;
    if (popupTriggerKindRef.current === "natural" && popupOpenedAtRef.current) {
      const delaySec = Math.floor((Date.now() - popupOpenedAtRef.current) / 1000);
      delayMin = Math.ceil(delaySec / 60);
    }
    popupOpenedAtRef.current = null;
    popupTriggerKindRef.current = null;

    const totalShift = minutesToAdd + delayMin;

    // Push back this task's end time AND every following task by `totalShift`
    const sorted = [...tasks].sort((a, b) => toMin(a.start) - toMin(b.start));
    const idx = sorted.findIndex(t => t.id === task.id);
    const updated = sorted.map((t, i) => {
      if (i < idx) return t;
      if (i === idx) return { ...t, end: fromMin(toMin(t.end) + totalShift) };
      return { ...t, start: fromMin(toMin(t.start) + totalShift), end: fromMin(toMin(t.end) + totalShift) };
    });
    setTasks(updated);
    // Allow this task to trigger the popup again at its new end time
    lastEndedRef.current.delete(task.id);
    // Allow re-detection of subsequent tasks too (their times changed)
    sorted.slice(idx + 1).forEach(t => lastEndedRef.current.delete(t.id));
    setEndTaskPopup(null);
    setShowExtendChoice(false);
  };

  // Finish a task earlier than scheduled — pull every following task forward by the saved minutes
  const finishEarly = (task) => {
    const sorted = [...tasks].sort((a, b) => toMin(a.start) - toMin(b.start));
    const idx = sorted.findIndex(t => t.id === task.id);
    if (idx === -1) return;

    // Compute current "now" in minutes (real or demo)
    let nowMinutes;
    if (demoMode) {
      const elapsedInTask = demoElapsed % DEMO_TASK_DURATION;
      const fakeProgressRatio = elapsedInTask / DEMO_TASK_DURATION;
      const taskDur = toMin(sorted[idx].end) - toMin(sorted[idx].start);
      nowMinutes = toMin(sorted[idx].start) + fakeProgressRatio * taskDur;
    } else {
      nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    }
    const nowMinRounded = Math.ceil(nowMinutes); // round up to next full minute

    // Shift = how much we need to pull next task's start back so it starts NOW
    let shift = 0;
    if (idx + 1 < sorted.length) {
      const nextStart = toMin(sorted[idx + 1].start);
      shift = Math.max(0, nextStart - nowMinRounded);
    }

    const updated = sorted.map((t, i) => {
      if (i < idx) return t;
      // Current task: end it NOW
      if (i === idx) {
        return { ...t, end: fromMin(Math.max(toMin(t.start) + 1, nowMinRounded)) };
      }
      // Following tasks: pull them earlier by `shift`
      return { ...t, start: fromMin(toMin(t.start) - shift), end: fromMin(toMin(t.end) - shift) };
    });
    setTasks(updated);

    // Mark this task as done and close popup
    setCompletions({
      ...completions,
      [selectedDay]: { ...dayCompletions, [task.id]: "done" },
    });
    setValidationBurst({ color: task.color, ts: Date.now() });
    setTimeout(() => setValidationBurst(null), 1800);
    lastEndedRef.current.add(task.id);
    popupOpenedAtRef.current = null;
    popupTriggerKindRef.current = null;
    setEndTaskPopup(null);
    setShowExtendChoice(false);
    setNow(new Date()); // force immediate re-detection of next task
    checkAndTriggerDaySummary(task.id);
    // Show transition overlay if there's a next task (use updated list)
    setTimeout(() => triggerTaskTransition(task.id, updated), 1900);
  };

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (progress / 100) * circumference;

  // ============================================================
  // === GOAL PROGRESS (DAILY + WEEKLY) ===
  // ============================================================
  const computeDayGoal = (dayIdx) => {
    const dayT = weekTasks[dayIdx] || [];
    if (dayT.length === 0) return { done: 0, total: 0, percent: 0 };
    const dayComp = completions[dayIdx] || {};
    const done = dayT.filter(t => dayComp[t.id] === "done").length;
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
      done: totalDone,
      total: totalCount,
      percent: totalCount > 0 ? Math.round((totalDone / totalCount) * 100) : 0,
    };
  };

  const weeklyGoal = computeWeekGoal();

  // ============================================================
  // === STATS ===
  // ============================================================
  const computeStats = () => {
    const stats = activeDayThemes.map((theme, idx) => {
      const dayT = weekTasks[idx] || [];
      const totalMinutes = dayT.reduce((s, t) => s + (toMin(t.end) - toMin(t.start)), 0);
      const goal = computeDayGoal(idx);
      return { ...theme, totalMinutes, taskCount: dayT.length, completion: goal.percent, idx };
    });
    const categoryTotals = {};
    Object.values(weekTasks).flat().forEach(t => {
      const dur = toMin(t.end) - toMin(t.start);
      const key = t.category ? TASK_CATEGORIES.find(c => c.id === t.category)?.name || t.name : t.name;
      categoryTotals[key] = (categoryTotals[key] || 0) + dur;
    });
    const topCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const totalWeekTasks = Object.values(weekTasks).flat().length;
    const totalWeekMinutes = stats.reduce((s, d) => s + d.totalMinutes, 0);
    const dayWithTasks = stats.filter(s => s.taskCount > 0);
    const avgCompletion = dayWithTasks.length > 0
      ? dayWithTasks.reduce((s, d) => s + d.completion, 0) / dayWithTasks.length : 0;
    const bestDay = [...stats].sort((a, b) => b.completion - a.completion)[0];
    return { stats, topCategories, totalWeekTasks, totalWeekMinutes, avgCompletion, bestDay };
  };

  // ============================================================
  // === SIGNUP ===
  // ============================================================
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden flex items-center justify-center p-6"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-violet-500" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-cyan-500 opacity-50" />
        </div>
        <div className="relative z-10 w-full max-w-sm">
          <div className="text-center mb-10">


            {/* === HOLOGRAPHIC BUDDHA HEAD === */}
            <div className="relative mx-auto mb-3 w-16 h-20 flex items-center justify-center"
              style={{ animation: "hologram-flicker 4s ease-in-out infinite" }}>
              {/* Soft glow halo */}
              <div className="absolute inset-0 rounded-full blur-2xl opacity-60"
                style={{
                  background: "radial-gradient(circle, #A78BFA 0%, transparent 70%)",
                  animation: "brain-pulse 3s ease-in-out infinite",
                }} />

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

                  {/* === BUDDHA OUTLINE: face + topknot + ears === */}
                  <g filter="url(#buddhaNeon)" stroke="#A78BFA" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    {/* Topknot flame (ushnisha) */}
                    <path d="M 50 4 L 47 12 Q 50 14, 53 12 L 50 4 Z" />
                    {/* Topknot bun */}
                    <ellipse cx="50" cy="20" rx="7" ry="6" />
                    {/* Head dome */}
                    <path d="M 50 26
                             C 33 26, 24 38, 24 56
                             C 24 70, 28 80, 34 86
                             L 36 88
                             C 38 96, 42 102, 46 105
                             C 48 106, 52 106, 54 105
                             C 58 102, 62 96, 64 88
                             L 66 86
                             C 72 80, 76 70, 76 56
                             C 76 38, 67 26, 50 26 Z" />
                    {/* Ears (extended buddha-style) */}
                    <path d="M 26 60 C 22 62, 21 70, 24 76 C 26 80, 30 80, 32 78" />
                    <path d="M 74 60 C 78 62, 79 70, 76 76 C 74 80, 70 80, 68 78" />
                    {/* Bindi / third eye dot */}
                    <circle cx="50" cy="64" r="1.2" fill="#A78BFA" stroke="none" />
                    {/* Eyes — closed, gentle curves */}
                    <path d="M 38 73 Q 42 70, 46 73" />
                    <path d="M 54 73 Q 58 70, 62 73" />
                    {/* Nose */}
                    <path d="M 50 78 L 47 90 Q 47 92, 50 92" />
                    {/* Mouth — slight serene smile */}
                    <path d="M 44 99 Q 50 102, 56 99" />
                    {/* Lower lip line */}
                    <path d="M 46 102 Q 50 104, 54 102" opacity="0.6" />
                  </g>

                  {/* === NEURAL NETWORK on the upper skull (small, dense) === */}
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

                  {/* === GLOWING NODES === */}
                  <g filter="url(#buddhaNodes)">
                    {[
                      { cx: 40, cy: 36, r: 1.1 },
                      { cx: 46, cy: 40, r: 1.2 },
                      { cx: 50, cy: 34, r: 1.4 },
                      { cx: 54, cy: 40, r: 1.2 },
                      { cx: 60, cy: 36, r: 1.1 },
                      { cx: 36, cy: 44, r: 1.0 },
                      { cx: 42, cy: 46, r: 1.0 },
                      { cx: 50, cy: 44, r: 1.3 },
                      { cx: 58, cy: 46, r: 1.0 },
                      { cx: 64, cy: 44, r: 1.0 },
                      { cx: 34, cy: 52, r: 0.9 },
                      { cx: 40, cy: 54, r: 1.0 },
                      { cx: 46, cy: 56, r: 1.0 },
                      { cx: 54, cy: 56, r: 1.0 },
                      { cx: 60, cy: 54, r: 1.0 },
                      { cx: 66, cy: 52, r: 0.9 },
                    ].map((n, i) => (
                      <circle key={i} cx={n.cx} cy={n.cy} r={n.r} fill="#FFFFFF"
                        style={{ filter: `drop-shadow(0 0 2.5px #A78BFA)` }}>
                        <animate attributeName="opacity"
                          values="0.55;1;0.55"
                          dur={`${1.8 + (i % 5) * 0.4}s`}
                          repeatCount="indefinite"
                          begin={`${(i * 0.13) % 3}s`} />
                      </circle>
                    ))}
                  </g>

                  {/* Holographic projection base */}
                  <ellipse cx="50" cy="124" rx="22" ry="1.8" fill="#A78BFA" opacity="0.5"
                    style={{ filter: "blur(2px)" }} />
                  <ellipse cx="50" cy="125" rx="14" ry="0.9" fill="#A78BFA" opacity="0.85"
                    style={{ filter: "blur(0.8px)" }} />
                </svg>
              </div>
            </div>
            <p className="text-xs text-white/40 mt-3 tracking-[0.25em] uppercase">Reprenez le contrôle de votre journée</p>
          </div>
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-light mb-1">Créer un compte</h2>
            <p className="text-xs text-white/40 mb-4">Quelques informations pour commencer</p>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Prénom" value={signupForm.firstName}
                onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
              <input type="text" placeholder="Nom" value={signupForm.lastName}
                onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block ml-1">Date de naissance</label>
              <input type="date" value={signupForm.birthDate}
                onChange={(e) => setSignupForm({ ...signupForm, birthDate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
            </div>
            <input type="email" placeholder="Adresse mail" value={signupForm.email}
              onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
            <button onClick={handleSignup}
              disabled={!signupForm.firstName || !signupForm.lastName || !signupForm.birthDate || !signupForm.email}
              className="w-full mt-4 py-3.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition disabled:opacity-30 disabled:cursor-not-allowed">
              Créer mon compte
            </button>
            <p className="text-[11px] text-white/40 text-center mt-3">
              ✨ 7 jours d'essai gratuit · sans carte bancaire
            </p>
            <p className="text-[10px] text-white/30 text-center mt-1">
              3,99 € / mois ensuite · sans engagement
            </p>
          </div>

          {/* === EPHEMERAL BETA BYPASS BUTTON === */}
          <button
            onClick={() => {
              setUser({
                firstName: "Bêta",
                lastName: "Testeur",
                birthDate: "1990-01-01",
                email: "beta@focus.app",
                city: "",
                photo: null,
                bio: "",
                trialStart: Date.now(),
                isSubscribed: false,
              });
              setTutorialStep(0);
            }}
            className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-yellow-400/30 text-[11px] text-yellow-300/80 hover:bg-yellow-400/5 hover:border-yellow-400/50 transition flex items-center justify-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Accès bêta · entrer sans inscription
          </button>

          <footer className="mt-8 text-center">
            <p className="text-[10px] text-white/25 tracking-[0.15em] uppercase">propulsé par</p>
            <p className="mt-1 text-sm font-bold tracking-[0.08em]"
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.45) 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              DIGIT'ARK<span style={{ WebkitTextFillColor: "rgba(255,255,255,0.85)" }}>.</span>
            </p>
          </footer>
        </div>
      </div>
    );
  }

  // ============================================================
  // === FOCUS MODE ===
  // ============================================================
  if (focusMode) {
    const bigRadius = 160;
    const bigCircumference = 2 * Math.PI * bigRadius;
    const bigOffset = bigCircumference - (progress / 100) * bigCircumference;
    const accent = currentTask?.color || dayTheme.accent;
    const activeSound = activeAmbient
      ? AMBIENT_SOUNDS.find(s => s.id === activeAmbient)?.name
      : activeCustomTrack ? customTracks.find(t => t.id === activeCustomTrack)?.name : null;
    return (
      <div className="fixed inset-0 bg-neutral-950 text-white flex flex-col items-center justify-center z-50 overflow-hidden"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
            style={{ background: accent }} />
        </div>
        <button onClick={() => setFocusMode(false)}
          className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/5 backdrop-blur flex items-center justify-center hover:bg-white/10 transition z-10">
          <X size={18} />
        </button>
        {activeSound && (
          <div className="absolute top-6 left-6 px-3 py-2 rounded-full bg-white/5 backdrop-blur border border-white/10 flex items-center gap-2 text-xs">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
            <span className="text-white/70 truncate max-w-[160px]">{activeSound}</span>
          </div>
        )}
        <div className="relative w-[360px] h-[360px]">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 360 360">
            <circle cx="180" cy="180" r={bigRadius} stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" />
            {currentTask && (
              <circle cx="180" cy="180" r={bigRadius} stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round"
                strokeDasharray={bigCircumference} strokeDashoffset={bigOffset}
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.6s ease",
                  filter: `drop-shadow(0 0 12px ${accent}80)` }} />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {currentTask ? (
              <>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">{currentTask.name}</p>
                <div className="text-7xl font-extralight font-mono tabular-nums tracking-tight" style={{ color: accent }}>
                  {formatTime(remainingSec)}
                </div>
                <div className="text-3xl font-light mt-3 text-white/70 tabular-nums">{Math.round(progress)}%</div>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">en attente</p>
                <div className="text-5xl font-extralight text-white/40">—</div>
              </>
            )}
          </div>
        </div>
        {nextTask && (
          <p className="absolute bottom-12 text-xs text-white/30 tracking-widest uppercase">
            Ensuite · {nextTask.name}
          </p>
        )}
      </div>
    );
  }

  // ============================================================
  // === MEDITATION OVERLAY ===
  // ============================================================
  if (activeMeditation) {
    const med = MEDITATIONS.find(m => m.id === activeMeditation);
    return (
      <div className="fixed inset-0 bg-neutral-950 text-white flex flex-col items-center justify-center z-50 overflow-hidden"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse"
            style={{ background: med.color, animationDuration: "4s" }} />
        </div>
        <button onClick={() => setActiveMeditation(null)}
          className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/5 backdrop-blur flex items-center justify-center hover:bg-white/10 transition z-10">
          <X size={18} />
        </button>
        <div className="relative z-10 text-center px-8 max-w-md">
          <med.icon size={48} style={{ color: med.color }} className="mx-auto mb-6" />
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">Méditation guidée</p>
          <h2 className="text-3xl font-light mb-2">{med.name}</h2>
          <p className="text-sm text-white/50 mb-1">{med.description}</p>
          <p className="text-xs text-white/30 mb-10">{med.duration} min</p>
          <div className="relative w-48 h-48 mx-auto mb-10">
            <div className="absolute inset-0 rounded-full border-2 animate-pulse"
              style={{ borderColor: med.color + "60", animationDuration: "4s" }} />
            <div className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{ background: `radial-gradient(circle, ${med.color}30 0%, transparent 70%)` }}>
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">respirez</p>
                <p className="text-lg font-light" style={{ color: med.color }}>en suivant le cercle</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-white/60 italic mb-8 leading-relaxed">"{med.script}"</p>
          <button onClick={() => setActiveMeditation(null)}
            className="px-8 py-3 rounded-full bg-white text-black text-sm font-medium hover:scale-105 transition">
            Terminer la séance
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // === STATS PAGE ===
  // ============================================================
  if (showStats) {
    const { stats, topCategories, totalWeekTasks, totalWeekMinutes, avgCompletion, bestDay } = computeStats();
    const maxBar = Math.max(...stats.map(s => s.totalMinutes), 1);
    return (
      <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl"
            style={{ background: dayTheme.glow }} />
        </div>
        <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-8">
          <header className="flex items-center justify-between mb-8">
            <button onClick={() => setShowStats(false)}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-lg font-light">Statistiques</h2>
            <div className="w-10" />
          </header>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider mb-2">
                <TrendingUp size={12} /> Taux d'accomplissement
              </div>
              <p className="text-3xl font-extralight" style={{ color: dayTheme.accent }}>
                {Math.round(avgCompletion) || 0}<span className="text-lg text-white/40">%</span>
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider mb-2">
                <CheckCircle2 size={12} /> Tâches semaine
              </div>
              <p className="text-3xl font-extralight">{totalWeekTasks}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider mb-2">
                <Clock size={12} /> Temps planifié
              </div>
              <p className="text-3xl font-extralight">
                {Math.floor(totalWeekMinutes / 60)}<span className="text-lg text-white/40">h</span>
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider mb-2">
                <Award size={12} /> Meilleur jour
              </div>
              <p className="text-2xl font-light" style={{ color: bestDay.accent }}>{bestDay.short}</p>
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5">Volume par jour</h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {stats.map((s) => {
                const height = s.totalMinutes > 0 ? (s.totalMinutes / maxBar) * 100 : 4;
                return (
                  <div key={s.idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-[10px] text-white/40 font-mono">
                      {s.totalMinutes > 0 ? `${Math.floor(s.totalMinutes / 60)}h` : ""}
                    </div>
                    <div className="w-full rounded-t-lg transition-all"
                      style={{ height: `${height}%`,
                        background: `linear-gradient(180deg, ${s.accent}cc 0%, ${s.accent}40 100%)`,
                        minHeight: "4px" }} />
                    <p className="text-[10px] uppercase tracking-wider text-white/50">{s.short}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5">Accomplissement par jour</h3>
            <div className="space-y-3">
              {stats.map((s) => (
                <div key={s.idx} className="flex items-center gap-3">
                  <span className="text-xs text-white/50 w-10">{s.short}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${s.completion}%`, background: s.accent }} />
                  </div>
                  <span className="text-xs font-mono tabular-nums w-10 text-right" style={{ color: s.accent }}>
                    {s.completion}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5">Activités principales</h3>
            <div className="space-y-3">
              {topCategories.length === 0 ? (
                <p className="text-sm text-white/40 italic">Pas encore de données</p>
              ) : (
                topCategories.map(([name, mins], idx) => {
                  const colors = ["#A78BFA", "#60A5FA", "#34D399", "#FBBF24", "#F472B6"];
                  return (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: colors[idx] }} />
                        <span className="text-sm">{name}</span>
                      </div>
                      <span className="text-xs text-white/50 font-mono">
                        {Math.floor(mins / 60)}h {mins % 60}min
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <p className="text-[11px] text-white/30 text-center mb-6 italic">
            Calculs locaux, sans serveur.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // === PROFILE ===
  // ============================================================
  if (showProfile) {
    const draft = profileDraft || user;
    return (
      <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl"
            style={{ background: dayTheme.glow }} />
        </div>
        <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-8">
          <header className="flex items-center justify-between mb-8">
            <button onClick={() => { setShowProfile(false); setProfileDraft(null); }}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-lg font-light">Mon profil</h2>
            <div className="w-10" />
          </header>
          <div className="flex flex-col items-center mb-8">
            <label className="relative cursor-pointer group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 flex items-center justify-center"
                style={{ borderColor: dayTheme.accent + "60", background: "rgba(255,255,255,0.05)" }}>
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
                <input type="text" value={draft.firstName}
                  onChange={(e) => setProfileDraft({ ...draft, firstName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block ml-1">Nom</label>
                <input type="text" value={draft.lastName}
                  onChange={(e) => setProfileDraft({ ...draft, lastName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 ml-1 flex items-center gap-1.5">
                <Calendar size={11} /> Date de naissance · {calcAge(draft.birthDate)} ans
              </label>
              <input type="date" value={draft.birthDate}
                onChange={(e) => setProfileDraft({ ...draft, birthDate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 ml-1 flex items-center gap-1.5">
                <Mail size={11} /> Adresse mail
              </label>
              <input type="email" value={draft.email}
                onChange={(e) => setProfileDraft({ ...draft, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 ml-1 flex items-center gap-1.5">
                <MapPin size={11} /> Ville
              </label>
              <input type="text" placeholder="Paris, Lyon, Marseille..." value={draft.city || ""}
                onChange={(e) => setProfileDraft({ ...draft, city: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 ml-1 flex items-center gap-1.5">
                <Sparkles size={11} /> Bio
              </label>
              <textarea placeholder="Quelques mots sur vous..." value={draft.bio || ""}
                onChange={(e) => setProfileDraft({ ...draft, bio: e.target.value })} rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 resize-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={() => { setShowProfile(false); setProfileDraft(null); }}
              className="flex-1 py-3 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition">Annuler</button>
            <button onClick={() => { setUser(draft); setShowProfile(false); setProfileDraft(null); }}
              className="flex-1 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition">Enregistrer</button>
          </div>
          <button onClick={() => setUser(null)}
            className="w-full mt-3 py-3 rounded-xl text-sm text-red-400/80 hover:bg-red-500/10 transition flex items-center justify-center gap-2">
            <LogOut size={14} /> Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // === MY BRAIN PAGE ===
  // ============================================================
  if (showBrain) {
    // If user is previewing a specific cycle (beta tester mode), simulate that many days
    const displayedDays = brainPreviewCycle !== null
      ? brainPreviewCycle * BRAIN_CYCLE_DAYS
      : brainTotalDays;
    const { nodes, links } = generateBrainGeometry(displayedDays);
    const displayedCycleIdx = Math.floor(displayedDays / BRAIN_CYCLE_DAYS) - (displayedDays > 0 && displayedDays % BRAIN_CYCLE_DAYS === 0 ? 1 : 0);
    const displayedDayInCycle = displayedDays === 0 ? 0 : ((displayedDays - 1) % BRAIN_CYCLE_DAYS) + 1;
    const displayedCycleProgress = displayedDays === 0 ? 0 : ((displayedDays - 1) % BRAIN_CYCLE_DAYS) / BRAIN_CYCLE_DAYS;
    const displayedColor = BRAIN_CYCLE_COLORS[Math.max(0, displayedCycleIdx) % BRAIN_CYCLE_COLORS.length];
    const totalCycles = Math.max(1, displayedCycleIdx + 1);
    const isNewCycleStart = displayedDayInCycle === 0 && displayedDays > 0;

    return (
      <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        {/* Atmospheric glow background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ background: displayedColor }} />
        </div>

        <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <button onClick={() => { setShowBrain(false); setBrainPreviewCycle(null); }}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-lg font-light">Mon cerveau</h2>
            <div className="w-10" />
          </header>

          {/* Preview banner if in beta-test mode */}
          {brainPreviewCycle !== null && (
            <div className="mb-4 px-3 py-2 rounded-xl border border-yellow-400/30 bg-yellow-400/5 flex items-center justify-between">
              <span className="text-[11px] text-yellow-300/80">
                🧪 Aperçu cycle {brainPreviewCycle} (bêta)
              </span>
              <button onClick={() => setBrainPreviewCycle(null)}
                className="text-[10px] text-yellow-300/60 hover:text-yellow-300 underline">
                Quitter l'aperçu
              </button>
            </div>
          )}

          {/* Cycle indicator */}
          <div className="text-center mb-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">
              Cycle {Math.max(1, displayedCycleIdx + 1)} sur 12
            </p>
            <p className="text-2xl font-extralight" style={{ color: displayedColor }}>
              {displayedDays === 0
                ? "Pas encore commencé"
                : `Jour ${displayedDayInCycle} / ${BRAIN_CYCLE_DAYS}`}
            </p>
          </div>

          {/* The brain visualization — face with neon outline */}
          <div className="relative aspect-square mb-6 rounded-3xl overflow-hidden"
            style={{
              background: "radial-gradient(circle at center, rgba(15,15,22,1) 0%, rgba(5,5,8,1) 100%)",
              border: `1px solid ${displayedColor}30`,
            }}>
            {/* Soft halo behind the head */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-3/4 rounded-full blur-3xl opacity-25"
                style={{ background: displayedColor }} />
            </div>

            <svg viewBox="0 0 200 220" className="relative w-full h-full">
              <defs>
                {/* Strong glow filter for neon effect */}
                <filter id="neonGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* === HEAD: front-facing minimal neon outline === */}
              <g filter="url(#neonGlow)" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* Skull / face outline (oval head with chin and ears bumps) */}
                <path d="M 100 18
                         C 70 18, 48 32, 44 60
                         C 42 72, 44 88, 50 102
                         L 50 114
                         C 46 116, 44 122, 46 128
                         C 48 134, 53 136, 56 134
                         L 58 138
                         C 60 152, 68 168, 78 176
                         C 80 178, 78 184, 82 186
                         C 88 192, 96 194, 100 194
                         C 104 194, 112 192, 118 186
                         C 122 184, 120 178, 122 176
                         C 132 168, 140 152, 142 138
                         L 144 134
                         C 147 136, 152 134, 154 128
                         C 156 122, 154 116, 150 114
                         L 150 102
                         C 156 88, 158 72, 156 60
                         C 152 32, 130 18, 100 18 Z" />

                {/* Closed eyes — gentle curves */}
                <path d="M 73 88 Q 80 84, 88 88" />
                <path d="M 112 88 Q 120 84, 127 88" />

                {/* Nose — thin elegant line */}
                <path d="M 100 95 L 96 125 Q 96 130, 102 130" />

                {/* Mouth — slight smile */}
                <path d="M 88 152 Q 100 156, 112 152" />

                {/* Lower lip line */}
                <path d="M 92 158 Q 100 162, 108 158" opacity="0.6" />
              </g>

              {/* === NEURAL NETWORK in the upper skull === */}
              {/* Links between nodes */}
              <g>
                {links.map((link, i) => {
                  const from = nodes[link.from];
                  const to = nodes[link.to];
                  if (!from || !to) return null;
                  return (
                    <line key={`l${i}`}
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke={link.color}
                      strokeWidth={link.isBridge ? "0.7" : "0.45"}
                      opacity={link.isBridge ? "0.85" : "0.6"}
                      style={{ filter: `drop-shadow(0 0 1.5px ${link.color})` }}
                    />
                  );
                })}
              </g>

              {/* Brain nodes (synapses) */}
              <g filter="url(#nodeGlow)">
                {nodes.map((node, i) => (
                  <circle key={`n${i}`}
                    cx={node.x} cy={node.y}
                    r={node.size}
                    fill={node.color}
                    style={{ filter: `drop-shadow(0 0 3px ${node.color})` }}
                  >
                    <animate attributeName="opacity"
                      values="0.55;1;0.55"
                      dur={`${2 + (i % 4) * 0.5}s`}
                      repeatCount="indefinite"
                      begin={`${node.twinkleDelay}s`} />
                  </circle>
                ))}
              </g>

              {/* Holographic projection base — purple glow ellipse below the head */}
              <ellipse cx="100" cy="210" rx="50" ry="3"
                fill={displayedColor}
                opacity="0.55"
                style={{ filter: "blur(3px)" }} />
              <ellipse cx="100" cy="211" rx="30" ry="1.5"
                fill={displayedColor}
                opacity="0.9"
                style={{ filter: "blur(1px)" }} />
            </svg>

            {/* Empty-state message */}
            {displayedDays === 0 && (
              <div className="absolute inset-x-0 bottom-12 text-center px-6">
                <p className="text-xs text-white/40 italic leading-relaxed">
                  Validez au moins 80% de vos tâches aujourd'hui<br/>
                  pour activer votre première connexion.
                </p>
              </div>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            <div className="rounded-xl p-3 border text-center"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-1">Jours</p>
              <p className="text-xl font-light font-mono tabular-nums" style={{ color: displayedColor }}>
                {displayedDays}
              </p>
            </div>
            <div className="rounded-xl p-3 border text-center"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-1">Connexions</p>
              <p className="text-xl font-light font-mono tabular-nums">
                {nodes.length + links.length}
              </p>
            </div>
            <div className="rounded-xl p-3 border text-center"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-1">Cycles</p>
              <p className="text-xl font-light font-mono tabular-nums">
                {totalCycles}<span className="text-white/30 text-sm">/12</span>
              </p>
            </div>
          </div>

          {/* Cycle progress bar */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                Progression du cycle
              </p>
              <p className="text-xs font-mono tabular-nums" style={{ color: displayedColor }}>
                {Math.round(displayedCycleProgress * 100)}%
              </p>
            </div>
            <div className="relative h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
              <div className="absolute inset-y-0 left-0 rounded-full transition-all"
                style={{
                  width: `${displayedCycleProgress * 100}%`,
                  background: displayedColor,
                  boxShadow: `0 0 10px ${displayedColor}`,
                }} />
            </div>
            <p className="text-[11px] text-white/40 mt-2 italic">
              {displayedDays === 0 && "Chaque journée validée fait grandir votre cerveau."}
              {displayedDays > 0 && displayedCycleProgress < 0.5 && "Vous bâtissez vos premières habitudes. Continuez."}
              {displayedCycleProgress >= 0.5 && displayedCycleProgress < 1 && "Plus que quelques jours pour terminer ce cycle."}
              {isNewCycleStart && "Nouveau cycle ✨ Une nouvelle couleur, de nouvelles connexions."}
            </p>
          </div>

          {/* Cycle legend (colors of completed/current cycles) */}
          <div className="rounded-2xl border p-4 mb-4"
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3">
              Vos cycles
            </p>
            <div className="flex flex-wrap gap-2">
              {[...Array(12)].map((_, i) => {
                const isCompleted = i < displayedCycleIdx;
                const isCurrent = i === displayedCycleIdx && displayedDays > 0;
                const isLocked = i > displayedCycleIdx || displayedDays === 0;
                const c = BRAIN_CYCLE_COLORS[i];
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center"
                      style={{
                        background: isLocked ? "rgba(255,255,255,0.03)" : c + "30",
                        borderColor: isLocked ? "rgba(255,255,255,0.1)" : c,
                        boxShadow: isCurrent ? `0 0 12px ${c}` : "none",
                      }}>
                      {isCompleted && <Check size={10} style={{ color: c }} />}
                      {isCurrent && (
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ background: c }} />
                      )}
                    </div>
                    <p className="text-[8px] text-white/30 font-mono tabular-nums">
                      {i + 1}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* === BETA TESTERS: cycle preview buttons === */}
          <div className="rounded-2xl border-2 border-dashed border-yellow-400/30 bg-yellow-400/[0.03] p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🧪</span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-yellow-300/80">
                Aperçu bêta · à supprimer en prod
              </p>
            </div>
            <p className="text-[11px] text-white/50 mb-3 leading-relaxed">
              Visualisez à quoi ressemblera le cerveau après chaque cycle complet.
            </p>
            <div className="grid grid-cols-6 gap-1.5">
              {[...Array(12)].map((_, i) => {
                const cycleNum = i + 1;
                const c = BRAIN_CYCLE_COLORS[i];
                const isActive = brainPreviewCycle === cycleNum;
                return (
                  <button
                    key={i}
                    onClick={() => setBrainPreviewCycle(cycleNum)}
                    className="aspect-square rounded-lg border text-[11px] font-mono tabular-nums transition hover:scale-105"
                    style={{
                      background: isActive ? c + "30" : "rgba(255,255,255,0.02)",
                      borderColor: isActive ? c : c + "40",
                      color: isActive ? c : "rgba(255,255,255,0.6)",
                      boxShadow: isActive ? `0 0 12px ${c}80` : "none",
                    }}
                  >
                    {cycleNum}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-white/30 italic mt-3 text-center">
              Chaque bouton = {BRAIN_CYCLE_DAYS} jours validés × le cycle choisi
            </p>
          </div>

          <p className="text-[11px] text-white/30 text-center italic px-4 leading-relaxed">
            Un cycle = 28 jours. Le temps qu'il faut pour ancrer une habitude.
            <br/>Chaque journée validée à 80% ou plus active une nouvelle connexion.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // === CUSTOMIZATION PAGE ===
  // ============================================================
  if (showCustomization) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ background: dayTheme.glow }} />
        </div>

        <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <button onClick={() => setShowCustomization(false)}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-lg font-light">Personnalisation</h2>
            <div className="w-10" />
          </header>

          <p className="text-sm text-white/60 text-center mb-8 leading-relaxed">
            Choisissez l'ambiance visuelle qui vous ressemble.
            <br />
            Chaque thème redéfinit les couleurs des 7 jours de la semaine.
          </p>

          {/* Theme cards */}
          <div className="space-y-3 mb-6">
            {Object.entries(CUSTOM_THEMES).map(([key, theme]) => {
              const isActive = customTheme === key;
              return (
                <button
                  key={key}
                  onClick={() => setCustomTheme(key)}
                  className="w-full text-left rounded-2xl border p-4 transition hover:scale-[1.01]"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${theme.colors[0]}20 0%, ${theme.colors[3]}10 100%)`
                      : "rgba(255,255,255,0.025)",
                    borderColor: isActive ? theme.colors[0] + "60" : "rgba(255,255,255,0.08)",
                    boxShadow: isActive ? `0 8px 32px ${theme.colors[0]}30` : "none",
                  }}
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex-1">
                      <p className="text-base font-medium">{theme.label}</p>
                      <p className="text-xs text-white/50 mt-0.5">{theme.description}</p>
                    </div>
                    {isActive && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: theme.colors[0] }}>
                        <Check size={12} className="text-black" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Color preview — 7 dots, one per day */}
                  <div className="flex gap-1.5 mt-3">
                    {theme.colors.map((c, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="w-full h-7 rounded-md"
                          style={{
                            background: `linear-gradient(135deg, ${c} 0%, ${c}99 100%)`,
                            boxShadow: isActive ? `0 0 12px ${c}60` : "none",
                          }} />
                        <p className="text-[8px] uppercase tracking-wider text-white/40">
                          {DAY_NAMES[i].short}
                        </p>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-white/30 text-center italic px-4 leading-relaxed">
            Les thèmes ne modifient pas les couleurs de votre cerveau ni des catégories de tâches —
            <br />
            uniquement l'ambiance générale de l'application.
          </p>

          <p className="text-[10px] text-white/20 text-center mt-8 italic">
            Plus de personnalisation arrivera dans une prochaine mise à jour.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // === SUBSCRIPTION PAGE ===
  // ============================================================
  if (showSubscription || trialExpired) {
    const forced = trialExpired; // can't go back if trial expired

    return (
      <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: dayTheme.glow }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-50"
            style={{ background: dayTheme.accent }} />
        </div>

        <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            {!forced ? (
              <button onClick={() => setShowSubscription(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
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

          {/* === ALREADY SUBSCRIBED === */}
          {user.isSubscribed ? (
            <>
              <div className="rounded-3xl border p-6 mb-6"
                style={{ borderColor: dayTheme.accent + "40",
                  background: `linear-gradient(135deg, ${dayTheme.accent}15 0%, transparent 100%)` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: dayTheme.accent + "30" }}>
                    <CheckCircle2 size={20} style={{ color: dayTheme.accent }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-0.5">Abonnement</p>
                    <p className="text-base font-medium" style={{ color: dayTheme.accent }}>Actif</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Plan</span>
                    <span>Focus mensuel</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Tarif</span>
                    <span>3,99 € / mois</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Engagement</span>
                    <span>Aucun</span>
                  </div>
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
              {/* === TRIAL STATUS / VALUE PROP === */}
              <div className="rounded-3xl border p-6 mb-5"
                style={{ borderColor: dayTheme.accent + "40",
                  background: `linear-gradient(135deg, ${dayTheme.accent}15 0%, transparent 100%)`,
                  boxShadow: `0 20px 60px ${dayTheme.accent}20` }}>
                {forced ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                      Essai terminé
                    </p>
                    <h3 className="text-2xl font-light mb-1">
                      Continuons ensemble
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      Votre essai gratuit de 7 jours est terminé.
                      Activez votre abonnement pour continuer à utiliser Focus.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                      Essai gratuit · {trialDaysLeft} {trialDaysLeft > 1 ? "jours" : "jour"} restant{trialDaysLeft > 1 ? "s" : ""}
                    </p>
                    <h3 className="text-2xl font-light mb-1">
                      Activer mon abonnement
                    </h3>
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

              {/* === PAYMENT FORM === */}
              <div className="space-y-3 mb-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 ml-1">
                  Informations de paiement
                </p>

                <input
                  type="text"
                  placeholder="Nom sur la carte"
                  value={paymentForm.name}
                  onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-white/30"
                />

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Numéro de carte"
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
                    type="text"
                    inputMode="numeric"
                    placeholder="MM / AA"
                    value={paymentForm.expiry}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      const formatted = v.length > 2 ? `${v.slice(0, 2)} / ${v.slice(2)}` : v;
                      setPaymentForm({ ...paymentForm, expiry: formatted });
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-white/30 font-mono tabular-nums"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="CVC"
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

  // ============================================================
  // === MAIN APP ===
  // ============================================================
  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{`
        @keyframes float-up { 0% { transform: translateY(0) scale(1); opacity: 0.9; } 100% { transform: translateY(-18px) scale(0.3); opacity: 0; } }
        @keyframes shimmer-edge { 0%, 100% { opacity: 0.6; transform: scaleY(1); } 50% { opacity: 1; transform: scaleY(1.15); } }
        @keyframes goal-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes goal-pop { 0% { transform: scale(1); } 50% { transform: scale(1.04); } 100% { transform: scale(1); } }
        @keyframes breath {
          0%, 100% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes burst-fade {
          0% { transform: scale(0.4); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes check-pop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes confetti-out {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          20% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes particle-pulse {
          0%, 100% { transform: scale(0.6) translate(0, 0); opacity: 0.4; }
          50% { transform: scale(1.3) translate(2px, -2px); opacity: 1; }
        }
        @keyframes brain-rotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes hologram-flicker {
          0%, 100% { opacity: 0.95; }
          47% { opacity: 0.95; }
          48% { opacity: 0.65; }
          49% { opacity: 0.9; }
          50% { opacity: 0.55; }
          51% { opacity: 0.95; }
          80% { opacity: 0.85; }
        }
        @keyframes hologram-color {
          0% { filter: hue-rotate(0deg) drop-shadow(0 0 20px #A78BFA); }
          25% { filter: hue-rotate(60deg) drop-shadow(0 0 25px #60A5FA); }
          50% { filter: hue-rotate(180deg) drop-shadow(0 0 25px #34D399); }
          75% { filter: hue-rotate(280deg) drop-shadow(0 0 25px #F472B6); }
          100% { filter: hue-rotate(360deg) drop-shadow(0 0 20px #A78BFA); }
        }
        @keyframes hologram-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes brain-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes brain-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes solar-breathe {
          0%, 100% { opacity: 0.85; transform: scale(1) translateX(-50%); }
          50% { opacity: 1; transform: scale(1.06) translateX(-47%); }
        }
        @keyframes solar-rays {
          0% { transform: translateX(-50%) rotate(0deg); }
          100% { transform: translateX(-50%) rotate(360deg); }
        }
        @keyframes solar-shimmer {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* ── SOLAR AMBIANCE LAYER (pointer-events-none, behind everything) ── */}
      {solar.glowIntensity > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0"
          style={{ transition: "opacity 4s ease-in-out" }}>

          {/* Primary halo — large diffuse glow at sun position */}
          <div className="absolute left-1/2 w-[140vw] max-w-[700px]"
            style={{
              top: `${solar.sunY - 18}%`,
              height: "55vw",
              maxHeight: "340px",
              transform: "translateX(-50%)",
              background: solar.bgGradient,
              transition: "top 180s linear, background 900s linear",
              filter: "blur(2px)",
            }} />

          {/* Core glow — smaller, brighter center */}
          <div
            className="absolute left-1/2"
            style={{
              top: `${solar.sunY}%`,
              width: "60vw",
              maxWidth: "320px",
              height: "32vw",
              maxHeight: "200px",
              transform: "translateX(-50%) translateY(-50%)",
              background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${solar.glowColor} 0%, transparent 70%)`,
              opacity: solar.coreOpacity,
              filter: "blur(32px)",
              transition: "top 180s linear, opacity 900s linear",
              animation: "solar-breathe 8s ease-in-out infinite",
            }} />

          {/* Lens flare streak — ultra-thin horizontal line at sun level */}
          {solar.coreOpacity > 0.15 && (
            <div className="absolute left-0 right-0"
              style={{
                top: `${solar.sunY}%`,
                height: "1px",
                background: `linear-gradient(90deg, transparent 0%, ${solar.glowColor} 30%, rgba(255,255,255,${solar.coreOpacity * 0.4}) 50%, ${solar.glowColor} 70%, transparent 100%)`,
                opacity: solar.coreOpacity * 0.6,
                filter: "blur(1px)",
                animation: "solar-shimmer 6s ease-in-out infinite",
                animationDelay: "2s",
              }} />
          )}

          {/* Soft screen-tint — full-screen very subtle warm/cool cast */}
          <div className="absolute inset-0"
            style={{
              background: solar.phase === "dawn" || solar.phase === "sunset"
                ? `linear-gradient(180deg, rgba(251,146,60,${solar.glowIntensity * 0.07}) 0%, transparent 40%)`
                : solar.phase === "morning" || solar.phase === "midday"
                ? `linear-gradient(180deg, rgba(253,230,138,${solar.glowIntensity * 0.05}) 0%, transparent 35%)`
                : "transparent",
              transition: "background 900s linear",
            }} />
        </div>
      )}

      {/* Day-theme glow (existing, kept underneath solar) */}
      <div className="absolute inset-0 opacity-50 pointer-events-none transition-all duration-1000 z-0">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl transition-all duration-1000"
          style={{ background: dayTheme.glow }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{ background: currentTask ? currentTask.color : dayTheme.accent }} />
      </div>

      {isRunning && currentTask && (
        <div className="relative z-10 bg-black/60 backdrop-blur-xl border-b border-white/5 px-5 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: currentTask.color }} />
            <span className="font-medium tracking-wide">{currentTask.name}</span>
          </div>
          <div className="font-mono tabular-nums text-white/80">{formatTime(remainingSec)} restant</div>
        </div>
      )}

      <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-8">
        {/* HEADER — minimal: logo + avatar only */}
        <header className="flex items-start justify-between mb-8">
          <button
            onClick={() => {
              const now = Date.now();
              if (now - logoTapsRef.current.lastTap < 600) {
                logoTapsRef.current.count++;
              } else {
                logoTapsRef.current.count = 1;
              }
              logoTapsRef.current.lastTap = now;
              if (logoTapsRef.current.count >= 5) {
                logoTapsRef.current.count = 0;
                toggleDemo();
              }
            }}
            className="text-left"
          >
            <h1 className="text-4xl font-light tracking-tight leading-none">
              focus<span style={{ color: dayTheme.accent }}>.</span>
            </h1>
            <p className="text-xs text-white/40 mt-2 tracking-widest uppercase">
              {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </button>

          <button onClick={() => setShowMenu(true)}
            data-tour="menu"
            className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition">
            <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-medium"
              style={{ background: dayTheme.accent + "30", border: `1px solid ${dayTheme.accent}40` }}>
              {user.photo ? <img src={user.photo} alt="" className="w-full h-full object-cover" />
              : <span style={{ color: dayTheme.accent }}>{user.firstName?.[0]}{user.lastName?.[0]}</span>}
            </div>
            <ChevronDown size={12} className="text-white/50" />
          </button>
        </header>

        {/* === TRIAL COUNTDOWN BANNER === */}
        {!user.isSubscribed && trialDaysLeft > 0 && (
          <button
            onClick={() => setShowSubscription(true)}
            className="w-full mb-3 px-4 py-2.5 rounded-2xl border flex items-center justify-between gap-3 transition hover:bg-white/[0.04]"
            style={{
              background: "rgba(255,255,255,0.025)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: dayTheme.accent }} />
              <p className="text-xs text-white/70">
                Essai gratuit · <span className="font-medium text-white">{trialDaysLeft} {trialDaysLeft > 1 ? "jours" : "jour"} restant{trialDaysLeft > 1 ? "s" : ""}</span>
              </p>
            </div>
            <span className="text-[11px] font-medium" style={{ color: dayTheme.accent }}>
              Activer →
            </span>
          </button>
        )}

        {/* === MY BRAIN BANNER === */}
        <button
          onClick={() => setShowBrain(true)}
          data-tour="brain"
          className="w-full mb-6 px-4 py-3 rounded-2xl border flex items-center gap-3 transition hover:bg-white/[0.04] group"
          style={{
            background: `linear-gradient(135deg, ${brainCurrentColor}10 0%, transparent 70%)`,
            borderColor: brainCurrentColor + "30",
          }}
        >
          {/* Mini brain preview */}
          <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full blur-md opacity-50"
              style={{ background: brainCurrentColor }} />
            <svg viewBox="0 0 60 60" className="relative w-full h-full">
              {/* Brain outline */}
              <path
                d="M 30 10 C 18 10, 10 16, 10 26 C 8 32, 12 38, 18 42 C 22 46, 26 47, 30 46 C 34 47, 38 46, 42 42 C 48 38, 52 32, 50 26 C 50 16, 42 10, 30 10 Z"
                fill="none"
                stroke={brainCurrentColor}
                strokeWidth="0.8"
                opacity="0.7"
              />
              {/* Mini glowing dots — proportional to total days */}
              {[...Array(Math.min(brainTotalDays, 12))].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const r = 10 + (i % 3) * 3;
                return (
                  <circle key={i}
                    cx={30 + Math.cos(angle) * r}
                    cy={26 + Math.sin(angle) * r * 0.7}
                    r="1.3"
                    fill={BRAIN_CYCLE_COLORS[Math.floor((i / Math.max(brainTotalDays, 1)) * (brainCurrentCycleIdx + 1)) % BRAIN_CYCLE_COLORS.length]}
                  >
                    <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.5 + (i % 3) * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.1}s`} />
                  </circle>
                );
              })}
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 text-left min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-0.5">
              Mon cerveau
            </p>
            <p className="text-sm font-medium" style={{ color: brainCurrentColor }}>
              {brainTotalDays === 0
                ? "Validez votre première journée"
                : `Cycle ${brainCurrentCycleIdx + 1} · Jour ${brainDayInCycle + (brainTotalDays > 0 ? 1 : 0)}/${BRAIN_CYCLE_DAYS}`}
            </p>
          </div>

          {/* Progress bar */}
          {brainTotalDays > 0 && (
            <div className="w-12 h-1 rounded-full overflow-hidden bg-white/10 shrink-0">
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${brainCycleProgress * 100}%`,
                  background: brainCurrentColor,
                  boxShadow: `0 0 6px ${brainCurrentColor}`,
                }} />
            </div>
          )}

          <ChevronRight size={14} className="text-white/40 shrink-0" />
        </button>

        {/* === CONFLICT WARNING BANNER === */}
        {existingConflicts.length > 0 && (
          <div className="mb-6 rounded-2xl border p-4"
            style={{
              background: "linear-gradient(135deg, rgba(248,113,113,0.12) 0%, rgba(248,113,113,0.04) 100%)",
              borderColor: "rgba(248,113,113,0.4)",
            }}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(248,113,113,0.2)", border: "1px solid rgba(248,113,113,0.4)" }}>
                <span className="text-base">⚠️</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-300 mb-1">
                  {existingConflicts.length} conflit{existingConflicts.length > 1 ? "s" : ""} d'horaire détecté{existingConflicts.length > 1 ? "s" : ""}
                </p>
                <div className="space-y-0.5">
                  {existingConflicts.slice(0, 3).map((c, i) => (
                    <p key={i} className="text-[11px] text-white/60">
                      <span style={{ color: c.taskA.color }}>{c.taskA.name}</span>
                      {" "}({c.taskA.start}-{c.taskA.end}) chevauche{" "}
                      <span style={{ color: c.taskB.color }}>{c.taskB.name}</span>
                      {" "}({c.taskB.start}-{c.taskB.end})
                    </p>
                  ))}
                  {existingConflicts.length > 3 && (
                    <p className="text-[11px] text-white/40 italic">
                      …et {existingConflicts.length - 3} autre{existingConflicts.length - 3 > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const ok = autoRepairConflicts();
                if (!ok) {
                  setConflictDialog({
                    type: "repairFailed",
                    message: "Impossible de réparer automatiquement : le décalage nécessaire dépasse minuit.",
                  });
                }
              }}
              className="w-full py-2.5 rounded-xl text-xs font-medium transition hover:scale-[1.01]"
              style={{ background: "rgba(248,113,113,0.25)", color: "#FCA5A5",
                border: "1px solid rgba(248,113,113,0.4)" }}
            >
              Réparer automatiquement
            </button>
          </div>
        )}

        {/* WEEK SELECTOR */}
        <div data-tour="week" className="mb-6 -mx-6 px-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Semaine</p>
            <div className="flex items-center gap-3">
              {selectedDay !== todayIndex() && (
                <button
                  onClick={() => setSelectedDay(todayIndex())}
                  className="text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-white transition flex items-center gap-1"
                >
                  <span className="w-1 h-1 rounded-full" style={{ background: activeDayThemes[todayIndex()].accent }} />
                  Aujourd'hui
                </button>
              )}
              <p className="text-xs text-white/40 italic">{dayTheme.mood}</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
            {activeDayThemes.map((day, idx) => {
              const isSelected = selectedDay === idx;
              const isToday = idx === todayIndex();
              return (
                <button key={idx} onClick={() => setSelectedDay(idx)}
                  className={`shrink-0 snap-start flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all ${
                    isSelected ? "scale-105" : "hover:bg-white/5"}`}
                  style={{
                    background: isSelected ? day.accent + "20" : "rgba(255,255,255,0.03)",
                    borderColor: isSelected ? day.accent + "60" : "rgba(255,255,255,0.08)",
                    boxShadow: isSelected ? `0 0 20px ${day.accent}40` : "none",
                  }}>
                  <span className="text-[10px] uppercase tracking-widest font-medium mb-2"
                    style={{ color: isSelected ? day.accent : "rgba(255,255,255,0.5)" }}>{day.short}</span>
                  {/* Elegant dots representing tasks */}
                  <div className="flex items-center gap-0.5 h-5">
                    {(() => {
                      const count = (weekTasks[idx] || []).length;
                      if (count === 0) {
                        return <div className="w-3 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />;
                      }
                      const dots = Math.min(count, 5);
                      return (
                        <>
                          {[...Array(dots)].map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full"
                              style={{
                                background: isSelected ? day.accent : "rgba(255,255,255,0.5)",
                                opacity: isSelected ? 1 : 0.7,
                              }} />
                          ))}
                          {count > 5 && (
                            <span className="text-[8px] ml-0.5"
                              style={{ color: isSelected ? day.accent : "rgba(255,255,255,0.5)" }}>+</span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  {isToday && <span className="mt-1.5 w-1 h-1 rounded-full" style={{ background: day.accent }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========== GOAL PROGRESS LINES (only when something has progressed) ========== */}
        {(dailyGoal.percent > 0 || weeklyGoal.percent > 0) && (
        <div className="space-y-4 mb-8">
          {/* Daily goal line */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                Progression journée
              </p>
              <p className="text-xs font-mono tabular-nums" style={{ color: dayTheme.accent }}>
                {dailyGoal.percent}<span className="text-white/30">%</span>
                <span className="text-white/30 ml-1.5">· {dailyGoal.done}/{dailyGoal.total}</span>
              </p>
            </div>
            <div className="relative h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${dailyGoal.percent}%`,
                  background: dayTheme.accent,
                  boxShadow: `0 0 10px ${dayTheme.accent}80`,
                  transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
              {dailyGoal.percent > 0 && dailyGoal.percent < 100 && (
                <div
                  className="absolute inset-y-0 w-1/4 pointer-events-none"
                  style={{
                    left: 0,
                    background: `linear-gradient(90deg, transparent 0%, ${dayTheme.accent}80 50%, transparent 100%)`,
                    animation: "goal-shimmer 2.5s ease-in-out infinite",
                  }}
                />
              )}
            </div>
          </div>

          {/* Weekly goal line */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                Progression semaine
              </p>
              <p className="text-xs font-mono tabular-nums text-white/85">
                {weeklyGoal.percent}<span className="text-white/30">%</span>
                <span className="text-white/30 ml-1.5">· {weeklyGoal.done}/{weeklyGoal.total}</span>
              </p>
            </div>
            <div className="relative h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${weeklyGoal.percent}%`,
                  background: "linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 100%)",
                  boxShadow: "0 0 8px rgba(255,255,255,0.4)",
                  transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
              {weeklyGoal.percent > 0 && weeklyGoal.percent < 100 && (
                <div
                  className="absolute inset-y-0 w-1/4 pointer-events-none"
                  style={{
                    left: 0,
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                    animation: "goal-shimmer 3s ease-in-out infinite",
                  }}
                />
              )}
            </div>
          </div>
        </div>
        )}

        {/* AMBIENT SOUND PICKER — only when day is running */}
        {isRunning && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Ambiance sonore</p>
            {(activeAmbient || activeCustomTrack) && (
              <input type="range" min="0" max="1" step="0.05" value={ambientVolume}
                onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                className="w-20 accent-white/60" />
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto -mx-6 px-6 pb-2" style={{ scrollbarWidth: "none" }}>
            {AMBIENT_SOUNDS.map((sound) => {
              const Icon = sound.icon;
              const isActive = activeAmbient === sound.id;
              return (
                <button key={sound.id} onClick={() => activateAmbient(sound.id)}
                  className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all"
                  style={{ background: isActive ? sound.color + "20" : "rgba(255,255,255,0.03)",
                    borderColor: isActive ? sound.color + "60" : "rgba(255,255,255,0.08)" }}>
                  <Icon size={14} style={{ color: isActive ? sound.color : "rgba(255,255,255,0.6)" }} />
                  <span className="text-xs" style={{ color: isActive ? sound.color : "rgba(255,255,255,0.7)" }}>
                    {sound.name}
                  </span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: sound.color }} />}
                </button>
              );
            })}
            {customTracks.map((track) => {
              const isActive = activeCustomTrack === track.id;
              return (
                <div key={track.id} className="shrink-0 flex items-center gap-1 rounded-full border transition-all"
                  style={{ background: isActive ? "#FFFFFF20" : "rgba(255,255,255,0.03)",
                    borderColor: isActive ? "#FFFFFF60" : "rgba(255,255,255,0.08)" }}>
                  <button onClick={() => activateCustom(track.id)}
                    className="flex items-center gap-2 pl-4 pr-2 py-2.5">
                    <Headphones size={14} style={{ color: isActive ? "white" : "rgba(255,255,255,0.6)" }} />
                    <span className="text-xs max-w-[120px] truncate" style={{ color: isActive ? "white" : "rgba(255,255,255,0.7)" }}>
                      {track.name}
                    </span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-white" />}
                  </button>
                  <button onClick={() => removeCustomTrack(track.id)}
                    className="pr-3 text-white/40 hover:text-red-400 transition">
                    <X size={12} />
                  </button>
                </div>
              );
            })}
            <label className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border border-dashed border-white/15 hover:bg-white/5 hover:border-white/30 transition cursor-pointer">
              <Upload size={14} className="text-white/60" />
              <span className="text-xs text-white/70">Ajouter ma musique</span>
              <input type="file" accept="audio/*" multiple className="hidden" onChange={handleMusicUpload} />
            </label>
          </div>
        </div>
        )}

        {demoMode && (
          <div className="mb-6 px-4 py-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-xs text-yellow-200 flex items-center gap-2">
            <Zap size={12} /> Mode démo : chaque tâche dure 30 secondes
          </div>
        )}

        {/* MAIN: only show the running ring when day is running */}
        {(isRunning || pausedAt) && (() => {
          // Calculate countdown to the next task if no task is currently active
          let countdownSec = 0;
          let totalWaitSec = 0;
          if (!currentTask && nextTask) {
            const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
            countdownSec = Math.max(0, Math.floor((toMin(nextTask.start) - nowMin) * 60));
            // Total wait window — capped at 1 hour for visual reference (full ring at 1h+ wait)
            totalWaitSec = Math.min(60 * 60, countdownSec + 1);
          }
          const countdownProgress = totalWaitSec > 0
            ? Math.max(0, ((totalWaitSec - countdownSec) / totalWaitSec) * 100)
            : 0;
          const countdownOffset = circumference - (countdownProgress / 100) * circumference;
          const accent = currentTask ? currentTask.color : (nextTask ? nextTask.color : dayTheme.accent);

          return (
          <div className="flex flex-col items-center mb-3">
            <div className="relative w-72 h-72">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 280 280">
                <circle cx="140" cy="140" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
                {currentTask && (
                  <circle cx="140" cy="140" r={radius} stroke={currentTask.color} strokeWidth="3" fill="none"
                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeOffset}
                    style={{ transition: "stroke-dashoffset 1s linear, stroke 0.6s ease" }} />
                )}
                {/* Countdown ring (when waiting for next task) */}
                {!currentTask && nextTask && !demoMode && (
                  <circle cx="140" cy="140" r={radius} stroke={accent} strokeWidth="2" fill="none"
                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={countdownOffset}
                    style={{
                      transition: "stroke-dashoffset 1s linear",
                      filter: `drop-shadow(0 0 8px ${accent}80)`,
                      opacity: 0.8,
                    }} />
                )}
              </svg>

              {/* === COUNTDOWN PARTICLE FIELD ===
                  1 particle at 0%, hundreds near 100% with exponential growth */}
              {!currentTask && nextTask && !demoMode && (
                <div className="absolute inset-2 rounded-full overflow-hidden pointer-events-none">
                  {(() => {
                    // Exponential growth: 1 → 250 particles
                    // At 0% → 1 ; at 50% → ~30 ; at 90% → ~150 ; at 100% → 250
                    const eased = Math.pow(countdownProgress / 100, 1.8);
                    const particleCount = Math.max(1, Math.floor(1 + eased * 249));
                    const particles = [];
                    for (let i = 0; i < particleCount; i++) {
                      // Stable pseudo-random distribution (deterministic per index)
                      const angle = ((i * 137.508) % 360); // golden angle for even spread
                      const distRatio = 0.05 + ((i * 17) % 90) / 100;
                      const x = 50 + Math.cos(angle * Math.PI / 180) * distRatio * 47;
                      const y = 50 + Math.sin(angle * Math.PI / 180) * distRatio * 47;
                      const size = 1 + ((i * 7) % 4);
                      const duration = 1.5 + ((i * 11) % 30) / 10;
                      const delay = ((i * 13) % 40) / 10;
                      particles.push(
                        <span
                          key={i}
                          className="absolute rounded-full"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            background: accent,
                            boxShadow: `0 0 ${3 + countdownProgress / 10}px ${accent}`,
                            opacity: 0.3 + (countdownProgress / 150),
                            animation: `particle-pulse ${duration}s ease-in-out infinite`,
                            animationDelay: `${delay}s`,
                          }}
                        />
                      );
                    }
                    return particles;
                  })()}
                </div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                {currentTask ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">en cours</p>
                    <h2 className="text-2xl font-light mb-3">{currentTask.name}</h2>
                    <div className="text-5xl font-extralight font-mono tabular-nums tracking-tight" style={{ color: currentTask.color }}>
                      {formatTime(remainingSec)}
                    </div>
                    <p className="text-xs text-white/40 mt-3">
                      {demoMode ? "démo" : `${currentTask.start} → ${currentTask.end}`}
                    </p>
                  </>
                ) : demoMode ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Journée terminée</p>
                    <h2 className="text-2xl font-light text-white/60">Bravo 🎉</h2>
                  </>
                ) : nextTask ? (() => {
                  // Has any task been completed/skipped before? If yes, we're between tasks.
                  const hasStartedAny = Object.keys(dayCompletions).length > 0;
                  return (
                  <>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                      {hasStartedAny ? "Votre prochaine tâche commence dans" : "Votre journée commence dans"}
                    </p>
                    <div className="text-5xl font-extralight font-mono tabular-nums tracking-tight"
                      style={{ color: accent }}>
                      {formatTime(countdownSec)}
                    </div>
                    <p className="text-sm text-white/60 mt-4">
                      <span className="text-white/40">{nextTask.name} · </span>
                      <span className="font-mono tabular-nums">{nextTask.start}</span>
                    </p>
                  </>
                  );
                })() : (
                  <>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Journée terminée</p>
                    <h2 className="text-2xl font-light text-white/60">Bravo 🎉</h2>
                    <p className="text-[11px] text-white/40 mt-3 px-4">
                      Toutes les tâches sont passées
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Pause / Resume + plein écran buttons row */}
            <div className="flex items-center gap-3 mt-5">
              <button onClick={togglePlay}
                className="w-12 h-12 rounded-full backdrop-blur border flex items-center justify-center transition active:scale-95"
                style={{
                  background: pausedAt ? dayTheme.accent : "rgba(255,255,255,0.1)",
                  borderColor: pausedAt ? dayTheme.accent : "rgba(255,255,255,0.2)",
                  color: pausedAt ? "#000" : "#fff",
                }}>
                {pausedAt ? <Play size={16} fill="#000" className="ml-0.5" /> : <Pause size={16} fill="#fff" />}
              </button>
              <button onClick={() => setFocusMode(true)}
                className="px-4 py-2.5 rounded-full border backdrop-blur flex items-center gap-2 transition hover:bg-white/5"
                style={{ borderColor: dayTheme.accent + "40", background: dayTheme.accent + "10" }}>
                <Maximize2 size={12} style={{ color: dayTheme.accent }} />
                <span className="text-xs font-medium" style={{ color: dayTheme.accent }}>Plein écran</span>
              </button>
            </div>

            {pausedAt && (
              <p className="text-xs text-white/50 mt-3 tracking-[0.2em] uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: dayTheme.accent }} />
                En pause
              </p>
            )}
          </div>
          );
        })()}

        {/* TIMELINE */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-[0.2em] text-white/40">Timeline · {dayTheme.name}</h3>
          <button onClick={openAdd}
            data-tour="addBtn"
            className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition hover:scale-[1.05] active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${dayTheme.accent}50 0%, ${dayTheme.accent}25 100%)`,
              border: `1.5px solid ${dayTheme.accent}80`,
              boxShadow: `0 4px 24px ${dayTheme.accent}40, inset 0 1px 0 rgba(255,255,255,0.20)`,
              color: "white",
            }}>
            {/* Bright inner top highlight */}
            <span className="absolute inset-x-0 top-0 h-1/2 rounded-full pointer-events-none"
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)" }} />
            <Plus size={15} strokeWidth={2.8} className="relative z-10" />
            <span className="relative z-10 tracking-wide">Ajouter</span>
          </button>
        </div>

        <div data-tour="timeline">
        {sortedTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: dayTheme.accent + "15", border: `1px solid ${dayTheme.accent}30` }}>
              <Sparkles size={18} style={{ color: dayTheme.accent }} />
            </div>
            <p className="text-base font-light mb-1">Programmez votre {dayTheme.name.toLowerCase()}</p>
            <p className="text-xs text-white/40 mb-5">
              Ajoutez votre première tâche pour démarrer
            </p>
            <button onClick={openAdd}
              className="text-xs px-5 py-2.5 rounded-full transition inline-flex items-center gap-1.5 font-medium"
              style={{ background: dayTheme.accent + "20", border: `1px solid ${dayTheme.accent}50`, color: dayTheme.accent }}>
              <Plus size={13} /> Ajouter une tâche
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">

            {/* ── Début de la journée ── */}
            <div className="flex items-center gap-3 py-1 mb-1">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-2 h-2 rounded-full border-2"
                  style={{ borderColor: dayTheme.accent, background: dayTheme.accent + "40" }} />
                <div className="w-px flex-1 min-h-[10px]"
                  style={{ background: `linear-gradient(180deg, ${dayTheme.accent}60 0%, transparent 100%)` }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Début de la journée</p>
                <p className="text-xs font-mono tabular-nums font-medium mt-0.5"
                  style={{ color: dayTheme.accent }}>
                  {sortedTasks[0].start}
                </p>
              </div>
            </div>

            {sortedTasks.map((task) => {
              const isCurrent = currentTask?.id === task.id;
              const taskProg = getTaskProgress(task);
              const isPast = isPastTask(task) && !isCurrent;
              const isExpanded = expandedId === task.id;
              const linkedMed = task.meditationId ? MEDITATIONS.find(m => m.id === task.meditationId) : null;
              const cat = task.category ? TASK_CATEGORIES.find(c => c.id === task.category) : null;
              const CatIcon = cat?.icon;
              const completion = dayCompletions[task.id];
              const isPauseTask = cat?.isPause === true;

              const isDragging = dragState?.taskId === task.id;
              const isDropTarget = dragState?.overTaskId === task.id;

              // ── PAUSE TASK: completely different card design ──
              if (isPauseTask) {
                return (
                  <div key={task.id}
                    ref={el => dragRefs.current[task.id] = el}
                    onMouseDown={(e) => { if (e.button === 0) startLongPress(task, e.clientY); }}
                    onMouseUp={cancelLongPress}
                    onMouseLeave={cancelLongPress}
                    onTouchStart={(e) => startLongPress(task, e.touches[0].clientY)}
                    onTouchEnd={cancelLongPress}
                    onTouchCancel={cancelLongPress}
                    className={`group relative rounded-2xl overflow-hidden transition-all select-none ${
                      isDragging ? "scale-[1.03] z-20 opacity-90"
                      : isDropTarget ? "scale-[1.01]"
                      : isCurrent ? "scale-[1.02]" : ""
                    }`}
                    style={{
                      background: isCurrent
                        ? "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)"
                        : "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
                      border: `1px solid ${isCurrent ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.10)"}`,
                      boxShadow: isCurrent ? "0 8px 32px rgba(255,255,255,0.08)" : "none",
                      opacity: isPast && !isCurrent && !completion ? 0.55 : 1,
                      cursor: isDragging ? "grabbing" : "grab",
                    }}>

                    {/* Subtle white progress bar */}
                    {taskProg > 0 && (
                      <div className="absolute inset-y-0 left-0 pointer-events-none transition-all"
                        style={{
                          width: `${taskProg}%`,
                          background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.14) 100%)",
                          transition: "width 1s linear",
                        }} />
                    )}

                    <button onClick={() => { if (dragState) return; setExpandedId(isExpanded ? null : task.id); }}
                      className="relative w-full flex items-center gap-4 px-5 py-4 text-left">

                      {/* Drag handle */}
                      <div className={`shrink-0 flex flex-col gap-[3px] transition-opacity ${isDragging ? "opacity-50" : "opacity-0 group-hover:opacity-20"}`}>
                        {[0,1,2].map(r => (
                          <div key={r} className="flex gap-[3px]">
                            <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
                            <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
                          </div>
                        ))}
                      </div>

                      {/* Moon icon — white circle */}
                      <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}>
                        <Moon size={16} className="text-white/80" />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white">Pause</h4>
                            {(completion === "done" || (isPast && !isCurrent && !completion)) && (
                              <CheckCircle2 size={12} className="text-white/60 shrink-0" />
                            )}
                            {completion === "skipped" && <X size={12} className="text-white/30 shrink-0" />}
                          </div>
                          <span className="text-xs text-white/40 font-mono tabular-nums whitespace-nowrap">
                            {task.start} – {task.end}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/45 leading-tight italic">
                          {cat.tagline}
                        </p>
                      </div>

                      <ChevronDown size={15} className="text-white/30 shrink-0 transition-transform"
                        style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }} />
                    </button>

                    {/* Expanded actions */}
                    {isExpanded && (
                      <div className="px-5 pb-4 space-y-2 border-t border-white/8 pt-3">
                        {task.notes && (
                          <p className="text-xs text-white/50 italic leading-relaxed mb-3">{task.notes}</p>
                        )}
                        {isCurrent && !completion && (
                          <div className="flex gap-2">
                            <button onClick={(e) => {
                                e.stopPropagation();
                                popupOpenedAtRef.current = null;
                                popupTriggerKindRef.current = "manual";
                                setEndTaskPopup(task);
                              }}
                              className="flex-1 py-2.5 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center gap-2 transition hover:bg-white/10 text-white/80">
                              <CheckCircle2 size={14} />
                              <span className="text-xs font-medium">Terminer</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); openEdit(task); }}
                              className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center gap-2 transition hover:bg-white/5 text-white/50 hover:text-white/70">
                              <Pencil size={13} />
                              <span className="text-xs font-medium">Modifier</span>
                            </button>
                          </div>
                        )}
                        <div className="flex justify-end gap-1 pt-1">
                          {!isCurrent && (
                            <button onClick={(e) => { e.stopPropagation(); openEdit(task); }}
                              className="w-8 h-8 rounded-full hover:bg-white/5 transition flex items-center justify-center text-white/30 hover:text-white/60">
                              <Pencil size={13} />
                            </button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                            className="w-8 h-8 rounded-full hover:bg-red-500/10 transition flex items-center justify-center text-white/30 hover:text-red-400">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // ── Standard task card ──
              return (
                <div key={task.id}
                  ref={el => dragRefs.current[task.id] = el}
                  onMouseDown={(e) => { if (e.button === 0) startLongPress(task, e.clientY); }}
                  onMouseUp={cancelLongPress}
                  onMouseLeave={cancelLongPress}
                  onTouchStart={(e) => startLongPress(task, e.touches[0].clientY)}
                  onTouchEnd={cancelLongPress}
                  onTouchCancel={cancelLongPress}
                  className={`group relative rounded-2xl overflow-hidden border transition-all select-none ${
                    isDragging
                      ? "scale-[1.03] shadow-2xl z-20 opacity-90"
                      : isDropTarget
                      ? "scale-[1.01]"
                      : isCurrent ? "border-white/15 scale-[1.02] shadow-2xl"
                      : isPast ? "border-white/5 opacity-60" : "border-white/5 hover:border-white/10"
                  }`}
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    // Drop target highlight
                    ...(isDropTarget ? {
                      borderColor: task.color + "80",
                      boxShadow: `0 0 24px ${task.color}40, inset 0 0 0 2px ${task.color}50`,
                    } : {}),
                    // Dragging element gets a shadow lift
                    ...(isDragging ? {
                      boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 24px ${task.color}40`,
                      cursor: "grabbing",
                    } : { cursor: "grab" }),
                  }}>
                  <div className="absolute inset-y-0 left-0 transition-all pointer-events-none"
                    style={{
                      width: `${taskProg}%`,
                      background: `linear-gradient(90deg, ${task.color}15 0%, ${task.color}55 60%, ${task.color}90 100%)`,
                      transition: "width 1s linear",
                    }} />
                  {taskProg > 0 && taskProg < 100 && (
                    <div className="absolute inset-y-0 pointer-events-none"
                      style={{ left: `calc(${taskProg}% - 24px)`, width: "48px", transition: "left 1s linear" }}>
                      <>
                        <div className="absolute inset-y-0 right-6 w-px"
                          style={{ background: task.color, boxShadow: `0 0 14px ${task.color}, 0 0 28px ${task.color}80`,
                            animation: "shimmer-edge 1.4s ease-in-out infinite" }} />
                        {[...Array(8)].map((_, i) => (
                          <span key={i} className="absolute rounded-full"
                            style={{ width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`, background: task.color,
                              right: `${4 + (i * 5)}px`, top: `${15 + ((i * 13) % 50)}%`, opacity: 0,
                              animation: `float-up ${1.4 + (i * 0.18)}s ease-out infinite`,
                              animationDelay: `${i * 0.15}s`, boxShadow: `0 0 6px ${task.color}` }} />
                        ))}
                      </>
                    </div>
                  )}
                  <button onClick={() => {
                      // Don't expand if a drag was in progress
                      if (dragState) return;
                      setExpandedId(isExpanded ? null : task.id);
                    }}
                    className="relative w-full flex items-center gap-3 p-4 min-h-[72px] text-left">

                    {/* Drag handle — 6 dots, visible on hover or during drag */}
                    <div className={`shrink-0 flex flex-col gap-[3px] transition-opacity ${
                      isDragging ? "opacity-70" : "opacity-0 group-hover:opacity-30"
                    }`}>
                      {[0,1,2].map(row => (
                        <div key={row} className="flex gap-[3px]">
                          <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
                          <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
                        </div>
                      ))}
                    </div>

                    {CatIcon ? (
                      <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
                        style={{ background: task.color + "25" }}>
                        <CatIcon size={16} style={{ color: task.color }} />
                      </div>
                    ) : (
                      <div className="w-1 h-12 rounded-full shrink-0" style={{ background: task.color }} />
                    )}
                    <div className="flex-1 min-w-0">
                      {/* Title row — wraps up to 2 lines, never truncates hard */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`font-medium flex items-start gap-1.5 leading-snug min-w-0 ${
                          isCurrent ? "text-white" : "text-white/85"
                        } ${task.name.length > 28 ? "text-[13px]" : "text-sm"}`}
                          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {task.name}
                          <span className="flex items-center gap-1 shrink-0 translate-y-[1px]">
                            {(completion === "done" || (isPast && !isCurrent && !completion)) && (
                              <CheckCircle2 size={11} className="text-green-400" />
                            )}
                            {completion === "skipped" && <X size={11} className="text-white/30" />}
                            {task.notes && <StickyNote size={10} className="text-white/30" />}
                            {linkedMed && <Brain size={10} style={{ color: linkedMed.color }} />}
                          </span>
                        </h4>
                        {/* Time — always on the right, shrink-0 so it never gets squished */}
                        <span className="text-[11px] text-white/50 font-mono tabular-nums whitespace-nowrap shrink-0 mt-0.5">
                          {task.start}–{task.end}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40">
                          {completion === "done" ? "✓ Validée"
                          : completion === "skipped" ? "Non terminée"
                          : (isPast && !isCurrent) ? "✓ Terminée"
                          : task.subcategory ? task.subcategory
                          : (isCurrent ? "En cours" : "À venir")}
                        </span>
                        <span className="font-mono tabular-nums font-medium"
                          style={{ color: isCurrent ? task.color : "rgba(255,255,255,0.5)" }}>
                          {Math.round(taskProg)}%
                        </span>
                      </div>
                    </div>
                    <ChevronDown size={16} className="text-white/40 shrink-0 transition-transform"
                      style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }} />
                  </button>
                  {isExpanded && (
                    <div className="relative border-t border-white/5 bg-black/30 backdrop-blur p-4 space-y-3">
                      {task.notes ? (
                        <div className="text-sm text-white/75 whitespace-pre-line leading-relaxed">{task.notes}</div>
                      ) : (
                        <p className="text-xs text-white/30 italic">Aucune note pour cette tâche.</p>
                      )}
                      {linkedMed && (
                        <button onClick={(e) => { e.stopPropagation(); setActiveMeditation(linkedMed.id); }}
                          className="w-full p-3 rounded-xl border flex items-center gap-3 transition hover:bg-white/5"
                          style={{ borderColor: linkedMed.color + "40", background: linkedMed.color + "10" }}>
                          <linkedMed.icon size={18} style={{ color: linkedMed.color }} />
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium" style={{ color: linkedMed.color }}>{linkedMed.name}</p>
                            <p className="text-[11px] text-white/50">{linkedMed.duration} min · {linkedMed.description}</p>
                          </div>
                          <Play size={14} style={{ color: linkedMed.color }} />
                        </button>
                      )}

                      {/* Action buttons for current task: Terminer + Modifier (side by side) */}
                      {isCurrent && !completion && (
                        <div className="flex gap-2">
                          <button onClick={(e) => {
                              e.stopPropagation();
                              popupOpenedAtRef.current = null; // manual = no auto-shift
                              popupTriggerKindRef.current = "manual";
                              setEndTaskPopup(task);
                            }}
                            className="flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-2 transition hover:scale-[1.01]"
                            style={{
                              background: task.color + "15",
                              borderColor: task.color + "50",
                              color: task.color,
                            }}>
                            <CheckCircle2 size={14} />
                            <span className="text-xs font-medium">Terminer</span>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); openEdit(task); }}
                            className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center gap-2 transition hover:bg-white/5 text-white/70 hover:text-white"
                            title="Modifier l'horaire ou la durée">
                            <Pencil size={13} />
                            <span className="text-xs font-medium">Modifier</span>
                          </button>
                        </div>
                      )}

                      {/* Hidden: original early-finish-only button (replaced by the action row above) */}
                      {false && isCurrent && !completion && (
                        <button onClick={(e) => {
                            e.stopPropagation();
                            popupOpenedAtRef.current = null; // manual = no auto-shift
                            popupTriggerKindRef.current = "manual";
                            setEndTaskPopup(task);
                          }}
                          className="w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 transition hover:scale-[1.01]"
                          style={{
                            background: task.color + "15",
                            borderColor: task.color + "50",
                            color: task.color,
                          }}>
                          <CheckCircle2 size={14} />
                          <span className="text-xs font-medium">Terminer maintenant</span>
                        </button>
                      )}

                      <div className="flex justify-end gap-1 pt-1">
                        <button onClick={(e) => { e.stopPropagation(); openEdit(task); }}
                          className="w-8 h-8 rounded-full hover:bg-white/5 transition flex items-center justify-center text-white/40 hover:text-white"
                          title="Modifier">
                          <Pencil size={13} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                          className="w-8 h-8 rounded-full hover:bg-red-500/10 transition flex items-center justify-center text-white/40 hover:text-red-400"
                          title="Supprimer">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* ── Fin de la journée ── */}
            <div className="flex items-center gap-3 py-1 mt-1">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-px flex-1 min-h-[10px]"
                  style={{ background: `linear-gradient(180deg, transparent 0%, ${dayTheme.accent}60 100%)` }} />
                <div className="w-2 h-2 rounded-full border-2"
                  style={{ borderColor: dayTheme.accent, background: dayTheme.accent + "40" }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Fin de la journée</p>
                <p className="text-xs font-mono tabular-nums font-medium mt-0.5"
                  style={{ color: dayTheme.accent }}>
                  {sortedTasks[sortedTasks.length - 1].end}
                </p>
              </div>
            </div>

          </div>
        )}
        </div>

        {/* ===== FLOATING TASKS — "À programmer · En attente" ===== */}
        <div className="mt-8 mb-6">
            {/* Section header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#FB923C" }} />
                <h3 className="text-xs uppercase tracking-[0.2em] text-white/40">
                  À programmer · En attente
                </h3>
                {floatingTasks.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
                    style={{ background: "rgba(251,146,60,0.2)", color: "#FB923C" }}>
                    {floatingTasks.length}
                  </span>
                )}
              </div>
              <button onClick={openAddFloating}
                className="text-[11px] text-white/40 hover:text-orange-400 transition flex items-center gap-1">
                <Plus size={12} /> Ajouter
              </button>
            </div>

            {floatingTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-center"
                style={{ borderColor: "rgba(251,146,60,0.25)", background: "rgba(251,146,60,0.03)" }}>
                <p className="text-xs text-white/40 leading-relaxed">
                  Aucune tâche en attente.<br/>
                  <button onClick={openAddFloating}
                    className="text-orange-400/80 hover:text-orange-400 underline underline-offset-2 transition mt-1">
                    Ajouter une tâche sans horaire
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {floatingTasks.map((task) => {
                  const cat = TASK_CATEGORIES.find(c => c.id === task.category);
                  const CatIcon = cat?.icon;
                  return (
                    <div key={task.id}
                      className="relative overflow-hidden rounded-2xl border flex items-center gap-3 px-4 py-3.5 group"
                      style={{
                        background: "linear-gradient(135deg, rgba(251,146,60,0.10) 0%, rgba(251,146,60,0.04) 100%)",
                        borderColor: "rgba(251,146,60,0.30)",
                      }}>
                      {/* Left orange accent stripe */}
                      <div className="absolute left-0 inset-y-0 w-0.5 rounded-r-full"
                        style={{ background: "linear-gradient(180deg, #FB923C, #F97316, #EA580C)" }} />

                      {/* Icon */}
                      <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
                        style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)" }}>
                        {CatIcon
                          ? <CatIcon size={14} style={{ color: "#FB923C" }} />
                          : <span className="text-base">🔖</span>}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white/90 truncate">{task.name}</p>
                        {task.subcategory && (
                          <p className="text-[11px] text-white/40 truncate">{task.subcategory}</p>
                        )}
                        {task.notes && (
                          <p className="text-[11px] text-white/30 truncate mt-0.5 italic">{task.notes}</p>
                        )}
                      </div>

                      {/* Badge */}
                      <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: "rgba(251,146,60,0.15)", color: "#FB923C",
                          border: "1px solid rgba(251,146,60,0.3)" }}>
                        En attente
                      </span>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Planifier → pre-fills scheduled form */}
                        <button
                          onClick={() => {
                            // Copy to scheduled form with prefilled name/category/notes
                            setFloatingTasks(floatingTasks.filter(t => t.id !== task.id));
                            setIsFloatingForm(false);
                            setEditingTask(null);
                            let suggestedStart = "";
                            if (sortedTasks.length > 0) {
                              const lastTask = sortedTasks.reduce((latest, t) =>
                                toMin(t.end) > toMin(latest.end) ? t : latest, sortedTasks[0]);
                              suggestedStart = lastTask.end;
                            }
                            setTaskForm({
                              name: task.name, start: suggestedStart, end: "",
                              notes: task.notes || "", meditationId: null,
                              category: task.category || null, subcategory: task.subcategory || null,
                            });
                            setShowAdd(true);
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition hover:scale-110"
                          style={{ background: "rgba(251,146,60,0.2)", color: "#FB923C" }}
                          title="Planifier cette tâche">
                          <CalendarPlus size={13} />
                        </button>
                        <button
                          onClick={() => openEdit(task, true)}
                          className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition text-white/30 hover:text-white/60"
                          title="Modifier">
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => setFloatingTasks(floatingTasks.filter(t => t.id !== task.id))}
                          className="w-8 h-8 rounded-full hover:bg-red-500/10 flex items-center justify-center transition text-white/30 hover:text-red-400"
                          title="Supprimer">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ===== START DAY BUTTON (only when truly not started — not paused) ===== */}
        {!isRunning && !pausedAt && (
          <div className="mt-10 mb-4 flex flex-col items-center">
            <button
              onClick={() => {
                if (sortedTasks.length === 0) {
                  setShowNoTasksWarning(true);
                } else {
                  startDay();
                }
              }}
              data-tour="startBtn"
              className="group relative w-full overflow-hidden rounded-2xl px-6 py-5 transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: `linear-gradient(135deg, ${dayTheme.accent}25 0%, ${dayTheme.accent}10 50%, transparent 100%)`,
                border: `1px solid ${dayTheme.accent}40`,
                boxShadow: `0 0 30px ${dayTheme.accent}20, inset 0 1px 0 ${dayTheme.accent}30`,
              }}
            >
              {/* Animated shimmer sweep */}
              <div
                className="absolute inset-y-0 w-1/3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${dayTheme.accent}40 50%, transparent 100%)`,
                  animation: "goal-shimmer 2s ease-in-out infinite",
                }}
              />
              <div
                className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{ background: dayTheme.accent }}
              />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <span
                      className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{ background: dayTheme.accent, animationDuration: "3s" }}
                    />
                    <div
                      className="absolute inset-0 rounded-full border"
                      style={{ borderColor: dayTheme.accent + "60" }}
                    />
                    <div
                      className="relative w-9 h-9 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${dayTheme.accent} 0%, ${dayTheme.accent}80 100%)`,
                        boxShadow: `0 0 20px ${dayTheme.accent}80`,
                      }}
                    >
                      <Play size={14} fill="black" className="ml-0.5 text-black" />
                    </div>
                  </div>

                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-0.5">
                      {sortedTasks.length > 0 ? "Tout est prêt" : "Aucune tâche"}
                    </p>
                    <p className="text-base font-medium" style={{ color: dayTheme.accent }}>
                      Démarrer la journée
                    </p>
                  </div>
                </div>

                {sortedTasks.length > 0 ? (
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">Première</p>
                    <p className="text-xs font-medium text-white/80 truncate max-w-[120px]">
                      {sortedTasks[0]?.name}
                    </p>
                    <p className="text-[10px] font-mono text-white/40 tabular-nums">
                      {sortedTasks[0]?.start}
                    </p>
                  </div>
                ) : (
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">
                      0 tâche
                    </p>
                    <p className="text-[10px] text-white/40 italic mt-0.5">
                      à programmer
                    </p>
                  </div>
                )}
              </div>
            </button>

            <button onClick={() => setFocusMode(true)}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-white/40 hover:text-white/70 transition">
              <Maximize2 size={11} />
              Mode plein écran
            </button>

            {/* Reset day button — only if there are tasks or the day has started */}
            {(sortedTasks.length > 0 || Object.keys(dayCompletions).length > 0) && (
              <button onClick={() => setShowResetConfirm(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-white/25 hover:text-red-400/70 transition">
                <RotateCcw size={10} />
                Réinitialiser la journée
              </button>
            )}
          </div>
        )}

        {/* === ADD / EDIT MODAL === */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAdd(false)}>
            <div onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-light mb-1">{editingTask ? "Modifier la tâche" : "Nouvelle tâche"}</h3>
              <p className="text-xs text-white/40 mb-4">{dayTheme.name}</p>

              {/* === TOGGLE: Avec horaire / Sans horaire === */}
              {!editingTask && (
                <div className="flex mb-5 rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
                  <button
                    onClick={() => setIsFloatingForm(false)}
                    className="flex-1 py-2.5 text-xs font-medium transition"
                    style={!isFloatingForm ? {
                      background: dayTheme.accent + "25",
                      color: dayTheme.accent,
                      borderRight: `1px solid ${dayTheme.accent}30`,
                    } : { color: "rgba(255,255,255,0.4)" }}>
                    Avec horaire
                  </button>
                  <button
                    onClick={() => setIsFloatingForm(true)}
                    className="flex-1 py-2.5 text-xs font-medium transition"
                    style={isFloatingForm ? {
                      background: "#FB923C25",
                      color: "#FB923C",
                    } : { color: "rgba(255,255,255,0.4)" }}>
                    Sans horaire
                  </button>
                </div>
              )}

              {/* Hint: last task's end time — only for scheduled tasks */}
              {!editingTask && !isFloatingForm && sortedTasks.length > 0 && (() => {
                const lastTask = sortedTasks.reduce((latest, t) =>
                  toMin(t.end) > toMin(latest.end) ? t : latest, sortedTasks[0]);
                return (
                  <div className="mb-4 px-3.5 py-2.5 rounded-xl flex items-start gap-2.5 border"
                    style={{ background: dayTheme.accent + "10", borderColor: dayTheme.accent + "30" }}>
                    <Clock size={13} className="shrink-0 mt-0.5" style={{ color: dayTheme.accent }} />
                    <div className="text-[11px] leading-relaxed">
                      <p className="text-white/70">
                        Votre dernière tâche se termine à <span className="font-mono tabular-nums font-medium text-white">{lastTask.end}</span>
                      </p>
                      <p className="text-white/40 mt-0.5">
                        L'heure de début est pré-remplie pour enchaîner
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Floating task hint */}
              {isFloatingForm && (
                <div className="mb-4 px-3.5 py-2.5 rounded-xl flex items-start gap-2.5 border"
                  style={{ background: "rgba(251,146,60,0.1)", borderColor: "rgba(251,146,60,0.3)" }}>
                  <span className="text-base shrink-0">🔖</span>
                  <div className="text-[11px] leading-relaxed">
                    <p className="text-white/70">Cette tâche n'a pas d'horaire.</p>
                    <p className="text-white/40 mt-0.5">
                      Elle apparaîtra dans la section "À programmer" sans impacter votre planning.
                    </p>
                  </div>
                </div>
              )}

              <button onClick={() => { setShowCategoryPicker(true); setPickerStep("category"); }}
                className="w-full mb-4 p-3.5 rounded-xl border flex items-center gap-3 transition hover:bg-white/5"
                style={{
                  borderColor: taskForm.category
                    ? TASK_CATEGORIES.find(c => c.id === taskForm.category)?.color + "60"
                    : "rgba(167,139,250,0.4)",
                  background: taskForm.category
                    ? TASK_CATEGORIES.find(c => c.id === taskForm.category)?.color + "10"
                    : "rgba(167,139,250,0.08)",
                }}>
                {taskForm.category ? (
                  <>
                    {(() => {
                      const cat = TASK_CATEGORIES.find(c => c.id === taskForm.category);
                      const Icon = cat?.icon;
                      return Icon && <Icon size={18} style={{ color: cat.color }} />;
                    })()}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium" style={{ color: TASK_CATEGORIES.find(c => c.id === taskForm.category)?.color }}>
                        {TASK_CATEGORIES.find(c => c.id === taskForm.category)?.name}
                      </p>
                      {taskForm.subcategory && <p className="text-[11px] text-white/60">{taskForm.subcategory}</p>}
                    </div>
                    <span className="text-xs text-white/40">Changer</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="text-violet-400" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-violet-300">Tâches prédéfinies</p>
                      <p className="text-[11px] text-white/50">Choisir parmi les catégories prédéfinies</p>
                    </div>
                    <ChevronDown size={14} className="text-white/40 -rotate-90" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] text-white/30 uppercase tracking-widest">ou</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="space-y-3">
                <input type="text" placeholder="Nom de la tâche (libre)" value={taskForm.name}
                  onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30" />
                {!isFloatingForm && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Début</label>
                    <input type="time" value={taskForm.start}
                      onChange={(e) => setTaskForm({ ...taskForm, start: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-white/30" />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Fin</label>
                    <input type="time" value={taskForm.end}
                      onChange={(e) => setTaskForm({ ...taskForm, end: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-white/30" />
                  </div>
                </div>
                )}
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Notes / sous-tâches</label>
                  <textarea placeholder="Ajoute des notes, sous-tâches, rappels..." value={taskForm.notes}
                    onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })} rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 resize-none" />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition">Annuler</button>
                <button onClick={saveTask}
                  className="flex-1 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition">
                  {editingTask ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === CATEGORY PICKER === */}
        {showCategoryPicker && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4"
            onClick={() => { setShowCategoryPicker(false); setPickedCategory(null); setPickerStep("category"); }}>
            <div onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm max-h-[85vh] overflow-y-auto">
              {pickerStep === "category" ? (
                <>
                  {/* === MES TÂCHES (custom reusable templates) === */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg,#A78BFA,#60A5FA)" }}>
                          <Plus size={9} className="text-black" strokeWidth={3} />
                        </div>
                        <h3 className="text-sm font-medium">Mes tâches</h3>
                      </div>
                      <button onClick={openNewTemplate}
                        className="text-[11px] text-white/50 hover:text-white transition flex items-center gap-1">
                        <Plus size={11} /> Créer
                      </button>
                    </div>

                    {customTaskTemplates.length === 0 ? (
                      <button onClick={openNewTemplate}
                        className="w-full py-4 rounded-2xl border border-dashed border-white/10 text-xs text-white/40 hover:text-white/60 hover:border-white/20 transition flex items-center justify-center gap-2">
                        <Plus size={13} />
                        Créer une tâche personnalisée réutilisable
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {customTaskTemplates.map((tpl) => {
                          const iconDef = CUSTOM_TASK_ICONS.find(i => i.key === tpl.iconKey);
                          const TplIcon = iconDef?.icon || Zap;
                          return (
                            <div key={tpl.id} className="relative group">
                              <button
                                onClick={() => insertTemplate(tpl)}
                                className="w-full p-3.5 rounded-2xl border transition hover:scale-[1.02] text-left"
                                style={{
                                  background: tpl.color + "12",
                                  borderColor: tpl.color + "40",
                                }}>
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                                  style={{ background: tpl.color + "25" }}>
                                  <TplIcon size={15} style={{ color: tpl.color }} />
                                </div>
                                <p className="text-sm font-medium truncate" style={{ color: tpl.color }}>
                                  {tpl.name}
                                </p>
                                <p className="text-[10px] text-white/40 mt-0.5">
                                  {tpl.durationMin} min
                                </p>
                              </button>
                              {/* Edit / delete mini buttons on hover */}
                              <div className="absolute top-1.5 right-1.5 gap-0.5 hidden group-hover:flex">
                                <button onClick={(e) => { e.stopPropagation(); openEditTemplate(tpl); }}
                                  className="w-6 h-6 rounded-lg bg-black/60 backdrop-blur flex items-center justify-center text-white/60 hover:text-white transition">
                                  <Pencil size={10} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); deleteTemplate(tpl.id); }}
                                  className="w-6 h-6 rounded-lg bg-black/60 backdrop-blur flex items-center justify-center text-white/40 hover:text-red-400 transition">
                                  <Trash2 size={10} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        {/* Quick add another */}
                        <button onClick={openNewTemplate}
                          className="p-3.5 rounded-2xl border border-dashed border-white/10 hover:border-white/20 transition flex flex-col items-center justify-center gap-1 text-white/30 hover:text-white/50">
                          <Plus size={16} />
                          <span className="text-[10px]">Nouvelle</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-white/8" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Prédéfinies</span>
                    <div className="h-px flex-1 bg-white/8" />
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-violet-400" />
                    <h3 className="text-lg font-light">Tâches prédéfinies</h3>
                  </div>
                  <p className="text-xs text-white/40 mb-5">Choisis une catégorie</p>
                  <div className="grid grid-cols-2 gap-2">
                    {TASK_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      // ── Special Pause card ──
                      if (cat.isPause) {
                        return (
                          <button key={cat.id}
                            onClick={() => { setPickedCategory(cat); setPickerStep("subcategory"); }}
                            className="col-span-2 p-4 rounded-2xl border transition flex items-center gap-4 hover:scale-[1.01]"
                            style={{
                              background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                              borderColor: "rgba(255,255,255,0.18)",
                              boxShadow: "0 4px 20px rgba(255,255,255,0.04)",
                            }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                              <Moon size={18} className="text-white/80" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium text-white">Pause</p>
                              <p className="text-[11px] text-white/45 italic leading-snug mt-0.5">
                                {cat.tagline}
                              </p>
                            </div>
                            <ChevronRight size={14} className="text-white/30 shrink-0" />
                          </button>
                        );
                      }
                      // ── Standard category card ──
                      return (
                        <button key={cat.id}
                          onClick={() => { setPickedCategory(cat); setPickerStep("subcategory"); }}
                          className="p-4 rounded-2xl border border-white/10 hover:border-white/20 transition flex flex-col items-start gap-2"
                          style={{ background: cat.color + "08" }}>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: cat.color + "25" }}>
                            <Icon size={16} style={{ color: cat.color }} />
                          </div>
                          <p className="text-sm font-medium">{cat.name}</p>
                          <p className="text-[10px] text-white/40">
                            {cat.subcategories.length} {cat.subcategories.length > 1 ? "options" : "option"}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => { setPickerStep("category"); setPickedCategory(null); }}
                    className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white mb-3 transition">
                    <ChevronLeft size={14} /> Retour aux catégories
                  </button>
                  <div className="flex items-center gap-2 mb-1">
                    {(() => {
                      const Icon = pickedCategory.icon;
                      return <Icon size={16} style={{ color: pickedCategory.color }} />;
                    })()}
                    <h3 className="text-lg font-light">{pickedCategory.name}</h3>
                  </div>
                  <p className="text-xs text-white/40 mb-5">Choisis une activité</p>
                  <div className="grid grid-cols-2 gap-2">
                    {pickedCategory.subcategories.map((sub, idx) => {
                      const Icon = sub.icon;
                      return (
                        <button key={idx}
                          onClick={() => {
                            setTaskForm({
                              ...taskForm, name: sub.name,
                              category: pickedCategory.id, subcategory: sub.name,
                              meditationId: sub.meditationId || taskForm.meditationId,
                            });
                            setShowCategoryPicker(false);
                            setPickedCategory(null);
                            setPickerStep("category");
                          }}
                          className="p-3 rounded-2xl border border-white/10 hover:border-white/20 transition flex items-center gap-2.5 text-left"
                          style={{ background: pickedCategory.color + "08" }}>
                          <Icon size={14} style={{ color: pickedCategory.color }} className="shrink-0" />
                          <span className="text-xs truncate">{sub.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* === MENU DRAWER (avatar tap) === */}
        {showMenu && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[65] flex items-start justify-end p-4 sm:p-6"
            onClick={() => setShowMenu(false)}>
            <div onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-white/10 rounded-3xl p-3 w-full max-w-[260px] mt-16 shadow-2xl">

              {/* Profile summary */}
              <button
                onClick={() => { setShowMenu(false); setProfileDraft(user); setShowProfile(true); }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition text-left"
              >
                <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center font-medium shrink-0"
                  style={{ background: dayTheme.accent + "30", border: `1px solid ${dayTheme.accent}40` }}>
                  {user.photo ? (
                    <img src={user.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span style={{ color: dayTheme.accent }}>{user.firstName?.[0]}{user.lastName?.[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-[11px] text-white/40 truncate">{user.email}</p>
                </div>
              </button>

              <div className="h-px bg-white/5 my-2" />

              <button
                onClick={() => { setShowMenu(false); setShowBrain(true); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
              >
                <Brain size={15} style={{ color: brainCurrentColor }} />
                <span className="text-sm flex-1">Mon cerveau</span>
                {brainTotalDays > 0 && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: brainCurrentColor + "20", color: brainCurrentColor }}>
                    {brainTotalDays}j
                  </span>
                )}
              </button>

              <button
                onClick={() => { setShowMenu(false); setShowStats(true); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
              >
                <BarChart3 size={15} className="text-white/60" />
                <span className="text-sm">Statistiques</span>
              </button>

              <button
                onClick={() => { setShowMenu(false); setProfileDraft(user); setShowProfile(true); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
              >
                <Pencil size={15} className="text-white/60" />
                <span className="text-sm">Modifier le profil</span>
              </button>

              <button
                onClick={() => { setShowMenu(false); setShowCustomization(true); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
              >
                <Palette size={15} className="text-white/60" />
                <span className="text-sm flex-1">Personnalisation</span>
                <div className="flex gap-0.5">
                  {CUSTOM_THEMES[customTheme].colors.slice(0, 3).map((c, i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
                  ))}
                </div>
              </button>

              <button
                onClick={() => { setShowMenu(false); setShowSubscription(true); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
              >
                <Sparkles size={15} className="text-white/60" />
                <span className="text-sm flex-1">Mon abonnement</span>
                {user.isSubscribed ? (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: dayTheme.accent + "20", color: dayTheme.accent }}>
                    Actif
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-white/40">
                    {trialDaysLeft > 0 ? `${trialDaysLeft}j` : "Expiré"}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setVoiceOn(!voiceOn);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
              >
                {voiceOn ? <Volume2 size={15} className="text-white/60" /> : <VolumeX size={15} className="text-white/60" />}
                <span className="text-sm flex-1">Voix de notification</span>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">
                  {voiceOn ? "ON" : "OFF"}
                </span>
              </button>

              <button
                onClick={() => { setShowMenu(false); setTutorialStep(0); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
              >
                <Sparkles size={15} className="text-white/60" />
                <span className="text-sm">Revoir le tutoriel</span>
              </button>

              <div className="h-px bg-white/5 my-2" />

              <button
                onClick={() => { setShowMenu(false); setUser(null); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition text-left text-red-400/80"
              >
                <LogOut size={15} />
                <span className="text-sm">Se déconnecter</span>
              </button>
            </div>
          </div>
        )}

        {/* === BRAIN CONNECTION BURST (when a new day validates the brain) === */}
        {brainNewNodeBurst && (
          <div className="fixed inset-0 pointer-events-none z-[95] flex items-end justify-center pb-32 sm:pb-40">
            <button
              onClick={() => { setBrainNewNodeBurst(null); setShowBrain(true); }}
              className="pointer-events-auto rounded-2xl border px-5 py-4 backdrop-blur-md flex items-center gap-3"
              style={{
                background: `linear-gradient(135deg, ${brainCurrentColor}25 0%, rgba(15,15,20,0.95) 100%)`,
                borderColor: brainCurrentColor + "60",
                boxShadow: `0 20px 60px ${brainCurrentColor}50, 0 0 40px ${brainCurrentColor}30`,
                animation: "burst-fade 2.4s ease-out forwards",
              }}
            >
              {/* Mini pulsing brain dot */}
              <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full animate-ping opacity-50"
                  style={{ background: brainCurrentColor }} />
                <div className="relative w-5 h-5 rounded-full"
                  style={{
                    background: brainCurrentColor,
                    boxShadow: `0 0 16px ${brainCurrentColor}`,
                  }} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: brainCurrentColor }}>
                  Nouvelle connexion
                </p>
                <p className="text-sm font-medium text-white">
                  Jour {brainDayInCycle}/{BRAIN_CYCLE_DAYS} · Cycle {brainCurrentCycleIdx + 1}
                </p>
              </div>
              <ChevronRight size={14} className="text-white/40 shrink-0" />
            </button>
          </div>
        )}

        {/* === SWAP CONFIRMATION TOAST === */}
        {swapToast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[199] pointer-events-none">
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border backdrop-blur-md"
              style={{
                background: "rgba(15,15,20,0.95)",
                borderColor: "rgba(255,255,255,0.15)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                animation: "check-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              }}>
              <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center shrink-0">
                <Check size={11} className="text-green-400" strokeWidth={3} />
              </div>
              <p className="text-xs text-white/80 whitespace-nowrap">
                <span className="font-medium text-white">{swapToast.nameA}</span>
                <span className="text-white/40 mx-1.5">↔</span>
                <span className="font-medium text-white">{swapToast.nameB}</span>
                <span className="text-white/50 ml-1.5">échangées</span>
              </p>
            </div>
          </div>
        )}

        {/* === DRAG GHOST OVERLAY (follows pointer during drag) === */}
        {dragState && (() => {
          const draggingTask = tasks.find(t => t.id === dragState.taskId);
          if (!draggingTask) return null;
          const cat = draggingTask.category ? TASK_CATEGORIES.find(c => c.id === draggingTask.category) : null;
          const GhostIcon = cat?.icon;
          return (
            <div
              className="fixed z-[200] pointer-events-none"
              style={{
                top: dragState.currentY - 28,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border backdrop-blur-md shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, rgba(15,15,20,0.95) 0%, rgba(20,20,28,0.95) 100%)`,
                  borderColor: draggingTask.color + "70",
                  boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 20px ${draggingTask.color}40`,
                }}>
                {/* Drag icon */}
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: draggingTask.color + "25" }}>
                  {GhostIcon
                    ? <GhostIcon size={13} style={{ color: draggingTask.color }} />
                    : <div className="w-1 h-4 rounded-full" style={{ background: draggingTask.color }} />}
                </div>
                <div>
                  <p className="text-xs font-medium text-white leading-tight">{draggingTask.name}</p>
                  <p className="text-[10px] font-mono tabular-nums"
                    style={{ color: draggingTask.color }}>
                    {draggingTask.start} – {draggingTask.end}
                  </p>
                </div>
                {/* Swap indicator when over a target */}
                {dragState.overTaskId && (() => {
                  const targetTask = tasks.find(t => t.id === dragState.overTaskId);
                  if (!targetTask) return null;
                  return (
                    <div className="flex items-center gap-1.5 ml-1 pl-2.5 border-l border-white/10">
                      <ChevronRight size={10} className="text-white/40" />
                      <p className="text-[10px] text-white/60 max-w-[80px] truncate">{targetTask.name}</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })()}

        {/* === TASK TRANSITION OVERLAY (between two tasks) === */}
        {taskTransition && (
          <div className="fixed inset-0 z-[88] flex items-center justify-center pointer-events-none">
            {/* Soft backdrop */}
            <div className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, rgba(15,15,20,0.6) 0%, rgba(0,0,0,0.85) 80%)`,
                animation: "burst-fade 5s ease-out forwards",
              }} />

            <div className="relative max-w-sm w-full px-8 text-center pointer-events-auto"
              style={{ animation: "check-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
              {/* Check icon with halo */}
              <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full animate-ping opacity-40"
                  style={{ background: taskTransition.fromColor }} />
                <div className="absolute inset-0 rounded-full blur-2xl opacity-60"
                  style={{ background: taskTransition.fromColor }} />
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: taskTransition.fromColor,
                    boxShadow: `0 0 40px ${taskTransition.fromColor}, 0 0 80px ${taskTransition.fromColor}60`,
                  }}>
                  <Check size={32} strokeWidth={3} className="text-black" />
                </div>
              </div>

              {/* Completed task */}
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">
                Tâche terminée
              </p>
              <p className="text-xl font-light mb-8" style={{ color: taskTransition.fromColor }}>
                {taskTransition.fromName}
              </p>

              {/* Arrow / divider */}
              <div className="flex items-center justify-center gap-2 mb-6 opacity-60">
                <div className="h-px w-12" style={{ background: `linear-gradient(90deg, transparent, ${taskTransition.toColor})` }} />
                <ChevronRight size={14} style={{ color: taskTransition.toColor }} />
                <div className="h-px w-12" style={{ background: `linear-gradient(90deg, ${taskTransition.toColor}, transparent)` }} />
              </div>

              {/* Next task */}
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">
                Prochaine tâche
              </p>
              <p className="text-2xl font-light mb-1" style={{ color: taskTransition.toColor }}>
                {taskTransition.toName}
              </p>
              <p className="text-xs text-white/40 font-mono tabular-nums">
                {taskTransition.toStart}
              </p>

              {/* Skip button */}
              <button
                onClick={() => setTaskTransition(null)}
                className="mt-8 text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition"
              >
                Passer
              </button>
            </div>
          </div>
        )}

        {/* === VALIDATION BURST (transient feedback) === */}
        {validationBurst && (
          <div className="fixed inset-0 pointer-events-none z-[90] flex items-center justify-center">
            {/* Soft halo burst */}
            <div className="absolute w-64 h-64 rounded-full"
              style={{
                background: `radial-gradient(circle, ${validationBurst.color}40 0%, transparent 70%)`,
                animation: "burst-fade 1.6s ease-out forwards",
              }} />
            {/* Particles */}
            {[...Array(16)].map((_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              const distance = 90 + Math.random() * 40;
              return (
                <span key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${3 + Math.random() * 3}px`,
                    height: `${3 + Math.random() * 3}px`,
                    background: validationBurst.color,
                    boxShadow: `0 0 8px ${validationBurst.color}`,
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
                    animation: `confetti-out 1.4s ease-out forwards`,
                    animationDelay: `${i * 0.02}s`,
                  }} />
              );
            })}
            {/* Checkmark */}
            <div
              className="relative w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: validationBurst.color,
                boxShadow: `0 0 40px ${validationBurst.color}, 0 0 80px ${validationBurst.color}60`,
                animation: "check-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <Check size={28} strokeWidth={3} className="text-black" />
            </div>
          </div>
        )}


        {/* === TUTORIAL OVERLAY (with spotlight on target element) === */}
        {tutorialStep !== null && TUTORIAL_STEPS[tutorialStep] && (() => {
          const step = TUTORIAL_STEPS[tutorialStep];
          const isFirst = tutorialStep === 0;
          const isLast = tutorialStep === TUTORIAL_STEPS.length - 1;
          const hasTarget = step.target && tutorialRect;
          const padding = 8; // padding around the highlighted element

          // Compute bubble position based on target
          // - if no target: center the bubble
          // - if target is in the upper half: bubble below the target
          // - if target is in the lower half: bubble above the target
          let bubbleStyle = {};
          let arrowPos = null; // 'top' or 'bottom' or null
          if (hasTarget) {
            const viewportH = window.innerHeight;
            const targetCenterY = tutorialRect.top + tutorialRect.height / 2;
            const targetIsInUpperHalf = targetCenterY < viewportH / 2;

            if (targetIsInUpperHalf) {
              // Bubble below the target
              bubbleStyle = {
                top: `${tutorialRect.top + tutorialRect.height + padding + 16}px`,
                left: "50%",
                transform: "translateX(-50%)",
              };
              arrowPos = "top";
            } else {
              // Bubble above the target
              bubbleStyle = {
                bottom: `${viewportH - tutorialRect.top + padding + 16}px`,
                left: "50%",
                transform: "translateX(-50%)",
              };
              arrowPos = "bottom";
            }
          } else {
            // Centered
            bubbleStyle = {
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            };
          }

          return (
            <div className="fixed inset-0 z-[100]" style={{ pointerEvents: "auto" }}>
              {/* === SPOTLIGHT === */}
              {/* The trick: a transparent box where the target is, with a giant box-shadow filling the rest of the screen with dark overlay */}
              {hasTarget ? (
                <div
                  className="fixed pointer-events-none transition-all duration-300"
                  style={{
                    top: `${tutorialRect.top - padding}px`,
                    left: `${tutorialRect.left - padding}px`,
                    width: `${tutorialRect.width + padding * 2}px`,
                    height: `${tutorialRect.height + padding * 2}px`,
                    borderRadius: "16px",
                    boxShadow: `
                      0 0 0 9999px rgba(0, 0, 0, 0.85),
                      inset 0 0 0 2px ${dayTheme.accent},
                      0 0 30px ${dayTheme.accent}80
                    `,
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
              )}

              {/* === BUBBLE === */}
              <div
                className="fixed max-w-[340px] w-[calc(100%-32px)] rounded-3xl p-5 border z-[110]"
                style={{
                  ...bubbleStyle,
                  background: "linear-gradient(135deg, rgba(20,20,25,0.97) 0%, rgba(15,15,20,0.97) 100%)",
                  borderColor: dayTheme.accent + "50",
                  boxShadow: `0 20px 80px ${dayTheme.accent}30, 0 0 60px ${dayTheme.accent}15`,
                }}
              >
                {/* Arrow pointing at the target */}
                {arrowPos === "top" && (
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-t border-l"
                    style={{
                      background: "rgba(20,20,25,0.97)",
                      borderColor: dayTheme.accent + "50",
                    }}
                  />
                )}
                {arrowPos === "bottom" && (
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-b border-r"
                    style={{
                      background: "rgba(20,20,25,0.97)",
                      borderColor: dayTheme.accent + "50",
                    }}
                  />
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={12} style={{ color: dayTheme.accent }} />
                    <p className="text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: dayTheme.accent }}>
                      Tutoriel · {tutorialStep + 1}/{TUTORIAL_STEPS.length}
                    </p>
                  </div>
                  <button
                    onClick={() => setTutorialStep(null)}
                    className="text-[10px] text-white/40 hover:text-white/70 transition uppercase tracking-wider"
                  >
                    Passer
                  </button>
                </div>

                <h3 className="text-lg font-light mb-2 leading-tight">
                  {step.title}
                </h3>

                <p className="text-xs text-white/70 leading-relaxed mb-4">
                  {step.body}
                </p>

                {/* Progress dots */}
                <div className="flex items-center justify-center gap-1.5 mb-4">
                  {TUTORIAL_STEPS.map((_, i) => (
                    <span key={i}
                      className="rounded-full transition-all"
                      style={{
                        width: i === tutorialStep ? "16px" : "5px",
                        height: "5px",
                        background: i === tutorialStep ? dayTheme.accent : "rgba(255,255,255,0.2)",
                      }} />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-2">
                  {!isFirst && (
                    <button
                      onClick={() => setTutorialStep(tutorialStep - 1)}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs text-white/70 hover:bg-white/5 transition flex items-center justify-center gap-1"
                    >
                      <ChevronLeft size={12} /> Précédent
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (isLast) {
                        setTutorialStep(null);
                      } else {
                        setTutorialStep(tutorialStep + 1);
                      }
                    }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-medium transition hover:scale-[1.02] flex items-center justify-center gap-1"
                    style={{ background: dayTheme.accent, color: "#000" }}
                  >
                    {isLast ? "C'est parti ✨" : "Suivant"}
                    {!isLast && <ChevronRight size={12} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* === END-OF-DAY SUMMARY POPUP === */}
        {showDaySummary && (() => {
          // Compute summary stats for this day
          const totalTasks = tasks.length;
          const doneTasks = tasks.filter(t => dayCompletions[t.id] === "done").length;
          const skippedTasks = tasks.filter(t => dayCompletions[t.id] === "skipped").length;
          const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

          const metrics = dayMetrics[selectedDay] || {};
          const pauseMin = metrics.pauseMin || 0;

          // Compute total work time (sum of original task durations that were completed)
          const original = metrics.originalTasks || [];
          const workMin = tasks
            .filter(t => dayCompletions[t.id] === "done")
            .reduce((sum, t) => {
              const orig = original.find(o => o.id === t.id);
              if (orig) return sum + (toMin(orig.end) - toMin(orig.start));
              return sum + (toMin(t.end) - toMin(t.start));
            }, 0);

          // Compute total delay = current task end times vs original
          let delayMin = 0;
          if (original.length > 0) {
            original.forEach(o => {
              const current = tasks.find(t => t.id === o.id);
              if (current) {
                const diff = toMin(current.end) - toMin(o.end);
                if (diff > delayMin) delayMin = diff; // total cumulative delay = max shift on any task
              }
            });
          }

          // Personalized coaching message based on performance
          let coachTitle = "";
          let coachMessage = "";
          let coachColor = dayTheme.accent;

          if (completionRate === 100 && delayMin === 0) {
            coachTitle = "Journée parfaite ! 🎯";
            coachMessage = `Vous avez tout accompli, sans aucun retard. Quelle régularité ! Continuez sur cette lancée, c'est exactement ce qui fait la différence.`;
            coachColor = "#34D399";
          } else if (completionRate >= 80) {
            coachTitle = "Excellente journée 👏";
            coachMessage = `Vous avez accompli ${doneTasks} tâches sur ${totalTasks}. C'est une journée très solide. ${delayMin > 0 ? `Le petit retard de ${delayMin} min est tout à fait normal.` : "Bravo pour la précision !"}`;
            coachColor = "#34D399";
          } else if (completionRate >= 50) {
            coachTitle = "Bonne journée 👍";
            coachMessage = `${doneTasks} tâches accomplies sur ${totalTasks}, c'est une moitié pleine. Demain, essayez peut-être de réduire le nombre de tâches ou d'allonger leur durée pour finir en beauté.`;
            coachColor = "#FBBF24";
          } else if (completionRate > 0) {
            coachTitle = "Une journée d'apprentissage";
            coachMessage = `Vous avez validé ${doneTasks} tâche${doneTasks > 1 ? "s" : ""} sur ${totalTasks}. Pas de jugement : peut-être que votre planning était trop ambitieux. Réajustez pour demain, c'est ça qui compte.`;
            coachColor = "#FB923C";
          } else {
            coachTitle = "Demain est un nouveau jour";
            coachMessage = `Aucune tâche validée aujourd'hui. C'est OK, ça arrive. L'important c'est de revenir demain avec un plan plus simple. Petits pas, grandes victoires.`;
            coachColor = "#F472B6";
          }

          return (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[80] flex items-end sm:items-center justify-center p-4">
              <div className="bg-neutral-900 border rounded-3xl p-6 w-full max-w-sm max-h-[92vh] overflow-y-auto"
                style={{ borderColor: dayTheme.accent + "50",
                  boxShadow: `0 20px 80px ${dayTheme.accent}40` }}>

                {/* Header */}
                <div className="text-center mb-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
                    Bilan · {dayTheme.name}
                  </p>
                  <h3 className="text-2xl font-light mb-3">{coachTitle}</h3>

                  {/* Big circular completion gauge */}
                  <div className="relative w-36 h-36 mx-auto my-6">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
                      <circle cx="72" cy="72" r="64" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
                      <circle cx="72" cy="72" r="64" stroke={coachColor} strokeWidth="6" fill="none"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 64}
                        strokeDashoffset={2 * Math.PI * 64 - (completionRate / 100) * 2 * Math.PI * 64}
                        style={{
                          filter: `drop-shadow(0 0 12px ${coachColor})`,
                          transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-4xl font-extralight font-mono tabular-nums" style={{ color: coachColor }}>
                        {completionRate}<span className="text-xl text-white/40">%</span>
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
                        respecté
                      </p>
                    </div>
                  </div>
                </div>

                {/* Coaching message */}
                <p className="text-sm text-white/70 leading-relaxed text-center px-2 mb-6 italic">
                  {coachMessage}
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  <div className="rounded-xl p-3 border"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-1">Validées</p>
                    <p className="text-lg font-light">
                      <span style={{ color: dayTheme.accent }}>{doneTasks}</span>
                      <span className="text-white/40"> / {totalTasks}</span>
                    </p>
                  </div>
                  <div className="rounded-xl p-3 border"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-1">Travail</p>
                    <p className="text-lg font-light font-mono tabular-nums">
                      {Math.floor(workMin / 60)}h{String(workMin % 60).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="rounded-xl p-3 border"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-1">Pause</p>
                    <p className="text-lg font-light font-mono tabular-nums">
                      {pauseMin > 0 ? `${pauseMin} min` : "Aucune"}
                    </p>
                  </div>
                  <div className="rounded-xl p-3 border"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-1">Retard</p>
                    <p className="text-lg font-light font-mono tabular-nums"
                      style={{ color: delayMin > 30 ? "#F87171" : delayMin > 10 ? "#FBBF24" : "#FFFFFF" }}>
                      {delayMin > 0 ? `+${delayMin} min` : "0"}
                    </p>
                  </div>
                </div>

                {/* Skipped tasks indicator */}
                {skippedTasks > 0 && (
                  <p className="text-[11px] text-white/40 text-center mb-4 italic">
                    {skippedTasks} tâche{skippedTasks > 1 ? "s" : ""} passée{skippedTasks > 1 ? "s" : ""}
                  </p>
                )}

                {/* Actions */}
                <button
                  onClick={() => {
                    setShowDaySummary(false);
                    setShowStats(true);
                  }}
                  className="w-full py-3.5 rounded-xl text-sm font-medium transition hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{ background: dayTheme.accent, color: "#000" }}
                >
                  <BarChart3 size={14} />
                  Voir mes stats de la semaine
                </button>
                <button
                  onClick={() => setShowDaySummary(false)}
                  className="w-full mt-2 py-2.5 text-xs text-white/40 hover:text-white/70 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          );
        })()}

        {/* === CUSTOM TASK TEMPLATE EDITOR === */}
        {showCustomTaskEditor && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[65] flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowCustomTaskEditor(false)}>
            <div onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-light mb-1">
                {editingTemplate ? "Modifier la tâche" : "Nouvelle tâche personnalisée"}
              </h3>
              <p className="text-xs text-white/40 mb-5">
                Cette tâche sera disponible à tout moment dans votre bibliothèque.
              </p>

              {/* Name */}
              <div className="mb-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block">Nom</label>
                <input
                  type="text"
                  placeholder="Ex : Uber Eats, Montage vidéo…"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Duration */}
              <div className="mb-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block">
                  Durée par défaut
                </label>
                <div className="relative">
                  <select
                    value={templateForm.durationMin}
                    onChange={(e) => setTemplateForm({ ...templateForm, durationMin: parseInt(e.target.value) })}
                    className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none cursor-pointer"
                    style={{ color: templateForm.color }}
                  >
                    {[5,10,15,20,25,30,45,60,90,120].map(m => (
                      <option key={m} value={m} className="bg-neutral-900 text-white">
                        {m} minutes
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" />
                </div>
              </div>

              {/* Icon picker */}
              <div className="mb-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block">Icône</label>
                <div className="grid grid-cols-6 gap-1.5">
                  {CUSTOM_TASK_ICONS.map(({ key, icon: Icon }) => (
                    <button key={key}
                      onClick={() => setTemplateForm({ ...templateForm, iconKey: key })}
                      className="aspect-square rounded-xl flex items-center justify-center transition hover:scale-110"
                      style={{
                        background: templateForm.iconKey === key
                          ? templateForm.color + "30"
                          : "rgba(255,255,255,0.04)",
                        border: `1px solid ${templateForm.iconKey === key
                          ? templateForm.color + "70"
                          : "rgba(255,255,255,0.08)"}`,
                        boxShadow: templateForm.iconKey === key
                          ? `0 0 12px ${templateForm.color}50`
                          : "none",
                      }}>
                      <Icon size={15} style={{ color: templateForm.iconKey === key ? templateForm.color : "rgba(255,255,255,0.5)" }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div className="mb-6">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block">Couleur</label>
                <div className="grid grid-cols-10 gap-1.5">
                  {CUSTOM_TASK_COLORS.map((c) => (
                    <button key={c}
                      onClick={() => setTemplateForm({ ...templateForm, color: c })}
                      className="aspect-square rounded-full transition hover:scale-125"
                      style={{
                        background: c,
                        boxShadow: templateForm.color === c
                          ? `0 0 0 2px rgba(0,0,0,0.8), 0 0 0 3.5px ${c}`
                          : "none",
                        transform: templateForm.color === c ? "scale(1.2)" : undefined,
                      }} />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="mb-5 p-3.5 rounded-2xl border flex items-center gap-3"
                style={{
                  background: templateForm.color + "12",
                  borderColor: templateForm.color + "40",
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: templateForm.color + "25" }}>
                  {(() => {
                    const iconDef = CUSTOM_TASK_ICONS.find(i => i.key === templateForm.iconKey);
                    const PIcon = iconDef?.icon || Zap;
                    return <PIcon size={18} style={{ color: templateForm.color }} />;
                  })()}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: templateForm.color }}>
                    {templateForm.name || "Nom de la tâche"}
                  </p>
                  <p className="text-[11px] text-white/40">{templateForm.durationMin} min · Tâche personnalisée</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setShowCustomTaskEditor(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition">
                  Annuler
                </button>
                {editingTemplate && (
                  <button onClick={() => { deleteTemplate(editingTemplate.id); setShowCustomTaskEditor(false); }}
                    className="w-10 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition flex items-center justify-center">
                    <Trash2 size={14} />
                  </button>
                )}
                <button onClick={saveTemplate}
                  disabled={!templateForm.name.trim()}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition hover:scale-[1.02] disabled:opacity-40"
                  style={{ background: templateForm.color, color: "#000" }}>
                  {editingTemplate ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === CONFLICT RESOLUTION POPUP === */}
        {conflictDialog && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[78] flex items-end sm:items-center justify-center p-4"
            onClick={() => conflictDialog.type !== "overflow" && setConflictDialog(null)}>
            <div onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border rounded-3xl p-6 w-full max-w-sm"
              style={{
                borderColor: "rgba(248,113,113,0.5)",
                boxShadow: "0 20px 60px rgba(248,113,113,0.25)",
              }}>
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 text-2xl"
                  style={{ background: "rgba(248,113,113,0.15)",
                    border: "1px solid rgba(248,113,113,0.4)" }}>
                  ⚠️
                </div>
                <h3 className="text-xl font-light mb-2">
                  {conflictDialog.type === "invalid" && "Horaires invalides"}
                  {conflictDialog.type === "edit" && "Conflit d'horaire"}
                  {conflictDialog.type === "fullyCovered" && "Tâche déjà programmée"}
                  {conflictDialog.type === "overflow" && "Décalage impossible"}
                  {conflictDialog.type === "repairFailed" && "Réparation impossible"}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {conflictDialog.type === "invalid" && conflictDialog.message}
                  {conflictDialog.type === "edit" && (
                    <>
                      Cette modification chevauche {conflictDialog.conflicts.length === 1 ? "la tâche" : "les tâches"}{" "}
                      <span className="font-medium text-white">
                        {conflictDialog.conflicts.map(c => c.name).join(", ")}
                      </span>.
                      {conflictDialog.overflow
                        ? " Décaler les tâches suivantes ferait dépasser minuit."
                        : ` Voulez-vous décaler ${conflictDialog.conflicts.length === 1 ? "cette tâche" : "ces tâches"} ainsi que toutes les suivantes de ${conflictDialog.shiftMin} min ?`}
                    </>
                  )}
                  {conflictDialog.type === "fullyCovered" && (
                    <>
                      Le créneau choisi recouvre entièrement{" "}
                      <span className="font-medium text-white">
                        {conflictDialog.conflicts.map(c => c.name).join(", ")}
                      </span>. Modifiez l'horaire ou supprimez la tâche existante d'abord.
                    </>
                  )}
                  {conflictDialog.type === "overflow" && (
                    <>
                      L'ajout de cette tâche décalerait les suivantes au-delà de minuit
                      (décalage de {conflictDialog.shiftMin} min nécessaire). Réduisez la durée ou choisissez un autre créneau.
                    </>
                  )}
                  {conflictDialog.type === "repairFailed" && conflictDialog.message}
                </p>
              </div>

              {/* List of impacted tasks (for edit case) */}
              {conflictDialog.type === "edit" && conflictDialog.conflicts && (
                <div className="rounded-xl border p-3 mb-4 space-y-1.5"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-1.5">
                    Tâches impactées
                  </p>
                  {conflictDialog.conflicts.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                      <span className="text-xs text-white/80 flex-1">{c.name}</span>
                      <span className="text-[10px] text-white/40 font-mono tabular-nums">
                        {c.start} → {c.end}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                {/* Edit case: offer cascade option if no overflow */}
                {conflictDialog.type === "edit" && !conflictDialog.overflow && (
                  <button
                    onClick={applyEditWithCascade}
                    className="w-full py-3.5 rounded-xl text-sm font-medium transition hover:scale-[1.02]"
                    style={{ background: dayTheme.accent, color: "#000" }}
                  >
                    Décaler les tâches suivantes
                  </button>
                )}

                <button
                  onClick={() => setConflictDialog(null)}
                  className="w-full py-3 rounded-xl text-sm font-medium transition hover:bg-white/5 border border-white/10 text-white/80"
                >
                  {conflictDialog.type === "edit" || conflictDialog.type === "fullyCovered" || conflictDialog.type === "overflow"
                    ? "Annuler"
                    : "OK"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === RESET DAY CONFIRMATION === */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[79] flex items-center justify-center p-6"
            onClick={() => setShowResetConfirm(false)}>
            <div onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-white/10 rounded-3xl p-6 w-full max-w-xs text-center">
              <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)" }}>
                <RotateCcw size={22} className="text-red-400" />
              </div>
              <h3 className="text-lg font-light mb-2">Réinitialiser la journée ?</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                Toutes les tâches du jour seront supprimées et la progression effacée. Cette action est irréversible.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition">
                  Annuler
                </button>
                <button onClick={resetDay}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30">
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === PAUSE CONFIRMATION POPUP === */}
        {showPauseConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[75] flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowPauseConfirm(false)}>
            <div onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border rounded-3xl p-6 w-full max-w-sm"
              style={{ borderColor: dayTheme.accent + "40",
                boxShadow: `0 20px 60px ${dayTheme.accent}30` }}>
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ background: dayTheme.accent + "15",
                    border: `1px solid ${dayTheme.accent}40` }}>
                  <Pause size={20} style={{ color: dayTheme.accent }} fill={dayTheme.accent} />
                </div>
                <h3 className="text-xl font-light mb-2">Mettre en pause ?</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Toutes les tâches restantes de la journée seront décalées du temps de votre pause.
                </p>
              </div>

              <label className="flex items-center gap-2 mb-4 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={skipPauseConfirm}
                  onChange={(e) => setSkipPauseConfirm(e.target.checked)}
                  className="w-4 h-4 rounded accent-white/60 cursor-pointer"
                />
                <span className="text-xs text-white/50">Ne plus me demander</span>
              </label>

              <div className="space-y-2">
                <button
                  onClick={confirmPause}
                  className="w-full py-3.5 rounded-xl text-sm font-medium transition hover:scale-[1.02]"
                  style={{ background: dayTheme.accent, color: "#000" }}
                >
                  Mettre en pause
                </button>
                <button onClick={() => setShowPauseConfirm(false)}
                  className="w-full py-2.5 text-xs text-white/40 hover:text-white/70 transition">
                  Continuer la journée
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === NO-TASKS WARNING POPUP === */}
        {showNoTasksWarning && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[75] flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowNoTasksWarning(false)}>
            <div onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border rounded-3xl p-6 w-full max-w-sm"
              style={{ borderColor: dayTheme.accent + "40",
                boxShadow: `0 20px 60px ${dayTheme.accent}30` }}>
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ background: dayTheme.accent + "15",
                    border: `1px solid ${dayTheme.accent}40` }}>
                  <Target size={22} style={{ color: dayTheme.accent }} />
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                  {dayTheme.name}
                </p>
                <h3 className="text-xl font-light mb-2">Aucune tâche programmée</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Programme au moins une tâche pour démarrer la journée.
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => { setShowNoTasksWarning(false); openAdd(); }}
                  className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition hover:scale-[1.02] font-medium text-sm"
                  style={{ background: dayTheme.accent, color: "#000" }}>
                  <Plus size={16} strokeWidth={2.5} />
                  Programmer une tâche
                </button>
                <button onClick={() => setShowNoTasksWarning(false)}
                  className="w-full py-2.5 text-xs text-white/40 hover:text-white/70 transition">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === END-OF-TASK / EARLY-FINISH POPUP === */}
        {endTaskPopup && (() => {
          // Detect if popup was triggered manually (task is still in progress)
          const isInProgress = currentTask?.id === endTaskPopup.id;
          // Compute time saved if user finishes now
          let minutesSaved = 0;
          if (isInProgress) {
            const taskEnd = toMin(endTaskPopup.end);
            let nowMinutes;
            if (demoMode) {
              const elapsedInTask = demoElapsed % DEMO_TASK_DURATION;
              const fakeProgressRatio = elapsedInTask / DEMO_TASK_DURATION;
              const taskDur = toMin(endTaskPopup.end) - toMin(endTaskPopup.start);
              nowMinutes = toMin(endTaskPopup.start) + fakeProgressRatio * taskDur;
            } else {
              nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
            }
            minutesSaved = Math.max(0, Math.round(taskEnd - nowMinutes));
          }

          return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-end sm:items-center justify-center p-4">
              <div className="bg-neutral-900 border rounded-3xl p-6 w-full max-w-sm"
                style={{ borderColor: endTaskPopup.color + "60",
                  boxShadow: `0 20px 60px ${endTaskPopup.color}30` }}>

                {!showExtendChoice ? (
                  <>
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                        style={{ background: endTaskPopup.color + "20",
                          boxShadow: `0 0 30px ${endTaskPopup.color}40` }}>
                        <CheckCircle2 size={28} style={{ color: endTaskPopup.color }} />
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                        {isInProgress ? "Tâche en cours" : "Tâche terminée"}
                      </p>
                      <h3 className="text-2xl font-light mb-2">{endTaskPopup.name}</h3>
                      <p className="text-sm text-white/60">
                        {isInProgress
                          ? "Avez-vous déjà fini votre objectif ?"
                          : "Avez-vous rempli votre objectif ?"}
                      </p>
                      {!isInProgress && (
                        <p className="text-[11px] text-white/30 italic mt-3 px-2">
                          Prenez votre temps · vos prochaines tâches sont en pause
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      {/* Early finish (only when in progress with time left) */}
                      {isInProgress && minutesSaved > 0 && (
                        <button onClick={() => finishEarly(endTaskPopup)}
                          className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                          style={{ background: endTaskPopup.color, color: "#000" }}>
                          <Check size={16} strokeWidth={2.5} />
                          <span className="text-sm font-medium">
                            J'ai déjà fini · gagner {minutesSaved} min
                          </span>
                        </button>
                      )}

                      {/* Default "done" — used when task ends naturally OR when there's no time left */}
                      {(!isInProgress || minutesSaved === 0) && (
                        <button onClick={() => markTaskDone(endTaskPopup.id)}
                          className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                          style={{ background: endTaskPopup.color, color: "#000" }}>
                          <Check size={16} strokeWidth={2.5} />
                          <span className="text-sm font-medium">Oui, c'est fait</span>
                        </button>
                      )}

                      <button onClick={() => setShowExtendChoice(true)}
                        className="w-full py-3.5 rounded-xl border border-white/15 text-sm text-white/80 hover:bg-white/5 transition flex items-center justify-center gap-2">
                        <Plus size={14} />
                        {isInProgress ? "Pas encore, ajouter du temps" : "Non, ajouter du temps"}
                      </button>
                      <button onClick={() => {
                          if (isInProgress) {
                            popupOpenedAtRef.current = null;
                            popupTriggerKindRef.current = null;
                            setEndTaskPopup(null);
                          } else {
                            markTaskSkipped(endTaskPopup.id);
                          }
                        }}
                        className="w-full py-2.5 text-xs text-white/40 hover:text-white/70 transition">
                        {isInProgress ? "Continuer normalement" : "Passer à la prochaine tâche"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={16} style={{ color: endTaskPopup.color }} />
                      <h3 className="text-lg font-light">Combien de temps ajouter ?</h3>
                    </div>
                    <p className="text-xs text-white/40 mb-5">
                      Les tâches suivantes seront décalées automatiquement
                    </p>

                    {/* Dropdown selector for minutes */}
                    <div className="mb-5">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block">
                        Durée supplémentaire
                      </label>
                      <div className="relative">
                        <select
                          value={extendMinutes}
                          onChange={(e) => setExtendMinutes(parseInt(e.target.value, 10))}
                          className="w-full appearance-none bg-white/5 border rounded-xl pl-4 pr-10 py-3.5 text-base font-medium focus:outline-none cursor-pointer transition"
                          style={{
                            borderColor: endTaskPopup.color + "50",
                            color: endTaskPopup.color,
                          }}
                        >
                          {[1, 2, 3, 5, 7, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 75, 90, 105, 120, 150, 180].map((min) => (
                            <option key={min} value={min} className="bg-neutral-900 text-white">
                              +{min} minute{min > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: endTaskPopup.color }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => setShowExtendChoice(false)}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition">
                        Retour
                      </button>
                      <button onClick={() => extendTask(endTaskPopup, extendMinutes)}
                        className="flex-1 py-3 rounded-xl text-sm font-medium transition hover:scale-[1.02]"
                        style={{ background: endTaskPopup.color, color: "#000" }}>
                        Confirmer
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
