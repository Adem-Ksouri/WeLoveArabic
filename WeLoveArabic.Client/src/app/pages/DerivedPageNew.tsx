import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useMorphology } from '../context/MorphologyContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { FileText, TrendingUp, Search, Award, Clock, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { listRootDetailsApi } from '../utils/api';

export default function DerivedPageNew() {
  const location = useLocation();
  const { roots, schemas, derivedWords, getSchemaById, getRootById } = useMorphology();
  const [selectedRootId, setSelectedRootId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWords, setFilteredWords] = useState(derivedWords);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const rootParam = params.get('root');
    if (rootParam) {
      setSelectedRootId(rootParam);
    }
  }, [location.search]);

  useEffect(() => {
    // Update filtered words when derivedWords or selectedRootId changes
    const filtered = derivedWords.filter((w) => {
      const matchesRoot = selectedRootId && selectedRootId !== 'all' ? w.rootId === selectedRootId : true;
      return matchesRoot;
    });
    setFilteredWords(filtered);
  }, [derivedWords, selectedRootId]);

  const handleSearch = async () => {
    if (!searchQuery.trim() && (!selectedRootId || selectedRootId === 'all')) {
      const filtered = derivedWords.filter((w) => {
        const matchesRoot = selectedRootId && selectedRootId !== 'all' ? w.rootId === selectedRootId : true;
        return matchesRoot;
      });
      setFilteredWords(filtered);
      return;
    }

    setIsSearching(true);
    try {
      let results = derivedWords.filter((w) => {
        const matchesRoot = selectedRootId && selectedRootId !== 'all' ? w.rootId === selectedRootId : true;
        const matchesSearch = searchQuery.trim()
          ? w.word.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        return matchesRoot && matchesSearch;
      });

      if (selectedRootId && selectedRootId !== 'all') {
        const root = getRootById(selectedRootId);

        if (root) {
          const apiData = await listRootDetailsApi(root.value);
          const apiWords = apiData.derivedWordsWithCount
            .filter((item) =>
              searchQuery.trim()
                ? item.word.toLowerCase().includes(searchQuery.toLowerCase())
                : true
            )
            .map((item) => {
              const matchingSchema = item.scheme
                ? schemas.find((schema) => schema.pattern === item.scheme || schema.name === item.scheme)
                : undefined;

              return {
                id: `${root.id}-${item.word}`,
                rootId: root.id,
                schemaId: matchingSchema?.id || item.scheme || '',
                word: item.word,
                frequency: item.count,
                createdAt: new Date().toISOString(),
                lastUsed: new Date().toISOString(),
              };
            });

          if (apiWords.length > 0) {
            results = apiWords;
          }
        }
      }
      
      setFilteredWords(results);
      toast.success(`✅ ${results.length} résultat(s) trouvé(s)`);
    } catch (error) {
      toast.error('❌ Erreur lors de la recherche');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (selectedRootId && selectedRootId !== 'all') {
      void handleSearch();
    }
  }, [selectedRootId]);

  const sortedWords = [...filteredWords].sort((a, b) => b.frequency - a.frequency);

  const totalWords = filteredWords.length;
  const totalFrequency = filteredWords.reduce((sum, w) => sum + w.frequency, 0);
  const avgFrequency = totalWords > 0 ? (totalFrequency / totalWords).toFixed(1) : 0;
  const maxFrequency = totalWords > 0 ? Math.max(...filteredWords.map((w) => w.frequency)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestion des dérivés</h1>
              <p className="text-slate-600">Statistiques et analyse des mots dérivés</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Hash className="w-5 h-5 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{totalWords}</div>
            <div className="text-sm text-slate-600">Mots uniques</div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{totalFrequency}</div>
            <div className="text-sm text-slate-600">Utilisations totales</div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{avgFrequency}</div>
            <div className="text-sm text-slate-600">Fréquence moyenne</div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{maxFrequency}</div>
            <div className="text-sm text-slate-600">Max fréquence</div>
          </Card>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-4 border-2">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-slate-400" />
              <Select value={selectedRootId} onValueChange={setSelectedRootId}>
                <SelectTrigger className="border-0 focus:ring-0">
                  <SelectValue placeholder="Toutes les racines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les racines</SelectItem>
                  {roots.map((root) => {
                    const count = derivedWords.filter((w) => w.rootId === root.id).length;
                    return (
                      <SelectItem key={root.id} value={root.id}>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{root.value}</span>
                          <span className="text-slate-500 ml-4">({count})</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="p-4 border-2">
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Rechercher un mot..."
                  className="pl-10 border-0 focus-visible:ring-0"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="h-10 px-4"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Recherche...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Words List */}
        {sortedWords.length === 0 ? (
          <Card className="p-12 text-center border-2 border-dashed">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun mot dérivé</h3>
              <p className="text-slate-600">
                {searchQuery || selectedRootId
                  ? 'Aucun résultat ne correspond à vos critères'
                  : 'Générez des mots depuis la page de génération'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedWords.map((word, index) => {
              const root = getRootById(word.rootId);
              const schema = getSchemaById(word.schemaId);
              const isTopWord = index < 3;
              const frequencyPercentage = maxFrequency > 0 ? (word.frequency / maxFrequency) * 100 : 0;

              return (
                <Card
                  key={word.id}
                  className={`p-6 hover:shadow-lg transition-all border-2 ${
                    isTopWord ? 'border-indigo-200 bg-gradient-to-r from-indigo-50/50 to-white' : 'hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 flex-1">
                      {/* Rank */}
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                            index === 0
                              ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-lg'
                              : index === 1
                              ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-lg'
                              : index === 2
                              ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          #{index + 1}
                        </div>
                      </div>

                      {/* Word Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <p className="text-2xl font-bold text-slate-900">{word.word}</p>
                          {isTopWord && (
                            <Award className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span className="flex items-center">
                            <span className="font-medium mr-1">Racine:</span>
                            {root?.value || '-'}
                          </span>
                          <span className="flex items-center">
                            <span className="font-medium mr-1">Schème:</span>
                            {schema?.name || '-'}
                          </span>
                        </div>
                        
                        {/* Frequency Bar */}
                        <div className="mt-3">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${frequencyPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <TrendingUp className="w-4 h-4 text-indigo-600 mr-1" />
                            <Badge
                              variant={word.frequency > 5 ? 'default' : 'secondary'}
                              className={`text-base px-3 py-1 ${
                                word.frequency > 5
                                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                                  : word.frequency > 2
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                  : ''
                              }`}
                            >
                              {word.frequency}×
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">Fréquence</p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Clock className="w-4 h-4 text-slate-400 mr-1" />
                            <p className="text-sm font-medium text-slate-700">
                              {new Date(word.lastUsed).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                              })}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500">Dernière util.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Section */}
        <Card className="mt-8 bg-gradient-to-br from-slate-50 to-white border-2">
          <div className="p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              Mise à jour automatique des statistiques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 font-bold text-xs">✓</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Fréquence d'apparition</p>
                  <p>Incrémentée à chaque génération ou validation</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-xs">↻</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Temps réel</p>
                  <p>Statistiques mises à jour instantanément</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 font-bold text-xs">📊</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Suivi d'utilisation</p>
                  <p>Date de dernière utilisation enregistrée</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}