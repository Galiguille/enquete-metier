export const sections = [
  {
    id: 'section1',
    title: 'Présentation de l\'entreprise',
    fields: [
      { id: 'entreprise', label: 'Entreprise ou organisme :', type: 'text' },
      { id: 'adresse', label: 'Adresse :', type: 'text' },
      { id: 'telephone', label: 'Téléphone :', type: 'text' },
      { id: 'personne', label: 'Nom de la personne rencontrée :', type: 'text' },
      { id: 'posteOccupe', label: 'Poste occupé :', type: 'text' },
      { id: 'posteEnquete', label: "Poste sur lequel porte l'enquête :", type: 'text' },
    ]
  },
  {
    id: 'acces',
    title: "Conditions d'accès",
    fields: [
      { id: 'tempsTravail', label: 'Depuis combien de temps faites-vous ce travail ?', type: 'textarea' },
      { id: 'arrivePoste', label: 'Comment êtes-vous arrivé à ce poste ?', type: 'textarea' },
      { id: 'formation', label: 'Quelle formation avez-vous ?', type: 'textarea' },
      { id: 'diplomeExige', label: "Y a-t-il un diplôme exigé pour ce poste ? Si oui, lequel ?", type: 'textarea' },
      { id: 'centresFormation', label: 'Connaissez-vous les centres qui dispensent cette formation ?', type: 'textarea' },
      { id: 'concours', label: "Si le recrutement se fait par concours, quelles sont les conditions et le niveau pour s'y présenter ?", type: 'textarea' },
      { id: 'qualites', label: 'Selon vous, quelles qualités sont nécessaires pour exercer ce métier ?', type: 'textarea' },
    ]
  },
  {
    id: 'contenu',
    title: 'Contenu du poste',
    fields: [
      { id: 'consisteTravail', label: 'En quoi consiste le travail ?', type: 'textarea' },
      { id: 'ensembleTaches', label: "Pouvez-vous décrire l'ensemble des tâches ?", type: 'textarea' },
      { id: 'attraits', label: "Qu'est-ce qui vous a attiré dans ce métier, les aspects positifs ?", type: 'textarea' },
      { id: 'contraintes', label: 'Quelles sont les contraintes, les aspects plus difficiles ?', type: 'textarea' },
      { id: 'travailEquipe', label: "S'agit-il d'un travail d'équipe ? Si oui, préciser.", type: 'textarea' },
      { id: 'professionnelsExt', label: "Êtes-vous amené à travailler avec des professionnels extérieurs à l'entreprise ? Si oui, lesquels ?", type: 'textarea' },
    ]
  },
  {
    id: 'conditions',
    title: 'Conditions de travail',
    fields: [
      { id: 'horaires', label: 'Quels sont les horaires & jours ?', type: 'textarea' },
      { id: 'heuresSemaine', label: 'Combien d\'heures de travail par semaine ?', type: 'input' },
      { id: 'salaire', label: 'Le salaire pour un débutant ?', type: 'input' },
      { id: 'tenue', label: 'Faut-il avoir une tenue particulière ?', type: 'textarea' },
      { id: 'contreIndications', label: "D'après vous, y a-t-il des contre-indications à la réalisation de ce métier (problème de santé, disponibilité...) ?", type: 'textarea' },
      { id: 'debouches', label: "Pensez-vous qu'il y ait actuellement des débouchés ?", type: 'textarea' },
      { id: 'recrutement', label: "Comment recrute l'entreprise ou l'organisme (annonces, Pôle emploi...) ?", type: 'textarea' },
      { id: 'criteres', label: 'Quels sont les critères de sélection ? (expérience, stage, formation, esprit d\'initiative...)', type: 'textarea' },
      { id: 'conservationCV', label: 'Combien de temps gardez-vous les CV qui vous sont envoyés ?', type: 'textarea' },
      { id: 'typeContrat', label: 'Quels types de contrat propose votre société ?', type: 'textarea' },
      { id: 'personneRecrutement', label: 'Quelle est la personne en charge du recrutement au sein de votre entité ?', type: 'input' },
      { id: 'immersion', label: "Seriez-vous prêt(e) à accueillir dans votre entreprise un demandeur d'emploi pour découvrir ce métier (convention de stage gratuite de 5 à 10 jours, mise en place par Pôle emploi) ? (Immersion professionnelle)", type: 'textarea' },
    ]
  }
];
