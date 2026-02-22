import AddRoot from '../Components/AddRoot'
import AllRoots from '../Components/AllRoots'
import LoadRoots from '../Components/LoadRoots'
import SearchRoot from '../Components/SearchRoot'

function RootsPage() {
  return (
    <section className="app-section">
      <h1>Gestion des racines</h1>
      <LoadRoots />
      <AddRoot />
      <SearchRoot />
      <AllRoots />
    </section>
  )
}

export default RootsPage
