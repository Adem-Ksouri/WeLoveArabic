import React, { useState } from 'react';
import { useMorphology } from '../context/MorphologyContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { CheckCircle, XCircle, Info, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { verifyWordApi } from '../utils/api';

export default function ValidatePageNew() {
  const { roots, schemas, addDerivedWord, getRootById } = useMorphology();
  const [selectedRootId, setSelectedRootId] = useState('');
  const [inputWord, setInputWord] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    schemaName?: string;
    schemaPattern?: string;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async () => {
    if (!selectedRootId || !inputWord.trim()) {
      toast.error('⚠️ Veuillez sélectionner une racine et entrer un mot');
      return;
    }

    setIsValidating(true);
    const root = getRootById(selectedRootId);
    if (!root) return;

    try {
      const data = await verifyWordApi(root.value, inputWord.trim());

      if (data.success) {
        const matchingSchema = schemas.find(
          (schema) => schema.pattern === data.scheme || schema.name === data.scheme
        );

        if (matchingSchema) {
          setValidationResult({
            isValid: true,
            schemaName: matchingSchema.name,
            schemaPattern: matchingSchema.pattern,
          });
          addDerivedWord(root.id, matchingSchema.id, inputWord);
          toast.success('✅ Mot valide et ajouté aux dérivés');
        } else {
          setValidationResult({
            isValid: true,
            schemaName: 'Schème non répertorié',
            schemaPattern: data.scheme || 'Non déterminé',
          });
          toast.success('✅ Mot valide (schème non répertorié)');
        }
      } else {
        setValidationResult({
          isValid: false,
        });
        toast.error('❌ Mot invalide pour cette racine');
      }
    } catch (error) {
      toast.error('❌ Erreur lors de la validation');
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const selectedRoot = getRootById(selectedRootId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Validation morphologique</h1>
              <p className="text-slate-600">Vérifiez l'appartenance des mots aux racines</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Main Validation Card */}
        <Card className="border-2 overflow-hidden mb-8">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          <div className="p-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="root-validate" className="text-base font-semibold">
                  1. Sélectionner une racine
                </Label>
                <Select value={selectedRootId} onValueChange={setSelectedRootId}>
                  <SelectTrigger id="root-validate" className="h-12 text-lg">
                    <SelectValue placeholder="Choisir une racine..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roots.map((root) => (
                      <SelectItem key={root.id} value={root.id} className="text-lg">
                        {root.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="word-input" className="text-base font-semibold">
                  2. Entrer le mot à valider
                </Label>
                <Input
                  id="word-input"
                  value={inputWord}
                  onChange={(e) => setInputWord(e.target.value)}
                  placeholder="Ex: كاتب, مكتوب, كتاب"
                  onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
                  className="h-14 text-2xl text-center"
                />
              </div>

              {selectedRoot && inputWord && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-700 font-medium">Validation en cours</p>
                  </div>
                  <p className="text-lg">
                    Racine : <span className="font-bold text-blue-900">{selectedRoot.value}</span>
                    <span className="mx-3 text-blue-400">→</span>
                    Mot : <span className="font-bold text-blue-900">{inputWord}</span>
                  </p>
                </div>
              )}

              <Button
                onClick={handleValidate}
                className="w-full h-16 text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                size="lg"
                disabled={isValidating || !selectedRootId || !inputWord.trim()}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {isValidating ? 'Validation en cours...' : 'Valider le mot'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Result Card */}
        {validationResult && (
          <Card
            className={`border-2 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 ${
              validationResult.isValid
                ? 'border-green-300 bg-gradient-to-br from-green-50 to-green-100/50'
                : 'border-red-300 bg-gradient-to-br from-red-50 to-red-100/50'
            }`}
          >
            <div
              className={`h-2 ${
                validationResult.isValid
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}
            ></div>
            <div className="p-8">
              <div className="flex items-start space-x-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    validationResult.isValid
                      ? 'bg-green-200'
                      : 'bg-red-200'
                  }`}
                >
                  {validationResult.isValid ? (
                    <CheckCircle className="w-8 h-8 text-green-700" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-700" />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      validationResult.isValid ? 'text-green-900' : 'text-red-900'
                    }`}
                  >
                    {validationResult.isValid ? 'Mot valide ✓' : 'Mot invalide ✗'}
                  </h3>
                  <p
                    className={`text-base ${
                      validationResult.isValid ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {validationResult.isValid
                      ? 'Ce mot appartient bien à la racine sélectionnée'
                      : 'Ce mot n\'appartient pas à la racine sélectionnée'}
                  </p>

                  {validationResult.isValid && validationResult.schemaName && (
                    <div className="mt-6 p-5 bg-white rounded-xl border-2 border-green-200 shadow-sm">
                      <div className="flex items-center space-x-2 mb-3">
                        <Sparkles className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-green-700 font-semibold">Schème détecté</p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-green-600 mb-1">Nom du schème</p>
                          <p className="text-2xl font-bold text-green-900">
                            {validationResult.schemaName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-green-600 mb-1">Pattern</p>
                          <p className="text-lg font-medium text-green-800">
                            {validationResult.schemaPattern}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-green-200/50">
                <Button
                  variant="outline"
                  onClick={() => {
                    setValidationResult(null);
                    setInputWord('');
                  }}
                  className="w-full"
                >
                  Valider un autre mot
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <div className="p-6">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                Comment ça marche ?
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 mr-2">1.</span>
                  <span>Sélectionnez la racine de référence</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 mr-2">2.</span>
                  <span>Entrez le mot à vérifier</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 mr-2">3.</span>
                  <span>Le système analyse la structure morphologique</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 mr-2">4.</span>
                  <span>Le schème est automatiquement détecté si le mot est valide</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
            <div className="p-6">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Mise à jour automatique
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Les mots validés sont ajoutés aux dérivés</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>La fréquence est incrémentée automatiquement</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Le schème est détecté et enregistré</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Les statistiques sont mises à jour en temps réel</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>

        {roots.length === 0 && (
          <Card className="mt-6 border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100/50">
            <div className="p-6">
              <h3 className="font-semibold text-orange-900 mb-2">⚠️ Aucune racine disponible</h3>
              <p className="text-orange-800">
                Ajoutez d'abord des racines dans la section "Racines" pour pouvoir valider des mots.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}