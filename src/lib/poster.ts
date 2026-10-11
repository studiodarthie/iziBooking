import { PosterTheme } from "@prisma/client";

/**
 * Générateur d'affiches "J'y serai" — tout le rendu passe par des transformations Cloudinary
 * chaînées dans l'URL, sans asset de gabarit à concevoir ni appel serveur au SDK Cloudinary :
 * fond uni, photo recadrée en cercle avec liseré, textes superposés, filigrane conditionnel.
 * Les coordonnées ci-dessous visent un format portrait 1080x1350 (idéal story/statut WhatsApp).
 */

export const POSTER_THEMES: Record<PosterTheme, { label: string; bg: string; accent: string; text: string }> = {
  BRIQUE: { label: "Brique", bg: "331408", accent: "C9982B", text: "FFFFFF" },
  DORE: { label: "Doré", bg: "332709", accent: "F2E0AC", text: "FFFFFF" },
  FORET: { label: "Forêt", bg: "0D1F17", accent: "E7EDE9", text: "FFFFFF" },
};

const CANVAS_W = 1080;
const CANVAS_H = 1350;

function cloudName(): string {
  const name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!name) throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME manquant");
  return name;
}

/** Encode un texte pour une transformation Cloudinary (l_text:...). */
function encodeCloudinaryText(value: string): string {
  return encodeURIComponent(value)
    .replace(/%2C/g, "%252C") // virgule = séparateur de transformation, doit être doublement encodée
    .replace(/\//g, "%252F");
}

export function slugifyPosterTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "evenement";
}

export function buildPosterUrl(params: {
  photoPublicId: string;
  title: string;
  eventDateLabel?: string | null;
  theme: PosterTheme;
  showWatermark: boolean;
}): string {
  const { photoPublicId, title, eventDateLabel, theme, showWatermark } = params;
  const t = POSTER_THEMES[theme];

  // La photo de l'utilisateur est la ressource de base (elle existe forcément, on vient de
  // l'uploader) : pas besoin d'un asset de gabarit externe. On la recadre en cercle, puis on
  // la "pose" sur une toile de couleur unie plus grande, avant d'empiler les textes.
  const steps: string[] = [
    `w_440,h_440,c_thumb,g_face,r_max,bo_12px_solid_rgb:${t.accent}`,
    `b_rgb:${t.bg},w_${CANVAS_W},h_${CANVAS_H},c_pad,g_north,y_100`,
    `l_text:Poppins_76_bold:J%27Y%20SERAI,co_rgb:${t.text}/fl_layer_apply,g_north,y_1060`,
    `l_text:Poppins_46_bold:${encodeCloudinaryText(title)},co_rgb:${t.text},w_900,c_fit/fl_layer_apply,g_north,y_1170`,
  ];

  if (eventDateLabel) {
    steps.push(
      `l_text:Poppins_32:${encodeCloudinaryText(eventDateLabel)},co_rgb:${t.accent}/fl_layer_apply,g_north,y_1250`
    );
  }

  if (showWatermark) {
    steps.push(
      `l_text:Poppins_28_bold:izibooking.app,co_rgb:${t.text},o_55/fl_layer_apply,g_south,y_50`
    );
  }

  steps.push("f_auto,q_auto");

  return `https://res.cloudinary.com/${cloudName()}/image/upload/${steps.join("/")}/${photoPublicId}`;
}
