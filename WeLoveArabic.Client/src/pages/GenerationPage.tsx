import GenerateFromSchemes from '../Components/GenerateFromSchemes'
import VerifyWord from '../Components/VerifyWord'

function GenerationPage() {
  return (
    <section className="app-section">
      <h1>Génération</h1>
      <GenerateFromSchemes />
      <VerifyWord />
    </section>
  )
}

export default GenerationPage
