'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<any[]>([])
  const [chargement, setChargement] = useState(true)
  const [recherche, setRecherche] = useState('')

  useEffect(() => {
    supabase
      .from('utilisateurs')
      .select('*')
      .order('created_at', { ascending: false })
      .then((result: { data: any[] | null }) => {
        setUtilisateurs(result.data || [])
        setChargement(false)
      })
  }, [])

  const toggleAdmin = async (id: string, roleActuel: string) => {
    const nouveauRole = roleActuel === 'admin' ? 'user' : 'admin'
    await supabase.from('utilisateurs').update({ role: nouveauRole }).eq('id', id)
    setUtilisateurs(prev => prev.map(u => u.id === id ? { ...u, role: nouveauRole } : u))
  }

  const filtres = utilisateurs.filter(u =>
    `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-500 mt-1">{utilisateurs.length} inscrits</p>
        </div>
        <input type="text" placeholder="Rechercher..." value={recherche}
          onChange={e => setRecherche(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-64" />
      </div>

      {chargement ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Utilisateur</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Niveau</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Domaines</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Rôle</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Inscription</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtres.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{u.prenom?.[0]}{u.nom?.[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.prenom} {u.nom}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{u.niveau}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {u.domaines?.slice(0, 2).map((d: string) => (
                        <span key={d} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded">{d}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      u.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-500'
                    }`}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(u.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleAdmin(u.id, u.role || 'user')}
                      className="text-xs text-blue-600 hover:underline">
                      {u.role === 'admin' ? 'Retirer admin' : 'Rendre admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtres.length === 0 && (
            <div className="text-center py-12 text-gray-400">Aucun utilisateur trouvé.</div>
          )}
        </div>
      )}
    </div>
  )
}