/**
 * Charge une image et la convertit en Data URI (base64)
 * @param {string} path - Chemin relatif de l'image (ex: '/logo1.png')
 * @returns {Promise<string|null>} - Data URI ou null si erreur
 */
export const loadImageAsDataURI = async (path) => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`Erreur chargement image (${response.status}): ${path}`);
      return null;
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => {
        console.warn(`Erreur FileReader: ${path}`);
        reject(new Error(`Impossible de lire l'image: ${path}`));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(`Erreur lors du chargement de l'image: ${path}`, error);
    return null;
  }
};
