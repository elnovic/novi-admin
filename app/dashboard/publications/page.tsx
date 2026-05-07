'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPublications() {
  const [publications, setPublications] = useState<any[]>([])
  const [chargement, setChargement] = useState(true)
  const [filtre, setFiltre] = useState('tous')

  useEffect(() => { chargerPublications() }, [])

  const chargerPublications = async () => {
    const { data } = await supabase
      .from('publications')
      .select('*')
      .order('created_at', { ascending: false })
    setPublications(data || [])
    setChargement(false)
  }

  const changerStatut = async (id: string, statut: string) => {
    await supabase.from('publications').update({ statut }).eq('id', id)
    await chargerPublications()
  }

  const filtrees = publications.filter(p => filtre === 'tous' ? true : p.statut === filtre)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Publications</h1>
        <p className="text-gray-500 mt-1">{publications.length} publications au total</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'tous', label: 'Toutes' },
          { key: 'en_attente', label: 'En attente' },
          { key: 'publie', label: 'Publiées' },
          { key: 'rejete', label: 'Rejetées' }
        ].map(f => (
          <button key={f.key} onClick={() => setFiltre(f.key)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              filtre === f.key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-200 text-gray-600 hover:border-blue-300'
            }`}>
            {f.label} ({publications.filter(p => f.key === 'tous' ? true : p.statut === f.key).length})
          </button>
        ))}
      </div>

      {chargement ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {filtrees.map(pub => (
            <div key={pub.id} className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      pub.statut === 'publie' ? 'bg-green-50 text-green-600' :
                      pub.statut === 'en_attente' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {pub.statut === 'publie' ? 'Publiée' : pub.statut === 'en_attente' ? 'En attente' : 'Rejetée'}
                    </span>
                    <span className="text-xs text-gray-400">{pub.type}</span>
                    {pub.domaine && <span className="text-xs text-gray-400">· {pub.domaine}</span>}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{pub.titre}</h3>
                  <p className="text-sm text-gray-500">{pub.auteur}{pub.institution ? ` · ${pub.institution}` : ''}</p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{pub.resume}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(pub.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {pub.statut !== 'publie' && (
                    <button onClick={() => changerStatut(pub.id, 'publie')}
                      className="px-4 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">
                      ✓ Publier
                    </button>
                  )}
                  {pub.statut !== 'rejete' && (
                    <button onClick={() => changerStatut(pub.id, 'rejete')}
                      className="px-4 py-2 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600">
                      ✗ Rejeter
                    </button>
                  )}
                  {pub.statut !== 'en_attente' && (
                    <button onClick={() => changerStatut(pub.id, 'en_attente')}
                      className="px-4 py-2 border border-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-50">
                      ↺ Remettre en attente
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtrees.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-gray-400">Aucune publication dans cette catégorie.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}