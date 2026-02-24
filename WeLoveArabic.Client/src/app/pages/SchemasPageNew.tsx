import React, { useState } from 'react';
import { useMorphology } from '../context/MorphologyContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Settings, Plus, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function SchemasPageNew() {
  const { schemas, addSchema, deleteSchema, derivedWords } = useMorphology();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    pattern: '',
  });

  const handleOpenAddDialog = () => {
    setFormData({ name: '', pattern: '' });
    setIsDialogOpen(true);
  };

  const handleSaveSchema = async () => {
    if (!formData.name.trim() || !formData.pattern.trim()) {
      return;
    }

    try {
      await addSchema(
        formData.name.trim(),
        formData.pattern.trim(),
        ''
      );
      toast.success('✅ Schème ajouté avec succès');
      setIsDialogOpen(false);
      setFormData({ name: '', pattern: '' });
    } catch (error) {
      toast.error('❌ Erreur lors de l\'ajout du schème');
      console.error('Add schema error:', error);
    }
  };

  const handleDeleteSchema = (id: string) => {
    deleteSchema(id);
    toast.success('🗑️ Schème supprimé');
  };

  const getSchemaUsageCount = (schemaId: string) => {
    return derivedWords.filter((w) => w.schemaId === schemaId).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Gestion des schèmes</h1>
                <p className="text-slate-600">Créez et organisez vos schèmes morphologiques</p>
              </div>
            </div>
            <Button
              onClick={handleOpenAddDialog}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600"
              size="lg"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un schème</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">Total de schèmes</p>
                <p className="text-3xl font-bold text-slate-900">{schemas.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">Mots générés</p>
                <p className="text-3xl font-bold text-slate-900">{derivedWords.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Schemas List */}
        {schemas.length === 0 ? (
          <Card className="p-12 text-center border-2 border-dashed">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun schème</h3>
              <p className="text-slate-600 mb-6">
                Commencez par créer des schèmes morphologiques
              </p>
              <Button onClick={handleOpenAddDialog} size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Créer mon premier schème
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemas.map((schema) => {
              const usageCount = getSchemaUsageCount(schema.id);
              return (
                <Card
                  key={schema.id}
                  className="overflow-hidden hover:shadow-lg transition-all border-2 hover:border-purple-200 group"
                >
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors mb-2">
                          {schema.name}
                        </h3>
                        <div className="text-lg font-mono text-purple-600">
                          {schema.pattern}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                          {usageCount} util.
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 hover:bg-red-50"
                          onClick={() => handleDeleteSchema(schema.id)}
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-gradient-to-br from-slate-50 to-white border-2">
          <div className="p-6">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple-600" />
              À propos des schèmes morphologiques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <p className="font-medium text-slate-900 mb-1">📝 Structure</p>
                <p>
                  Un schème définit le pattern morphologique utilisé pour générer des mots dérivés
                  à partir d'une racine.
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900 mb-1">🔤 Pattern</p>
                <p>
                  Utilisez les lettres ف، ع، ل comme placeholders pour les consonnes radicales
                  dans le pattern.
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900 mb-1">📊 Statistiques</p>
                <p>
                  Le nombre d'utilisations indique combien de mots ont été générés avec ce schème.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Ajouter un schème
            </DialogTitle>
            <DialogDescription>
              Créez un nouveau schème morphologique
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">Nom du schème</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: فَعَلَ"
                className="h-12 text-lg"
                autoFocus
              />
              <p className="text-xs text-slate-500">Le nom du schème en notation arabe</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pattern" className="text-base font-semibold">Pattern</Label>
              <Input
                id="pattern"
                value={formData.pattern}
                onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                placeholder="Ex: فعل"
                className="h-12 text-lg font-mono"
              />
              <p className="text-xs text-slate-500">
                Utilisez ف، ع، ل pour les consonnes radicales
              </p>
            </div>
            
            <Button
              onClick={handleSaveSchema}
              className="w-full h-12"
              size="lg"
              disabled={!formData.name.trim() || !formData.pattern.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter le schème
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}