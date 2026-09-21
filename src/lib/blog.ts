// Articles du blog. Ajouter un article = ajouter un objet à `posts` (puis créer la page /blog/[slug]).
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO, ex. "2026-10-01"
  image?: string;
  readingMinutes?: number;
};

export const BLOG_CATEGORIES = [
  { name: "Conseils organisateurs", desc: "Choisir, comparer et réserver sereinement pour votre événement." },
  { name: "Guides prestataires", desc: "Développer votre activité, soigner votre profil, fidéliser vos clients." },
  { name: "Culture & scène africaine", desc: "Artistes, traditions et tendances de la scène événementielle." },
  { name: "Actualités iziBooking", desc: "Nouveautés de la plateforme et arrivée dans de nouveaux pays." },
];

export const UPCOMING_TOPICS = [
  { category: "Conseils organisateurs", title: "Comment choisir son DJ de mariage : 7 questions à poser" },
  { category: "Conseils organisateurs", title: "Budget événement : comment répartir vos dépenses" },
  { category: "Guides prestataires", title: "Photographes : préparer un portfolio qui décroche des réservations" },
  { category: "Culture & scène africaine", title: "Les rythmes traditionnels qui font danser les mariages" },
];

export const posts: BlogPost[] = [];
