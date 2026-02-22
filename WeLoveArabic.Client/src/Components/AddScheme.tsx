import { useState } from 'react'
import { addArabicScheme } from '../api/weLoveArabicApi'
import { useAppData } from '../state/AppDataContext'

function AddScheme() {
    const [scheme, setScheme] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { addScheme } = useAppData()

    const handleAddScheme = async () => {
        const normalizedScheme = scheme.trim()

        if (!normalizedScheme) {
            setMessage('Saisissez un schème.')
            return
        }

        try {
            setIsSubmitting(true)
            const response = await addArabicScheme(normalizedScheme)
            addScheme(normalizedScheme)
            setMessage(response)
            setScheme('')
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Une erreur est survenue.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="add-scheme">
            <h3>Ajouter un schème</h3>
            <div className="control-row">
                <input
                    type="text"
                    placeholder="Ex: فاعل"
                    value={scheme}
                    onChange={(event) => setScheme(event.target.value)}
                />
                <button onClick={handleAddScheme} disabled={isSubmitting}>
                    {isSubmitting ? 'Ajout...' : 'Ajouter'}
                </button>
            </div>
            {message && <p className="status-message">{message}</p>}
        </div>
    )
}

export default AddScheme;
