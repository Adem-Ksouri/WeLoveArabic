type GeneratedItem = {
  root: string;
  scheme: string;
  word: string;
  frequency: number;
};

type GeneratedSchemesProps = {
  results: GeneratedItem[];
};

function GeneratedRootScheme(props: GeneratedSchemesProps) {

  const { results } = props;

  return (
    <div className="generated-schemes">
      <h3>Tous les mots créés</h3>

      {results.length === 0 ? (
        <p>Aucun mot pour le moment.</p>
      ) : (
        <table className="generated-table">
          <thead>
            <tr>
              <th>Racine</th>
              <th>Modèle</th>
              <th>Mot</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {results.map(function (item, index) {
              return (
                <tr key={index}>
                  <td>{item.root}</td>
                  <td>{item.scheme}</td>
                  <td className="generated-word">{item.word}</td>
                  <td><strong>{item.frequency}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GeneratedRootScheme;