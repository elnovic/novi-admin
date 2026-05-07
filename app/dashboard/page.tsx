'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/stats`)
      .then(r => r.json())
      .then(data => { setStats(data); setChargement(false) })
      .catch(() => setChargement(false))
  }, [])

  const cartes = stats ? [
    { label: 'Cours publiés', valeur: stats.cours, icon: '📚', href: '/dashboard/cours', couleur: 'from-blue-600 to-blue-700' },
    { label: 'Utilisateurs', valeur: stats.utilisateurs, icon: '👥', href: '/dashboard/utilisateurs', couleur: 'from-green-600 to-green-700' },
    { label: 'Publications', valeur: stats.publications, icon: '📄', href: '/dashboard/publications', couleur: 'from-purple-600 to-purple-700' },
    { label: 'Opportunités', valeur: stats.opportunites, icon: '💼', href: '/dashboard/opportunites', couleur: 'from-amber-600 to-amber-700' },
    { label: 'Admins', valeur: stats.admins, icon: '🔐', href: '/dashboard/admins', couleur: 'from-red-600 to-red-700' },
  ] : []

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h1>
        <p className="text-gray-400 mt-1 text-sm">Tableau de bord NOVI Ecosystem — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {chargement ? (
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cartes.map(c => (
              <Link key={c.label} href={c.href}>
                <div className={`bg-gradient-to-br ${c.couleur} text-white rounded-2xl p-5 hover:opacity-90 transition-opacity cursor-pointer`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{c.icon}</span>
                    <span className="text-white opacity-50 text-xs">→</span>
                  </div>
                  <p className="text-3xl font-black">{c.valeur}</p>
                  <p className="text-xs opacity-80 mt-1">{c.label}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Actions rapides */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/cours/generer">
                <div className="bg-gray-950 text-white rounded-2xl p-6 hover:bg-gray-900 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-lg">⬡</span>
                  </div>
                  <h3 className="font-semibold mb-1">Générer un cours IA</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">Créer un cours complet avec le moteur IA NOVI — génération, validation et publication automatiques</p>
                </div>
              </Link>
              <Link href="/dashboard/publications">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-lg">📄</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Approuver publications</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">Valider les soumissions d'articles, livres et thèses en attente de modération</p>
                </div>
              </Link>
              <Link href="/dashboard/opportunites">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-lg">💼</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Gérer opportunités</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">Ajouter, modifier ou supprimer les offres de stage, CDI et partenariats</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Derniers inscrits */}
          {stats?.derniers_inscrits?.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Derniers inscrits</h2>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="text-left px-6 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Utilisateur</th>
                      <th className="text-left px-6 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="text-left px-6 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Niveau</th>
                      <th className="text-left px-6 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.derniers_inscrits.map((u: any, i: number) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">{u.prenom?.[0]}{u.nom?.[0]}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{u.prenom} {u.nom}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">{u.niveau}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          {new Date(u.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}