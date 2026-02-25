import React from 'react';
import { Link } from 'react-router';
import { Card } from '../components/ui/card';
import { BookOpen, Settings, Wand2, CheckCircle, FileText, ArrowRight, Zap } from 'lucide-react';
import { useMorphology } from '../context/MorphologyContext';

export default function HomeNew() {
  const { roots, schemas, derivedWords } = useMorphology();

  const features = [
    {
      title: 'Racines',
      description: 'Gérez votre collection de racines morphologiques',
      icon: BookOpen,
      path: '/roots',
      color: 'from-blue-500 to-blue-600',
      count: roots.length,
      countLabel: 'racines',
    },
    {
      title: 'Schèmes',
      description: 'Créez et organisez vos schèmes',
      icon: Settings,
      path: '/schemas',
      color: 'from-purple-500 to-purple-600',
      count: schemas.length,
      countLabel: 'schèmes',
    },
    {
      title: 'Générer',
      description: 'Produisez des mots dérivés automatiquement',
      icon: Wand2,
      path: '/generate',
      color: 'from-green-500 to-green-600',
      count: null,
      countLabel: '',
    },
    {
      title: 'Valider',
      description: 'Vérifiez la validité morphologique',
      icon: CheckCircle,
      path: '/validate',
      color: 'from-orange-500 to-orange-600',
      count: null,
      countLabel: '',
    },
    {
      title: 'Dérivés',
      description: 'Consultez statistiques et fréquences',
      icon: FileText,
      path: '/derived',
      color: 'from-indigo-500 to-indigo-600',
      count: derivedWords.length,
      countLabel: 'mots',
    },
  ];

  const quickActions = [
    { label: 'Ajouter une racine', path: '/roots', icon: BookOpen },
    { label: 'Créer un schème', path: '/schemas', icon: Settings },
    { label: 'Générer des mots', path: '/generate', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold">Système de Gestion Morphologique</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl">
            Plateforme complète pour analyser, générer et valider des structures morphologiques
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{roots.length}</div>
              <div className="text-slate-300 text-sm">Racines</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{schemas.length}</div>
              <div className="text-slate-300 text-sm">Schèmes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{derivedWords.length}</div>
              <div className="text-slate-300 text-sm">Mots dérivés</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.path} to={action.path}>
                  <Card className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-slate-300 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                          <Icon className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                        <span className="font-medium text-slate-900">{action.label}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Features Grid */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.path} to={feature.path}>
                  <Card className="h-full hover:shadow-xl transition-all cursor-pointer group overflow-hidden border-0 bg-white">
                    <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {feature.count !== null && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-slate-900">{feature.count}</div>
                            <div className="text-xs text-slate-500">{feature.countLabel}</div>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-slate-600 text-sm mb-4">{feature.description}</p>
                      <div className="flex items-center text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                        Accéder
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-12 bg-gradient-to-br from-slate-50 to-white border-2">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              À propos de cette plateforme
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">🎯 Fonctionnalités</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Gestion complète des racines morphologiques</li>
                  <li>• Création et modification de schèmes</li>
                  <li>• Génération automatique de dérivés</li>
                  <li>• Validation morphologique intelligente</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">📊 Suivi et analyse</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Statistiques de fréquence d'utilisation</li>
                  <li>• Suivi temporel des mots dérivés</li>
                  <li>• Organisation par familles morphologiques</li>
                  <li>• Stockage local automatique</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
