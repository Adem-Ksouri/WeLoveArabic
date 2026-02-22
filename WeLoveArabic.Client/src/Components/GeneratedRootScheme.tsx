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
      <h3>Résultats de génération</h3>

      {results.length === 0 ? (
        <p>Aucun mot généré pour le moment.</p>
      ) : (
        <table className="generated-table">
          <thead>
            <tr>
              <th>Racine</th>
              <th>Schème</th>
              <th>Mot généré</th>
              <th>Fréquence</th>
            </tr>
          </thead>
          <tbody>
            {results.map(function (item, index) {
              return (
                <tr key={index}>
                  <td>{item.root}</td>
                  <td>{item.scheme}</td>
                  <td className="generated-word">{item.word}</td>
                  <td className="frequency">{item.frequency}</td>
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