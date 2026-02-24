import React from 'react';
import { Link, useLocation } from 'react-router';
import { BookOpen, Settings, Wand2, CheckCircle, FileText, Home, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { path: '/', icon: Home, label: 'Accueil', color: 'text-slate-600' },
    { path: '/roots', icon: BookOpen, label: 'Racines', color: 'text-blue-600' },
    { path: '/schemas', icon: Settings, label: 'Schèmes', color: 'text-purple-600' },
    { path: '/generate', icon: Wand2, label: 'Générer', color: 'text-green-600' },
    { path: '/validate', icon: CheckCircle, label: 'Valider', color: 'text-orange-600' },
    { path: '/derived', icon: FileText, label: 'Dérivés', color: 'text-indigo-600' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          {isSidebarOpen && (
            <div>
              <h1 className="font-bold text-lg text-slate-900">Morphologie</h1>
              <p className="text-xs text-slate-500">Système de gestion</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="ml-auto"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                  {isSidebarOpen && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200">
          <div
            className={`${
              isSidebarOpen ? 'p-3' : 'p-2'
            } bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100`}
          >
            {isSidebarOpen ? (
              <>
                <p className="text-xs font-medium text-slate-900 mb-1">Données locales</p>
                <p className="text-xs text-slate-600">Stockées dans le navigateur</p>
              </>
            ) : (
              <div className="w-2 h-2 bg-green-500 rounded-full mx-auto"></div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
