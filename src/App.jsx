import { useState, useRef, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import { 
  FileText, Edit, Eye, Mail, Printer, Mic, ChevronDown, Download, Share2, X, MessageSquare
} from 'lucide-react';
import { sections } from './data/sections';
import { loadImageAsDataURI } from './utils/imageLoader';

// --- Custom SVG Icons for Share Modal ---
const IconWhatsApp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.5 1.32 5.02l-1.37 4.99 5.1-1.34c1.47.8 3.12 1.25 4.86 1.25h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-1.25-.47-2.39-1.47-2.39-1.47s-.88-.79-1.65-2.06c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
  </svg>
);
const IconTelegram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.74-1.48 6.98c-.13.62-.53.78-1.04.49l-2.23-1.64-1.08 1.04c-.12.12-.22.22-.45.22l.16-2.28 4.2-3.8c.18-.16-.05-.25-.3-.1l-5.17 3.25-2.18-.68c-.63-.2-.64-.65.13-1l8.5-3.3c.53-.2.97.13.81.74z" />
  </svg>
);

export default function App() {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('enquete-metier-data');
      return saved ? JSON.parse(saved) : {}; // Initial state from localStorage
    } catch (e) {
      console.warn("Failed to parse localStorage data", e);
      return {}; // Fallback to empty object on error
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
  const [currentDate] = useState(() => new Date().toLocaleDateString('fr-FR'));

  // Set viewport meta tag on mount.
  // It's generally better to set this in the public/index.html file.
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
  }, []);

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem('enquete-metier-data', JSON.stringify(formData));
    } catch (e) {
      console.warn("Failed to save to localStorage", e);
    }
  }, [formData]);

  const handleChange = useCallback((id, value) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  }, []);

  const toggleListening = useCallback((fieldId) => {
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
      if (!event.results || !event.results[0] || !event.results[0][0]) {
        console.error("Erreur : résultat vocale invalide");
        return;
      }
      const transcript = event.results[0][0].transcript;
      setFormData(prev => {
        const currentVal = prev[fieldId] || ''; // Use prev state
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
  }, [listeningField]); // Recreate if listeningField changes

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

  const generateAndSharePdf = async () => {
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
      const file = await generatePdfDocument(formData);
      setPdfFile(file);
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
      
      {/* Print-specific CSS */}
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
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isFullscreenPreview={isFullscreenPreview}
        setIsFullscreenPreview={setIsFullscreenPreview}
        onGenerateAndShare={generateAndSharePdf}
        isGenerating={isGenerating}
        onPrint={handlePrint}
        progress={progress}
      />

      <main className="main-content-area flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* COLONNE GAUCHE : FORMULAIRE */}
        <div className={`no-print w-full ${isFullscreenPreview ? 'md:hidden' : 'md:w-1/2 lg:w-5/12'} border-r border-gray-300 bg-white overflow-y-auto ${activeTab === 'form' ? 'block' : 'hidden md:block'}`}>
          <div className="p-4 sm:p-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 border-b pb-2">Saisie des réponses</h2>
            <div className="text-sm text-gray-500 mb-6 space-y-3">
              <p>Remplissez les champs ci-dessous. Le document final se mettra à jour automatiquement à droite.</p>
              <div className="flex items-start sm:items-center gap-2 text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="shrink-0 mt-0.5 sm:mt-0"><Mic /></div>
                <span><strong>Astuce :</strong> Vous pouvez dicter vos réponses en cliquant sur l'icône micro.</span>
              </div>
            </div>
            
            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section.id} className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <span className="text-blue-500"><ChevronDown /></span>
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
                            <Mic />
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
                <Eye /> Voir l'aperçu du document
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
      <ShareModal 
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
        canSharePdf={canSharePdf()}
        pdfFile={pdfFile}
        shareSubject={shareSubject}
        shareBody={shareBody}
      />
    </div>
  );
}

const Header = ({ activeTab, setActiveTab, isFullscreenPreview, setIsFullscreenPreview, onGenerateAndShare, isGenerating, onPrint, progress }) => (
  <div className="sticky top-0 z-10 no-print shadow-md">
    <header className="bg-blue-900 text-white p-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <FileText />
        Outil d'Enquête Métier
      </h1>
      <div className="flex gap-2 flex-wrap justify-center">
        <button onClick={() => setActiveTab('form')} className={`md:hidden px-3 py-2 rounded-md flex items-center gap-2 text-sm ${activeTab === 'form' ? 'bg-blue-700' : 'bg-blue-800'}`}>
          <Edit /> Formulaire
        </button>
        <button onClick={() => setActiveTab('preview')} className={`md:hidden px-3 py-2 rounded-md flex items-center gap-2 text-sm ${activeTab === 'preview' ? 'bg-blue-700' : 'bg-blue-800'}`}>
          <FileText /> Aperçu
        </button>
        <button onClick={() => setIsFullscreenPreview(!isFullscreenPreview)} className={`hidden md:flex px-3 py-2 rounded-md items-center gap-2 text-sm transition-colors ${isFullscreenPreview ? 'bg-blue-700 ring-2 ring-blue-400' : 'bg-blue-800 hover:bg-blue-700'}`} title={isFullscreenPreview ? "Revenir à l'édition" : "Voir le document en plein écran"}>
          {isFullscreenPreview ? <Edit /> : <Eye />} <span className="hidden lg:inline">{isFullscreenPreview ? "Éditer" : "Plein Écran"}</span>
        </button>
        <button onClick={onGenerateAndShare} disabled={isGenerating} className={`${isGenerating ? 'bg-gray-400 cursor-wait' : 'bg-sky-600 hover:bg-sky-500'} text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium`}>
          {isGenerating ? <span className="animate-pulse">Génération...</span> : <><Mail /><span className="hidden sm:inline">Envoyer PDF</span></>}
        </button>
        <button onClick={onPrint} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium">
          <Printer /> 
          <span className="hidden sm:inline">Imprimer / PDF</span>
        </button>
      </div>
    </header>
    <div className="px-4 pt-1 pb-2 bg-blue-900 border-t border-blue-800/50">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-blue-200/80 uppercase tracking-wider">Progression</span>
        <span className="text-sm font-bold text-white">{progress}%</span>
      </div>
      <div className="w-full bg-black/25 rounded-full h-2.5 shadow-inner">
        <div className="bg-gradient-to-r from-emerald-400 to-sky-400 h-2.5 rounded-full shadow-lg transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  </div>
);

const ShareModal = ({ show, onClose, canSharePdf, pdfFile, shareSubject, shareBody }) => {
  if (!show) return null;

  const shareOptions = [
    {
      href: `mailto:?subject=${encodeURIComponent(shareSubject)}&body=${encodeURIComponent(shareBody)}`,
      label: "Partager par Email",
      name: "Email",
      Icon: Mail,
      className: "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
    },
    {
      href: `https://wa.me/?text=${encodeURIComponent(shareSubject + "\n\n" + shareBody)}`,
      label: "Partager par WhatsApp",
      name: "WhatsApp",
      Icon: IconWhatsApp,
      className: "bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
    },
    {
      href: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareSubject + "\n\n" + shareBody)}`,
      label: "Partager par Telegram",
      name: "Telegram",
      Icon: IconTelegram,
      className: "bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-700"
    },
    {
      href: `sms:?&body=${encodeURIComponent(shareSubject + "\n\n" + shareBody)}`,
      label: "Partager par SMS",
      name: "SMS",
      Icon: MessageSquare,
      className: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative transform transition-all scale-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"><X /></button>
        <div className="text-center mb-6">
          <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-green-600 shadow-sm"><Download size={32} /></div>
          <h3 className="text-xl font-bold text-gray-900">Document téléchargé !</h3>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">Le PDF a été enregistré. Choisissez comment envoyer le message (n'oubliez pas de <strong>joindre le fichier</strong>) :</p>
        </div>
        {canSharePdf && (
          <button
            onClick={async () => {
              try { await navigator.share({ files: [pdfFile], title: shareSubject, text: shareBody }); } 
              catch (e) { console.log("Partage annulé ou erreur", e); }
            }}
            className="w-full mb-4 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Share2 size={20} /> Partager le fichier directement
          </button>
        )}
        <div className="grid grid-cols-2 gap-3">
          {shareOptions.map(({ href, label, name, Icon, className }) => (
            <a key={name} href={href} aria-label={label} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors border group ${className}`}>
              <div className="group-hover:scale-110 transition-transform"><Icon /></div>
              <span className="mt-2 text-sm font-medium">{name}</span>
            </a>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-6 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg">Fermer</button>
      </div>
    </div>
  );
};

async function generatePdfDocument(formData) {
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

  const logoHeight = 20;
  if (logo1Data) {
    try {
      const imgProps = pdf.getImageProperties(logo1Data);
      pdf.addImage(logo1Data, 'PNG', margin, y, logoHeight * (imgProps.width / imgProps.height), logoHeight);
    } catch (e) { console.warn("Erreur ajout logo 1", e); }
  }
  if (logo2Data) {
    try {
      const imgProps = pdf.getImageProperties(logo2Data);
      const logoWidth = logoHeight * (imgProps.width / imgProps.height);
      pdf.addImage(logo2Data, 'PNG', pdfWidth - margin - logoWidth, y, logoWidth, logoHeight);
    } catch (e) { console.warn("Erreur ajout logo 2", e); }
  }
  if (logo1Data || logo2Data) y += logoHeight + 10;

  pdf.setFontSize(24).setFont('helvetica', 'bold').text("Enquête Métier", pdfWidth / 2, y, { align: 'center' });
  y += 15;

  checkPageBreak(40);
  pdf.setFontSize(16).setFont('helvetica', 'bold').setTextColor(49, 46, 129).text("Motivation", margin, y);
  y += 5;
  pdf.setLineWidth(0.5).setDrawColor(209, 213, 219).line(margin, y, pdfWidth - margin, y);
  y += 10;

  pdf.setFontSize(11).setFont('helvetica', 'normal').setTextColor(0, 0, 0);
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

  sections.forEach((section) => {
    checkPageBreak(20);
    pdf.setFontSize(16).setFont('helvetica', 'bold').setTextColor(49, 46, 129).text(section.title, margin, y);
    y += 5;
    pdf.setLineWidth(0.5).setDrawColor(209, 213, 219).line(margin, y, pdfWidth - margin, y);
    y += 10;

    section.fields.forEach(field => {
      const questionLines = pdf.splitTextToSize(field.label, maxLineWidth);
      const answer = formData[field.id] || 'Non renseigné';
      const answerLines = pdf.splitTextToSize(answer, maxLineWidth - 4);
      const neededHeight = (questionLines.length * (lineHeight - 2)) + (answerLines.length * lineHeight) + 12;
      checkPageBreak(neededHeight);

      pdf.setFontSize(11).setFont('helvetica', 'bold').setTextColor(0, 0, 0).text(questionLines, margin, y);
      y += questionLines.length * (lineHeight - 2) + 3;

      pdf.setFont('helvetica', 'normal').setTextColor(80, 80, 80);
      const answerHeight = answerLines.length * lineHeight;
      pdf.setDrawColor(156, 163, 175).setLineWidth(0.8).line(margin, y - 2, margin, y + answerHeight - 5);
      pdf.text(answerLines, margin + 3, y);
      y += answerHeight + 7;
    });
    y += 5;
  });

  checkPageBreak(30);
  y += 10;
  pdf.setLineWidth(0.2).setDrawColor(209, 213, 219).line(margin, y, pdfWidth - margin, y);
  y += 10;
  pdf.setFontSize(10).setTextColor(0, 0, 0).text(`Fait le ${new Date().toLocaleDateString('fr-FR')}`, margin, y);
  if (formData.consent) {
    pdf.setTextColor(0, 128, 0).setFont('helvetica', 'bold').text("✓ Consentement validé", margin, y + lineHeight);
  }

  pdf.save("enquete-metier.pdf");
  const blob = pdf.output('blob');
  return new File([blob], "enquete-metier.pdf", { type: "application/pdf" });
}