import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/public/LegalPage";

export const metadata: Metadata = {
  title: "Politique de confidentialité - iziBooking",
  description: "Comment iziBooking collecte, utilise et protège vos données personnelles.",
};

const sections: LegalSection[] = [
  {
    id: "responsable",
    title: "Qui est responsable de vos données ?",
    body: (
      <>
        <p>Le responsable du traitement est iziBooking.app, filiale de Ets Darthie (entreprise individuelle), dont le siège social est situé à Douala, Cameroun.</p>
        <p>Contact pour toute question relative à vos données : <a href="mailto:itsizibooking@gmail.com">itsizibooking@gmail.com</a>.</p>
      </>
    ),
  },
  {
    id: "donnees",
    title: "Données que nous collectons",
    body: (
      <ul>
        <li><strong>Compte</strong> : nom, adresse email, photo de profil (notamment via Google), rôle (organisateur ou prestataire).</li>
        <li><strong>Profil prestataire</strong> : nom d’activité, catégorie, description, localisation, tarifs, photos, vidéos et liens, coordonnées de contact (dont WhatsApp), calendrier.</li>
        <li><strong>Réservations</strong> : date, type et lieu de l’événement, montants, statut, échanges de messages, avis.</li>
        <li><strong>Paiements</strong> : références et statuts de transaction. Les données de carte ou de mobile money sont traitées par notre prestataire de paiement ; nous ne les conservons pas.</li>
        <li><strong>Données techniques</strong> : cookie de session de connexion, journaux techniques nécessaires à la sécurité.</li>
      </ul>
    ),
  },
  {
    id: "finalites",
    title: "Pourquoi nous les utilisons",
    body: (
      <ul>
        <li>Créer et gérer votre compte, vous authentifier — <em>exécution du contrat</em>.</li>
        <li>Mettre en relation organisateurs et prestataires, gérer les réservations, la messagerie et les paiements — <em>exécution du contrat</em>.</li>
        <li>Envoyer des emails transactionnels (connexion, nouvelle demande, nouveau message) — <em>exécution du contrat</em>.</li>
        <li>Vérifier les profils, prévenir la fraude et traiter les litiges — <em>intérêt légitime</em>.</li>
        <li>Respecter nos obligations comptables et légales — <em>obligation légale</em>.</li>
      </ul>
    ),
  },
  {
    id: "destinataires",
    title: "Qui reçoit vos données ?",
    body: (
      <>
        <p>Vos données ne sont jamais vendues. Elles sont partagées uniquement :</p>
        <ul>
          <li>entre organisateur et prestataire concernés par une réservation (nom, coordonnées utiles à la prestation, détails de l’événement) ;</li>
          <li>avec nos sous-traitants techniques (voir ci-dessous) ;</li>
          <li>avec les autorités, lorsque la loi l’exige.</li>
        </ul>
      </>
    ),
  },
  {
    id: "sous-traitants",
    title: "Sous-traitants et transferts hors de votre pays",
    body: (
      <>
        <p>Pour faire fonctionner iziBooking, nous faisons appel à :</p>
        <ul>
          <li><strong>Vercel</strong> — hébergement de l’application ;</li>
          <li><strong>Neon</strong> — base de données (serveurs aux États-Unis) ;</li>
          <li><strong>Cloudinary</strong> — stockage des photos et médias ;</li>
          <li><strong>Resend</strong> — envoi des emails ;</li>
          <li><strong>Tranzak</strong> — paiements par mobile money et carte ;</li>
          <li><strong>Google</strong> — connexion avec un compte Google, si vous la choisissez.</li>
        </ul>
        <p>Certains de ces prestataires sont situés hors de votre pays, notamment aux États-Unis. Nous veillons à ce que ces transferts soient encadrés par des garanties appropriées. Nos engagements sont détaillés dans l’<Link href="/dpa">Accord de traitement des données</Link>.</p>
      </>
    ),
  },
  {
    id: "conservation",
    title: "Combien de temps conservons-nous vos données ?",
    body: (
      <ul>
        <li>Données de compte : pendant la durée de vie du compte, puis supprimées ou anonymisées dans un délai raisonnable après sa clôture.</li>
        <li>Données de réservation et de paiement : conservées le temps requis par les obligations légales et comptables applicables.</li>
        <li>Journaux techniques : conservés pour une durée limitée, strictement nécessaire à la sécurité.</li>
      </ul>
    ),
  },
  {
    id: "droits",
    title: "Vos droits",
    body: (
      <>
        <p>Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de portabilité de vos données. Vous pouvez aussi retirer un consentement à tout moment.</p>
        <p>Pour exercer vos droits, écrivez à <a href="mailto:itsizibooking@gmail.com">itsizibooking@gmail.com</a> en précisant l’email de votre compte. Nous répondons dans un délai maximum d’un mois. Vous pouvez également saisir l’autorité de protection des données personnelles compétente.</p>
        <p>Si vous résidez dans l’Union européenne, vos droits découlent du Règlement général sur la protection des données (RGPD).</p>
      </>
    ),
  },
  {
    id: "securite",
    title: "Sécurité",
    body: (
      <p>Nous mettons en œuvre des mesures techniques et organisationnelles adaptées : connexions chiffrées (HTTPS), authentification sans mot de passe, accès restreints aux données et surveillance des accès administrateurs. Aucun système n’étant infaillible, nous vous informerons en cas de violation de données vous concernant, conformément à la loi.</p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>iziBooking utilise uniquement des cookies strictement nécessaires (maintien de votre session de connexion et sécurité). Ils ne nécessitent pas de consentement. Aucun cookie publicitaire n’est utilisé.</p>
    ),
  },
  {
    id: "mineurs",
    title: "Mineurs",
    body: <p>La Plateforme s’adresse aux personnes majeures. Nous ne collectons pas sciemment de données de mineurs ; si vous pensez qu’un mineur nous a transmis des données, contactez-nous pour les supprimer.</p>,
  },
  {
    id: "modifications",
    title: "Modifications",
    body: <p>Cette politique peut évoluer. En cas de changement important, nous vous en informerons par email ou sur la Plateforme. La date de dernière mise à jour figure en haut de cette page.</p>,
  },
];

export default function ConfidentialitePage() {
  return (
    <LegalPage
      current="/confidentialite"
      title="Politique de confidentialité"
      intro="Vos données vous appartiennent. Voici ce que nous collectons, pourquoi, et comment vous gardez le contrôle."
      updated="21 septembre 2026"
      sections={sections}
    />
  );
}
