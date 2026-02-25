import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Root, Schema, DerivedWord } from '../types';
import { addRootsApi, addSchemesApi, getRootsSortedApi, getSchemasApi } from '../utils/api';

interface MorphologyContextType {
  roots: Root[];
  schemas: Schema[];
  derivedWords: DerivedWord[];
  addRoot: (value: string) => Promise<void>;
  importRoots: (roots: string[]) => Promise<void>;
  deleteRoot: (id: string) => void;
  addSchema: (name: string, pattern: string, description?: string) => Promise<void>;
  updateSchema: (id: string, name: string, pattern: string, description?: string) => void;
  deleteSchema: (id: string) => void;
  addDerivedWord: (rootId: string, schemaId: string, word: string) => void;
  updateWordFrequency: (wordId: string) => void;
  getDerivedWordsByRoot: (rootId: string) => DerivedWord[];
  getSchemaById: (id: string) => Schema | undefined;
  getRootById: (id: string) => Root | undefined;
}

const MorphologyContext = createContext<MorphologyContextType | undefined>(undefined);

export const useMorphology = () => {
  const context = useContext(MorphologyContext);
  if (!context) {
    throw new Error('useMorphology must be used within MorphologyProvider');
  }
  return context;
};

interface MorphologyProviderProps {
  children: ReactNode;
}

const toSafeString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return typeof record.word === 'string'
      ? record.word
      : typeof record.Word === 'string'
      ? record.Word
      : '';
  }

  return '';
};

const parseArray = <T,>(raw: string | null): T[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

export const MorphologyProvider: React.FC<MorphologyProviderProps> = ({ children }) => {
  const [roots, setRoots] = useState<Root[]>(() => {
    return parseArray<Root>(localStorage.getItem('morphology_roots')).map((root) => ({
      ...root,
      id: toSafeString(root.id),
      value: toSafeString(root.value),
      createdAt: typeof root.createdAt === 'string' ? root.createdAt : new Date().toISOString(),
    }));
  });

  const [schemas, setSchemas] = useState<Schema[]>(() => {
    return parseArray<Schema>(localStorage.getItem('morphology_schemas')).map((schema) => ({
      ...schema,
      id: toSafeString(schema.id),
      name: toSafeString(schema.name),
      pattern: toSafeString(schema.pattern),
      createdAt: typeof schema.createdAt === 'string' ? schema.createdAt : new Date().toISOString(),
      description: typeof schema.description === 'string' ? schema.description : undefined,
    }));
  });

  const [derivedWords, setDerivedWords] = useState<DerivedWord[]>(() => {
    return parseArray<DerivedWord>(localStorage.getItem('morphology_derived_words')).map((word) => ({
      ...word,
      id: toSafeString(word.id),
      rootId: toSafeString(word.rootId),
      schemaId: toSafeString(word.schemaId),
      word: toSafeString(word.word),
      frequency: typeof word.frequency === 'number' && Number.isFinite(word.frequency) ? word.frequency : 1,
      createdAt: typeof word.createdAt === 'string' ? word.createdAt : new Date().toISOString(),
      lastUsed: typeof word.lastUsed === 'string' ? word.lastUsed : new Date().toISOString(),
    }));
  });

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('morphology_roots', JSON.stringify(roots));
  }, [roots]);

  useEffect(() => {
    localStorage.setItem('morphology_schemas', JSON.stringify(schemas));
  }, [schemas]);

  useEffect(() => {
    localStorage.setItem('morphology_derived_words', JSON.stringify(derivedWords));
  }, [derivedWords]);

  useEffect(() => {
    const syncFromApi = async () => {
      try {
        const [apiRoots, apiSchemas] = await Promise.all([
          getRootsSortedApi(),
          getSchemasApi(),
        ]);

        setRoots(
          apiRoots.map((value) => ({
            id: value,
            value,
            createdAt: new Date().toISOString(),
          }))
        );

        setSchemas(
          apiSchemas.map((pattern) => ({
            id: pattern,
            name: pattern,
            pattern,
            createdAt: new Date().toISOString(),
          }))
        );
      } catch (error) {
        console.error('API sync error:', error);
      }
    };

    syncFromApi();
  }, []);

  const addRoot = async (value: string) => {
    await addRootsApi([value]);

    const newRoot: Root = {
      id: value,
      value,
      createdAt: new Date().toISOString(),
    };

    setRoots((currentRoots) => {
      if (currentRoots.some((root) => root.value === value)) {
        return currentRoots;
      }

      return [...currentRoots, newRoot];
    });
  };

  const importRoots = async (rootValues: string[]) => {
    await addRootsApi(rootValues);

    const newRoots: Root[] = rootValues.map((value) => ({
      id: value,
      value,
      createdAt: new Date().toISOString(),
    }));

    setRoots((currentRoots) => {
      const existing = new Set(currentRoots.map((root) => root.value));
      const uniques = newRoots.filter((root) => !existing.has(root.value));
      return [...currentRoots, ...uniques];
    });
  };

  const deleteRoot = (id: string) => {
    setRoots(roots.filter((r) => r.id !== id));
    // Supprimer aussi les mots dérivés associés
    setDerivedWords(derivedWords.filter((w) => w.rootId !== id));
  };

  const addSchema = async (name: string, pattern: string, description?: string) => {
    await addSchemesApi([pattern]);

    const newSchema: Schema = {
      id: pattern,
      name,
      pattern,
      description,
      createdAt: new Date().toISOString(),
    };

    setSchemas((currentSchemas) => {
      if (currentSchemas.some((schema) => schema.pattern === pattern)) {
        return currentSchemas;
      }

      return [...currentSchemas, newSchema];
    });
  };

  const updateSchema = (id: string, name: string, pattern: string, description?: string) => {
    setSchemas(
      schemas.map((s) =>
        s.id === id ? { ...s, name, pattern, description } : s
      )
    );
  };

  const deleteSchema = (id: string) => {
    setSchemas(schemas.filter((s) => s.id !== id));
    // Supprimer aussi les mots dérivés associés
    setDerivedWords(derivedWords.filter((w) => w.schemaId !== id));
  };

  const addDerivedWord = (rootId: string, schemaId: string, word: string) => {
    // Vérifier si le mot existe déjà
    const existingWord = derivedWords.find(
      (w) => w.rootId === rootId && w.schemaId === schemaId && w.word === word
    );

    if (existingWord) {
      // Incrémenter la fréquence
      updateWordFrequency(existingWord.id);
    } else {
      // Créer un nouveau mot dérivé
      const newWord: DerivedWord = {
        id: Date.now().toString(),
        rootId,
        schemaId,
        word,
        frequency: 1,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
      };
      setDerivedWords([...derivedWords, newWord]);
    }
  };

  const updateWordFrequency = (wordId: string) => {
    setDerivedWords(
      derivedWords.map((w) =>
        w.id === wordId
          ? { ...w, frequency: w.frequency + 1, lastUsed: new Date().toISOString() }
          : w
      )
    );
  };

  const getDerivedWordsByRoot = (rootId: string) => {
    return derivedWords.filter((w) => w.rootId === rootId);
  };

  const getSchemaById = (id: string) => {
    return schemas.find((s) => s.id === id);
  };

  const getRootById = (id: string) => {
    return roots.find((r) => r.id === id);
  };

  return (
    <MorphologyContext.Provider
      value={{
        roots,
        schemas,
        derivedWords,
        addRoot,
        importRoots,
        deleteRoot,
        addSchema,
        updateSchema,
        deleteSchema,
        addDerivedWord,
        updateWordFrequency,
        getDerivedWordsByRoot,
        getSchemaById,
        getRootById,
      }}
    >
      {children}
    </MorphologyContext.Provider>
  );
};
