import { useState } from "react";
import { addArabicRoot } from "../api/weLoveArabicApi";
import { useAppData } from "../state/AppDataContext";

function LoadRoots(){
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string>("");
    const [parsedRoots, setParsedRoots] = useState<string[]>([]);
    const [message, setMessage] = useState<string>("");
    const [isImporting, setIsImporting] = useState<boolean>(false);
    const { addRoots } = useAppData();

    function parseRoots(rawContent: string) {
        return rawContent
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
    }

    function readFileAsText(file: File) {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function (e) {
                if (e.target && typeof e.target.result === "string") {
                    resolve(e.target.result);
                    return;
                }

                reject(new Error("Impossible de lire le fichier."));
            };

            reader.onerror = function () {
                reject(new Error("Impossible de lire le fichier."));
            };

            reader.readAsText(file);
        });
    }

    async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];
        setSelectedFile(file);
        setMessage("");

        try {
            const text = await readFileAsText(file);
            const roots = parseRoots(text);
            setFileContent(text);
            setParsedRoots(roots);
            setMessage(`${roots.length} racine(s) prêtes à être ajoutées.`);
        } catch (error) {
            setFileContent("");
            setParsedRoots([]);
            setMessage(error instanceof Error ? error.message : "Impossible de lire ce fichier.");
        }
    }

    async function handleImportRoots() {
        const roots = parsedRoots;

        if (roots.length === 0) {
            setMessage("Aucune racine à ajouter.");
            return;
        }

        try {
            setIsImporting(true);
            const results = await Promise.allSettled(
                roots.map((root) => addArabicRoot(root))
            );

            const successfulCount = results.filter((result) => result.status === "fulfilled").length;

            addRoots(roots);
            setMessage(`${successfulCount}/${roots.length} racines ajoutées.`);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Une erreur est survenue.");
        } finally {
            setIsImporting(false);
        }
    }

    return (
        <div className="load-roots">
            <h3>Importer un fichier de racines</h3>
            <p className="hint-text">Une racine par ligne.</p>

            <div className="control-row">
                <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileSelect}
                />

                <button onClick={handleImportRoots} disabled={!selectedFile || isImporting || parsedRoots.length === 0}>
                    {isImporting ? "Ajout en cours..." : "Ajouter les racines"}
                </button>
            </div>

            {fileContent && (
                <div>
                    <h3>Contenu :</h3>
                    <pre className="content-preview">{fileContent}</pre>
                </div>
            )}

            {message && <p className="status-message">{message}</p>}
        </div>
    );
}

export default LoadRoots;