import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { useMorphology } from '../context/MorphologyContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Plus, Upload, Search, Trash2, Eye, BookOpen, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function RootsPageNew() {
  const { roots, addRoot, importRoots, deleteRoot, getDerivedWordsByRoot } = useMorphology();
  const [newRoot, setNewRoot] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRoots, setFilteredRoots] = useState(roots);
  const [isSearching, setIsSearching] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update filtered roots when roots change
  useEffect(() => {
    setFilteredRoots(roots);
  }, [roots]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredRoots(roots);
      return;
    }

    setIsSearching(true);
    try {
      // Appel API simulé - remplacez par votre vraie API
      // const response = await fetch('YOUR_API_ENDPOINT/search', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ query: searchQuery })
      // });
      // const data = await response.json();
      
      // Simulation d'un appel API avec délai
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Logique locale comme fallback
      const results = roots.filter((root) =>
        root.value.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setFilteredRoots(results);
      toast.success(`✅ ${results.length} résultat(s) trouvé(s)`);
    } catch (error) {
      toast.error('❌ Erreur lors de la recherche');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddRoot = async () => {
    if (!newRoot.trim()) {
      return;
    }

    try {
      await addRoot(newRoot.trim());
      setNewRoot('');
      setIsAddDialogOpen(false);
      toast.success('✅ Racine ajoutée avec succès');
    } catch (error) {
      toast.error('❌ Erreur lors de l\'ajout de la racine');
      console.error('Add root error:', error);
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      toast.error('❌ Veuillez sélectionner un fichier .txt');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const rootsList = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      
      if (rootsList.length > 0) {
        try {
          await importRoots(rootsList);
          toast.success(`✅ ${rootsList.length} racine(s) importée(s)`);
        } catch (error) {
          toast.error('❌ Erreur lors de l\'import des racines');
          console.error('Import roots error:', error);
        }
      } else {
        toast.error('❌ Le fichier est vide');
      }
    };
    reader.onerror = () => {
      toast.error('❌ Erreur lors de la lecture du fichier');
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteRoot = (id: string) => {
    deleteRoot(id);
    toast.success('🗑️ Racine supprimée');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Gestion des racines</h1>
              </div>
              <p className="text-slate-600">Organisez et gérez vos racines morphologiques</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Importer</span>
              </Button>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une racine</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">Total de racines</p>
                <p className="text-3xl font-bold text-slate-900">{roots.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">Résultats filtrés</p>
                <p className="text-3xl font-bold text-slate-900">{filteredRoots.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">Mots dérivés</p>
                <p className="text-3xl font-bold text-slate-900">
                  {roots.reduce((sum, root) => sum + getDerivedWordsByRoot(root.id).length, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6 border-2">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Rechercher une racine..."
                className="pl-10 h-12 text-lg border-0 focus-visible:ring-0"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="h-12 px-6"
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

        {/* Roots List */}
        {filteredRoots.length === 0 ? (
          <Card className="p-12 text-center border-2 border-dashed">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {searchQuery ? 'Aucun résultat' : 'Aucune racine'}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchQuery
                  ? 'Essayez avec un autre terme de recherche'
                  : 'Commencez par ajouter ou importer des racines'}
              </p>
              {!searchQuery && (
                <div className="flex justify-center space-x-3">
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une racine
                  </Button>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Importer
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoots.map((root) => {
              const derivedCount = getDerivedWordsByRoot(root.id).length;
              return (
                <Card
                  key={root.id}
                  className="p-5 hover:shadow-lg transition-all group border-2 hover:border-blue-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {root.value}
                      </div>
                      <div className="text-sm text-slate-500">
                        Ajoutée le {new Date(root.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {derivedCount} {derivedCount !== 1 ? 'dérivés' : 'dérivé'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Link to={`/derived?root=${root.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4 text-slate-600" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-50"
                        onClick={() => handleDeleteRoot(root.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Ajouter une racine</DialogTitle>
            <DialogDescription>
              Entrez la racine morphologique que vous souhaitez ajouter
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="root" className="text-base">Racine</Label>
              <Input
                id="root"
                value={newRoot}
                onChange={(e) => setNewRoot(e.target.value)}
                placeholder="Ex: كتب"
                className="h-12 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleAddRoot()}
                autoFocus
              />
            </div>
            <Button onClick={handleAddRoot} className="w-full h-12" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter la racine
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileImport}
        accept=".txt"
      />
    </div>
  );
}