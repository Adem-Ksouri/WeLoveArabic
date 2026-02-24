import React, { useState } from 'react';
import { useMorphology } from '../context/MorphologyContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Wand2, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { generateWordsApi } from '../utils/api';

export default function GeneratePageNew() {
  const { roots, schemas, addDerivedWord, getSchemaById, getRootById } = useMorphology();
  const [selectedRootId, setSelectedRootId] = useState('');
  const [selectedSchemaId, setSelectedSchemaId] = useState('');
  const [generatedWord, setGeneratedWord] = useState('');
  const [familyWords, setFamilyWords] = useState<Array<{ schema: string; word: string; schemaId: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateWord = async () => {
    if (!selectedRootId || !selectedSchemaId) {
      toast.error('⚠️ Veuillez sélectionner une racine et un schème');
      return;
    }

    setIsGenerating(true);
    const root = getRootById(selectedRootId);
    const schema = getSchemaById(selectedSchemaId);

    if (root && schema) {
      try {
        const generatedWords = await generateWordsApi(root.value, [schema.pattern]);
        const first = generatedWords[0];
        const word = first?.word;

        if (!word) {
          toast.error('❌ Aucun mot généré par l\'API');
          setIsGenerating(false);
          return;
        }

        setGeneratedWord(word);
        addDerivedWord(root.id, schema.id, word);
        setFamilyWords([]);
        setIsGenerating(false);
        toast.success('✨ Mot généré avec succès');
      } catch (error) {
        setIsGenerating(false);
        toast.error('❌ Erreur lors de la génération');
        console.error('Generate word error:', error);
      }
    }
  };

  const handleGenerateFamily = async () => {
    if (!selectedRootId) {
      toast.error('⚠️ Veuillez sélectionner une racine');
      return;
    }

    setIsGenerating(true);
    const root = getRootById(selectedRootId);
    if (!root) return;

    try {
      const generatedWords = await generateWordsApi(
        root.value,
        schemas.map((schema) => schema.pattern)
      );

      const generatedByScheme = new Map(
        generatedWords
          .filter((item) => item.scheme)
          .map((item) => [item.scheme as string, item.word])
      );

      const family = schemas
        .map((schema, index) => ({
          schema: schema.name,
          word: generatedByScheme.get(schema.pattern) || generatedWords[index]?.word || '',
          schemaId: schema.id,
        }))
        .filter((item) => item.word);

      family.forEach((item) => {
        addDerivedWord(root.id, item.schemaId, item.word);
      });

      setFamilyWords(family);
      setGeneratedWord('');
      setIsGenerating(false);
      toast.success(`🎉 Famille morphologique générée (${family.length} mots)`);
    } catch (error) {
      setIsGenerating(false);
      toast.error('❌ Erreur lors de la génération de la famille');
      console.error('Generate family error:', error);
    }
  };

  const selectedRoot = getRootById(selectedRootId);
  const selectedSchema = getSchemaById(selectedSchemaId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Génération de mots</h1>
              <p className="text-slate-600">Créez des mots dérivés automatiquement</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Single Word Generation */}
          <Card className="border-2 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Génération simple</h2>
                  <p className="text-sm text-slate-600">Un mot à la fois</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="root-select" className="text-base font-semibold">1. Sélectionner une racine</Label>
                  <Select value={selectedRootId} onValueChange={setSelectedRootId}>
                    <SelectTrigger id="root-select" className="h-12 text-lg">
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
                  <Label htmlFor="schema-select" className="text-base font-semibold">2. Sélectionner un schème</Label>
                  <Select value={selectedSchemaId} onValueChange={setSelectedSchemaId}>
                    <SelectTrigger id="schema-select" className="h-12">
                      <SelectValue placeholder="Choisir un schème..." />
                    </SelectTrigger>
                    <SelectContent>
                      {schemas.map((schema) => (
                        <SelectItem key={schema.id} value={schema.id}>
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{schema.name}</span>
                            <span className="text-slate-500 ml-4">({schema.pattern})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRoot && selectedSchema && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 mb-1">Aperçu</p>
                    <p className="text-lg">
                      <span className="font-bold">{selectedRoot.value}</span>
                      <ArrowRight className="w-4 h-4 inline mx-2 text-blue-600" />
                      <span className="font-medium">{selectedSchema.name}</span>
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleGenerateWord}
                  className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  size="lg"
                  disabled={isGenerating || !selectedRootId || !selectedSchemaId}
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  {isGenerating ? 'Génération...' : 'Générer le mot'}
                </Button>

                {generatedWord && (
                  <div className="mt-6 p-8 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-700 font-medium">Mot généré avec succès</p>
                    </div>
                    <p className="text-4xl font-bold text-green-900 text-center">{generatedWord}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Family Generation */}
          <Card className="border-2 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Famille morphologique</h2>
                  <p className="text-sm text-slate-600">Tous les dérivés possibles</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="root-family" className="text-base font-semibold">Sélectionner une racine</Label>
                  <Select value={selectedRootId} onValueChange={setSelectedRootId}>
                    <SelectTrigger id="root-family" className="h-12 text-lg">
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

                {selectedRoot && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-700 mb-1">Racine sélectionnée</p>
                    <p className="text-2xl font-bold text-purple-900">{selectedRoot.value}</p>
                    <p className="text-sm text-purple-600 mt-2">
                      {schemas.length} schème{schemas.length !== 1 ? 's' : ''} disponible{schemas.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleGenerateFamily}
                  className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  size="lg"
                  disabled={isGenerating || !selectedRootId}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isGenerating ? 'Génération...' : 'Générer toute la famille'}
                </Button>

                {familyWords.length > 0 && (
                  <div className="mt-6 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-slate-700">
                        {familyWords.length} mots générés
                      </p>
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                      {familyWords.map((item, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-purple-600 font-medium mb-1">{item.schema}</p>
                              <p className="text-xl font-bold text-purple-900">{item.word}</p>
                            </div>
                            <div className="text-2xl font-bold text-purple-300">
                              {index + 1}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Help Section */}
        {(roots.length === 0 || schemas.length === 0) && (
          <Card className="mt-8 border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100/50">
            <div className="p-6">
              <h3 className="font-semibold text-orange-900 mb-2">⚠️ Configuration requise</h3>
              <div className="text-orange-800 space-y-1">
                {roots.length === 0 && (
                  <p>• Ajoutez d'abord des racines dans la section "Racines"</p>
                )}
                {schemas.length === 0 && (
                  <p>• Créez des schèmes dans la section "Schèmes"</p>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
