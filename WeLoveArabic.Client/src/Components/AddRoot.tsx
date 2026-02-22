import { useState } from 'react'
import { addArabicRoot } from '../api/weLoveArabicApi'
import { useAppData } from '../state/AppDataContext'

function AddRoot() {
    const [root, setRoot] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { addRoot } = useAppData()

    const handleAddRoot = async () => {
        const normalizedRoot = root.trim()

        if (!normalizedRoot) {
            setMessage('Saisissez une racine.')
            return
        }

        try {
            setIsSubmitting(true)
            const response = await addArabicRoot(normalizedRoot)
            addRoot(normalizedRoot)
            setMessage(response)
            setRoot('')
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Une erreur est survenue.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="add-root">
            <h3>Ajouter une racine</h3>
            <div className="control-row">
                <input
                    type="text"
                    placeholder="Ex: كتب"
                    value={root}
                    onChange={(event) => setRoot(event.target.value)}
                />
                <button onClick={handleAddRoot} disabled={isSubmitting}>
                    {isSubmitting ? 'Ajout...' : 'Ajouter'}
                </button>
            </div>
            {message && <p className="status-message">{message}</p>}
        </div>
    )
}

export default AddRoot;
