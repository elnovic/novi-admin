'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminCours() {
  const [cours, setCours] = useState<any[]>([])
  const [chargement, setChargement] = useState(true)
  const [suppression, setSuppression] = useState<string | null>(null)

  useEffect(() => { chargerCours() }, [])

  const chargerCours = async () => {
    const { data } = await supabase
      .from('cours')
      .select('id, titre, niveau, domaine, duree_estimee, score_qualite, certification, created_at')
      .order('created_at', { ascending: false })
    setCours(data || [])
    setChargement(false)
  }

  const supprimerCours = async (id: string) => {
    if (!confirm('Supprimer ce cours définitivement ?')) return
    setSuppression(id)
    await supabase.from('cours').delete().eq('id', id)
    await chargerCours()
    setSuppression(null)
  }

  const toggleCertification = async (id: string, actuel: boolean) => {
    await supabase.from('cours').update({ certification: !actuel }).eq('id', id)
    await chargerCours()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des cours</h1>
          <p className="text-gray-500 mt-1">{cours.length} cours disponibles</p>
        </div>
        <Link href="/dashboard/cours/generer"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          + Générer un cours IA
        </Link>
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
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Titre</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Domaine</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Niveau</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Score</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Certification</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cours.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{c.titre}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.duree_estimee}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{c.domaine}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.niveau}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${
                      c.score_qualite >= 90 ? 'text-green-600' :
                      c.score_qualite >= 75 ? 'text-blue-600' : 'text-amber-600'
                    }`}>
                      {c.score_qualite}/100
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleCertification(c.id, c.certification)}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                        c.certification
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}>
                      {c.certification ? '✓ Actif' : '✗ Inactif'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`https://novi-platform.vercel.app/academie/${c.id}`}
                        target="_blank"
                        className="text-xs text-blue-600 hover:underline">
                        Voir
                      </Link>
                      <button onClick={() => supprimerCours(c.id)}
                        disabled={suppression === c.id}
                        className="text-xs text-red-500 hover:underline disabled:opacity-50">
                        {suppression === c.id ? '...' : 'Supprimer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cours.length === 0 && (
            <div className="text-center py-12 text-gray-400">Aucun cours.</div>
          )}
        </div>
      )}
    </div>
  )
}