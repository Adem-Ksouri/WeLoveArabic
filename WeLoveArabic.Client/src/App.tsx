import './App.css'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import DataHubPage from './pages/DataHubPage'
import ResultsExplorerPage from './pages/ResultsExplorerPage'
import WordStudioPage from './pages/WordStudioPage'
import { appRoutes, navigationItems } from './routes/appRoutes'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>We Love Arabic</h1>
        <p>Un parcours clair pour préparer, créer et consulter.</p>
      </header>

      <nav className="app-nav" aria-label="Navigation principale">
        {navigationItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to={appRoutes.studio} replace />} />
          <Route path={appRoutes.dataHub} element={<DataHubPage />} />
          <Route path={appRoutes.studio} element={<WordStudioPage />} />
          <Route path={appRoutes.results} element={<ResultsExplorerPage />} />
          <Route path="*" element={<Navigate to={appRoutes.studio} replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
