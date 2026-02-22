import { useState } from "react";

function SchemeList(){
     const [schemes, setSchemes] = useState<string[]>([
    "Schéma 1",
    "Schéma 2",
    "Schéma 3"
  ]);

  const handleDelete = (index: number) => {
    const updated = schemes.filter((_, i) => i !== index);
    setSchemes(updated);
  };

  const handleEdit = (index: number) => {
    const newName = prompt("Nouveau nom du schéma :", schemes[index]);
    if (newName && newName.trim() !== "") {
      const updated = [...schemes];
      updated[index] = newName;
      setSchemes(updated);
    }
  };

  return (
    <div className="scheme-table">
      <h2>Liste des schémas</h2>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Nom du schéma</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {schemes.map((scheme, index) => (
            <tr key={index}>
              <td>{scheme}</td>
              <td>
                <button onClick={() => handleEdit(index)}>
                  Modifier
                </button>
                {" "}
                <button onClick={() => handleDelete(index)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SchemeList;