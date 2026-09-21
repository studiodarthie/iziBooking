import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/public/LegalPage";

export const metadata: Metadata = {
  title: "Règlement de la plateforme - iziBooking",
  description: "Les règles de bonne conduite pour les prestataires et les organisateurs sur iziBooking.",
};

const sections: LegalSection[] = [
  {
    id: "objet",
    title: "Objet",
    body: (
      <p>Ce règlement fixe les règles de bonne conduite applicables à tous les utilisateurs d’iziBooking. Il complète les <Link href="/cgv">CGV</Link> et vise à préserver une communauté fiable, respectueuse et professionnelle.</p>
    ),
  },
  {
    id: "communes",
    title: "Règles communes",
    body: (
      <ul>
        <li>Fournir des informations exactes, à jour et vérifiables.</li>
        <li>Utiliser un seul compte par personne ou par structure.</li>
        <li>Communiquer avec courtoisie et respect, sans harcèlement, injure ni discrimination.</li>
        <li>Ne pas publier de contenu illégal, trompeur, violent ou portant atteinte aux droits d’autrui.</li>
        <li>Ne pas tenter de contourner les mesures de sécurité de la Plateforme.</li>
      </ul>
    ),
  },
  {
    id: "prestataires",
    title: "Règles pour les prestataires",
    body: (
      <ul>
        <li>Présenter honnêtement vos services, vos tarifs et vos disponibilités ; utiliser vos propres photos ou des contenus dont vous détenez les droits.</li>
        <li>Répondre aux demandes dans un délai raisonnable et tenir votre calendrier à jour.</li>
        <li>Honorer les réservations acceptées. Une annulation de dernière minute injustifiée peut entraîner une sanction.</li>
        <li>Fournir la prestation telle que décrite, avec professionnalisme et ponctualité.</li>
      </ul>
    ),
  },
  {
    id: "organisateurs",
    title: "Règles pour les organisateurs",
    body: (
      <ul>
        <li>Décrire précisément votre événement (date, lieu, type, attentes) dès la demande.</li>
        <li>Régler l’acompte convenu dans les délais et respecter les conditions acceptées.</li>
        <li>Respecter le prestataire et son équipe le jour de l’événement.</li>
        <li>Ne pas demander de prestation contraire à la loi ou aux bonnes mœurs.</li>
      </ul>
    ),
  },
  {
    id: "avis",
    title: "Avis et contenus",
    body: (
      <>
        <p>Seul un organisateur ayant réalisé une réservation peut déposer un avis sur le prestataire concerné. Les avis doivent refléter une expérience réelle.</p>
        <p>Sont interdits : les faux avis, les avis rédigés en échange d’une contrepartie, les propos diffamatoires ou injurieux. iziBooking peut retirer tout contenu non conforme.</p>
      </>
    ),
  },
  {
    id: "paiements",
    title: "Paiements et transparence",
    body: (
      <>
        <p>Les paiements doivent transiter par la Plateforme chaque fois que cela est proposé : c’est ce qui garantit la protection de l’acompte et l’accès à la médiation.</p>
        <p>Lorsqu’un règlement direct est choisi, il doit être déclaré sur la réservation. Toute manœuvre visant à éluder les frais de service ou la commission est interdite.</p>
      </>
    ),
  },
  {
    id: "litiges",
    title: "Signalement et litiges",
    body: (
      <p>Si vous constatez un comportement ou un contenu contraire à ce règlement, signalez-le via la <Link href="/contact">page Contact</Link>. Pour un désaccord sur une prestation, ouvrez un litige depuis la réservation concernée : l’équipe iziBooking l’examinera.</p>
    ),
  },
  {
    id: "sanctions",
    title: "Sanctions",
    body: (
      <>
        <p>En cas de manquement, iziBooking peut, selon la gravité : adresser un avertissement, retirer un contenu, suspendre la visibilité d’un profil, ou bannir définitivement un compte.</p>
        <p>L’utilisateur concerné est informé de la mesure et peut présenter ses observations par email.</p>
      </>
    ),
  },
  {
    id: "modification",
    title: "Évolution du règlement",
    body: <p>Ce règlement peut évoluer pour tenir compte de l’évolution de la Plateforme. La version en vigueur est celle publiée sur cette page.</p>,
  },
];

export default function ReglementPage() {
  return (
    <LegalPage
      current="/reglement"
      title="Règlement de la plateforme"
      intro="Les règles de bonne conduite qui font d’iziBooking un espace de confiance pour tous."
      updated="21 septembre 2026"
      sections={sections}
    />
  );
}
