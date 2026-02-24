// Utilitaires pour la génération morphologique

/**
 * Applique un schème à une racine pour générer un mot dérivé
 * Cette fonction est simplifiée pour la démonstration
 */
export function applySchemaToRoot(root: string, schemaPattern: string): string {
  // Pour une véritable implémentation, il faudrait une logique plus sophistiquée
  // qui prend en compte les règles morphologiques arabes
  
  // Exemple simplifié: on remplace les consonnes de la racine dans le schème
  const rootLetters = root.split('');
  let result = schemaPattern;
  
  // Remplacer ف par la première lettre, ع par la deuxième, ل par la troisième
  const replacements: { [key: string]: number } = {
    'ف': 0,
    'ع': 1,
    'ل': 2,
  };
  
  for (const [placeholder, index] of Object.entries(replacements)) {
    if (rootLetters[index]) {
      result = result.replace(new RegExp(placeholder, 'g'), rootLetters[index]);
    }
  }
  
  return result;
}

/**
 * Extrait le schème d'un mot en utilisant une racine
 */
export function extractSchema(word: string, root: string): string | null {
  // Logique simplifiée pour extraire le schème
  // Dans une vraie implémentation, cela nécessiterait une analyse morphologique complète
  
  const rootLetters = root.split('');
  let schema = word;
  
  // Remplacer les lettres de la racine par les placeholders
  const placeholders = ['ف', 'ع', 'ل'];
  
  rootLetters.forEach((letter, index) => {
    if (placeholders[index]) {
      schema = schema.replace(new RegExp(letter, 'g'), placeholders[index]);
    }
  });
  
  return schema;
}

/**
 * Valide si un mot peut être dérivé d'une racine donnée
 */
export function validateWordFromRoot(word: string, root: string): boolean {
  // Vérification simplifiée: le mot doit contenir toutes les lettres de la racine dans l'ordre
  const rootLetters = root.split('');
  let wordIndex = 0;
  const wordLetters = word.split('');
  
  for (const rootLetter of rootLetters) {
    let found = false;
    for (let i = wordIndex; i < wordLetters.length; i++) {
      if (wordLetters[i] === rootLetter) {
        wordIndex = i + 1;
        found = true;
        break;
      }
    }
    if (!found) {
      return false;
    }
  }
  
  return true;
}
