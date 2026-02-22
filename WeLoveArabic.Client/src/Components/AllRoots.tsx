import { useState } from "react";

function AllRoots() {
  const [roots, setRoots] = useState<string[]>([]);
  
  return (
    <div className="all-roots">
      <h3>Liste de toutes les racines</h3>

      {roots.length === 0 ? (
        <p>Aucune racine disponible.</p>
      ) : (
        <ul>
          {roots.map((root, index) => (
            <li key={index}>{root}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AllRoots;