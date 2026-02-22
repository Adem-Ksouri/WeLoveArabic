import GeneratedRootScheme from '../Components/GeneratedRootScheme'
import ShowAllPreviouslyGeneratedResults from '../Components/ShowAllPreviouslyGeneratedResults'
import { useAppData } from '../state/AppDataContext'

function ResultsExplorerPage() {
  const { generatedResults } = useAppData()

  return (
    <section className="app-section">
      <h1>Consulter</h1>

      <details className="app-subsection" open>
        <summary>Voir par racine</summary>
        <ShowAllPreviouslyGeneratedResults />
      </details>

      <details className="app-subsection">
        <summary>Voir tout</summary>
        <GeneratedRootScheme results={generatedResults} />
      </details>
    </section>
  )
}

export default ResultsExplorerPage
