import { useEffect, useState } from "react";
import { generateArabicWord } from "../api/weLoveArabicApi";
import { useAppData } from "../state/AppDataContext";

type Scheme = string;

// --- TODO ---
// memorize the generated schemes in the root list (in the AVL tree) with the frequency of generation 


// input : -root => outpout : list of generated words with the schemes used and the frequency of generation for each scheme

export default function GenerateFromSchemes() {
  const { schemes, addGeneratedWord } = useAppData();
  const [availableSchemes, setAvailableSchemes] = useState<Scheme[]>(schemes);

  const [usedSchemes, setUsedSchemes] = useState<Scheme[]>([]);

  const [root, setRoot] = useState<string>("");
  const [resultMessage, setResultMessage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    const usedSet = new Set(usedSchemes);
    setAvailableSchemes(schemes.filter((scheme) => !usedSet.has(scheme)));
  }, [schemes, usedSchemes]);

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

  const handleGenerateSelectedSchemes = async () => {
    const normalizedRoot = root.trim();

    if (!normalizedRoot || usedSchemes.length === 0) {
      setResultMessage("Saisissez une racine et choisissez au moins un schème.");
      return;
    }

    try {
      setIsGenerating(true);
      const responses = await Promise.all(
        usedSchemes.map(async (scheme) => {
          const response = await generateArabicWord(normalizedRoot, scheme);
          addGeneratedWord(normalizedRoot, scheme, response);
          return `${scheme}: ${response}`;
        })
      );
      setResultMessage(responses.join(" | "));
    } catch (error) {
      setResultMessage(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAllSchemes = async () => {
    const normalizedRoot = root.trim();
    const allSchemes = [...usedSchemes, ...availableSchemes];

    if (!normalizedRoot || allSchemes.length === 0) {
      setResultMessage("Saisissez une racine et ajoutez des schèmes.");
      return;
    }

    try {
      setIsGenerating(true);
      const responses = await Promise.all(
        allSchemes.map(async (scheme) => {
          const response = await generateArabicWord(normalizedRoot, scheme);
          addGeneratedWord(normalizedRoot, scheme, response);
          return `${scheme}: ${response}`;
        })
      );
      setResultMessage(responses.join(" | "));
    } catch (error) {
      setResultMessage(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="generate-from-roots">
      <h3>Créer des mots</h3>

      <input
        type="text"
        placeholder="Racine (ex: كتب)"
        value={root}
        onChange={(e) => setRoot(e.target.value)}
      />

      <select
        value=""
        onChange={(e) => handleSelectScheme(e.target.value)}
      >
        <option value="">Choisir un schème</option>
        {availableSchemes.map((scheme, index) => (
          <option key={index} value={scheme}>
            {scheme}
          </option>
        ))}
      </select>

      {usedSchemes.length > 0 && (
        <ul className="chips-list">
          {usedSchemes.map((scheme, index) => (
            <li key={index}>
              {scheme}{" "}
              <button
                type="button"
                aria-label={`Supprimer le schème ${scheme}`}
                onClick={() => handleRemoveScheme(scheme)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="action-row">
        <button
          disabled={!canGenerate}
          onClick={handleGenerateSelectedSchemes}
        >
          {isGenerating ? "Génération..." : "Générer"}
        </button>

        <button onClick={handleGenerateAllSchemes} disabled={isGenerating}>
          Tout générer
        </button>
      </div>

      {resultMessage && <p className="status-message">{resultMessage}</p>}
    </div>
  );
}