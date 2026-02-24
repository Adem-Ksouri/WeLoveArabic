import React, { useState } from 'react';
import { Link } from 'react-router';
import { useMorphology } from '../context/MorphologyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Home, Plus, Upload, Search, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function RootsPage() {
  const { roots, addRoot, importRoots, deleteRoot, getDerivedWordsByRoot } = useMorphology();
  const [newRoot, setNewRoot] = useState('');
  const [importText, setImportText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const handleAddRoot = () => {
    if (newRoot.trim()) {
      addRoot(newRoot.trim());
      setNewRoot('');
      setIsAddDialogOpen(false);
      toast.success('Racine ajoutée avec succès');
    }
  };

  const handleImportRoots = () => {
    const rootsList = importText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    
    if (rootsList.length > 0) {
      importRoots(rootsList);
      setImportText('');
      setIsImportDialogOpen(false);
      toast.success(`${rootsList.length} racine(s) importée(s)`);
    }
  };

  const handleDeleteRoot = (id: string) => {
    deleteRoot(id);
    toast.success('Racine supprimée');
  };

  const filteredRoots = roots.filter((root) =>
    root.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4">
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Gestion des racines</h1>
            <p className="text-slate-600 mt-2">Gérez vos racines morphologiques</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-blue-600" />
                    </div>
                    <CardTitle>Ajouter une racine</CardTitle>
                  </div>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle racine</DialogTitle>
                <DialogDescription>
                  Entrez la racine morphologique que vous souhaitez ajouter
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="root">Racine</Label>
                  <Input
                    id="root"
                    value={newRoot}
                    onChange={(e) => setNewRoot(e.target.value)}
                    placeholder="Ex: كتب"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddRoot()}
                  />
                </div>
                <Button onClick={handleAddRoot} className="w-full">
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Upload className="w-5 h-5 text-green-600" />
                    </div>
                    <CardTitle>Importer des racines</CardTitle>
                  </div>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importer des racines</DialogTitle>
                <DialogDescription>
                  Collez vos racines, une par ligne
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="import">Racines (une par ligne)</Label>
                  <Textarea
                    id="import"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="كتب&#10;درس&#10;علم"
                    rows={8}
                  />
                </div>
                <Button onClick={handleImportRoots} className="w-full">
                  Importer
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-purple-600" />
                </div>
                <CardTitle>Rechercher</CardTitle>
              </div>
              <CardDescription>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une racine..."
                  className="mt-2"
                />
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des racines ({filteredRoots.length})</CardTitle>
            <CardDescription>
              Toutes les racines disponibles dans le système
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRoots.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Aucune racine trouvée</p>
                <p className="text-sm mt-2">Commencez par ajouter ou importer des racines</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Racine</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Mots dérivés</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoots.map((root) => {
                    const derivedCount = getDerivedWordsByRoot(root.id).length;
                    return (
                      <TableRow key={root.id}>
                        <TableCell className="font-medium text-lg">{root.value}</TableCell>
                        <TableCell className="text-slate-600">
                          {new Date(root.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {derivedCount} mot{derivedCount !== 1 ? 's' : ''}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Link to={`/derived?root=${root.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRoot(root.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
