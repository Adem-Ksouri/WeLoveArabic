import { useState } from 'react'
import { listRootDetails } from '../api/weLoveArabicApi'
import { useAppData } from '../state/AppDataContext'

function SearchRoot() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { roots } = useAppData()

  const handleSearch = async () => {
    const normalizedQuery = query.trim()

    if (!normalizedQuery) {
      setResult('Saisissez une racine.')
      return
    }

    const existsLocally = roots.some(
      (root) => root.toLowerCase() === normalizedQuery.toLowerCase()
    )

    if (existsLocally) {
      setResult(`Racine trouvée : ${normalizedQuery}`)
      return
    }

    try {
      setIsLoading(true)
      const apiResponse = await listRootDetails(normalizedQuery)
      setResult(`Résultat : ${apiResponse}`)
    } catch {
      setResult('Racine non trouvée.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="search-root">
        <h3>Rechercher une racine</h3>
        <div className="control-row">
          <input
            type="text"
            placeholder="Ex: كتب"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Recherche...' : 'Chercher'}
          </button>
        </div>
        {result && <p className="status-message">{result}</p>}
    </div>
  )
}

export default SearchRoot;