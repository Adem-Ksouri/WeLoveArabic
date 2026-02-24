import React, { useState } from 'react';
import { Link } from 'react-router';
import { useMorphology } from '../context/MorphologyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Home, Wand2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { applySchemaToRoot } from '../utils/morphology';

export default function GeneratePage() {
  const { roots, schemas, addDerivedWord, getSchemaById, getRootById } = useMorphology();
  const [selectedRootId, setSelectedRootId] = useState('');
  const [selectedSchemaId, setSelectedSchemaId] = useState('');
  const [generatedWord, setGeneratedWord] = useState('');
  const [familyWords, setFamilyWords] = useState<Array<{ schema: string; word: string }>>([]);

  const handleGenerateWord = () => {
    if (!selectedRootId || !selectedSchemaId) {
      toast.error('Veuillez sélectionner une racine et un schème');
      return;
    }

    const root = getRootById(selectedRootId);
    const schema = getSchemaById(selectedSchemaId);

    if (root && schema) {
      const word = applySchemaToRoot(root.value, schema.pattern);
      setGeneratedWord(word);
      addDerivedWord(root.id, schema.id, word);
      toast.success('Mot généré avec succès');
    }
  };

  const handleGenerateFamily = () => {
    if (!selectedRootId) {
      toast.error('Veuillez sélectionner une racine');
      return;
    }

    const root = getRootById(selectedRootId);
    if (!root) return;

    const family = schemas.map((schema) => {
      const word = applySchemaToRoot(root.value, schema.pattern);
      addDerivedWord(root.id, schema.id, word);
      return {
        schema: schema.name,
        word,
      };
    });

    setFamilyWords(family);
    setGeneratedWord('');
    toast.success(`Famille morphologique générée (${family.length} mots)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4">
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Génération de mots</h1>
          <p className="text-slate-600 mt-2">Générez des mots dérivés à partir de racines et schèmes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Générer un mot</CardTitle>
                  <CardDescription>Appliquer un schème à une racine</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="root-select">Sélectionner une racine</Label>
                <Select value={selectedRootId} onValueChange={setSelectedRootId}>
                  <SelectTrigger id="root-select">
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
                <Label htmlFor="schema-select">Sélectionner un schème</Label>
                <Select value={selectedSchemaId} onValueChange={setSelectedSchemaId}>
                  <SelectTrigger id="schema-select">
                    <SelectValue placeholder="Choisir un schème..." />
                  </SelectTrigger>
                  <SelectContent>
                    {schemas.map((schema) => (
                      <SelectItem key={schema.id} value={schema.id}>
                        {schema.name} ({schema.pattern})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerateWord} className="w-full" size="lg">
                <Wand2 className="w-4 h-4 mr-2" />
                Générer le mot dérivé
              </Button>

              {generatedWord && (
                <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-medium mb-2">Mot généré :</p>
                  <p className="text-3xl font-bold text-green-900 text-center">{generatedWord}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Générer la famille morphologique</CardTitle>
                  <CardDescription>Tous les dérivés d'une racine</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="root-family">Sélectionner une racine</Label>
                <Select value={selectedRootId} onValueChange={setSelectedRootId}>
                  <SelectTrigger id="root-family">
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

              <Button onClick={handleGenerateFamily} className="w-full" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Générer toute la famille
              </Button>

              {familyWords.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Famille morphologique générée ({familyWords.length} mots) :
                  </p>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {familyWords.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <p className="text-xs text-purple-600 font-medium">{item.schema}</p>
                          <p className="text-lg font-bold text-purple-900">{item.word}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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

        {schemas.length === 0 && (
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardContent className="py-6">
              <p className="text-orange-800">
                ⚠️ Aucun schème disponible. Veuillez d'abord{' '}
                <Link to="/schemas" className="underline font-medium">
                  ajouter des schèmes
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
