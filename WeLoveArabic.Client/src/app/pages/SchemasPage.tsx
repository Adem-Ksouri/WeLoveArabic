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
import { Home, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Schema } from '../types';

export default function SchemasPage() {
  const { schemas, addSchema, updateSchema, deleteSchema } = useMorphology();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSchema, setEditingSchema] = useState<Schema | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    pattern: '',
    description: '',
  });

  const handleOpenAddDialog = () => {
    setFormData({ name: '', pattern: '', description: '' });
    setEditingSchema(null);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (schema: Schema) => {
    setFormData({
      name: schema.name,
      pattern: schema.pattern,
      description: schema.description || '',
    });
    setEditingSchema(schema);
    setIsAddDialogOpen(true);
  };

  const handleSaveSchema = () => {
    if (formData.name.trim() && formData.pattern.trim()) {
      if (editingSchema) {
        updateSchema(
          editingSchema.id,
          formData.name.trim(),
          formData.pattern.trim(),
          formData.description.trim()
        );
        toast.success('Schème modifié avec succès');
      } else {
        addSchema(
          formData.name.trim(),
          formData.pattern.trim(),
          formData.description.trim()
        );
        toast.success('Schème ajouté avec succès');
      }
      setIsAddDialogOpen(false);
      setFormData({ name: '', pattern: '', description: '' });
      setEditingSchema(null);
    }
  };

  const handleDeleteSchema = (id: string) => {
    deleteSchema(id);
    toast.success('Schème supprimé');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4">
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Gestion des schèmes</h1>
            <p className="text-slate-600 mt-2">Créez et modifiez vos schèmes morphologiques</p>
          </div>
          <Button onClick={handleOpenAddDialog} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Ajouter un schème</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des schèmes ({schemas.length})</CardTitle>
            <CardDescription>
              Tous les schèmes morphologiques disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {schemas.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Aucun schème trouvé</p>
                <p className="text-sm mt-2">Commencez par ajouter des schèmes</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Pattern</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schemas.map((schema) => (
                    <TableRow key={schema.id}>
                      <TableCell className="font-medium text-lg">{schema.name}</TableCell>
                      <TableCell className="font-medium text-lg">{schema.pattern}</TableCell>
                      <TableCell className="text-slate-600 max-w-xs">
                        {schema.description || '-'}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(schema.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditDialog(schema)}
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSchema(schema.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSchema ? 'Modifier le schème' : 'Ajouter un nouveau schème'}
              </DialogTitle>
              <DialogDescription>
                {editingSchema
                  ? 'Modifiez les informations du schème'
                  : 'Entrez les informations du nouveau schème'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du schème</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: فَعَلَ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pattern">Pattern</Label>
                <Input
                  id="pattern"
                  value={formData.pattern}
                  onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                  placeholder="Ex: فعل"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnel)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Verbe trilitère au passé"
                  rows={3}
                />
              </div>
              <Button onClick={handleSaveSchema} className="w-full">
                {editingSchema ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
