import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type GeneratedItem = {
  root: string
  scheme: string
  word: string
  frequency: number
}

type AppDataState = {
  roots: string[]
  schemes: string[]
  generatedResults: GeneratedItem[]
}

type AppDataContextValue = AppDataState & {
  addRoot: (root: string) => void
  addRoots: (roots: string[]) => void
  addScheme: (scheme: string) => void
  editScheme: (previousScheme: string, nextScheme: string) => void
  deleteScheme: (scheme: string) => void
  addGeneratedWord: (root: string, scheme: string, word: string) => void
  upsertValidationResult: (root: string, word: string, isValid: boolean, scheme?: string) => void
  getDerivativesByRoot: (root: string) => GeneratedItem[]
}

const STORAGE_KEY = 'welove-arabic-front-state'

const defaultState: AppDataState = {
  roots: [],
  schemes: ['Schéma 1', 'Schéma 2', 'Schéma 3'],
  generatedResults: [],
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined)

function normalize(input: string) {
  return input.trim()
}

function normalizeForCompare(input: string) {
  return normalize(input).toLowerCase()
}

function uniqueByValue(values: string[]) {
  const normalizedSeen = new Set<string>()
  const result: string[] = []

  for (const value of values) {
    const trimmed = normalize(value)
    if (!trimmed) {
      continue
    }

    const key = normalizeForCompare(trimmed)
    if (normalizedSeen.has(key)) {
      continue
    }

    normalizedSeen.add(key)
    result.push(trimmed)
  }

  return result
}

function loadInitialState(): AppDataState {
  const rawState = localStorage.getItem(STORAGE_KEY)

  if (!rawState) {
    return defaultState
  }

  try {
    const parsed = JSON.parse(rawState) as Partial<AppDataState>
    return {
      roots: Array.isArray(parsed.roots) ? uniqueByValue(parsed.roots) : defaultState.roots,
      schemes: Array.isArray(parsed.schemes) && parsed.schemes.length > 0
        ? uniqueByValue(parsed.schemes)
        : defaultState.schemes,
      generatedResults: Array.isArray(parsed.generatedResults)
        ? parsed.generatedResults.filter((item) =>
            item
            && typeof item.root === 'string'
            && typeof item.scheme === 'string'
            && typeof item.word === 'string'
            && typeof item.frequency === 'number'
          )
        : defaultState.generatedResults,
    }
  } catch {
    return defaultState
  }
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppDataState>(loadInitialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<AppDataContextValue>(() => ({
    ...state,
    addRoot: (root) => {
      const normalizedRoot = normalize(root)
      if (!normalizedRoot) {
        return
      }

      setState((previousState) => ({
        ...previousState,
        roots: uniqueByValue([...previousState.roots, normalizedRoot]),
      }))
    },
    addRoots: (roots) => {
      setState((previousState) => ({
        ...previousState,
        roots: uniqueByValue([...previousState.roots, ...roots]),
      }))
    },
    addScheme: (scheme) => {
      const normalizedScheme = normalize(scheme)
      if (!normalizedScheme) {
        return
      }

      setState((previousState) => ({
        ...previousState,
        schemes: uniqueByValue([...previousState.schemes, normalizedScheme]),
      }))
    },
    editScheme: (previousScheme, nextScheme) => {
      const normalizedNext = normalize(nextScheme)
      if (!normalizedNext) {
        return
      }

      setState((previousState) => {
        const updatedSchemes = previousState.schemes.map((scheme) =>
          normalizeForCompare(scheme) === normalizeForCompare(previousScheme)
            ? normalizedNext
            : scheme
        )

        const updatedResults = previousState.generatedResults.map((result) => (
          normalizeForCompare(result.scheme) === normalizeForCompare(previousScheme)
            ? { ...result, scheme: normalizedNext }
            : result
        ))

        return {
          ...previousState,
          schemes: uniqueByValue(updatedSchemes),
          generatedResults: updatedResults,
        }
      })
    },
    deleteScheme: (schemeToDelete) => {
      setState((previousState) => ({
        ...previousState,
        schemes: previousState.schemes.filter(
          (scheme) => normalizeForCompare(scheme) !== normalizeForCompare(schemeToDelete)
        ),
      }))
    },
    addGeneratedWord: (root, scheme, word) => {
      const normalizedRoot = normalize(root)
      const normalizedScheme = normalize(scheme)
      const normalizedWord = normalize(word)

      if (!normalizedRoot || !normalizedScheme || !normalizedWord) {
        return
      }

      setState((previousState) => {
        const existingIndex = previousState.generatedResults.findIndex((result) =>
          normalizeForCompare(result.root) === normalizeForCompare(normalizedRoot)
          && normalizeForCompare(result.scheme) === normalizeForCompare(normalizedScheme)
          && normalizeForCompare(result.word) === normalizeForCompare(normalizedWord)
        )

        if (existingIndex === -1) {
          return {
            ...previousState,
            roots: uniqueByValue([...previousState.roots, normalizedRoot]),
            generatedResults: [
              ...previousState.generatedResults,
              {
                root: normalizedRoot,
                scheme: normalizedScheme,
                word: normalizedWord,
                frequency: 1,
              },
            ],
          }
        }

        const nextResults = [...previousState.generatedResults]
        nextResults[existingIndex] = {
          ...nextResults[existingIndex],
          frequency: nextResults[existingIndex].frequency + 1,
        }

        return {
          ...previousState,
          roots: uniqueByValue([...previousState.roots, normalizedRoot]),
          generatedResults: nextResults,
        }
      })
    },
    upsertValidationResult: (root, word, isValid, scheme) => {
      if (!isValid) {
        return
      }

      const normalizedScheme = normalize(scheme ?? 'Schème non précisé')
      const normalizedWord = normalize(word)
      const normalizedRoot = normalize(root)

      if (!normalizedRoot || !normalizedWord) {
        return
      }

      setState((previousState) => {
        const existingIndex = previousState.generatedResults.findIndex((result) =>
          normalizeForCompare(result.root) === normalizeForCompare(normalizedRoot)
          && normalizeForCompare(result.word) === normalizeForCompare(normalizedWord)
        )

        if (existingIndex === -1) {
          return {
            ...previousState,
            roots: uniqueByValue([...previousState.roots, normalizedRoot]),
            generatedResults: [
              ...previousState.generatedResults,
              {
                root: normalizedRoot,
                scheme: normalizedScheme,
                word: normalizedWord,
                frequency: 1,
              },
            ],
          }
        }

        const nextResults = [...previousState.generatedResults]
        nextResults[existingIndex] = {
          ...nextResults[existingIndex],
          scheme: normalizedScheme,
          frequency: nextResults[existingIndex].frequency + 1,
        }

        return {
          ...previousState,
          roots: uniqueByValue([...previousState.roots, normalizedRoot]),
          generatedResults: nextResults,
        }
      })
    },
    getDerivativesByRoot: (root) => {
      const normalizedRoot = normalizeForCompare(root)
      if (!normalizedRoot) {
        return []
      }

      return state.generatedResults
        .filter((result) => normalizeForCompare(result.root) === normalizedRoot)
        .sort((first, second) => {
          if (second.frequency !== first.frequency) {
            return second.frequency - first.frequency
          }

          return first.word.localeCompare(second.word)
        })
    },
  }), [state])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const context = useContext(AppDataContext)

  if (!context) {
    throw new Error('useAppData must be used inside AppDataProvider')
  }

  return context
}
    