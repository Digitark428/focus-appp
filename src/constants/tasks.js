import {
  Activity, Award, BarChart3, Bike, BookOpen, Brain, Briefcase, Camera, Clock,
  CloudRain, Coffee, Dumbbell, Flame, Footprints, GraduationCap, Hammer, Heart,
  Home, Mail, Moon, Mountain, Music, Palette, Phone, Pill, Plane, Search,
  ShoppingCart, Sparkles, Target, Trees, Users, Utensils, Waves, Wind, Zap,
} from "lucide-react";

// Ambient soundscapes (synthesized via Web Audio API at runtime).
export const AMBIENT_SOUNDS = [
  { id: "rain",   name: "Pluie douce", icon: CloudRain, color: "#60A5FA" },
  { id: "forest", name: "Forêt",       icon: Trees,     color: "#34D399" },
  { id: "cafe",   name: "Café",        icon: Coffee,    color: "#FB923C" },
  { id: "lofi",   name: "Lo-Fi",       icon: Music,     color: "#A78BFA" },
  { id: "wind",   name: "Vent",        icon: Wind,      color: "#94A3B8" },
];

// Guided meditations attachable to tasks.
export const MEDITATIONS = [
  {
    id: "breath-478", name: "Respiration 4-7-8", duration: 5, icon: Wind, color: "#60A5FA",
    description: "Inspirez 4s · Retenez 7s · Expirez 8s",
    script: "Installez-vous confortablement... Fermez les yeux...",
  },
  {
    id: "body-scan", name: "Scan corporel", duration: 10, icon: Heart, color: "#F472B6",
    description: "Détendez chaque partie du corps",
    script: "Commencez par détendre votre tête...",
  },
  {
    id: "focus", name: "Concentration", duration: 5, icon: Brain, color: "#A78BFA",
    description: "Préparez votre esprit au travail",
    script: "Concentrez-vous sur votre respiration...",
  },
  {
    id: "energy", name: "Énergie matinale", duration: 7, icon: Flame, color: "#FB923C",
    description: "Démarrez la journée avec vitalité",
    script: "Sentez l'énergie circuler...",
  },
  {
    id: "sleep", name: "Détente du soir", duration: 12, icon: Moon, color: "#94A3B8",
    description: "Préparez le corps au sommeil",
    script: "Relâchez les tensions...",
  },
];

// Icons available when creating a custom task template.
export const CUSTOM_TASK_ICONS = [
  { key: "Zap", icon: Zap },           { key: "Star", icon: Sparkles },     { key: "Flame", icon: Flame },
  { key: "Heart", icon: Heart },       { key: "Brain", icon: Brain },       { key: "Target", icon: Target },
  { key: "Music", icon: Music },       { key: "Coffee", icon: Coffee },     { key: "Dumbbell", icon: Dumbbell },
  { key: "Briefcase", icon: Briefcase }, { key: "BookOpen", icon: BookOpen }, { key: "Camera", icon: Camera },
  { key: "Phone", icon: Phone },       { key: "Home", icon: Home },         { key: "Plane", icon: Plane },
  { key: "ShoppingCart", icon: ShoppingCart }, { key: "Users", icon: Users }, { key: "Clock", icon: Clock },
  { key: "Moon", icon: Moon },         { key: "Award", icon: Award },       { key: "Palette", icon: Palette },
  { key: "Mountain", icon: Mountain }, { key: "Bike", icon: Bike },         { key: "GraduationCap", icon: GraduationCap },
];

// Color swatches for custom task templates.
export const CUSTOM_TASK_COLORS = [
  "#A78BFA", "#60A5FA", "#34D399", "#FBBF24", "#FB923C",
  "#F472B6", "#F87171", "#22D3EE", "#A3E635", "#E879F9",
  "#38BDF8", "#4ADE80", "#FCD34D", "#FDA4AF", "#C4B5FD",
  "#6EE7B7", "#FCA5A1", "#93C5FD", "#FDE68A", "#FFFFFF",
];

// Predefined activity categories with their subcategories.
export const TASK_CATEGORIES = [
  {
    id: "sport", name: "Sport", icon: Dumbbell, color: "#FF6B6B",
    subcategories: [
      { name: "Musculation", icon: Dumbbell },     { name: "Cardio", icon: Activity },
      { name: "Course à pied", icon: Footprints }, { name: "Vélo", icon: Bike },
      { name: "Natation", icon: Waves },           { name: "Yoga", icon: Heart },
      { name: "Pilates", icon: Activity },         { name: "CrossFit", icon: Flame },
      { name: "HIIT", icon: Zap },                 { name: "Boxe", icon: Target },
      { name: "Football", icon: Target },          { name: "Basketball", icon: Target },
      { name: "Tennis", icon: Target },            { name: "Randonnée", icon: Mountain },
      { name: "Escalade", icon: Mountain },        { name: "Stretching", icon: Activity },
      { name: "Marche active", icon: Footprints }, { name: "Danse", icon: Music },
      { name: "Arts martiaux", icon: Target },     { name: "Skateboard", icon: Activity },
    ],
  },
  {
    id: "work", name: "Travail", icon: Briefcase, color: "#4ECDC4",
    subcategories: [
      { name: "Travail concentré", icon: Brain }, { name: "Réunion", icon: Users },
      { name: "Mails", icon: Mail },              { name: "Appels", icon: Phone },
      { name: "Brainstorming", icon: Sparkles },  { name: "Présentation", icon: BarChart3 },
      { name: "Création", icon: Palette },        { name: "Administratif", icon: BookOpen },
    ],
  },
  {
    id: "meditation", name: "Méditation", icon: Brain, color: "#A78BFA",
    subcategories: [
      { name: "Respiration 4-7-8", icon: Wind,  meditationId: "breath-478" },
      { name: "Scan corporel",     icon: Heart, meditationId: "body-scan" },
      { name: "Concentration",     icon: Brain, meditationId: "focus" },
      { name: "Énergie matinale",  icon: Flame, meditationId: "energy" },
      { name: "Détente du soir",   icon: Moon,  meditationId: "sleep" },
    ],
  },
  {
    id: "meal", name: "Repas", icon: Utensils, color: "#FFE66D",
    subcategories: [
      { name: "Petit déjeuner", icon: Utensils }, { name: "Déjeuner", icon: Utensils },
      { name: "Dîner", icon: Utensils },          { name: "Collation", icon: Utensils },
      { name: "Préparation repas", icon: Hammer },
    ],
  },
  {
    id: "study", name: "Étude", icon: GraduationCap, color: "#60A5FA",
    subcategories: [
      { name: "Lecture", icon: BookOpen },              { name: "Révisions", icon: GraduationCap },
      { name: "Cours en ligne", icon: GraduationCap },  { name: "Devoirs", icon: BookOpen },
      { name: "Recherche", icon: Search },              { name: "Apprendre une langue", icon: GraduationCap },
    ],
  },
  {
    id: "errand", name: "Courses & vie", icon: ShoppingCart, color: "#FB923C",
    subcategories: [
      { name: "Courses", icon: ShoppingCart }, { name: "Ménage", icon: Home },
      { name: "Lessive", icon: Home },         { name: "Cuisine", icon: Utensils },
      { name: "Rangement", icon: Home },       { name: "Bricolage", icon: Hammer },
    ],
  },
  {
    id: "wellness", name: "Bien-être", icon: Heart, color: "#F472B6",
    subcategories: [
      { name: "Douche", icon: Waves },        { name: "Skincare", icon: Sparkles },
      { name: "Médicaments", icon: Pill },    { name: "Journal", icon: BookOpen },
      { name: "Gratitude", icon: Heart },     { name: "Sieste", icon: Moon },
    ],
  },
  {
    id: "social", name: "Social & loisirs", icon: Users, color: "#34D399",
    subcategories: [
      { name: "Famille", icon: Users },       { name: "Amis", icon: Users },
      { name: "Appel proches", icon: Phone }, { name: "Sortie", icon: Plane },
      { name: "Lecture loisir", icon: BookOpen }, { name: "Jeu vidéo", icon: Target },
      { name: "Film / Série", icon: Music },
    ],
  },
  {
    id: "break", name: "Pause", icon: Moon, color: "#FFFFFF",
    isPause: true, // special design flag — rendered as a distinct white "moon" card
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

// Initial empty task lists for each day of the week (0=Monday ... 6=Sunday).
export const DEFAULT_TASKS = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
export const DEFAULT_FLOATING = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
export const DEFAULT_COMPLETIONS = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} };
export const DEFAULT_DAY_METRICS = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} };
