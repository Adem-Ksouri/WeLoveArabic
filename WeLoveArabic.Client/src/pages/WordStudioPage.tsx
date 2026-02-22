import GenerateFromSchemes from '../Components/GenerateFromSchemes'
import VerifyWord from '../Components/VerifyWord'

function WordStudioPage() {
  return (
    <section className="app-section">
      <h1>Créer</h1>

      <details className="app-subsection" open>
        <summary>Créer des mots</summary>
        <GenerateFromSchemes />
      </details>

      <details className="app-subsection">
        <summary>Vérifier un mot</summary>
        <VerifyWord />
      </details>
    </section>
  )
}

export default WordStudioPage
