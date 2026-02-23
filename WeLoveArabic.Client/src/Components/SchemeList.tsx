import { useState } from "react";
import { useAppData } from "../state/AppDataContext";

function SchemeList(){
  const { schemes, deleteScheme } = useAppData();
  const [message, setMessage] = useState("");

  const handleDelete = (index: number) => {
    const selectedScheme = schemes[index];
    if (!selectedScheme) {
      return;
    }

    deleteScheme(selectedScheme);
    setMessage("Élément supprimé.");
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
              <td>{scheme}</td>
              <td>
                <div className="action-row">
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