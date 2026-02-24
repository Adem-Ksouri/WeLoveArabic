import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useMorphology } from '../context/MorphologyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Home, FileText, TrendingUp } from 'lucide-react';

export default function DerivedPage() {
  const location = useLocation();
  const { roots, derivedWords, getSchemaById, getRootById } = useMorphology();
  const [selectedRootId, setSelectedRootId] = useState('');

  // Récupérer le paramètre root de l'URL si présent
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const rootParam = params.get('root');
    if (rootParam) {
      setSelectedRootId(rootParam);
    }
  }, [location.search]);

  const filteredWords = selectedRootId && selectedRootId !== 'all'
    ? derivedWords.filter((w) => w.rootId === selectedRootId)
    : derivedWords;

  const sortedWords = [...filteredWords].sort((a, b) => b.frequency - a.frequency);

  const totalWords = filteredWords.length;
  const totalFrequency = filteredWords.reduce((sum, w) => sum + w.frequency, 0);
  const avgFrequency = totalWords > 0 ? (totalFrequency / totalWords).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4">
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Gestion des dérivés</h1>
          <p className="text-slate-600 mt-2">
            Consultez les mots dérivés et leurs statistiques d'utilisation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de mots</CardDescription>
              <CardTitle className="text-3xl">{totalWords}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <FileText className="w-4 h-4 mr-2" />
                Mots dérivés uniques
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Fréquence totale</CardDescription>
              <CardTitle className="text-3xl">{totalFrequency}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Utilisations cumulées
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Fréquence moyenne</CardDescription>
              <CardTitle className="text-3xl">{avgFrequency}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Par mot dérivé
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtrer par racine</CardTitle>
            <CardDescription>Sélectionnez une racine pour voir ses dérivés</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedRootId} onValueChange={setSelectedRootId}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les racines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les racines</SelectItem>
                {roots.map((root) => {
                  const count = derivedWords.filter((w) => w.rootId === root.id).length;
                  return (
                    <SelectItem key={root.id} value={root.id}>
                      {root.value} ({count} mot{count !== 1 ? 's' : ''})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Liste des mots dérivés
              {selectedRootId && selectedRootId !== 'all' && (
                <span className="text-slate-600 font-normal ml-2">
                  - Racine : {getRootById(selectedRootId)?.value}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Mots triés par fréquence d'utilisation (du plus utilisé au moins utilisé)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedWords.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Aucun mot dérivé trouvé</p>
                <p className="text-sm mt-2">
                  Générez des mots depuis{' '}
                  <Link to="/generate" className="underline font-medium">
                    la page de génération
                  </Link>
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rang</TableHead>
                    <TableHead>Mot dérivé</TableHead>
                    <TableHead>Racine</TableHead>
                    <TableHead>Schème</TableHead>
                    <TableHead>Fréquence</TableHead>
                    <TableHead>Dernière utilisation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedWords.map((word, index) => {
                    const root = getRootById(word.rootId);
                    const schema = getSchemaById(word.schemaId);
                    return (
                      <TableRow key={word.id}>
                        <TableCell className="font-medium">#{index + 1}</TableCell>
                        <TableCell className="font-bold text-lg">{word.word}</TableCell>
                        <TableCell className="font-medium">{root?.value || '-'}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{schema?.name || '-'}</span>
                            <span className="text-xs text-slate-500">
                              {schema?.pattern || ''}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={word.frequency > 5 ? 'default' : 'secondary'}
                            className={
                              word.frequency > 5
                                ? 'bg-green-600'
                                : word.frequency > 2
                                ? 'bg-blue-600'
                                : ''
                            }
                          >
                            {word.frequency}×
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {new Date(word.lastUsed).toLocaleDateString()}{' '}
                          {new Date(word.lastUsed).toLocaleTimeString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Mise à jour automatique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-slate-600">
            <p>
              📊 <strong>Fréquence d'apparition</strong> : Chaque fois qu'un mot est généré ou
              validé, sa fréquence est automatiquement incrémentée.
            </p>
            <p>
              🔄 <strong>Mise à jour en temps réel</strong> : Les statistiques sont mises à jour
              instantanément après chaque génération ou validation.
            </p>
            <p>
              📈 <strong>Suivi d'utilisation</strong> : La date de dernière utilisation est
              enregistrée pour chaque mot.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}