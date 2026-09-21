import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/public/LegalPage";

export const metadata: Metadata = {
  title: "Accord de traitement des données (DPA) - iziBooking",
  description: "Engagements d’iziBooking en matière de traitement et de protection des données personnelles.",
};

const sections: LegalSection[] = [
  {
    id: "objet",
    title: "Objet",
    body: (
      <p>Le présent accord de traitement des données (« DPA ») décrit les engagements d’iziBooking en matière de protection des données personnelles traitées dans le cadre de l’utilisation de la Plateforme. Il complète les <Link href="/cgv">CGV</Link> et la <Link href="/confidentialite">Politique de confidentialité</Link>.</p>
    ),
  },
  {
    id: "roles",
    title: "Rôles des parties",
    body: (
      <>
        <p><strong>iziBooking</strong> est responsable du traitement des données de comptes, de réservations et de paiements nécessaires au fonctionnement de la Plateforme.</p>
        <p>Lorsqu’un Prestataire reçoit des données d’un Organisateur pour exécuter une prestation (nom, coordonnées, détails de l’événement), il les traite en tant que responsable de traitement distinct, pour cette seule finalité, et s’engage à respecter la réglementation applicable.</p>
        <p>Pour les traitements effectués pour son compte, iziBooking agit conformément aux instructions documentées dans ses CGV et sa politique de confidentialité.</p>
      </>
    ),
  },
  {
    id: "donnees",
    title: "Nature des données et personnes concernées",
    body: (
      <ul>
        <li><strong>Personnes concernées</strong> : organisateurs, prestataires et leurs représentants, visiteurs de la Plateforme.</li>
        <li><strong>Catégories de données</strong> : identité, coordonnées, contenus de profil, données de réservation, messages, références de paiement, données techniques de connexion.</li>
        <li><strong>Données sensibles</strong> : iziBooking ne demande pas de données sensibles ; les utilisateurs sont invités à ne pas en partager dans les messages.</li>
      </ul>
    ),
  },
  {
    id: "obligations",
    title: "Engagements d’iziBooking",
    body: (
      <ul>
        <li>Ne traiter les données que pour les finalités décrites et documentées.</li>
        <li>Garantir la confidentialité : seules les personnes habilitées y accèdent, tenues à une obligation de confidentialité.</li>
        <li>Mettre en œuvre des mesures de sécurité adaptées (chiffrement des échanges, contrôle d’accès, sauvegardes).</li>
        <li>Aider les personnes concernées à exercer leurs droits (accès, rectification, effacement, etc.).</li>
        <li>Ne jamais vendre les données personnelles.</li>
      </ul>
    ),
  },
  {
    id: "sous-traitants",
    title: "Sous-traitants ultérieurs",
    body: (
      <>
        <p>iziBooking recourt aux sous-traitants suivants, liés par des obligations de protection équivalentes :</p>
        <ul>
          <li>Vercel Inc. — hébergement de l’application (États-Unis) ;</li>
          <li>Neon, Inc. — base de données (États-Unis) ;</li>
          <li>Cloudinary Ltd. — stockage de médias ;</li>
          <li>Resend — envoi d’emails ;</li>
          <li>Tranzak — traitement des paiements ;</li>
          <li>Google — authentification (facultative).</li>
        </ul>
        <p>Toute modification de cette liste sera portée à la connaissance des utilisateurs, qui pourront s’y opposer en contactant iziBooking.</p>
      </>
    ),
  },
  {
    id: "transferts",
    title: "Transferts internationaux",
    body: (
      <p>Certaines données peuvent être hébergées ou traitées hors de votre pays, notamment aux États-Unis. Ces transferts sont encadrés par des garanties appropriées.</p>
    ),
  },
  {
    id: "violation",
    title: "Violation de données",
    body: (
      <p>En cas de violation de données à caractère personnel, iziBooking en informe les personnes et autorités concernées dans les meilleurs délais et, lorsque la réglementation l’impose, dans un délai de 72 heures après en avoir pris connaissance, avec les informations utiles pour en limiter les conséquences.</p>
    ),
  },
  {
    id: "duree",
    title: "Durée, restitution et suppression",
    body: (
      <p>Les données sont traitées pendant la durée de la relation avec l’utilisateur. À la clôture d’un compte, elles sont supprimées ou anonymisées, à l’exception de celles que la loi impose de conserver (notamment comptables), dans les délais indiqués dans la politique de confidentialité.</p>
    ),
  },
  {
    id: "audit",
    title: "Contrôle et audit",
    body: (
      <p>Sur demande écrite raisonnable, iziBooking met à disposition les informations nécessaires pour démontrer le respect de ses engagements, et contribue aux audits menés par une autorité compétente.</p>
    ),
  },
  {
    id: "contact",
    title: "Contact et droit applicable",
    body: (
      <>
        <p>Pour toute question ou pour demander un exemplaire signé du présent accord, écrivez à <a href="mailto:itsizibooking@gmail.com">itsizibooking@gmail.com</a>.</p>
        <p>Le présent accord est soumis au droit camerounais, sans préjudice des dispositions impératives de protection des données applicables aux personnes concernées selon leur lieu de résidence.</p>
      </>
    ),
  },
];

export default function DpaPage() {
  return (
    <LegalPage
      current="/dpa"
      title="Accord de traitement des données (DPA)"
      intro="Nos engagements pour protéger les données personnelles confiées à iziBooking."
      updated="21 septembre 2026"
      sections={sections}
    />
  );
}
