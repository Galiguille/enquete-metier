export const sections = {
  fr: [
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
  ],
  en: [
    {
      id: 'section1',
      title: 'Company Overview',
      fields: [
        { id: 'entreprise', label: 'Company or organization:', type: 'text' },
        { id: 'adresse', label: 'Address:', type: 'text' },
        { id: 'telephone', label: 'Phone:', type: 'text' },
        { id: 'personne', label: 'Name of the person met:', type: 'text' },
        { id: 'posteOccupe', label: 'Position held:', type: 'text' },
        { id: 'posteEnquete', label: 'Target position of the survey:', type: 'text' },
      ]
    },
    {
      id: 'acces',
      title: 'Access Conditions',
      fields: [
        { id: 'tempsTravail', label: 'How long have you been doing this job?', type: 'textarea' },
        { id: 'arrivePoste', label: 'How did you get this position?', type: 'textarea' },
        { id: 'formation', label: 'What is your educational background?', type: 'textarea' },
        { id: 'diplomeExige', label: 'Is a specific degree required? If so, which one?', type: 'textarea' },
        { id: 'centresFormation', label: 'Do you know the training centers for this?', type: 'textarea' },
        { id: 'concours', label: 'If recruited by exam, what are the conditions and level?', type: 'textarea' },
        { id: 'qualites', label: 'In your opinion, what qualities are necessary for this job?', type: 'textarea' },
      ]
    },
    {
      id: 'contenu',
      title: 'Job Content',
      fields: [
        { id: 'consisteTravail', label: 'What does the work consist of?', type: 'textarea' },
        { id: 'ensembleTaches', label: 'Can you describe all the tasks?', type: 'textarea' },
        { id: 'attraits', label: 'What attracted you to this job, positive aspects?', type: 'textarea' },
        { id: 'contraintes', label: 'What are the constraints, the most difficult aspects?', type: 'textarea' },
        { id: 'travailEquipe', label: 'Is it teamwork? If so, specify.', type: 'textarea' },
        { id: 'professionnelsExt', label: 'Do you work with external professionals? If so, which ones?', type: 'textarea' },
      ]
    },
    {
      id: 'conditions',
      title: 'Working Conditions',
      fields: [
        { id: 'horaires', label: 'What are the hours & days?', type: 'textarea' },
        { id: 'heuresSemaine', label: 'How many working hours per week?', type: 'input' },
        { id: 'salaire', label: 'Salary for a beginner?', type: 'input' },
        { id: 'tenue', label: 'Is a specific outfit required?', type: 'textarea' },
        { id: 'contreIndications', label: 'Are there any contraindications (health, availability...)?', type: 'textarea' },
        { id: 'debouches', label: 'Do you think there are currently job opportunities?', type: 'textarea' },
        { id: 'recrutement', label: 'How does the company recruit (ads, job center...)?', type: 'textarea' },
        { id: 'criteres', label: 'What are the selection criteria? (experience, internship, initiative...)', type: 'textarea' },
        { id: 'conservationCV', label: 'How long do you keep the CVs sent to you?', type: 'textarea' },
        { id: 'typeContrat', label: 'What types of contracts does your company offer?', type: 'textarea' },
        { id: 'personneRecrutement', label: 'Who is in charge of recruitment in your entity?', type: 'input' },
        { id: 'immersion', label: 'Would you be willing to host a job seeker in your company for a 5 to 10 day discovery internship? (Professional immersion)', type: 'textarea' },
      ]
    }
  ]
};
