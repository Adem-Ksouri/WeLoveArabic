import { useState } from 'react'
import { listRootDetails } from '../api/weLoveArabicApi'
import { useAppData } from '../state/AppDataContext'

function ShowAllPreviouslyGeneratedResults() {
  const [root, setRoot] = useState('')
  const [apiResult, setApiResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { getDerivativesByRoot } = useAppData()

  const derivatives = getDerivativesByRoot(root)

  const handleListRootDetails = async () => {
    const normalizedRoot = root.trim()

    if (!normalizedRoot) {
      setApiResult('Saisissez une racine.')
      return
    }

    try {
      setIsLoading(true)
      const response = await listRootDetails(normalizedRoot)
      setApiResult(response)
    } catch (error) {
      setApiResult(error instanceof Error ? error.message : 'Une erreur est survenue.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="show-all-previously-generated-results">
      <h3>Voir les mots d'une racine</h3>
      <div className="control-row">
        <input
          type="text"
          placeholder="Ex: كتب"
          value={root}
          onChange={(event) => setRoot(event.target.value)}
        />
        <button onClick={handleListRootDetails} disabled={isLoading}>
          {isLoading ? 'Patientez...' : 'Afficher'}
        </button>
      </div>

      {apiResult && <p className="status-message">{apiResult}</p>}

      <h4>Mots enregistrés</h4>
      {derivatives.length === 0 ? (
        <p>Aucun mot trouvé pour cette racine.</p>
      ) : (
        <ul>
          {derivatives.map((item, index) => (
            <li key={`${item.root}-${item.scheme}-${item.word}-${index}`}>
              {item.word} — {item.scheme} (fréquence: {item.frequency})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ShowAllPreviouslyGeneratedResults;