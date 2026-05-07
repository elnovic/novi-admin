'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminOpportunites() {
  const [opportunites, setOpportunites] = useState<any[]>([])
  const [chargement, setChargement] = useState(true)
  const [ajout, setAjout] = useState(false)
  const [form, setForm] = useState({
    titre: '', entreprise: '', type: 'Stage',
    lieu: '', domaine: '', description: '', competences: ''
  })

  const inputClass = "w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-900"

  useEffect(() => { chargerOpportunites() }, [])

  const chargerOpportunites = async () => {
    const { data } = await supabase
      .from('opportunites')
      .select('*')
      .order('created_at', { ascending: false })
    setOpportunites(data || [])
    setChargement(false)
  }

  const ajouter = async () => {
    if (!form.titre || !form.entreprise) return
    await supabase.from('opportunites').insert({
      titre: form.titre,
      entreprise: form.entreprise,
      type: form.type,
      lieu: form.lieu,
      domaine: form.domaine,
      description: form.description,
      competences: form.competences.split(',').map(c => c.trim()).filter(Boolean)
    })
    setAjout(false)
    setForm({ titre: '', entreprise: '', type: 'Stage', lieu: '', domaine: '', description: '', competences: '' })
    await chargerOpportunites()
  }

  const supprimer = async (id: string) => {
    if (!confirm('Supprimer cette opportunité ?')) return
    await supabase.from('opportunites').delete().eq('id', id)
    await chargerOpportunites()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opportunités</h1>
          <p className="text-gray-500 mt-1">{opportunites.length} opportunités disponibles</p>
        </div>
        <button onClick={() => setAjout(!ajout)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">
          + Ajouter une opportunité
        </button>
      </div>

      {ajout && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Nouvelle opportunité</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Titre *</label>
              <input type="text" placeholder="Titre du poste" value={form.titre}
                onChange={e => setForm(p => ({ ...p, titre: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Entreprise *</label>
              <input type="text" placeholder="Nom de l'entreprise" value={form.entreprise}
                onChange={e => setForm(p => ({ ...p, entreprise: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className={inputClass}>
                {['Stage', 'CDI', 'Freelance', 'Partenariat'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Lieu</label>
              <input type="text" placeholder="Paris, Remote..." value={form.lieu}
                onChange={e => setForm(p => ({ ...p, lieu: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Domaine</label>
              <input type="text" placeholder="IA, IOT..." value={form.domaine}
                onChange={e => setForm(p => ({ ...p, domaine: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Compétences (séparées par virgules)</label>
            <input type="text" placeholder="Python, TensorFlow, React..." value={form.competences}
              onChange={e => setForm(p => ({ ...p, competences: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
            <textarea placeholder="Description du poste..." value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className={`${inputClass} h-24 resize-none`} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setAjout(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">
              Annuler
            </button>
            <button onClick={ajouter}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
              Publier l'opportunité
            </button>
          </div>
        </div>
      )}

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
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Entreprise</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Lieu</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Compétences</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {opportunites.map(op => (
                <tr key={op.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{op.titre}</p>
                    {op.domaine && <p className="text-xs text-gray-400 mt-0.5">{op.domaine}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{op.entreprise}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      op.type === 'CDI' ? 'bg-green-50 text-green-600' :
                      op.type === 'Stage' ? 'bg-blue-50 text-blue-600' :
                      op.type === 'Partenariat' ? 'bg-purple-50 text-purple-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {op.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{op.lieu}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {op.competences?.slice(0, 3).map((c: string) => (
                        <span key={c} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-100">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => supprimer(op.id)}
                      className="text-xs text-red-500 hover:underline">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {opportunites.length === 0 && (
            <div className="text-center py-12 text-gray-400">Aucune opportunité.</div>
          )}
        </div>
      )}
    </div>
  )
}