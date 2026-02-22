import './App.css'
import ShowAllPreviouslyGeneratedResults from './Components/ShowAllPreviouslyGeneratedResults'

// *** Added components ***
// --- Gestion des racines ---
// - LoadRoots : pour charger les racines à partir d'un fichier texte (une racine par ligne) et les ajouter à l'arbre AVL
// - AddRoot : pour ajouter une racine à l'arbre AVL
// - SearchRoot : pour chercher une racine dans l'arbre AVL
// - AllRoots : pour afficher toutes les racines existantes dans l'arbre AVL

// --- Gestion des schémas ---
// - AddScheme : pour ajouter un schéma à la table de hashage
// - SchemeList : pour afficher la liste de tous les schemes existants dans la table de hashage
// avec la possibilité de les modifier ou de les supprimer

// --- Génération à partir d'une racine ---
// - GenerateRootScheme : Présentation claire des résultats (racine, schème, mot généré, fréquence).
// - GenerateFromSchemes : Génération dynamique de mots dérivés à partir :d’une racine donnée,  d’un ou de plusieurs schèmes sélectionnés.

// *** Validation morphologique ***
// - VerifyWord : pour vérifier en donnant une racine et un mot si le mot est dérivé de la racine
// - ShowAllPreviouslyGeneratedResults : pour afficher tous les mots générés précédemment à partir d'une racine donnée avec les schémas utilisés et la fréquence de génération pour chaque schéma


function App() {

  return (
    <>
      <ShowAllPreviouslyGeneratedResults />
    </>
  )
}

export default App
