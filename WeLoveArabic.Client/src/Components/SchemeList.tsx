import { useState } from "react";
import { useAppData } from "../state/AppDataContext";

function SchemeList(){
  const { schemes, deleteScheme, editScheme } = useAppData();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedScheme, setEditedScheme] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = (index: number) => {
    const selectedScheme = schemes[index];
    if (!selectedScheme) {
      return;
    }

    deleteScheme(selectedScheme);
    setMessage("Élément supprimé.");
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditedScheme("");
    }
  };

  const handleEdit = (index: number) => {
    const selectedScheme = schemes[index];
    if (!selectedScheme) {
      return;
    }

    setEditingIndex(index);
    setEditedScheme(selectedScheme);
    setMessage("");
  };

  const handleSaveEdit = (index: number) => {
    const selectedScheme = schemes[index];
    const normalizedEditedScheme = editedScheme.trim();

    if (!selectedScheme || !normalizedEditedScheme) {
      setMessage("Le champ ne peut pas être vide.");
      return;
    }

    editScheme(selectedScheme, normalizedEditedScheme);
    setEditingIndex(null);
    setEditedScheme("");
    setMessage("Modification enregistrée.");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedScheme("");
  };

  return (
    <div className="scheme-table">
      <h2>Liste des schèmes</h2>
      {message && <p className="status-message">{message}</p>}

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {schemes.map((scheme, index) => (
            <tr key={index}>
              <td>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editedScheme}
                    onChange={(event) => setEditedScheme(event.target.value)}
                  />
                ) : (
                  scheme
                )}
              </td>
              <td>
                <div className="action-row">
                  {editingIndex === index ? (
                    <>
                      <button onClick={() => handleSaveEdit(index)}>
                        Enregistrer
                      </button>
                      <button onClick={handleCancelEdit}>
                        Annuler
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(index)}>
                      Modifier
                    </button>
                  )}
                  <button onClick={() => handleDelete(index)}>
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SchemeList;