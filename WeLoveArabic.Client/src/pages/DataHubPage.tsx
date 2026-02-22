import AddRoot from '../Components/AddRoot'
import AddScheme from '../Components/AddScheme'
import AllRoots from '../Components/AllRoots'
import LoadRoots from '../Components/LoadRoots'
import SchemeList from '../Components/SchemeList'
import SearchRoot from '../Components/SearchRoot'

function DataHubPage() {
  return (
    <section className="app-section">
      <h1>Préparer</h1>

      <details className="app-subsection" open>
        <summary>Gérer les racines</summary>
        <LoadRoots />
        <AddRoot />
        <SearchRoot />
        <AllRoots />
      </details>

      <details className="app-subsection">
        <summary>Gérer les schèmes</summary>
        <AddScheme />
        <SchemeList />
      </details>
    </section>
  )
}

export default DataHubPage
