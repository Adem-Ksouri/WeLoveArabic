const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7177/api/v1'

type QueryValue = string | number | boolean

function buildUrl(path: string, queryParams: Record<string, QueryValue> = {}) {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(queryParams)) {
    searchParams.set(key, String(value))
  }

  const queryString = searchParams.toString()
  return queryString.length > 0
    ? `${API_BASE_URL}/${path}?${queryString}`
    : `${API_BASE_URL}/${path}`
}

async function requestText(url: string, method: 'GET' | 'POST') {
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'text/plain',
    },
  })

  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(responseText || `HTTP ${response.status}`)
  }

  return responseText
}

export async function addArabicRoot(root: string) {
  const url = buildUrl('addRoot', { root })
  return requestText(url, 'POST')
}

export async function addArabicScheme(scheme: string) {
  const url = buildUrl('addScheme', { scheme })
  return requestText(url, 'POST')
}

export async function generateArabicWord(root: string, scheme: string) {
  const url = buildUrl('generateWord', { root, scheme })
  return requestText(url, 'POST')
}

export async function verifyArabicWord(root: string, word: string) {
  const url = buildUrl('verifyWord', { root, word })
  return requestText(url, 'GET')
}

export async function listRootDetails(root: string) {
  const url = buildUrl('listRootDetails', { root })
  return requestText(url, 'GET')
}

export async function listAllRoots() {
  const url = buildUrl('allRoots')
  return requestText(url, 'GET')
}

export function parseRootsResponse(responseText: string) {
  const normalized = responseText.trim()

  if (!normalized) {
    return []
  }

  try {
    const parsedJson = JSON.parse(normalized)
    if (Array.isArray(parsedJson)) {
      return parsedJson
        .filter((value) => typeof value === 'string')
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
    }
  } catch {
    // fallback texte simple
  }

  return normalized
    .split(/\r?\n|,|;|\|/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
}

export function parseValidationResponse(responseText: string) {
  const normalizedText = responseText.trim()
  const lowerText = normalizedText.toLowerCase()

  const isValid = lowerText.includes('oui')
    || lowerText.includes('yes')
    || lowerText.includes('valid')
    || lowerText.includes('true')

  const schemeMatch = normalizedText.match(/sch[èe]me\s*[:=-]?\s*([^,;|\n]+)/i)

  return {
    isValid,
    scheme: schemeMatch?.[1]?.trim(),
    raw: normalizedText,
  }
}
