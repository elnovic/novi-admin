'use client'

import { useState } from 'react'
import Link from 'next/link'

const DOMAINES = ["IA", "Programmation", "IOT", "Robotique", "Juridique", "Langue", "Sécurité", "Data Science", "Électronique", "Mathématiques"]
const NIVEAUX = ["débutant", "intermédiaire", "avancé"]
const FORMATS = ["théorie + pratique", "théorie + quiz", "pratique uniquement", "projet guidé"]

export default function GenererCours() {
  const [form, setForm] = useState({
    sujet: '', niveau: 'débutant', domaine: 'IA',
    format: 'théorie + pratique', public: ''
  })
  const [statut, setStatut] = useState<'idle' | 'generation' | 'succes' | 'erreur'>('idle')
  const [etapeActuelle, setEtapeActuelle] = useState('')
  const [resultat, setResultat] = useState<any>(null)
  const [erreur, setErreur] = useState('')

  const inputClass = "w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-900"

  const generer = async () => {
    if (!form.sujet) { setErreur('Le sujet est obligatoire.'); return }
    setErreur('')
    setStatut('generation')

    const etapes = [
      'Création du plan pédagogique...',
      'Génération du chapitre 1...',
      'Génération du chapitre 2...',
      'Génération du chapitre 3...',
      'Génération du chapitre 4...',
      'Génération du chapitre 5...',
      'Génération du projet final...',
      'Validation par le Course Manager...',
      'Import dans Supabase...'
    ]

    let etapeIndex = 0
    const interval = setInterval(() => {
      if (etapeIndex < etapes.length) {
        setEtapeActuelle(etapes[etapeIndex])
        etapeIndex++
      }
    }, 3000)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generer-cours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sujet: form.sujet,
          niveau: form.niveau,
          format_cours: form.format,
          public: form.public || `étudiants ${form.niveau}s`
        })
      })
      clearInterval(interval)
      if (!response.ok) throw new Error('Erreur API')
      const cours = await response.json()
      setResultat(cours)
      setStatut('succes')
    } catch {
      clearInterval(interval)
      setErreur('Erreur lors de la génération. Vérifie que l\'API Python tourne sur le port 8000.')
      setStatut('erreur')
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Générer un cours avec l'IA</h1>
        <p className="text-gray-500 mt-1">Le moteur IA NOVI va créer un cours complet, le valider et l'importer automatiquement.</p>
      </div>

      {(statut === 'idle' || statut === 'erreur') && (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 space-y-5">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Sujet du cours *</label>
            <input type="text" placeholder="Ex: Introduction au Deep Learning..."
              value={form.sujet} onChange={e => setForm(p => ({ ...p, sujet: e.target.value }))}
              className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Domaine</label>
              <select value={form.domaine} onChange={e => setForm(p => ({ ...p, domaine: e.target.value }))} className={inputClass}>
                {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Niveau</label>
              <select value={form.niveau} onChange={e => setForm(p => ({ ...p, niveau: e.target.value }))} className={inputClass}>
                {NIVEAUX.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Format</label>
              <select value={form.format} onChange={e => setForm(p => ({ ...p, format: e.target.value }))} className={inputClass}>
                {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Public cible</label>
              <input type="text" placeholder="Ex: ingénieurs, lycéens..." value={form.public}
                onChange={e => setForm(p => ({ ...p, public: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-xs text-blue-700 font-medium mb-2">Ce qui sera généré :</p>
            <div className="grid grid-cols-2 gap-1">
              {['5 chapitres complets', 'Quiz par chapitre', 'Exercices pratiques', 'Projet final', 'Examen oral', 'Validation qualité IA'].map(item => (
                <p key={item} className="text-xs text-blue-600">✓ {item}</p>
              ))}
            </div>
          </div>
          {erreur && (
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-sm text-red-600">{erreur}</p>
              <p className="text-xs text-red-400 mt-1">Lance : cd C:\Users\HP\novi-ai && uvicorn api:app --reload --port 8000</p>
            </div>
          )}
          <button onClick={generer}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
            🤖 Générer le cours
          </button>
        </div>
      )}

      {statut === 'generation' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-6">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Génération en cours...</h2>
            <p className="text-sm text-blue-600 font-medium">{etapeActuelle}</p>
            <p className="text-xs text-gray-400 mt-2">Cela peut prendre 5 à 10 minutes</p>
          </div>
          <div className="space-y-2 text-left max-w-sm mx-auto">
            {['Plan pédagogique', 'Chapitres & quiz', 'Projet final', 'Validation IA', 'Import Supabase'].map((e, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-500">
                <div className="w-4 h-4 bg-blue-100 rounded-full animate-pulse" />
                {e}
              </div>
            ))}
          </div>
        </div>
      )}

      {statut === 'succes' && resultat && (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Cours créé avec succès !</h2>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <p className="font-semibold text-gray-900">{resultat.titre}</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-blue-600">{resultat.chapitres?.length || 5}</p>
                <p className="text-xs text-gray-400">Chapitres</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">{resultat.qualite?.score_final || 85}/100</p>
                <p className="text-xs text-gray-400">Score qualité</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-600">{resultat.qualite?.certification_novi ? '✓' : '✗'}</p>
                <p className="text-xs text-gray-400">Certifié</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setStatut('idle'); setResultat(null); setForm({ sujet: '', niveau: 'débutant', domaine: 'IA', format: 'théorie + pratique', public: '' }) }}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">
              Générer un autre cours
            </button>
            <Link href="/dashboard/cours"
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm text-center hover:bg-blue-700 font-medium">
              Voir tous les cours →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}