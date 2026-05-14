// Tutorial steps. `target` is a `data-tour` attribute value pointing to the
// DOM element to spotlight. `null` = centered modal with no spotlight.
export const TUTORIAL_STEPS = [
  {
    title: "Bienvenue 👋",
    body: "Voici un tour rapide pour découvrir Focus. Cela prend moins d'une minute. Vous pouvez passer à tout moment.",
    target: null,
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
