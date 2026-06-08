import {
  Activity, Award, BarChart3, Bike, BookOpen, Brain, Briefcase, Camera, Clock,
  CloudRain, Coffee, Dumbbell, Flame, Footprints, GraduationCap, Hammer, Heart,
  Home, Mail, Moon, Mountain, Music, Palette, Phone, Pill, Plane, Search,
  ShoppingCart, Sparkles, Target, Trees, Users, Utensils, Waves, Wind, Zap,
} from "lucide-react";

// Ambient soundscapes (synthesized via Web Audio API at runtime).
// Palette Tempo : tons bleu nuit / doré, accents subtils pour préserver
// la hiérarchie visuelle sans casser l'identité.
export const AMBIENT_SOUNDS = [
  { id: "rain",   name: "Pluie douce", icon: CloudRain, color: "#7FA8D4" },
  { id: "forest", name: "Forêt",       icon: Trees,     color: "#9AB99A" },
  { id: "cafe",   name: "Café",        icon: Coffee,    color: "#D9B36A" },
  { id: "lofi",   name: "Lo-Fi",       icon: Music,     color: "#B8A0D4" },
  { id: "wind",   name: "Vent",        icon: Wind,      color: "#B8C0CC" },
];

// Guided meditations attachable to tasks. Palette Tempo unifiée.
export const MEDITATIONS = [
  {
    id: "breath-478", name: "Respiration 4-7-8", duration: 5, icon: Wind, color: "#7FA8D4",
    description: "Inspirez 4s · Retenez 7s · Expirez 8s",
    script: "Installez-vous confortablement... Fermez les yeux...",
  },
  {
    id: "body-scan", name: "Scan corporel", duration: 10, icon: Heart, color: "#D9B36A",
    description: "Détendez chaque partie du corps",
    script: "Commencez par détendre votre tête...",
  },
  {
    id: "focus", name: "Concentration", duration: 5, icon: Brain, color: "#B8A0D4",
    description: "Préparez votre esprit au travail",
    script: "Concentrez-vous sur votre respiration...",
  },
  {
    id: "energy", name: "Énergie matinale", duration: 7, icon: Flame, color: "#F2D28F",
    description: "Démarrez la journée avec vitalité",
    script: "Sentez l'énergie circuler...",
  },
  {
    id: "sleep", name: "Détente du soir", duration: 12, icon: Moon, color: "#9AA8C0",
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

// Color swatches for custom task templates. Palette Tempo : déclinaisons
// dorées et bleues nuit, accents subtils pour préserver l'identité.
export const CUSTOM_TASK_COLORS = [
  "#D9B36A", "#F2D28F", "#E2C078", "#C9A361", "#B88E45",
  "#7FA8D4", "#9AB7D9", "#B8A0D4", "#9AA8C0", "#B8C0CC",
  "#E8C684", "#F5D89A", "#A8C0DC", "#C7B5DC", "#9AB99A",
  "#D9C8A0", "#D9B36A", "#7B95B8", "#B8A88C", "#F5F7FA",
];

// Predefined activity categories with their subcategories.
// Palette Tempo : chaque catégorie reste distincte (hiérarchie visuelle),
// mais toutes les couleurs vivent dans la famille bleu nuit / doré subtil
// pour rester cohérent avec l'identité.
export const TASK_CATEGORIES = [
  {
    id: "sport", name: "Sport", icon: Dumbbell, color: "#E8C684",
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
    id: "work", name: "Travail", icon: Briefcase, color: "#D9B36A",
    subcategories: [
      { name: "Travail concentré", icon: Brain }, { name: "Réunion", icon: Users },
      { name: "Mails", icon: Mail },              { name: "Appels", icon: Phone },
      { name: "Brainstorming", icon: Sparkles },  { name: "Présentation", icon: BarChart3 },
      { name: "Création", icon: Palette },        { name: "Administratif", icon: BookOpen },
    ],
  },
  {
    id: "meditation", name: "Méditation", icon: Brain, color: "#B8A0D4",
    subcategories: [
      { name: "Respiration 4-7-8", icon: Wind,  meditationId: "breath-478" },
      { name: "Scan corporel",     icon: Heart, meditationId: "body-scan" },
      { name: "Concentration",     icon: Brain, meditationId: "focus" },
      { name: "Énergie matinale",  icon: Flame, meditationId: "energy" },
      { name: "Détente du soir",   icon: Moon,  meditationId: "sleep" },
    ],
  },
  {
    id: "meal", name: "Repas", icon: Utensils, color: "#F2D28F",
    subcategories: [
      { name: "Petit déjeuner", icon: Utensils }, { name: "Déjeuner", icon: Utensils },
      { name: "Dîner", icon: Utensils },          { name: "Collation", icon: Utensils },
      { name: "Préparation repas", icon: Hammer },
    ],
  },
  {
    id: "study", name: "Étude", icon: GraduationCap, color: "#7FA8D4",
    subcategories: [
      { name: "Lecture", icon: BookOpen },              { name: "Révisions", icon: GraduationCap },
      { name: "Cours en ligne", icon: GraduationCap },  { name: "Devoirs", icon: BookOpen },
      { name: "Recherche", icon: Search },              { name: "Apprendre une langue", icon: GraduationCap },
    ],
  },
  {
    id: "errand", name: "Courses & vie", icon: ShoppingCart, color: "#C9A361",
    subcategories: [
      { name: "Courses", icon: ShoppingCart }, { name: "Ménage", icon: Home },
      { name: "Lessive", icon: Home },         { name: "Cuisine", icon: Utensils },
      { name: "Rangement", icon: Home },       { name: "Bricolage", icon: Hammer },
    ],
  },
  {
    id: "wellness", name: "Bien-être", icon: Heart, color: "#D9B8B0",
    subcategories: [
      { name: "Douche", icon: Waves },        { name: "Skincare", icon: Sparkles },
      { name: "Médicaments", icon: Pill },    { name: "Journal", icon: BookOpen },
      { name: "Gratitude", icon: Heart },     { name: "Sieste", icon: Moon },
    ],
  },
  {
    id: "social", name: "Social & loisirs", icon: Users, color: "#9AB99A",
    subcategories: [
      { name: "Famille", icon: Users },       { name: "Amis", icon: Users },
      { name: "Appel proches", icon: Phone }, { name: "Sortie", icon: Plane },
      { name: "Lecture loisir", icon: BookOpen }, { name: "Jeu vidéo", icon: Target },
      { name: "Film / Série", icon: Music },
    ],
  },
  {
    id: "break", name: "Pause", icon: Moon, color: "#F5F7FA",
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
export const DEFAULT_TASKS = {};
export const DEFAULT_FLOATING = {};
export const DEFAULT_COMPLETIONS = {};
export const DEFAULT_DAY_METRICS = {};
