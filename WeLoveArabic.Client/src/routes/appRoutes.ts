export const appRoutes = {
  dataHub: '/referentiel',
  studio: '/atelier',
  results: '/resultats',
} as const

export const navigationItems = [
  { to: appRoutes.dataHub, label: 'Préparer' },
  { to: appRoutes.studio, label: 'Créer' },
  { to: appRoutes.results, label: 'Consulter' },
] as const
