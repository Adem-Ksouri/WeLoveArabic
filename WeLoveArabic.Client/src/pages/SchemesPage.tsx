import AddScheme from '../Components/AddScheme'
import SchemeList from '../Components/SchemeList'

function SchemesPage() {
  return (
    <section className="app-section">
      <h1>Gestion des schèmes</h1>
      <AddScheme />
      <SchemeList />
    </section>
  )
}

export default SchemesPage
