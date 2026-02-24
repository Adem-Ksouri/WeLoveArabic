// Types pour l'application de gestion morphologique

export interface Root {
  id: string;
  value: string; // La racine elle-même (ex: "كتب")
  createdAt: string;
}

export interface Schema {
  id: string;
  name: string; // Nom du schème (ex: "فَعَلَ")
  pattern: string; // Pattern du schème
  description?: string;
  createdAt: string;
}

export interface DerivedWord {
  id: string;
  rootId: string;
  schemaId: string;
  word: string; // Mot dérivé
  frequency: number; // Nombre de fois qu'il a été généré/validé
  createdAt: string;
  lastUsed: string;
}

export interface ValidationResult {
  isValid: boolean;
  schema?: Schema;
  derivedWord?: DerivedWord;
}
