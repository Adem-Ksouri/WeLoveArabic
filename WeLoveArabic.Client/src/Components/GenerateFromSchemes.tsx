import { useState } from "react";

type Scheme = string;

// --- TODO ---
// memorize the generated schemes in the root list (in the AVL tree) with the frequency of generation 


// input : -root => outpout : list of generated words with the schemes used and the frequency of generation for each scheme

export default function GenerateFromSchemes() {
  const initialSchemes: Scheme[] = ["Schéma 1", "Schéma 2", "Schéma 3"];
  const [availableSchemes, setAvailableSchemes] = useState<Scheme[]>(initialSchemes);

  const [usedSchemes, setUsedSchemes] = useState<Scheme[]>([]);

  const [root, setRoot] = useState<string>("");

  const handleSelectScheme = (scheme: Scheme) => {
    if (!scheme) return; // rien si vide
    if (!availableSchemes.includes(scheme)) return;

    setUsedSchemes([...usedSchemes, scheme]);
    setAvailableSchemes(availableSchemes.filter(s => s !== scheme));
  };

  const handleRemoveScheme = (scheme: Scheme) => {
    setUsedSchemes(usedSchemes.filter(s => s !== scheme));
    setAvailableSchemes([...availableSchemes, scheme]);
  };

  const canGenerate = root.trim() !== "" && usedSchemes.length > 0;

  return (
    <div className="generate-from-roots">
      <h3>Générer à partir d'une racine</h3>

      <input
        type="text"
        placeholder="Racine"
        value={root}
        onChange={(e) => setRoot(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      <select
        value=""
        onChange={(e) => handleSelectScheme(e.target.value)}
      >
        <option value="">-- Choisir un scheme --</option>
        {availableSchemes.map((scheme, index) => (
          <option key={index} value={scheme}>
            {scheme}
          </option>
        ))}
      </select>

      {usedSchemes.length > 0 && (
        <ul style={{ marginTop: "10px" }}>
          {usedSchemes.map((scheme, index) => (
            <li key={index}>
              {scheme}{" "}
              <button onClick={() => handleRemoveScheme(scheme)}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}

      <button
        disabled={!canGenerate}
        onClick={() => {
          if (!canGenerate) return;
          alert(
            "Schemes générés : " +
              usedSchemes.map(s => `${s} (Racine : ${root})`).join(", ")
          );
        }}
        style={{ marginTop: "10px" }}
      >
        Générer
      </button>

      <button>
        Générer avec tous les schémas
      </button>
    </div>
  );
}