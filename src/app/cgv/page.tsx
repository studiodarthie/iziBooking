import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/public/LegalPage";

export const metadata: Metadata = {
  title: "Conditions générales de vente - iziBooking",
  description: "Conditions générales de vente et d’utilisation de la plateforme iziBooking.",
};

const sections: LegalSection[] = [
  {
    id: "objet",
    title: "Objet et champ d’application",
    body: (
      <>
        <p>
          Les présentes conditions générales de vente et d’utilisation (« CGV ») régissent l’accès et l’utilisation de la plateforme iziBooking, accessible à l’adresse www.izibooking.app (la « Plateforme »), éditée par iziBooking.app, filiale de Ets Darthie (entreprise individuelle), dont le siège social est situé à Douala, Cameroun.
        </p>
        <p>En créant un compte ou en effectuant une réservation, vous acceptez sans réserve les présentes CGV, le <Link href="/reglement">Règlement de la plateforme</Link> et la <Link href="/confidentialite">Politique de confidentialité</Link>.</p>
      </>
    ),
  },
  {
    id: "definitions",
    title: "Définitions",
    body: (
      <ul>
        <li><strong>Organisateur</strong> : toute personne qui recherche et réserve un prestataire pour un événement.</li>
        <li><strong>Prestataire</strong> : tout artiste, professionnel ou entreprise (musicien, DJ, traiteur, photographe, décorateur, etc.) qui propose ses services sur la Plateforme.</li>
        <li><strong>Réservation</strong> : demande de prestation adressée à un Prestataire et, une fois acceptée, engagement entre l’Organisateur et le Prestataire.</li>
        <li><strong>Acompte</strong> : somme versée pour confirmer une Réservation, dont le montant est fixé par le Prestataire.</li>
      </ul>
    ),
  },
  {
    id: "role",
    title: "Rôle d’iziBooking",
    body: (
      <>
        <p>iziBooking est une plateforme de mise en relation. Le contrat de prestation est conclu directement entre l’Organisateur et le Prestataire : iziBooking n’en est pas partie et n’est pas l’employeur, le mandataire ou l’agent du Prestataire.</p>
        <p>iziBooking fournit les outils de recherche, de messagerie, de réservation et de paiement sécurisé, et intervient comme médiateur en cas de litige (voir article « Litiges »).</p>
      </>
    ),
  },
  {
    id: "comptes",
    title: "Comptes utilisateurs",
    body: (
      <>
        <p>La création d’un compte est gratuite. Vous vous engagez à fournir des informations exactes et à jour, et à préserver la confidentialité de votre accès (connexion par lien envoyé par email ou via un compte Google).</p>
        <p>Vous devez être majeur, ou disposer de l’autorisation de votre représentant légal, pour utiliser la Plateforme. Les Prestataires sont soumis à une vérification avant d’être mis en avant dans le catalogue.</p>
      </>
    ),
  },
  {
    id: "reservation",
    title: "Processus de réservation",
    body: (
      <>
        <p>Une réservation se déroule en plusieurs étapes :</p>
        <ul>
          <li>l’Organisateur envoie une demande précisant la date et le type d’événement ;</li>
          <li>le Prestataire accepte ou refuse la demande et fixe le montant convenu ;</li>
          <li>l’Organisateur règle l’acompte, en ligne via la Plateforme ou directement auprès du Prestataire ;</li>
          <li>la réservation est confirmée, puis marquée comme réalisée à l’issue de l’événement ;</li>
          <li>l’Organisateur peut alors laisser un avis.</li>
        </ul>
        <p>Une réservation n’est ferme qu’après acceptation par le Prestataire et paiement de l’acompte.</p>
      </>
    ),
  },
  {
    id: "prix",
    title: "Prix, frais et commissions",
    body: (
      <>
        <p>Les prix des prestations sont fixés librement par les Prestataires et exprimés en francs CFA (XAF/FCFA), sauf indication contraire.</p>
        <ul>
          <li><strong>Organisateurs</strong> : l’utilisation de la Plateforme est gratuite. Des frais de service de 3 % s’ajoutent au montant de la réservation.</li>
          <li><strong>Prestataires</strong> : une commission est prélevée sur les paiements encaissés via la Plateforme : 12 % avec le plan Free, 6 % avec le plan Premium.</li>
        </ul>
        <p>Le détail des tarifs est disponible sur la page <Link href="/tarifs">Tarifs</Link>. iziBooking peut modifier ses tarifs ; la modification ne s’applique pas aux réservations déjà acceptées.</p>
      </>
    ),
  },
  {
    id: "paiement",
    title: "Paiement et sécurisation",
    body: (
      <>
        <p>Les paiements en ligne (mobile money ou carte bancaire) sont traités par notre prestataire de paiement, Tranzak. iziBooking ne conserve aucune donnée bancaire complète.</p>
        <p>Lorsque le paiement est encaissé via la Plateforme, la somme est reversée au Prestataire, déduction faite de la commission, dans les meilleurs délais après la confirmation de la prestation.</p>
        <p>Les Organisateurs et Prestataires peuvent aussi convenir d’un règlement direct. Dans ce cas, le paiement s’effectue hors Plateforme, sous leur seule responsabilité, et les frais de service restent dus à iziBooking.</p>
      </>
    ),
  },
  {
    id: "annulation",
    title: "Annulation et remboursement",
    body: (
      <>
        <p>Une réservation peut être annulée depuis votre espace, tant que son statut le permet. Sauf conditions particulières précisées par le Prestataire sur son profil :</p>
        <ul>
          <li>en cas d’annulation par le Prestataire, l’acompte est intégralement remboursé à l’Organisateur ;</li>
          <li>en cas d’annulation par l’Organisateur, le remboursement de l’acompte dépend des conditions convenues avec le Prestataire et du délai restant avant l’événement.</li>
        </ul>
        <p>Les remboursements sont effectués par le même moyen que le paiement initial, dans la mesure du possible.</p>
      </>
    ),
  },
  {
    id: "premium",
    title: "Abonnement Premium",
    body: (
      <>
        <p>Les Prestataires peuvent souscrire un abonnement Premium mensuel de 15 000 FCFA, sans engagement. Il donne accès à des photos et services illimités, à une commission réduite, à une mise en avant dans les résultats de recherche et à une vérification prioritaire.</p>
        <p>L’abonnement n’est pas renouvelé automatiquement : à son expiration, le compte repasse au plan Free. Les sommes déjà versées pour la période en cours ne sont pas remboursables, sauf disposition légale contraire.</p>
      </>
    ),
  },
  {
    id: "litiges",
    title: "Litiges et médiation",
    body: (
      <>
        <p>En cas de désaccord sur une prestation, l’Organisateur ou le Prestataire peut ouvrir un litige depuis la réservation concernée. L’équipe iziBooking examine les éléments fournis par chaque partie et propose une solution amiable.</p>
        <p>Cette médiation ne prive pas les parties de leur droit de saisir la juridiction compétente. iziBooking peut suspendre les reversements concernés pendant l’examen d’un litige.</p>
      </>
    ),
  },
  {
    id: "responsabilite",
    title: "Responsabilité",
    body: (
      <>
        <p>Les Prestataires sont seuls responsables de la qualité, de l’exécution et de la conformité de leurs prestations. iziBooking ne garantit pas leur disponibilité ni le résultat de la prestation.</p>
        <p>iziBooking s’efforce d’assurer la disponibilité de la Plateforme mais ne peut garantir l’absence d’interruption. Sa responsabilité est limitée aux dommages directs et prévisibles, dans les limites permises par la loi.</p>
      </>
    ),
  },
  {
    id: "propriete",
    title: "Propriété intellectuelle et contenus",
    body: (
      <p>La Plateforme, sa marque et ses éléments sont protégés. Les Prestataires conservent la propriété des contenus qu’ils publient (photos, vidéos, descriptions) et accordent à iziBooking une licence non exclusive pour les afficher sur la Plateforme. Ils garantissent disposer des droits nécessaires sur ces contenus.</p>
    ),
  },
  {
    id: "donnees",
    title: "Données personnelles",
    body: (
      <p>Le traitement des données personnelles est décrit dans la <Link href="/confidentialite">Politique de confidentialité</Link> et l’<Link href="/dpa">Accord de traitement des données</Link>.</p>
    ),
  },
  {
    id: "modification",
    title: "Modification des CGV",
    body: (
      <p>iziBooking peut modifier les présentes CGV. Les utilisateurs sont informés de toute modification substantielle ; la poursuite de l’utilisation de la Plateforme vaut acceptation de la nouvelle version.</p>
    ),
  },
  {
    id: "droit",
    title: "Droit applicable et juridiction",
    body: (
      <p>Les présentes CGV sont soumises au droit camerounais. À défaut d’accord amiable, tout litige sera porté devant les juridictions camerounaises compétentes.</p>
    ),
  },
];

export default function CgvPage() {
  return (
    <LegalPage
      current="/cgv"
      title="Conditions générales de vente"
      intro="Les règles qui encadrent l’utilisation d’iziBooking, les réservations et les paiements."
      updated="21 septembre 2026"
      sections={sections}
    />
  );
}
