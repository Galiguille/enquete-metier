import React, { useState } from 'react';

const sections = [
  {
    id: 'intro',
    title: 'Informations Générales',
    fields: [
      { id: 'entreprise', label: 'Entreprise ou organisme', type: 'input' },
      { id: 'adresse', label: 'Adresse', type: 'input' },
      { id: 'telephone', label: 'Téléphone', type: 'input' },
      { id: 'personne', label: 'Nom de la personne rencontrée', type: 'input' },
      { id: 'posteOccupe', label: 'Poste occupé', type: 'input' },
      { id: 'posteEnquete', label: "Poste sur lequel porte l'enquête", type: 'input' },
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

// Icônes intégrées (SVG)
const IconPrinter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
);
const IconFileText = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
);
const IconChevron = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);
const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

export default function App() {
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('form');

  const handleChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    const recipient = '';
    const subject = `Enquête Métier : ${formData.entreprise || 'Nouvelle enquête'}`;
    
    // On prépare un résumé des informations générales pour le corps du mail
    const introSection = sections.find(s => s.id === 'intro');
    const introText = introSection 
      ? introSection.fields.map(f => `${f.label} : ${formData[f.id] || 'Non renseigné'}`).join('\n')
      : '';

    const body = `Bonjour,

Veuillez trouver en pièce jointe le document de l'enquête métier.
Voici les informations générales de l'enquête métier :

Note : Pour générer le document PDF, veuillez d'abord utiliser la fonction "Imprimer / PDF" de l'application, l'enregistrer sur votre appareil, puis l'attacher manuellement à cet e-mail.
${introText}

Lien vers le questionnaire : ${window.location.href}

Veuillez trouver le détail complet des réponses dans le document PDF ci-joint.

Note : N'oubliez pas de générer le PDF via le bouton "Imprimer / PDF" et de l'ajouter à cet e-mail.

Cordialement.
`;
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans main-app-wrapper">
      
      {/* CSS D'IMPRESSION (Correctif conservé) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          html, body, #root, .main-app-wrapper, .main-content-area, .preview-wrapper {
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            display: block !important;
            position: static !important;
            background: white !important;
          }
          
          .no-print { display: none !important; }

          .preview-wrapper {
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .print-container { 
            width: 100% !important; 
            max-width: 100% !important;
            margin: 0 !important; 
            padding: 0 !important; 
            box-shadow: none !important;
            background: white !important;
          }
          
          .page-break { page-break-inside: avoid; margin-bottom: 20px; }
          
          @page { margin: 1cm; }
        }
      `}} />

      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center no-print sticky top-0 z-10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <IconFileText />
          Outil d'Enquête Métier
        </h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('form')}
            className={`md:hidden px-3 py-2 rounded-md flex items-center gap-2 text-sm ${activeTab === 'form' ? 'bg-blue-700' : 'bg-blue-800'}`}
          >
            <IconEdit /> Formulaire
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`md:hidden px-3 py-2 rounded-md flex items-center gap-2 text-sm ${activeTab === 'preview' ? 'bg-blue-700' : 'bg-blue-800'}`}
          >
            <IconFileText /> Aperçu
          </button>
          <button
            onClick={handleEmail}
            className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium"
          >
            <IconMail />
            <span className="hidden sm:inline">Envoyer par mail</span>
          </button>
          <button 
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium"
          >
            <IconPrinter /> 
            <span className="hidden sm:inline">Imprimer / PDF</span>
          </button>
        </div>
      </header>

      <main className="main-content-area flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* COLONNE GAUCHE : FORMULAIRE */}
        <div className={`no-print w-full md:w-1/2 lg:w-5/12 border-r border-gray-300 bg-white overflow-y-auto ${activeTab === 'form' ? 'block' : 'hidden md:block'}`}>
          <div className="p-4 sm:p-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 border-b pb-2">Saisie des réponses</h2>
            <p className="text-sm text-gray-500 mb-6">Remplissez les champs ci-dessous. Le document final se mettra à jour automatiquement à droite.</p>
            
            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section.id} className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <span className="text-blue-500"><IconChevron /></span>
                    {section.title}
                  </h3>
                  <div className="space-y-4 pl-1 sm:pl-2">
                    {section.fields.map((field) => (
                      <div key={field.id} className="flex flex-col gap-1.5">
                        <label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                          {field.label}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            id={field.id}
                            rows="3"
                            className="w-full rounded-md border-gray-300 border p-2 sm:p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-y"
                            placeholder="Votre réponse..."
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                          />
                        ) : (
                          <input
                            type="text"
                            id={field.id}
                            className="w-full rounded-md border-gray-300 border p-2 sm:p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                            placeholder="Votre réponse..."
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : APERÇU DOCUMENT (Design Moderne restauré) */}
        <div className={`preview-wrapper w-full md:w-1/2 lg:w-7/12 bg-gray-300 overflow-y-auto p-2 sm:p-6 flex justify-center ${activeTab === 'preview' ? 'block' : 'hidden md:flex'}`}>
          
          <div className="print-container bg-white shadow-2xl max-w-[21cm] w-full min-h-[29.7cm] p-6 sm:p-12 text-gray-900">
            
            <div className="flex justify-between items-center mb-8">
              {/* Placeholders pour les logos - À remplacer par vos images */}
              <img src="https://placehold.co/150x80?text=Logo+1" alt="Image 1" className="h-20 object-contain" />
              <img src="https://placehold.co/150x80?text=Logo+2" alt="Image 2" className="h-20 object-contain" />
            </div>

            <div className="text-center mb-8 page-break">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider mb-6 text-gray-800 border-b-2 border-gray-800 pb-3 inline-block">
                Enquête Métier
              </h1>
            </div>

            <div className="mb-8 page-break">
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4 text-gray-700 bg-gray-100 p-2 border-l-4 border-gray-800">Motivation</h2>
              <p className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
                Bonjour Madame, Mademoiselle, Monsieur,
              </p>
              <p className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
                Je suis actuellement en pleine réflexion sur mon avenir professionnel et suis particulièrement intéressé(e) par votre métier / secteur d'activité.
              </p>
              <p className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
                Aussi, afin de m'en faire une image des plus objectives, j'aurai besoin d'informations sur certains aspects de la profession et vous serais reconnaissant(e) de bien vouloir accepter de répondre à un questionnaire.
              </p>
              <p className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
                Je vous assure d'ores et déjà que cela ne vous prendra que très peu de temps.<br/>
                Votre avis m'est précieux et me permettra de déterminer mon positionnement sur ce secteur.
              </p>
            </div>

            <div className="mb-8 page-break">
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-6 text-gray-700 bg-gray-100 p-2 border-l-4 border-gray-800">Enquête sur les métiers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="border-b border-gray-300 pb-1">
                  <span className="font-semibold block text-xs text-gray-500 uppercase">Entreprise ou organisme :</span>
                  <span className="text-base sm:text-lg min-h-[1.5rem] block text-blue-900">{formData.entreprise || ''}</span>
                </div>
                <div className="border-b border-gray-300 pb-1">
                  <span className="font-semibold block text-xs text-gray-500 uppercase">Adresse :</span>
                  <span className="text-base sm:text-lg min-h-[1.5rem] block text-blue-900">{formData.adresse || ''}</span>
                </div>
                <div className="border-b border-gray-300 pb-1">
                  <span className="font-semibold block text-xs text-gray-500 uppercase">Téléphone :</span>
                  <span className="text-base sm:text-lg min-h-[1.5rem] block text-blue-900">{formData.telephone || ''}</span>
                </div>
                <div className="border-b border-gray-300 pb-1">
                  <span className="font-semibold block text-xs text-gray-500 uppercase">Personne rencontrée :</span>
                  <span className="text-base sm:text-lg min-h-[1.5rem] block text-blue-900">{formData.personne || ''}</span>
                </div>
                <div className="border-b border-gray-300 pb-1 md:col-span-2">
                  <span className="font-semibold block text-xs text-gray-500 uppercase">Poste occupé :</span>
                  <span className="text-base sm:text-lg min-h-[1.5rem] block text-blue-900">{formData.posteOccupe || ''}</span>
                </div>
                <div className="border-b border-gray-300 pb-1 md:col-span-2">
                  <span className="font-semibold block text-xs text-gray-500 uppercase">Poste sur lequel porte l'enquête :</span>
                  <span className="text-base sm:text-lg min-h-[1.5rem] block text-blue-900">{formData.posteEnquete || ''}</span>
                </div>
              </div>
            </div>

            {sections.slice(1).map((section) => (
              <div key={`doc-${section.id}`} className="mb-8">
                <h2 className="text-lg sm:text-xl font-bold uppercase mb-5 text-gray-700 bg-gray-100 p-2 border-l-4 border-gray-800 page-break">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.fields.map((field) => (
                    <div key={`doc-field-${field.id}`} className="page-break">
                      <p className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{field.label}</p>
                      <div className="min-h-[2rem] p-2 sm:p-3 bg-blue-50/50 border border-blue-100 rounded text-gray-800 whitespace-pre-wrap text-sm sm:text-base">
                        {formData[field.id] ? formData[field.id] : <span className="text-gray-400 italic">...</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-12 text-center text-gray-600 italic page-break">
              <p className="text-base sm:text-lg mb-1">Je vous remercie sincèrement du temps précieux que vous m'avez accordé.</p>
              <p>Excellente journée.</p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}