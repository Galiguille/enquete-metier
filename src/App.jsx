import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import { 
  FileText, Edit, Eye, Mail, Printer, Mic, ChevronDown 
} from 'lucide-react';
import { sections } from './data/sections';
import { loadImageAsDataURI } from './utils/imageLoader';

// Créer des aliases pour les icônes
const IconFileText = FileText;
const IconEdit = Edit;
const IconEye = Eye;
const IconMail = Mail;
const IconPrinter = Printer;
const IconMic = Mic;
const IconChevron = ChevronDown;

// SVG inline pour les grandes icônes de partage
const IconMailLarge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 5L2 7"></path></svg>
);
const IconWhatsApp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.39 1.242-3.286 2.128-1.797 1.809-2.823 4.228-2.823 6.797 0 1.098.137 2.199.406 3.267l-.648 2.365 2.426-.651c.959.577 2.01.877 3.074.877 1.087 0 2.145-.289 3.092-.836 1.238-.503 2.39-1.242 3.286-2.128 1.797-1.809 2.823-4.228 2.823-6.797 0-1.098-.137-2.199-.406-3.267l.648-2.365-2.426.651z"></path></svg>
);
const IconTelegram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m3.75 9.79L9.48 15.05c-.35.27-.8.42-1.23.42-.43 0-.88-.15-1.23-.42l-5.27-4.26c-.52-.48-.52-1.3 0-1.78l5.27-4.26c.35-.27.8-.42 1.23-.42.43 0 .88.15 1.23.42l5.27 4.26c.52.48.52 1.3 0 1.78z"></path></svg>
);
const IconSMS = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

export default function App() {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('enquete-metier-data');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [activeTab, setActiveTab] = useState('form');
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [listeningField, setListeningField] = useState(null);
  const [highlightConsent, setHighlightConsent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  
  const recognitionRef = useRef(null);
  const currentDate = new Date().toLocaleDateString('fr-FR');

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem('enquete-metier-data', JSON.stringify(formData));
    } catch (e) {
      // Silencieusement ignoré (navigation privée, quota dépassé, etc.)
    }
  }, [formData]);

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
        "Aussi, afin de m'en faire une image des plus objectives, j'aurai besoin d'informations sur certains aspects de la profession et vous serais reconnaissant de bien vouloir accepter de répondre à un questionnaire.",
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
      let y = margin + logoHeight + 10; // Déclarez une fois avant

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