import React from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, Settings, Wand2, CheckCircle, FileText } from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'Gestion des racines',
      description: 'Ajouter, importer, rechercher et gérer vos racines morphologiques',
      icon: BookOpen,
      path: '/roots',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Gestion des schèmes',
      description: 'Créer et modifier les schèmes morphologiques',
      icon: Settings,
      path: '/schemas',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Génération de mots',
      description: 'Générer des mots dérivés et des familles morphologiques complètes',
      icon: Wand2,
      path: '/generate',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Validation morphologique',
      description: 'Vérifier la validité morphologique des mots',
      icon: CheckCircle,
      path: '/validate',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Gestion des dérivés',
      description: 'Consulter les mots dérivés et leurs statistiques',
      icon: FileText,
      path: '/derived',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Système de Gestion Morphologique
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Plateforme complète pour la gestion des racines, schèmes et mots dérivés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.path} to={feature.path} className="block">
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-slate-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className={`text-sm font-medium ${feature.color}`}>
                      Accéder →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            À propos de cette application
          </h2>
          <div className="text-slate-600 space-y-2">
            <p>
              Cette application vous permet de gérer un système morphologique complet avec les fonctionnalités suivantes :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Gestion complète des racines (ajout, importation, recherche)</li>
              <li>Création et modification de schèmes morphologiques</li>
              <li>Génération automatique de mots dérivés</li>
              <li>Validation morphologique des mots</li>
              <li>Suivi des statistiques d'utilisation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
