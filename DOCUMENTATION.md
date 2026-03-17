# Documentation du Projet : Outil d'Enquête Métier

## 1. Présentation du projet
Ce projet est une application web moderne (React) conçue pour faciliter la réalisation d'"Enquêtes Métier" (interviews de professionnels pour découvrir un métier).

Elle permet à l'utilisateur de :
- Remplir un formulaire structuré divisé en plusieurs sections.
- Dicter ses réponses vocalement grâce à la reconnaissance vocale du navigateur.
- Sauvegarder automatiquement ses réponses en local (pour ne rien perdre en cas de rafraîchissement).
- Générer un document PDF propre, formaté et prêt à être envoyé.
- Partager le PDF généré via Email, WhatsApp, Telegram, SMS ou l'outil de partage natif du téléphone.

---

## 2. Technologies utilisées
- **React** : Bibliothèque principale pour l'interface utilisateur et la réactivité de l'application.
- **Tailwind CSS** : Framework CSS utilitaire utilisé pour le design (visible via les classes comme `bg-blue-900`, `flex`, `rounded-xl`, etc.).
- **jsPDF** : Bibliothèque permettant de générer et dessiner le fichier PDF entièrement côté client.
- **Lucide React** : Bibliothèque d'icônes vectorielles (SVG).
- **Web Speech API** : API native des navigateurs (Chrome, Safari, Edge) pour la dictée vocale.

---

## 3. Architecture des fichiers
- `src/main.jsx` : Point d'entrée de l'application React. Il initialise l'application et l'attache au fichier HTML.
- `src/App.jsx` : Le composant central du projet. Il contient presque toute la logique : la gestion d'état, l'interface, la reconnaissance vocale, la fonction de génération du PDF et la modale de partage.
- `src/data/sections.js` : Fichier de configuration contenant les questions de l'enquête. Il est structuré en objet permettant le support bilingue (français et anglais).
- `src/utils/imageLoader.js` *(importé dans App.jsx)* : Un fichier utilitaire pour transformer les logos locaux en base64 afin de les intégrer au PDF.

---

## 4. Comprendre la création pas-à-pas

### Étape 1 : Le modèle de données (`sections.js`)
L'application ne code pas les questions en dur dans l'interface. Elle s'appuie sur le fichier `sections.js` qui contient un tableau d'objets décrivant chaque section et chaque champ. Cela permet de modifier facilement les questions à l'avenir sans toucher à la logique de `App.jsx`.

### Étape 2 : Gestion de l'état (State) et Sauvegarde
Dans `App.jsx`, le hook `useState` est utilisé pour stocker les réponses de l'utilisateur :
```javascript
const [formData, setFormData] = useState(() => {
  // Tente de récupérer les données précédentes au démarrage
  const saved = localStorage.getItem('enquete-metier-data');
  return saved ? JSON.parse(saved) : {};
});
```
Le hook `useEffect` surveille les changements de `formData` et met à jour le `localStorage` du navigateur de façon transparente.

### Étape 3 : L'interface Utilisateur (UI)
L'interface s'adapte à la taille de l'écran (Responsive) :
1. **Le Formulaire (colonne gauche)** : Construit dynamiquement en parcourant l'objet `sections`.
2. **L'Aperçu (colonne droite)** : Affiche une prévisualisation du rendu final en temps réel.
Sur smartphone, un système d'onglets (`activeTab`) permet de basculer facilement entre le formulaire et l'aperçu.

### Étape 4 : La Reconnaissance Vocale
Pour éviter de taper de longs textes, chaque champ est accompagné d'une icône microphone.
Au clic, la fonction `toggleListening(fieldId)` est déclenchée :
- Elle utilise l'API `SpeechRecognition`.
- Elle écoute la voix de l'utilisateur, la retranscrit en texte, et ajoute une majuscule au début si la case était vide.
- L'événement `onresult` concatène le nouveau texte à ce qui était potentiellement déjà écrit.

### Étape 5 : La Génération du PDF (`jsPDF`)
Lorsque l'utilisateur clique sur "Envoyer PDF", la fonction asynchrone `generatePdfDocument` est appelée :
1. **Chargement des images** : Elle attend le chargement des logos via `loadImageAsDataURI`.
2. **Initialisation** : Instanciation d'un document `jsPDF` (Format A4).
3. **Mise en page dynamique** : La fonction garde en mémoire la position verticale (`y`). Avant d'écrire une nouvelle ligne, elle appelle `checkPageBreak(neededHeight)` pour vérifier s'il reste assez d'espace. Si non, elle crée une nouvelle page (`pdf.addPage()`).
4. **Dessin** : Les titres sont mis en gras et en bleu, de belles bordures sont ajoutées pour encadrer les réponses.
5. **Génération** : La fonction ne télécharge pas directement le PDF, elle crée un objet `File` virtuel pour le préparer au partage.

### Étape 6 : La Modale de Partage (`ShareModal`)
L'application propose deux méthodes de partage via une modale élégante :
1. **Le partage direct (Web Share API)** : Si l'appareil le permet (notamment sur iOS/Android), le bouton "Partager le fichier directement" utilise `navigator.share()` et transfère le véritable fichier PDF aux applications de l'utilisateur (Mail, WhatsApp, etc.).
2. **Les liens de secours** : Des liens préformatés permettent d'ouvrir Email, Telegram ou WhatsApp avec un message d'accompagnement tout prêt.

---

## 5. Mise en exécution (Comment lancer le projet)

### Prérequis
Vous devez avoir **Node.js** installé sur votre ordinateur.

### Étape 1 : Ouvrir le projet
Ouvrez votre terminal et naviguez vers le dossier du projet :
```bash
cd /Users/guillegali/Documents/VSCode/My_DEV/enquete-metier/
```

### Étape 2 : Installer les dépendances
Si ce n'est pas déjà fait, installez toutes les bibliothèques nécessaires (React, jsPDF, Lucide, Tailwind) avec la commande :
```bash
npm install
```

### Étape 3 : Lancer en mode Développement
Pour travailler sur l'application et voir les modifications en temps réel, lancez :
```bash
npm run dev
```
*Un lien web (généralement http://localhost:5173) s'affichera dans le terminal. Ouvrez-le dans votre navigateur (Chrome recommandé pour tester la voix).*

### Étape 4 : Créer la version de Production
Lorsque l'application est prête à être hébergée sur le web (sur Vercel, Netlify, ou un FTP) :
```bash
npm run build
```
*Cela générera un dossier `dist/` contenant les fichiers optimisés de l'application finale.*