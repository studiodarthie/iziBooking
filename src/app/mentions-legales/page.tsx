import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/public/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales - iziBooking",
  description: "Informations légales sur l’éditeur et l’hébergeur du site iziBooking.",
};

const PHOTO_CREDITS = [
  { title: "Danse traditionnelle sur scène", author: "MediaMOF", url: "https://commons.wikimedia.org/wiki/File:Traditional_Dance_Performance_at_Cultural_Event_in_Nigeria_49.jpg" },
  { title: "Danseurs en costumes traditionnels", author: "MediaMOF", url: "https://commons.wikimedia.org/wiki/File:Traditional_Dance_Performance_at_Cultural_Event_in_Nigeria_186.jpg" },
  { title: "Première danse des mariés (Nigeria)", author: "Sani Oumar", url: "https://commons.wikimedia.org/wiki/File:A_moment_of_joy_-_Bride_and_her_groom_dancing_at_their_wedding_party_in_northern_Nigeria_(1).jpg" },
];

const sections: LegalSection[] = [
  {
    id: "editeur",
    title: "Éditeur du site",
    body: (
      <>
        <ul>
          <li><strong>Nom du site</strong> : iziBooking.app</li>
          <li><strong>Statut</strong> : filiale de Ets Darthie, entreprise individuelle</li>
          <li><strong>Siège social</strong> : Douala, Cameroun</li>
          <li><strong>Email de contact</strong> : <a href="mailto:itsizibooking@gmail.com">itsizibooking@gmail.com</a></li>
        </ul>
      </>
    ),
  },
  {
    id: "publication",
    title: "Directeur de la publication",
    body: <p>Le gérant d’iziBooking.app.</p>,
  },
  {
    id: "hebergement",
    title: "Hébergement",
    body: (
      <ul>
        <li><strong>Application</strong> : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</li>
        <li><strong>Base de données</strong> : Neon, Inc. (infrastructure Amazon Web Services, région États-Unis Est).</li>
        <li><strong>Médias</strong> : Cloudinary Ltd.</li>
      </ul>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: <p>Pour toute question, écrivez-nous à <a href="mailto:itsizibooking@gmail.com">itsizibooking@gmail.com</a> ou via la <Link href="/contact">page Contact</Link>.</p>,
  },
  {
    id: "propriete",
    title: "Propriété intellectuelle",
    body: (
      <p>La marque, le logo, la charte graphique, les textes et le code du site sont la propriété de l’éditeur, sauf mention contraire. Toute reproduction ou réutilisation sans autorisation écrite est interdite. Les contenus publiés par les prestataires demeurent leur propriété.</p>
    ),
  },
  {
    id: "credits",
    title: "Crédits photos",
    body: (
      <>
        <p>Certaines photographies de ce site proviennent de Wikimedia Commons et sont diffusées sous licence <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr" target="_blank" rel="noopener noreferrer">Creative Commons BY-SA 4.0</a> :</p>
        <ul>
          {PHOTO_CREDITS.map((c) => (
            <li key={c.url}>
              {c.title} — © {c.author},{" "}
              <a href={c.url} target="_blank" rel="noopener noreferrer">source</a>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "donnees",
    title: "Données personnelles et cookies",
    body: (
      <p>Le traitement de vos données est détaillé dans la <Link href="/confidentialite">Politique de confidentialité</Link>. Le site utilise uniquement les cookies nécessaires à son fonctionnement (session de connexion).</p>
    ),
  },
  {
    id: "droit",
    title: "Droit applicable",
    body: <p>Le présent site est soumis au droit camerounais. Les juridictions camerounaises sont compétentes pour tout litige qui s’y rapporterait.</p>,
  },
];

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      current="/mentions-legales"
      title="Mentions légales"
      intro="Qui édite et héberge iziBooking, et comment nous contacter."
      updated="21 septembre 2026"
      sections={sections}
    />
  );
}
