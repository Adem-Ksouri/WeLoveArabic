const API_BASE_URL = 'https://localhost:7177/api/v1';

type GetRootsSortedResponse = {
  Roots?: string[];
  roots?: string[];
};

type GetSchemasResponse = {
  Schemas?: string[];
  schemas?: string[];
};

type ApiDerivedWordRaw = {
  word?: string;
  Word?: string;
  scheme?: string | null;
  Scheme?: string | null;
};

export type ApiDerivedWord = {
  word: string;
  scheme: string | null;
};

type GenerateWordsResponse = {
  DerivedWords?: ApiDerivedWordRaw[];
  derivedWords?: ApiDerivedWordRaw[];
};

type VerifyArabicWordResponseRaw = {
  Success?: boolean;
  Scheme?: string | null;
  success?: boolean;
  scheme?: string | null;
};

export type VerifyArabicWordApiResponse = {
  success: boolean;
  scheme: string | null;
};

type ListRootDetailsResponse = {
  Success?: boolean;
  DerivedWordsWithCount?: ApiRootDetailPairRaw[] | null;
  success?: boolean;
  derivedWordsWithCount?: ApiRootDetailPairRaw[] | null;
};

type ApiRootDetailPairRaw = {
  Key?: ApiDerivedWordRaw;
  Value?: number;
  key?: ApiDerivedWordRaw;
  value?: number;
};

export type ApiRootDetailPair = {
  word: string;
  scheme: string | null;
  count: number;
};

function toStringValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function extractWordValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return toStringValue(record.Word) || toStringValue(record.word);
  }

  return '';
}

function extractSchemeValue(value: unknown): string | null {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const nested = toStringValue(record.Scheme) || toStringValue(record.scheme);
    return nested || null;
  }

  return null;
}

function normalizeDerivedWord(item: ApiDerivedWordRaw): ApiDerivedWord {
  return {
    word: extractWordValue(item.Word) || extractWordValue(item.word),
    scheme: extractSchemeValue(item.Scheme) ?? extractSchemeValue(item.scheme),
  };
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  return {} as T;
}

export async function getRootsSortedApi(): Promise<string[]> {
  const data = await requestJson<GetRootsSortedResponse>(`${API_BASE_URL}/getRootsSorted`);
  return data.roots ?? data.Roots ?? [];
}

export async function getSchemasApi(): Promise<string[]> {
  const data = await requestJson<GetSchemasResponse>(`${API_BASE_URL}/getSchemas`);
  return data.schemas ?? data.Schemas ?? [];
}

export async function addRootsApi(roots: string[]): Promise<void> {
  await requestJson(`${API_BASE_URL}/addRoots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roots),
  });
}

export async function addSchemesApi(schemes: string[]): Promise<void> {
  await requestJson(`${API_BASE_URL}/addSchemes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schemes),
  });
}

export async function generateWordsApi(
  root: string,
  schemes: string[]
): Promise<ApiDerivedWord[]> {
  const query = new URLSearchParams({ root });
  const data = await requestJson<GenerateWordsResponse>(`${API_BASE_URL}/generateWords?${query.toString()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schemes),
  });

  return (data.derivedWords ?? data.DerivedWords ?? [])
    .map(normalizeDerivedWord)
    .filter((item) => item.word);
}

export async function verifyWordApi(root: string, word: string): Promise<VerifyArabicWordApiResponse> {
  const query = new URLSearchParams({ root, word });
  const data = await requestJson<VerifyArabicWordResponseRaw>(`${API_BASE_URL}/verifyWord?${query.toString()}`);

  return {
    success: data.success ?? data.Success ?? false,
    scheme: data.scheme ?? data.Scheme ?? null,
  };
}

export async function listRootDetailsApi(root: string): Promise<{ success: boolean; derivedWordsWithCount: ApiRootDetailPair[] }> {
  const query = new URLSearchParams({ root });
  const data = await requestJson<ListRootDetailsResponse>(`${API_BASE_URL}/listRootDetails?${query.toString()}`);

  const derivedWordsWithCount = (data.derivedWordsWithCount ?? data.DerivedWordsWithCount ?? [])
    .map((pair) => {
      const key = pair.Key ?? pair.key;
      const value = pair.Value ?? pair.value ?? 0;

      if (!key) {
        return null;
      }

      const normalized = normalizeDerivedWord(key);
      if (!normalized.word) {
        return null;
      }

      return {
        word: normalized.word,
        scheme: normalized.scheme,
        count: Number.isFinite(value) ? value : 0,
      };
    })
    .filter((item): item is ApiRootDetailPair => item !== null);

  return {
    success: data.success ?? data.Success ?? false,
    derivedWordsWithCount,
  };
}
