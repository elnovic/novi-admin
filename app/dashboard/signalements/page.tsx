'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const statutCouleur: Record<string, string> = {
  nouveau: 'bg-red-50 text-red-600',
  en_cours: 'bg-amber-50 text-amber-600',
  resolu: 'bg-green-50 text-green-600',
  ignore: 'bg-gray-50 text-gray-400'
}

export default function Signalements() {
  const [signalements, setSignalements] = useState<any[]>([])
  const [chargement, setChargement] = useState(true)
  const [filtre, setFiltre] = useState('tous')

  useEffect(() => { charger() }, [])

  const charger = async () => {
    const { data } = await supabase
      .from('signalements')
      .select('*')
      .order('created_at', { ascending: false })
    setSignalements(data || [])
    setChargement(false)
  }

  const changerStatut = async (id: string, statut: string) => {
    await supabase.from('signalements').update({ statut }).eq('id', id)
    await charger()
  }

  const filtres_data = signalements.filter(s =>
    filtre === 'tous' ? true : s.statut === filtre
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Signalements</h1>
        <p className="text-gray-500 mt-1">{signalements.length} signalements au total</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'tous', label: 'Tous' },
          { key: 'nouveau', label: 'Nouveaux' },
          { key: 'en_cours', label: 'En cours' },
          { key: 'resolu', label: 'Résolus' },
          { key: 'ignore', label: 'Ignorés' }
        ].map(f => (
          <button key={f.key} onClick={() => setFiltre(f.key)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              filtre === f.key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-200 text-gray-600 hover:border-blue-300'
            }`}>
            {f.label} ({signalements.filter(s => f.key === 'tous' ? true : s.statut === f.key).length})
          </button>
        ))}
      </div>

      {chargement ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : filtres_data.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-gray-400">Aucun signalement dans cette catégorie.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtres_data.map(s => (
            <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statutCouleur[s.statut] || 'bg-gray-50 text-gray-500'}`}>
                      {s.statut === 'nouveau' ? 'Nouveau' :
                       s.statut === 'en_cours' ? 'En cours' :
                       s.statut === 'resolu' ? 'Résolu' : 'Ignoré'}
                    </span>
                    <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-full border border-gray-100">
                      {s.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(s.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mb-2 font-medium">📍 {s.page}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.description}</p>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  {s.statut !== 'en_cours' && (
                    <button onClick={() => changerStatut(s.id, 'en_cours')}
                      className="px-3 py-1.5 bg-amber-500 text-white text-xs rounded-lg hover:bg-amber-600">
                      En cours
                    </button>
                  )}
                  {s.statut !== 'resolu' && (
                    <button onClick={() => changerStatut(s.id, 'resolu')}
                      className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">
                      ✓ Résolu
                    </button>
                  )}
                  {s.statut !== 'ignore' && (
                    <button onClick={() => changerStatut(s.id, 'ignore')}
                      className="px-3 py-1.5 border border-gray-200 text-gray-500 text-xs rounded-lg hover:bg-gray-50">
                      Ignorer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}