
// --- TODO ---
// memorize the verified schemes in the root list (in the AVL tree) with the frequency 
// if the word is valid with the root and the scheme, increment the frequency of this scheme in the root list (in the AVL tree) for this root

function VerifyWord() {
  return (
    <div className="verify-word">
        <h3>Vérifier un mot</h3>
        <input type="text" placeholder="Entrer un mot à vérifier" />
        <input type="text" placeholder="Entrer une racine pour vérification" />
        <button>Vérifier</button>
    </div>
  );
}

export default VerifyWord;