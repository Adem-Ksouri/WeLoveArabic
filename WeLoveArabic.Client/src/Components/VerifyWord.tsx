import { useState } from 'react'
import { parseValidationResponse, verifyArabicWord } from '../api/weLoveArabicApi'
import { useAppData } from '../state/AppDataContext'

// --- TODO ---
// memorize the verified schemes in the root list (in the AVL tree) with the frequency 
// if the word is valid with the root and the scheme, increment the frequency of this scheme in the root list (in the AVL tree) for this root

function VerifyWord() {
  const [word, setWord] = useState('')
  const [root, setRoot] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { upsertValidationResult } = useAppData()

  const handleVerify = async () => {
    const normalizedWord = word.trim()
    const normalizedRoot = root.trim()

    if (!normalizedWord || !normalizedRoot) {
      setResult('Saisissez le mot et la racine.')
      return
    }

    try {
      setIsLoading(true)
      const response = await verifyArabicWord(normalizedRoot, normalizedWord)
      const parsed = parseValidationResponse(response)

      if (parsed.isValid) {
        upsertValidationResult(normalizedRoot, normalizedWord, true, parsed.scheme)
      }

      setResult(
        parsed.isValid
          ? `OUI${parsed.scheme ? ` (Schème: ${parsed.scheme})` : ''}`
          : `NON${parsed.raw ? ` (${parsed.raw})` : ''}`
      )
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Une erreur est survenue.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="verify-word">
        <h3>Vérifier un mot</h3>
        <div className="control-row">
          <input
            type="text"
            placeholder="Mot à vérifier"
            value={word}
            onChange={(event) => setWord(event.target.value)}
          />
          <input
            type="text"
            placeholder="Racine associée"
            value={root}
            onChange={(event) => setRoot(event.target.value)}
          />
          <button onClick={handleVerify} disabled={isLoading}>
            {isLoading ? 'Vérification...' : 'Vérifier'}
          </button>
        </div>
        {result && <p className="status-message">{result}</p>}
    </div>
  );
}

export default VerifyWord;