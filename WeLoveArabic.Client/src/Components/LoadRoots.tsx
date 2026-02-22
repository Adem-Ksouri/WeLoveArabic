import { useState } from "react";

function LoadRoots(){
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string>("");
    const [isVisible, setIsVisible] = useState<boolean>(false);

    function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        setSelectedFile(event.target.files[0]);
        setFileContent("");      // reset ancien contenu
        setIsVisible(false);     // cacher si on change de fichier
    }

    function handleToggle() {

        if (!selectedFile) {
            alert("Veuillez sélectionner un fichier !");
            return;
        }

        // Si le contenu est déjà visible → on cache
        if (isVisible) {
            setIsVisible(false);
            return;
        }

        // Sinon on lit le fichier puis on affiche
        const reader = new FileReader();

        reader.onload = function (e) {
            if (e.target && typeof e.target.result === "string") {
                setFileContent(e.target.result);
                setIsVisible(true);
            }
        };

        reader.readAsText(selectedFile);
    }

    return (
        <div>
            <h2>Importer un fichier .txt</h2>

            <input
                type="file"
                accept=".txt"
                onChange={handleFileSelect}
            />

            <br /><br />

            <button onClick={handleToggle}>
                {isVisible ? "Cacher le contenu" : "Afficher le contenu"}
            </button>

            <br /><br />

            {isVisible && (
                <div>
                    <h3>Contenu :</h3>
                    <pre>{fileContent}</pre>
                </div>
            )}
        </div>
    );
}

export default LoadRoots;