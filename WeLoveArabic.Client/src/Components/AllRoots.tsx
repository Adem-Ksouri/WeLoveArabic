import { useMemo, useState } from "react";
import { listAllRoots, parseRootsResponse } from "../api/weLoveArabicApi";
import { useAppData } from "../state/AppDataContext";

function AllRoots() {
  const { roots, addRoots } = useAppData();
  const [apiRoots, setApiRoots] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadAllRoots = async () => {
    try {
      setIsLoading(true);
      const response = await listAllRoots();
      const parsedRoots = parseRootsResponse(response);

      setApiRoots(parsedRoots);
      addRoots(parsedRoots);
      setMessage(`${parsedRoots.length} racine(s) trouvée(s).`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Un problème est survenu lors du chargement.");
    } finally {
      setIsLoading(false);
    }
  };

  const sortedRoots = useMemo(() => {
    const sourceRoots = apiRoots.length > 0 ? apiRoots : roots;
    return [...sourceRoots].sort((firstRoot, secondRoot) => firstRoot.localeCompare(secondRoot));
  }, [apiRoots, roots]);
  
  return (
    <div className="all-roots">
      <h3>Toutes les racines</h3>

      <div className="control-row">
        <button onClick={handleLoadAllRoots} disabled={isLoading}>
          {isLoading ? "Patientez..." : "Actualiser la liste"}
        </button>
      </div>

      {message && <p className="status-message">{message}</p>}

      {sortedRoots.length === 0 ? (
        <p>Aucune racine disponible.</p>
      ) : (
        <ul>
          {sortedRoots.map((root, index) => (
            <li key={index}>{root}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AllRoots;