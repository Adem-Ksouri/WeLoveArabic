import GeneratedRootScheme from '../Components/GeneratedRootScheme'
import ShowAllPreviouslyGeneratedResults from '../Components/ShowAllPreviouslyGeneratedResults'

function DisplayPage() {
  return (
    <section className="app-section">
      <h1>Affichage des résultats</h1>
      <ShowAllPreviouslyGeneratedResults />
      <GeneratedRootScheme results={[]} />
    </section>
  )
}

export default DisplayPage
