// Articles du blog. Ajouter un article = ajouter un objet à `posts` (le rendu /blog/[slug] est générique).

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "tip"; text: string }
  | { type: "cta"; heading: string; text: string; href: string; label: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO, ex. "2026-10-01"
  image?: string;
  readingMinutes?: number;
  content: ContentBlock[];
};

export const BLOG_CATEGORIES = [
  { name: "Conseils organisateurs", desc: "Choisir, comparer et réserver sereinement pour votre événement." },
  { name: "Guides prestataires", desc: "Développer votre activité, soigner votre profil, fidéliser vos clients." },
  { name: "Culture & scène africaine", desc: "Artistes, traditions et tendances de la scène événementielle." },
  { name: "Actualités iziBooking", desc: "Nouveautés de la plateforme et arrivée dans de nouveaux pays." },
];

export const UPCOMING_TOPICS = [
  { category: "Guides prestataires", title: "Photographes : préparer un portfolio qui décroche des réservations" },
  { category: "Culture & scène africaine", title: "Les rythmes traditionnels qui font danser les mariages" },
];

export const posts: BlogPost[] = [
  {
    slug: "autorisations-evenement-cameroun",
    title: "Quelles autorisations pour organiser un événement au Cameroun ?",
    excerpt:
      "Mariage, concert, soirée d'entreprise : un tour d'horizon des démarches à anticiper selon le type et la taille de votre événement.",
    category: "Conseils organisateurs",
    date: "2026-10-14",
    readingMinutes: 6,
    content: [
      {
        type: "p",
        text: "Dès qu'un événement sort du cadre strictement privé — qu'il rassemble du monde sur la voie publique, dans une salle louée ou en plein air — une forme d'autorisation ou de déclaration entre en jeu. Les règles exactes varient selon la commune, la taille de l'événement et le lieu choisi, mais quelques réflexes reviennent presque toujours.",
      },
      { type: "h2", text: "Pourquoi se renseigner tôt" },
      {
        type: "p",
        text: "Les délais administratifs sont rarement instantanés. Un dossier déposé la veille a peu de chances d'aboutir à temps, surtout si l'événement implique une occupation de la voie publique, de la musique amplifiée tard le soir, ou la présence attendue de plusieurs centaines de personnes.",
      },
      { type: "h2", text: "Les démarches selon le type d'événement" },
      {
        type: "ul",
        items: [
          "Mariage ou réception privée dans une salle ou un domicile : généralement pas d'autorisation spécifique si l'événement reste dans l'enceinte privée, mais une déclaration en mairie d'arrondissement est recommandée si de la musique amplifiée dépasse une certaine heure ou si des stands/tentes débordent sur la voie publique.",
          "Concert, soirée ou festival ouvert au public : autorisation de la mairie d'arrondissement, souvent avec avis de la préfecture pour les grands rassemblements, et coordination avec la police ou la gendarmerie locale pour le dispositif de sécurité.",
          "Séminaire ou conférence d'entreprise en hôtel ou centre de conférence : l'établissement gère en général les autorisations liées au lieu, mais vérifiez ce qui reste à votre charge (diffusion de musique, animation extérieure, signalétique).",
          "Événement avec diffusion de musique ou d'œuvres protégées : une déclaration auprès de l'organisme de gestion des droits d'auteur applicable est à prévoir, en plus de l'autorisation municipale.",
        ],
      },
      { type: "h2", text: "Qui contacter" },
      {
        type: "ul",
        items: [
          "La mairie de l'arrondissement où se déroule l'événement, pour toute occupation de voie publique ou déclaration de manifestation.",
          "La préfecture, au-delà d'un certain nombre de personnes attendues ou pour les événements nécessitant un dispositif de sécurité renforcé.",
          "Le commissariat ou la brigade de gendarmerie du secteur, pour coordonner la présence de forces de l'ordre si nécessaire.",
          "Le lieu lui-même (salle, hôtel, espace extérieur) : demandez systématiquement ce qui est déjà couvert par leur propre autorisation d'exploitation.",
        ],
      },
      {
        type: "tip",
        text: "Les délais et interlocuteurs exacts varient d'une commune à l'autre. Ce guide donne les grandes lignes : confirmez toujours les démarches précises auprès de votre mairie d'arrondissement avant de figer votre date.",
      },
      { type: "h2", text: "Le calendrier à prévoir" },
      {
        type: "p",
        text: "Pour un événement ouvert au public de taille moyenne à grande, comptez idéalement plusieurs semaines entre le dépôt du dossier et la date de l'événement. Pour une réception privée classique, quelques jours suffisent en général pour une simple déclaration, mais mieux vaut ne pas s'y prendre la dernière semaine.",
      },
      {
        type: "cta",
        heading: "Besoin d'un prestataire pour la sécurité de votre événement ?",
        text: "Agents de sécurité, stewards, gestion des accès : comparez les prestataires disponibles près de chez vous.",
        href: "/search?pole=SERVICES",
        label: "Voir les prestataires Services",
      },
    ],
  },
  {
    slug: "securite-evenementielle-barrieres-agents",
    title: "Sécurité événementielle : combien d'agents et de barrières prévoir, et où les trouver",
    excerpt:
      "Un dispositif de sécurité mal dimensionné est l'une des premières causes de problèmes le jour J. Quelques repères pour voir juste.",
    category: "Conseils organisateurs",
    date: "2026-10-12",
    readingMinutes: 5,
    content: [
      {
        type: "p",
        text: "La sécurité est souvent le dernier poste qu'on budgète — et le premier qu'on regrette d'avoir sous-estimé. Un dispositif adapté à la taille réelle de votre événement protège vos invités, votre matériel, et vous évite bien des mauvaises surprises.",
      },
      { type: "h2", text: "Combien d'agents prévoir" },
      {
        type: "p",
        text: "Il n'existe pas de règle universelle, mais quelques ordres de grandeur permettent de partir sur de bonnes bases selon la taille de votre événement :",
      },
      {
        type: "ul",
        items: [
          "Moins de 100 invités, en espace fermé et maîtrisé : 1 à 2 agents suffisent souvent, surtout pour filtrer les entrées.",
          "100 à 300 personnes : prévoyez généralement 3 à 5 agents, répartis entre l'entrée, la zone de restauration et la scène ou piste de danse.",
          "300 à 1000 personnes, ou événement avec alcool et musique tard dans la nuit : 6 à 10 agents, avec un responsable de dispositif clairement identifié.",
          "Au-delà de 1000 personnes ou en extérieur sur voie publique : le dimensionnement doit être discuté avec un prestataire professionnel et, selon le cas, avec les autorités locales.",
        ],
      },
      { type: "h2", text: "Et les barrières ?" },
      {
        type: "p",
        text: "Les barrières servent à trois choses : canaliser les flux à l'entrée, délimiter une zone VIP ou technique, et protéger la scène ou le matériel sensible (sonorisation, régie, groupe électrogène). Pour un événement de taille moyenne, comptez un linéaire suffisant pour couvrir l'entrée principale et le pourtour immédiat de la scène — un prestataire spécialisé pourra chiffrer précisément selon la configuration du lieu.",
      },
      {
        type: "tip",
        text: "Visitez le lieu avec votre prestataire de sécurité avant le jour J. Un dispositif pensé sur plan se révèle souvent différent une fois sur place — accès livraison, sorties de secours, zones d'ombre non éclairées le soir.",
      },
      { type: "h2", text: "Où trouver des prestataires fiables" },
      {
        type: "p",
        text: "Le bouche-à-oreille reste courant, mais il complique la comparaison des tarifs et des références. Passer par une plateforme où les profils sont vérifiés permet de comparer plusieurs prestataires de sécurité avant de réserver, avec un acompte sécurisé plutôt qu'un paiement à l'aveugle.",
      },
      {
        type: "cta",
        heading: "Comparez les prestataires de sécurité disponibles",
        text: "Agents, stewards, gestion d'accès : trouvez un prestataire vérifié près de votre lieu d'événement.",
        href: "/search?pole=SERVICES",
        label: "Voir les prestataires Services",
      },
    ],
  },
  {
    slug: "checklist-mariage-douala-yaounde",
    title: "Checklist complète pour organiser un mariage à Douala ou Yaoundé",
    excerpt:
      "Du premier rendez-vous avec le traiteur à la liste de diffusion du DJ : tout ce qu'il ne faut pas oublier, mois par mois.",
    category: "Conseils organisateurs",
    date: "2026-10-10",
    readingMinutes: 7,
    content: [
      {
        type: "p",
        text: "Un mariage réussi se joue autant dans les détails anticipés que dans la journée elle-même. Voici une checklist pensée pour le contexte camerounais, à adapter selon la taille de votre cérémonie et vos traditions familiales.",
      },
      { type: "h2", text: "6 à 9 mois avant" },
      {
        type: "ul",
        items: [
          "Fixer la date et réserver le lieu de réception — les meilleures salles et jardins de Douala et Yaoundé se réservent souvent plusieurs mois à l'avance en haute saison.",
          "Établir un budget global et répartir une première enveloppe par poste (salle, traiteur, animation, tenue, décoration).",
          "Commencer à comparer les traiteurs et demander des dégustations.",
          "Réserver votre DJ ou groupe de musiciens — les meilleurs profils se bloquent tôt les week-ends de forte demande.",
        ],
      },
      { type: "h2", text: "3 mois avant" },
      {
        type: "ul",
        items: [
          "Confirmer le photographe et le vidéaste, et discuter du déroulé souhaité (cérémonie traditionnelle, église, réception).",
          "Finaliser le menu et le nombre d'invités avec le traiteur.",
          "Réserver le décorateur et valider le thème de couleurs.",
          "Vérifier les démarches administratives nécessaires si la réception sort du cadre privé (voir notre guide sur les autorisations).",
        ],
      },
      { type: "h2", text: "1 mois avant" },
      {
        type: "ul",
        items: [
          "Envoyer le planning détaillé de la journée à tous les prestataires (traiteur, DJ, photographe, sécurité).",
          "Confirmer les acomptes versés et les soldes restants dus.",
          "Prévoir le dispositif de sécurité si le nombre d'invités le justifie.",
          "Faire un dernier point avec le lieu de réception sur l'accès livraison, les horaires et le stationnement.",
        ],
      },
      { type: "h2", text: "La semaine J" },
      {
        type: "ul",
        items: [
          "Reconfirmer les horaires d'arrivée de chaque prestataire par téléphone ou WhatsApp.",
          "Désigner une personne de confiance comme point de contact unique le jour J, pour que les prestataires n'aient pas à vous solliciter directement.",
          "Préparer un kit d'urgence : épingles à nourrice, chargeur de téléphone, numéros de tous les prestataires.",
        ],
      },
      {
        type: "tip",
        text: "Centraliser les contacts de tous vos prestataires au même endroit — par exemple dans votre tableau de bord iziBooking — évite de chercher un numéro dans une pile de messages WhatsApp le jour J.",
      },
      {
        type: "cta",
        heading: "Trouvez tous vos prestataires de mariage au même endroit",
        text: "Traiteurs, DJ, photographes, décorateurs : comparez les profils vérifiés et réservez avec un acompte sécurisé.",
        href: "/search",
        label: "Explorer le catalogue",
      },
    ],
  },
  {
    slug: "budget-evenement-repartir-depenses",
    title: "Budget événement : comment répartir vos dépenses",
    excerpt:
      "Quelle part du budget revient au traiteur, à l'animation, à la décoration ? Des repères pour éviter les mauvaises surprises.",
    category: "Conseils organisateurs",
    date: "2026-10-08",
    readingMinutes: 5,
    content: [
      {
        type: "p",
        text: "Un budget événement part rarement de zéro : on a en tête un montant global, et la vraie question est de savoir comment le répartir intelligemment entre les postes. Voici une grille de lecture pour y voir clair, à ajuster selon vos priorités.",
      },
      { type: "h2", text: "Les grands postes de dépense" },
      {
        type: "ul",
        items: [
          "Lieu et location de salle : souvent le poste le plus variable, entre 15 et 30 % du budget selon que vous disposez déjà d'un espace ou que vous louez un lieu premium.",
          "Traiteur et boissons : généralement le poste le plus lourd, entre 30 et 40 % du budget pour un événement avec repas complet.",
          "Animation (DJ, groupe, MC) : comptez entre 10 et 15 % pour une prestation de qualité qui tient la salle toute la soirée.",
          "Décoration et fleurs : entre 8 et 15 % selon le niveau de personnalisation souhaité.",
          "Photo et vidéo : entre 8 et 12 %, un poste qu'on a tendance à sous-estimer alors que c'est ce qui reste le plus longtemps.",
          "Sécurité et logistique : entre 5 et 10 % selon la taille de l'événement — ne le négligez pas, voir notre guide dédié.",
          "Imprévus : gardez toujours 5 à 10 % de marge pour les surprises de dernière minute.",
        ],
      },
      { type: "h2", text: "Exemple pour un événement de 100 invités" },
      {
        type: "p",
        text: "Pour un événement de taille moyenne (environ 100 invités), une répartition équilibrée pourrait ressembler à ceci : un tiers pour le traiteur, un cinquième pour la salle, le reste partagé entre animation, décoration, photo/vidéo et sécurité, avec une marge pour imprévus. Les proportions exactes dépendent évidemment de vos priorités — certains organisateurs préfèrent investir davantage dans l'animation, d'autres dans la décoration.",
      },
      { type: "h2", text: "Comment limiter les mauvaises surprises" },
      {
        type: "ul",
        items: [
          "Demandez toujours un devis détaillé poste par poste, pas un forfait global flou.",
          "Comparez au moins deux ou trois prestataires par poste avant de vous engager.",
          "Vérifiez ce qui est inclus dans chaque devis (déplacement, matériel, heures supplémentaires) pour éviter les frais cachés.",
          "Privilégiez un acompte raisonnable plutôt qu'un paiement intégral à l'avance, surtout avec un prestataire que vous ne connaissez pas encore.",
        ],
      },
      {
        type: "tip",
        text: "Sur iziBooking, les acomptes sont encaissés via la plateforme puis reversés au prestataire — vous évitez les virements à l'aveugle avant d'avoir rencontré qui que ce soit.",
      },
      {
        type: "cta",
        heading: "Comparez les tarifs avant de fixer votre budget",
        text: "Parcourez les profils de traiteurs, DJ, décorateurs et photographes avec leurs tarifs affichés.",
        href: "/search",
        label: "Explorer le catalogue",
      },
    ],
  },
  {
    slug: "organiser-conference-seminaire-entreprise",
    title: "Organiser une conférence ou un séminaire d'entreprise : le guide complet",
    excerpt:
      "Objectifs, logistique, communication : la méthode pour un événement professionnel qui marque les esprits sans mauvaise surprise.",
    category: "Conseils organisateurs",
    date: "2026-10-06",
    readingMinutes: 6,
    content: [
      {
        type: "p",
        text: "Un séminaire d'entreprise ou une conférence professionnelle obéit à une logique différente d'un événement privé : les enjeux d'image, de ponctualité et de logistique y sont plus stricts, et les intervenants ont souvent des contraintes précises.",
      },
      { type: "h2", text: "Définir les objectifs et le format" },
      {
        type: "p",
        text: "Avant de penser logistique, clarifiez ce que l'événement doit produire : former, informer, fédérer une équipe, présenter un produit. Le format en découle — une conférence avec intervenants et public assis n'a pas les mêmes besoins qu'un séminaire interactif en ateliers.",
      },
      { type: "h2", text: "La logistique essentielle" },
      {
        type: "ul",
        items: [
          "Salle et configuration : vérifiez la capacité, la configuration (théâtre, en U, ateliers) et l'équipement déjà inclus (vidéoprojecteur, sonorisation, Wi-Fi).",
          "Sonorisation et micros : indispensable dès que la salle dépasse une trentaine de personnes ou que plusieurs intervenants se succèdent.",
          "Restauration : pause-café, déjeuner assis ou cocktail — à caler avec le traiteur en fonction du format de la journée.",
          "Hébergement des intervenants : si des intervenants viennent d'une autre ville, anticipez leur transport et leur hébergement.",
          "Supports de communication : badges, signalétique, roll-up — souvent gérés par un graphiste et un imprimeur local.",
        ],
      },
      { type: "h2", text: "Communication interne et externe" },
      {
        type: "p",
        text: "Pour un séminaire interne, une invitation claire avec le programme détaillé suffit généralement. Pour une conférence ouverte à des partenaires ou au public, prévoyez un minimum de communication en amont (réseaux sociaux, email, voire un relais radio ou presse locale selon l'ampleur de l'événement) et un support de présence le jour J (affiche, bannière, badges).",
      },
      {
        type: "tip",
        text: "Faites une répétition technique la veille ou le matin même : micro, projecteur, Wi-Fi. C'est le moment où la plupart des imprévus se révèlent — mieux vaut les découvrir sans public.",
      },
      {
        type: "cta",
        heading: "Trouvez vos prestataires pour un événement professionnel",
        text: "Sonorisation, traiteur, décoration, sécurité : comparez les prestataires disponibles pour votre séminaire ou conférence.",
        href: "/search?pole=SERVICES",
        label: "Voir les prestataires Services",
      },
    ],
  },
  {
    slug: "choisir-dj-mariage-7-questions",
    title: "Comment choisir son DJ de mariage : 7 questions à poser",
    excerpt:
      "Le DJ fait ou défait l'ambiance d'une soirée. Voici les questions à poser avant de signer, pour éviter les mauvaises surprises.",
    category: "Conseils organisateurs",
    date: "2026-10-04",
    readingMinutes: 5,
    content: [
      {
        type: "p",
        text: "Le DJ est souvent la personne qui a le plus d'influence sur l'ambiance réelle de votre soirée — bien plus que la décoration ou le menu, aussi soignés soient-ils. Voici sept questions à poser avant de réserver.",
      },
      {
        type: "ol",
        items: [
          "Quel est votre style musical principal, et savez-vous adapter votre set à un public mélangé (générations, origines, goûts) ? Demandez des exemples de playlists pour des mariages similaires au vôtre.",
          "Avez-vous déjà travaillé dans ce lieu, ou pouvez-vous visiter les lieux avant le jour J ? La configuration de la salle change beaucoup la sonorisation nécessaire.",
          "Quel matériel apportez-vous, et avez-vous un plan de secours en cas de panne technique ? Un DJ sérieux a toujours un système de secours.",
          "Prenez-vous les demandes spéciales des invités le soir même, et comment gérez-vous les demandes qui ne correspondent pas à l'ambiance souhaitée ?",
          "Faites-vous aussi l'animation au micro (annonces, présentations), ou uniquement la musique ? Clarifiez ce point tôt, certains couples préfèrent un maître de cérémonie séparé.",
          "Quelle est votre politique d'acompte et d'annulation ? Un contrat clair protège les deux parties.",
          "Pouvez-vous partager des avis ou contacts de mariages précédents ? Un profil avec des avis vérifiés en dit souvent plus qu'une simple conversation.",
        ],
      },
      {
        type: "tip",
        text: "Demandez toujours à écouter un extrait d'un set réel (et pas seulement une démo enregistrée en studio) pour juger de l'ambiance qu'il sait créer en conditions réelles.",
      },
      {
        type: "p",
        text: "Une fois ces questions posées à deux ou trois DJ, comparez non seulement le tarif, mais aussi la clarté des réponses — c'est souvent un bon indicateur du professionnalisme le jour J.",
      },
      {
        type: "cta",
        heading: "Comparez les DJ et musiciens disponibles pour votre mariage",
        text: "Profils vérifiés, avis clients et tarifs affichés : trouvez l'animation qui correspond à votre ambiance.",
        href: "/search?pole=DIVERTISSEMENT",
        label: "Voir les prestataires Divertissement",
      },
    ],
  },
];
