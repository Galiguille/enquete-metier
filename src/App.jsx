import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import { sections } from './data/sections';

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
const IconMailLarge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const IconMic = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
);
const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const IconWhatsApp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.4c-1.5-1.5-3.5-2.3-5.6-2.3-4.4 0-8 3.6-8 8 0 1.4.4 2.8 1.1 4.1L2 22l4.3-1.4c1.2.7 2.6 1.1 4.1 1.1h.1c4.4 0 8-3.6 8-8 0-2.1-.8-4.1-2.3-5.6zm-5.6 13.1c-1.3 0-2.6-.3-3.8-1l-.3-.1-3 1 1-2.9-.2-.3c-.7-1.2-1.1-2.5-1.1-3.9 0-3.7 3-6.7 6.7-6.7 1.8 0 3.5.7 4.8 2 1.3 1.3 2 3 2 4.8 0 3.7-3 6.7-6.7 6.7zm3.7-5.1c-.2-.1-1.3-.6-1.5-.7-.2 0-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.1-.3.2-.5.1-.2-.1-1-.3-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.3-.4.1-.1.1-.2.2-.4.1-.2 0-.3 0-.4-.1-.2-.4-1-.6-1.3-.1-.4-.3-.3-.4-.3h-.5c-.2 0-.5.1-.7.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2 1 2.3.2.2 1.3.3 2.3.3h.1c1 0 3.2-.4 3.7-1.9.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.5-.3z"></path></svg>
);
const IconTelegram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
const IconSMS = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

// Helper pour charger les images pour le PDF
const loadImageAsDataURI = async (path) => {
  try {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(`Impossible de charger l'image: ${path}`, error);
    return null;
  }
};

export default function App() {
  const [formData, setFormData] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [listeningField, setListeningField] = useState(null);
  const [highlightConsent, setHighlightConsent] = useState(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Force le viewport pour s'adapter aux écrans mobiles (ex: Motorola G200)
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    
    // Set current date
    setCurrentDate(new Date().toLocaleDateString('fr-FR'));
  }, []);

  // Restauration et sauvegarde automatique des données
  useEffect(() => {
    // Au chargement, on essaie de restaurer les données
    try {
      const savedData = localStorage.getItem('enqueteFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Object.keys(parsedData).length > 0) {
          if (window.confirm("Une session précédente a été trouvée. Voulez-vous restaurer les données saisies ?")) {
            setFormData(parsedData);
          } else {
            // Si l'utilisateur refuse, on nettoie le stockage pour la prochaine fois
            localStorage.removeItem('enqueteFormData');
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la restauration depuis le localStorage:", error);
      localStorage.removeItem('enqueteFormData');
    }
  }, []); // Ne s'exécute qu'une seule fois au montage

  useEffect(() => {
    // À chaque modification du formulaire, on sauvegarde les données
    try {
      localStorage.setItem('enqueteFormData', JSON.stringify(formData));
    } catch (e) {
      // Ignore les erreurs de quota ou de navigation privée
    }
  }, [formData]); // S'exécute à chaque fois que formData change

  const handleChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const toggleListening = (fieldId) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Votre navigateur ne supporte pas la reconnaissance vocale. Essayez Chrome, Edge ou Safari.");
      return;
    }

    if (listeningField === fieldId) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setListeningField(null);
      return;
    }

    if (listeningField && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListeningField(fieldId);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => {
        const currentVal = prev[fieldId] || '';
        const prefix = currentVal && !currentVal.endsWith(' ') ? ' ' : '';
        const textToAdd = !currentVal ? transcript.charAt(0).toUpperCase() + transcript.slice(1) : transcript;
        return { ...prev, [fieldId]: currentVal + prefix + textToAdd };
      });
    };

    recognition.onerror = (event) => {
      console.error("Erreur vocale:", event.error);
      setListeningField(null);
    };

    recognition.onend = () => {
      setListeningField(null);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Calcul de la progression
  const allFields = sections.flatMap(section => section.fields);
  const filledFields = allFields.filter(field => formData[field.id] && formData[field.id].trim().length > 0).length;
  const progress = Math.round((filledFields / allFields.length) * 100);

  // Préparation des messages de partage
  const shareSubject = `Enquête Métier : ${formData.entreprise || 'Nouvelle enquête'}`;
  const shareBody = `Bonjour,\n\nVeuillez trouver ci-joint le document PDF de l'enquête métier.\n\nCordialement.`;

  // Vérification sécurisée du support de partage de fichiers
  const canSharePdf = () => {
    try {
      return navigator.canShare && pdfFile && navigator.canShare({ files: [pdfFile] });
    } catch (e) {
      return false;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = async () => {
    if (!formData.consent) {
      alert("Veuillez cocher la case de consentement RGPD pour générer le document.");
      setActiveTab('form'); // Force l'affichage de l'onglet formulaire (utile sur mobile)
      setTimeout(() => {
        const checkbox = document.getElementById('rgpd-checkbox');
        if (checkbox) {
          checkbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightConsent(true);
          setTimeout(() => setHighlightConsent(false), 9000); // Arrête le clignotement après 9 secondes
        }
      }, 100);
      return;
    }

    setIsGenerating(true);

    try {
      const [logo1Data, logo2Data] = await Promise.all([
        loadImageAsDataURI('/logo1.png'),
        loadImageAsDataURI('/logo2.png')
      ]);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const maxLineWidth = pdfWidth - margin * 2;
      const lineHeight = 7;
      let y = margin;

      const checkPageBreak = (neededHeight = 0) => {
        if (y + neededHeight > pdfHeight - margin) {
          pdf.addPage();
          y = margin;
        }
      };

      // --- Construction du PDF ---

      // Logos
      const logoHeight = 20;
      if (logo1Data) {
        try {
          const imgProps = pdf.getImageProperties(logo1Data);
          const aspectRatio = imgProps.width / imgProps.height;
          pdf.addImage(logo1Data, 'PNG', margin, y, logoHeight * aspectRatio, logoHeight);
        } catch (e) {
          console.warn("Erreur lors de l'ajout du logo 1", e);
        }
      }
      if (logo2Data) {
        try {
          const imgProps = pdf.getImageProperties(logo2Data);
          const aspectRatio = imgProps.width / imgProps.height;
          const logoWidth = logoHeight * aspectRatio;
          pdf.addImage(logo2Data, 'PNG', pdfWidth - margin - logoWidth, y, logoWidth, logoHeight);
        } catch (e) {
          console.warn("Erreur lors de l'ajout du logo 2", e);
        }
      }
      if (logo1Data || logo2Data) {
        y += logoHeight + 10;
      }

      // Titre
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Enquête Métier", pdfWidth / 2, y, { align: 'center' });
      y += 15;

      // Motivation
      checkPageBreak(40);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(49, 46, 129); // text-blue-900
      pdf.text("Motivation", margin, y);
      y += 5;
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(209, 213, 219); // gray-300
      pdf.line(margin, y, pdfWidth - margin, y);
      y += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      const motivationText = [
        "Bonjour Madame, Mademoiselle, Monsieur,",
        "Je suis actuellement en pleine réflexion sur mon avenir professionnel et suis particulièrement intéressé par votre métier.",
        "Aussi, afin de m'en faire une image des plus objectives, j'aurai besoin d'informations sur certains aspects de la profession et vous serais reconnaissant(e) de bien vouloir accepter de répondre à un questionnaire.",
        "Je vous assure d'ores et déjà que cela ne vous prendra que très peu de temps (environ 15 minutes).\nVotre avis m'est précieux et me permettra de déterminer mon positionnement sur ce secteur."
      ];
      motivationText.forEach(para => {
        const lines = pdf.splitTextToSize(para, maxLineWidth);
        checkPageBreak(lines.length * lineHeight);
        pdf.text(lines, margin, y);
        y += lines.length * (lineHeight - 1) + 3;
      });
      y += 10;

      // Sections et réponses
      sections.forEach((section) => {
        checkPageBreak(20);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(49, 46, 129); // text-blue-900
        pdf.text(section.title, margin, y);
        y += 5;
        pdf.setLineWidth(0.5);
        pdf.setDrawColor(209, 213, 219); // gray-300
        pdf.line(margin, y, pdfWidth - margin, y);
        y += 10;

        section.fields.forEach(field => {
          const questionLines = pdf.splitTextToSize(field.label, maxLineWidth);
          const answer = formData[field.id] || 'Non renseigné';
          const answerLines = pdf.splitTextToSize(answer, maxLineWidth - 4); // Réserve espace pour l'indentation
          const neededHeight = (questionLines.length * (lineHeight - 2)) + (answerLines.length * lineHeight) + 12;
          checkPageBreak(neededHeight);

          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(questionLines, margin, y);
          y += questionLines.length * (lineHeight - 2) + 3;

          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(80, 80, 80);
          const answerHeight = answerLines.length * lineHeight;

          // Dessine une bordure à gauche pour l'élégance
          pdf.setDrawColor(156, 163, 175); // gray-400
          pdf.setLineWidth(0.8);
          pdf.line(margin, y - 2, margin, y + answerHeight - 5);

          pdf.text(answerLines, margin + 3, y);
          y += answerHeight + 7;
        });
        y += 5;
      });
      
      // Section Signature
      checkPageBreak(30);
      y += 10;
      pdf.setLineWidth(0.2);
      pdf.setDrawColor(209, 213, 219); // gray-300
      pdf.line(margin, y, pdfWidth - margin, y);
      y += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Fait le ${new Date().toLocaleDateString('fr-FR')}`, margin, y);
      if (formData.consent) {
        pdf.setTextColor(0, 128, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text("✓ Consentement validé", margin, y + lineHeight);
        pdf.setTextColor(0, 0, 0);
      }

      // 1. Téléchargement direct du PDF
      pdf.save("enquete-metier.pdf");

      // 2. Préparation du fichier pour le partage natif (Mobile)
      const blob = pdf.output('blob');
      const file = new File([blob], "enquete-metier.pdf", { type: "application/pdf" });
      setPdfFile(file);
      
      // 3. Ouverture de la modale de partage
      setShowShareModal(true);

    } catch (error) {
      console.error("Erreur lors de la génération :", error);
      if (error.name !== 'AbortError') {
        alert("Une erreur est survenue lors de la création du PDF : " + (error.message || error));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col font-sans main-app-wrapper">
      
      {/* CSS D'IMPRESSION (Correctif conservé) */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');
        .print-container {
          font-family: 'Lato', sans-serif;
        }
        @media print {
          html, body, #root, .main-app-wrapper, .main-content-area {
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            display: block !important;
            background: white !important;
            font-family: 'Lato', sans-serif;
          }
          .no-print { display: none !important; }
          .preview-wrapper {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            position: static !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-container { 
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 11pt;
            color: #333;
            box-shadow: none !important;
          }
          .print-container h1, .print-container h2 {
            color: #000 !important;
          }
          .print-container h2, .print-container .answer-box {
            background-color: transparent !important;
          }
          .print-container .answer-box {
            border-color: #e5e7eb !important;
          }
          .page-break { 
            page-break-inside: avoid;
          }
          @page { 
            margin: 2cm;
          }
        }
      `}} />

      {/* Header */}
      <div className="sticky top-0 z-10 no-print shadow-md">
        <header className="bg-blue-900 text-white p-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <IconFileText />
          Outil d'Enquête Métier
        </h1>
        <div className="flex gap-2 flex-wrap justify-center">
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
            onClick={() => setIsFullscreenPreview(!isFullscreenPreview)}
            className={`hidden md:flex px-3 py-2 rounded-md items-center gap-2 text-sm transition-colors ${isFullscreenPreview ? 'bg-blue-700 ring-2 ring-blue-400' : 'bg-blue-800 hover:bg-blue-700'}`}
            title={isFullscreenPreview ? "Revenir à l'édition" : "Voir le document en plein écran"}
          >
            {isFullscreenPreview ? <IconEdit /> : <IconEye />} <span className="hidden lg:inline">{isFullscreenPreview ? "Éditer" : "Plein Écran"}</span>
          </button>
          <button
            onClick={handleEmail}
            disabled={isGenerating}
            className={`${isGenerating ? 'bg-gray-400 cursor-wait' : 'bg-sky-600 hover:bg-sky-500'} text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium`}
          >
            {isGenerating ? <span className="animate-pulse">Génération...</span> : <><IconMail /><span className="hidden sm:inline">Envoyer PDF</span></>}
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

      {/* Barre de progression améliorée */}
      <div className="px-4 pt-1 pb-2 bg-blue-900 border-t border-blue-800/50">
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-blue-200/80 uppercase tracking-wider">Progression</span>
            <span className="text-sm font-bold text-white">{progress}%</span>
        </div>
        <div className="w-full bg-black/25 rounded-full h-2.5 shadow-inner">
            <div 
                className="bg-gradient-to-r from-emerald-400 to-sky-400 h-2.5 rounded-full shadow-lg transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
      </div>
      </div>

      <main className="main-content-area flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* COLONNE GAUCHE : FORMULAIRE */}
        <div className={`no-print w-full ${isFullscreenPreview ? 'md:hidden' : 'md:w-1/2 lg:w-5/12'} border-r border-gray-300 bg-white overflow-y-auto ${activeTab === 'form' ? 'block' : 'hidden md:block'}`}>
          <div className="p-4 sm:p-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 border-b pb-2">Saisie des réponses</h2>
            <div className="text-sm text-gray-500 mb-6 space-y-3">
              <p>Remplissez les champs ci-dessous. Le document final se mettra à jour automatiquement à droite.</p>
              <div className="flex items-start sm:items-center gap-2 text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="shrink-0 mt-0.5 sm:mt-0"><IconMic /></div>
                <span><strong>Astuce :</strong> Vous pouvez dicter vos réponses en cliquant sur l'icône micro dans chaque champ.</span>
              </div>
            </div>
            
            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section.id} className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
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
                        <div className="relative">
                          {field.type === 'textarea' ? (
                            <textarea
                              id={field.id}
                              rows="3"
                              className="w-full rounded-md border-gray-300 border p-2 sm:p-3 pr-10 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-y"
                              placeholder="Votre réponse..."
                              value={formData[field.id] || ''}
                              onChange={(e) => handleChange(field.id, e.target.value)}
                            />
                          ) : (
                            <input
                              type="text"
                              id={field.id}
                              className="w-full rounded-md border-gray-300 border p-2 sm:p-3 pr-10 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                              placeholder="Votre réponse..."
                              value={formData[field.id] || ''}
                              onChange={(e) => handleChange(field.id, e.target.value)}
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => toggleListening(field.id)}
                            className={`absolute right-2 top-2 p-1.5 rounded-full transition-all ${
                              listeningField === field.id 
                                ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-400' 
                                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                            title="Dicter la réponse"
                          >
                            <IconMic />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Case à cocher Consentement RGPD */}
            <div className={`mt-6 p-4 rounded-xl border transition-all duration-300 ${
              highlightConsent 
                ? 'bg-red-100 border-red-500 ring-4 ring-red-200 animate-pulse' 
                : 'bg-blue-50 border-blue-100'
            }`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  id="rgpd-checkbox"
                  type="checkbox" 
                  className={`mt-1 w-4 h-4 rounded border-gray-300 focus:ring-blue-500 ${highlightConsent ? 'text-red-600' : 'text-blue-600'}`}
                  checked={formData.consent || false}
                  onChange={(e) => {
                    handleChange('consent', e.target.checked);
                    if (e.target.checked) setHighlightConsent(false);
                  }}
                />
                <span className={`text-sm ${highlightConsent ? 'text-red-700 font-bold' : 'text-gray-700'}`}>
                  En cochant cette case, j'accepte que les informations saisies soient utilisées uniquement dans le cadre pédagogique de cette enquête métier (RGPD) (aucune information reste stockee sur serveur ou ordinateur).
                </span>
              </label>
            </div>

            {/* Bouton Voir Aperçu (Mobile) */}
            <div className="mt-8 mb-4 md:hidden">
              <button
                onClick={() => setActiveTab('preview')}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 font-bold active:scale-95 transition-transform"
              >
                <IconEye /> Voir l'aperçu du document
              </button>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : APERÇU DOCUMENT (Design Moderne restauré) */}
        <div className={`preview-wrapper w-full ${isFullscreenPreview ? 'md:w-full' : 'md:w-1/2 lg:w-7/12'} bg-gray-300 overflow-y-auto p-2 sm:p-6 ${activeTab === 'preview' ? 'block' : 'hidden md:block'}`}>
          
          <div className="print-container bg-white shadow-2xl max-w-[21cm] w-full min-h-[29.7cm] p-4 sm:p-12 text-gray-900 mx-auto">
            
            <div className="flex justify-between items-center mb-8">
              {/* Placeholders pour les logos - À remplacer par vos images */}
              <img src="/logo1.png" crossOrigin="anonymous" alt="Logo Gauche" className="h-20 object-contain" />
              <img src="/logo2.png" crossOrigin="anonymous" alt="Logo Droite" className="h-20 object-contain" />
            </div>

            <div className="text-center mb-12 page-break">
              <h1 className="text-3xl font-bold text-center mb-8 pb-4 border-b-2 border-gray-300">
                Enquête Métier
              </h1>
            </div>

            <div className="mb-10 page-break">
              <h2 className="text-xl font-bold mb-5 text-gray-800 border-b border-gray-300 pb-2">Motivation</h2>
              <p className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
                Bonjour Madame, Mademoiselle, Monsieur,
              </p>
              <p className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
                Je suis actuellement en pleine réflexion sur mon avenir professionnel et suis particulièrement intéressé par votre métier.
              </p>
              <p className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
                Aussi, afin de m'en faire une image des plus objectives, j'aurai besoin d'informations sur certains aspects de la profession et vous serais reconnaissant(e) de bien vouloir accepter de répondre à un questionnaire.
              </p>
              <p className="mb-3 text-justify leading-relaxed text-sm sm:text-base">
                Je vous assure d'ores et déjà que cela ne vous prendra que très peu de temps (environ 15 minutes).<br/>
                Votre avis m'est précieux et me permettra de déterminer mon positionnement sur ce secteur.
              </p>
            </div>

            <div className="mb-10 page-break">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-300 pb-2">Enquête sur les métiers</h2>
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
                <h2 className="text-xl font-bold mb-5 text-gray-800 border-b border-gray-300 pb-2 page-break">
                  {section.title}
                </h2>
                <div className="space-y-5">
                  {section.fields.map((field) => (
                    <div key={`doc-field-${field.id}`} className="page-break">
                      <p className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">{field.label}</p>
                      <div className="answer-box min-h-[2rem] p-3 bg-gray-50 border-l-2 border-gray-400 text-gray-800 whitespace-pre-wrap text-base">
                        {formData[field.id] ? formData[field.id] : <span className="text-gray-400 italic">Non renseigné</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Section Signature / Date */}
            <div className="mt-8 pt-4 border-t-2 border-gray-200 page-break">
              <div className="flex justify-between items-end">
                <div className="text-sm text-gray-600">
                  <p>Fait le {currentDate}</p>
                  {formData.consent ? <p className="text-emerald-700 font-bold mt-1">✓ Consentement validé</p> : <p className="text-red-400 text-xs mt-1">Consentement en attente</p>}
                </div>
              </div>
            </div>

            <div className="mt-12 text-center text-gray-600 italic page-break">
              <p className="text-base sm:text-lg mb-1">Je vous remercie sincèrement du temps précieux que vous m'avez accordé.</p>
              <p>Excellente journée.</p>
            </div>

          </div>
        </div>
      </main>

      {/* MODALE DE PARTAGE */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative transform transition-all scale-100">
            <button 
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-green-600 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Document téléchargé !</h3>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Le PDF a été enregistré sur votre appareil. Choisissez comment envoyer le message (n'oubliez pas de <strong>joindre le fichier</strong>) :
              </p>
            </div>

            {/* Bouton de Partage Natif (Visible uniquement si supporté, ex: Mobile) */}
            {canSharePdf() && (
              <button
                onClick={async () => {
                  try {
                    await navigator.share({
                      files: [pdfFile],
                      title: shareSubject,
                      text: shareBody
                    });
                  } catch (e) { console.log("Partage annulé ou erreur", e); }
                }}
                className="w-full mb-4 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                Partager le fichier directement
              </button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <a href={`mailto:?subject=${encodeURIComponent(shareSubject)}&body=${encodeURIComponent(shareBody)}`} className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 text-gray-700 group">
                <div className="group-hover:scale-110 transition-transform"><IconMailLarge /></div>
                <span className="mt-2 text-sm font-medium">Email</span>
              </a>
              <a href={`https://wa.me/?text=${encodeURIComponent(shareSubject + "\n\n" + shareBody)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors border border-green-200 text-green-700 group">
                <div className="group-hover:scale-110 transition-transform"><IconWhatsApp /></div>
                <span className="mt-2 text-sm font-medium">WhatsApp</span>
              </a>
              <a href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareSubject + "\n\n" + shareBody)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-3 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors border border-sky-200 text-sky-700 group">
                <div className="group-hover:scale-110 transition-transform"><IconTelegram /></div>
                <span className="mt-2 text-sm font-medium">Telegram</span>
              </a>
              <a href={`sms:?&body=${encodeURIComponent(shareSubject + "\n\n" + shareBody)}`} className="flex flex-col items-center justify-center p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200 text-indigo-700 group">
                <div className="group-hover:scale-110 transition-transform"><IconSMS /></div>
                <span className="mt-2 text-sm font-medium">SMS</span>
              </a>
            </div>
            
            <button onClick={() => setShowShareModal(false)} className="w-full mt-6 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}