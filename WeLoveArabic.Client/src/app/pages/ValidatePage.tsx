import React, { useState } from 'react';
import { Link } from 'react-router';
import { useMorphology } from '../context/MorphologyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Home, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { validateWordFromRoot, extractSchema } from '../utils/morphology';

export default function ValidatePage() {
  const { roots, schemas, addDerivedWord, getRootById } = useMorphology();
  const [selectedRootId, setSelectedRootId] = useState('');
  const [inputWord, setInputWord] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    schemaName?: string;
    schemaPattern?: string;
  } | null>(null);

  const handleValidate = () => {
    if (!selectedRootId || !inputWord.trim()) {
      toast.error('Veuillez sélectionner une racine et entrer un mot');
      return;
    }

    const root = getRootById(selectedRootId);
    if (!root) return;

    const isValid = validateWordFromRoot(inputWord, root.value);

    if (isValid) {
      // Extraire le schème
      const extractedPattern = extractSchema(inputWord, root.value);
      
      // Chercher si le schème existe déjà
      const matchingSchema = schemas.find((s) => s.pattern === extractedPattern);

      if (matchingSchema) {
        setValidationResult({
          isValid: true,
          schemaName: matchingSchema.name,
          schemaPattern: matchingSchema.pattern,
        });
        // Ajouter le mot dérivé
        addDerivedWord(root.id, matchingSchema.id, inputWord);
        toast.success('Mot valide et ajouté aux dérivés');
      } else {
        setValidationResult({
          isValid: true,
          schemaName: 'Schème non répertorié',
          schemaPattern: extractedPattern || 'Non déterminé',
        });
        toast.success('Mot valide (schème non répertorié)');
      }
    } else {
      setValidationResult({
        isValid: false,
      });
      toast.error('Mot invalide pour cette racine');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4">
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Validation morphologique</h1>
          <p className="text-slate-600 mt-2">Vérifiez si un mot appartient à une racine</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>Valider un mot</CardTitle>
                <CardDescription>Entrez une racine et un mot à valider</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="root-validate">Sélectionner une racine</Label>
              <Select value={selectedRootId} onValueChange={setSelectedRootId}>
                <SelectTrigger id="root-validate">
                  <SelectValue placeholder="Choisir une racine..." />
                </SelectTrigger>
                <SelectContent>
                  {roots.map((root) => (
                    <SelectItem key={root.id} value={root.id}>
                      {root.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="word-input">Entrer le mot à valider</Label>
              <Input
                id="word-input"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                placeholder="Ex: كاتب"
                onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
                className="text-lg"
              />
            </div>

            <Button onClick={handleValidate} className="w-full" size="lg">
              <CheckCircle className="w-4 h-4 mr-2" />
              Valider le mot
            </Button>

            {validationResult && (
              <div
                className={`mt-6 p-6 border-2 rounded-lg ${
                  validationResult.isValid
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  {validationResult.isValid ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600" />
                  )}
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        validationResult.isValid ? 'text-green-900' : 'text-red-900'
                      }`}
                    >
                      {validationResult.isValid ? 'Mot valide ✓' : 'Mot invalide ✗'}
                    </h3>
                    <p
                      className={`text-sm ${
                        validationResult.isValid ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {validationResult.isValid
                        ? 'Ce mot appartient à la racine sélectionnée'
                        : 'Ce mot n\'appartient pas à la racine sélectionnée'}
                    </p>
                  </div>
                </div>

                {validationResult.isValid && validationResult.schemaName && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm text-green-700 font-medium mb-2">Schème détecté :</p>
                    <div className="bg-white p-3 rounded border border-green-200">
                      <p className="text-lg font-bold text-green-900">
                        {validationResult.schemaName}
                      </p>
                      <p className="text-sm text-green-700">
                        Pattern : {validationResult.schemaPattern}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {roots.length === 0 && (
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardContent className="py-6">
              <p className="text-orange-800">
                ⚠️ Aucune racine disponible. Veuillez d'abord{' '}
                <Link to="/roots" className="underline font-medium">
                  ajouter des racines
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Comment fonctionne la validation ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-600">
            <p>
              1. <strong>Sélectionnez une racine</strong> : Choisissez la racine que vous souhaitez
              vérifier
            </p>
            <p>
              2. <strong>Entrez un mot</strong> : Tapez le mot dont vous voulez vérifier
              l'appartenance
            </p>
            <p>
              3. <strong>Validation</strong> : Le système vérifie si le mot peut être dérivé de la
              racine
            </p>
            <p>
              4. <strong>Schème détecté</strong> : Si valide, le schème morphologique utilisé est
              affiché
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Note : Les mots validés sont automatiquement ajoutés à la liste des dérivés avec mise
              à jour de leur fréquence.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
