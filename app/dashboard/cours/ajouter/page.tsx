'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const DOMAINES = ["IA", "Programmation", "IOT", "Robotique", "Juridique", "Langue", "Sécurité", "Data Science", "Électronique", "Mathématiques"]
const NIVEAUX = ["débutant", "intermédiaire", "avancé"]

export default function AjouterCours() {
  const [etape, setEtape] = useState(1)
  const [form, setForm] = useState({
    titre: '',
    description: '',
    niveau: 'débutant',
    domaine: 'IA',
    duree_estimee: '',
    score_qualite: 90,
    certification: true,
    objectifs: ['', '', '', '', ''],
  })
  const [chapitres, setChapitres] = useState([
    { numero: 1, titre: '', contenu: '', points_cles: ['', '', ''], exemple_concret: '', quiz: [{ question: '', options: ['', '', '', ''], bonne_reponse: '', explication: '' }] }
  ])
  const [sauvegarde, setSauvegarde] = useState(false)
  const [succes, setSucces] = useState(false)
  const [erreur, setErreur] = useState('')

  const inputClass = "w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-900"
  const textareaClass = `${inputClass} resize-none`

  const ajouterChapitre = () => {
    setChapitres(prev => [...prev, {
      numero: prev.length + 1,
      titre: '',
      contenu: '',
      points_cles: ['', '', ''],
      exemple_concret: '',
      quiz: [{ question: '', options: ['', '', '', ''], bonne_reponse: '', explication: '' }]
    }])
  }

  const updateChapitre = (index: number, champ: string, valeur: any) => {
    setChapitres(prev => prev.map((ch, i) => i === index ? { ...ch, [champ]: valeur } : ch))
  }

  const updateQuiz = (chapIndex: number, quizIndex: number, champ: string, valeur: any) => {
    setChapitres(prev => prev.map((ch, i) => {
      if (i !== chapIndex) return ch
      const nouveauxQuiz = ch.quiz.map((q, qi) =>
        qi === quizIndex ? { ...q, [champ]: valeur } : q
      )
      return { ...ch, quiz: nouveauxQuiz }
    }))
  }

  const sauvegarder = async () => {
    if (!form.titre || !form.description) {
      setErreur('Le titre et la description sont obligatoires.')
      return
    }
    setSauvegarde(true)
    setErreur('')

    try {
      const cours_id = form.titre
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')
        .replace(/é|è|ê/g, 'e')
        .replace(/à/g, 'a')
        .replace(/ô/g, 'o')
        .replace(/î/g, 'i')
        .slice(0, 50)

      const contenu = {
        titre: form.titre,
        description: form.description,
        niveau: form.niveau,
        domaine: form.domaine,
        duree_estimee: form.duree_estimee,
        objectifs: form.objectifs.filter(o => o.trim() !== ''),
        chapitres: chapitres.filter(ch => ch.titre.trim() !== ''),
        projet_final: { titre: 'Projet final', description: 'Projet pratique du cours', etapes: [], criteres_evaluation: [], livrable_final: '' },
        examen_oral: { questions: [], criteres_evaluation: ['clarté', 'précision', 'exemples'] },
        ressources: []
      }

      await supabase.from('cours').upsert({
        id: cours_id,
        titre: form.titre,
        description: form.description,
        niveau: form.niveau,
        domaine: form.domaine,
        duree_estimee: form.duree_estimee || '10 heures',
        score_qualite: form.score_qualite,
        certification: form.certification,
        contenu
      })

      setSucces(true)
    } catch (e: any) {
      setErreur(e.message || 'Erreur lors de la sauvegarde.')
    } finally {
      setSauvegarde(false)
    }
  }

  if (succes) return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Cours publié !</h2>
        <p className="text-gray-500 text-sm mb-6">Le cours "{form.titre}" est maintenant disponible sur NOVI Académie.</p>
        <div className="flex gap-3">
          <button onClick={() => { setSucces(false); setForm({ titre: '', description: '', niveau: 'débutant', domaine: 'IA', duree_estimee: '', score_qualite: 90, certification: true, objectifs: ['', '', '', '', ''] }); setChapitres([{ numero: 1, titre: '', contenu: '', points_cles: ['', '', ''], exemple_concret: '', quiz: [{ question: '', options: ['', '', '', ''], bonne_reponse: '', explication: '' }] }]); setEtape(1) }}
            className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50">
            Ajouter un autre cours
          </button>
          <Link href="/dashboard/cours"
            className="flex-1 py-3 bg-blue-600 text-white text-sm rounded-xl text-center hover:bg-blue-700 font-medium">
            Voir tous les cours →
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ajouter un cours manuellement</h1>
          <p className="text-gray-500 mt-1 text-sm">Crée un cours complet sans passer par l'IA</p>
        </div>
        <Link href="/dashboard/cours/generer"
          className="text-sm text-blue-600 border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-50">
          🤖 Générer avec l'IA
        </Link>
      </div>

      {/* Étapes */}
      <div className="flex items-center gap-2">
        {['Informations', 'Chapitres', 'Finaliser'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <button onClick={() => setEtape(i + 1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                etape === i + 1
                  ? 'bg-blue-600 text-white font-medium'
                  : etape > i + 1
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-100 text-gray-500'
              }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                etape === i + 1 ? 'bg-white text-blue-600' :
                etape > i + 1 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {etape > i + 1 ? '✓' : i + 1}
              </span>
              {label}
            </button>
            {i < 2 && <div className="w-8 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* ÉTAPE 1 — Informations */}
      {etape === 1 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Informations générales</h2>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Titre du cours *</label>
            <input type="text" placeholder="Ex: Introduction au Machine Learning"
              value={form.titre} onChange={e => setForm(p => ({ ...p, titre: e.target.value }))}
              className={inputClass} />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Description *</label>
            <textarea placeholder="Description engageante du cours..." value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className={`${textareaClass} h-28`} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Domaine</label>
              <select value={form.domaine} onChange={e => setForm(p => ({ ...p, domaine: e.target.value }))}
                className={inputClass}>
                {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Niveau</label>
              <select value={form.niveau} onChange={e => setForm(p => ({ ...p, niveau: e.target.value }))}
                className={inputClass}>
                {NIVEAUX.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Durée estimée</label>
              <input type="text" placeholder="Ex: 12 heures" value={form.duree_estimee}
                onChange={e => setForm(p => ({ ...p, duree_estimee: e.target.value }))}
                className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Score qualité (/100)</label>
              <input type="number" min="0" max="100" value={form.score_qualite}
                onChange={e => setForm(p => ({ ...p, score_qualite: parseInt(e.target.value) }))}
                className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Certification NOVI</label>
              <div className="flex gap-3 mt-1">
                <button onClick={() => setForm(p => ({ ...p, certification: true }))}
                  className={`flex-1 py-2.5 rounded-xl border text-sm transition-all ${form.certification ? 'border-2 border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 text-gray-600'}`}>
                  ✓ Activée
                </button>
                <button onClick={() => setForm(p => ({ ...p, certification: false }))}
                  className={`flex-1 py-2.5 rounded-xl border text-sm transition-all ${!form.certification ? 'border-2 border-red-400 bg-red-50 text-red-600 font-medium' : 'border-gray-200 text-gray-600'}`}>
                  ✗ Désactivée
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Objectifs du cours (5 max)</label>
            <div className="space-y-2">
              {form.objectifs.map((obj, i) => (
                <input key={i} type="text"
                  placeholder={`Objectif ${i + 1} — Ex: Comprendre les bases du ML`}
                  value={obj}
                  onChange={e => {
                    const nouveaux = [...form.objectifs]
                    nouveaux[i] = e.target.value
                    setForm(p => ({ ...p, objectifs: nouveaux }))
                  }}
                  className={inputClass} />
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setEtape(2)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700">
              Suivant : Chapitres →
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 2 — Chapitres */}
      {etape === 2 && (
        <div className="space-y-4">
          {chapitres.map((ch, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Chapitre {ch.numero}</h3>
                {chapitres.length > 1 && (
                  <button onClick={() => setChapitres(prev => prev.filter((_, idx) => idx !== i).map((c, idx) => ({ ...c, numero: idx + 1 })))}
                    className="text-xs text-red-500 hover:underline">
                    Supprimer
                  </button>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Titre du chapitre</label>
                <input type="text" placeholder="Ex: Introduction aux réseaux de neurones"
                  value={ch.titre} onChange={e => updateChapitre(i, 'titre', e.target.value)}
                  className={inputClass} />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Contenu</label>
                <textarea placeholder="Contenu détaillé du chapitre..."
                  value={ch.contenu} onChange={e => updateChapitre(i, 'contenu', e.target.value)}
                  className={`${textareaClass} h-40`} />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Exemple concret</label>
                <textarea placeholder="Un exemple réel et précis..."
                  value={ch.exemple_concret} onChange={e => updateChapitre(i, 'exemple_concret', e.target.value)}
                  className={`${textareaClass} h-20`} />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Points clés (3)</label>
                <div className="space-y-2">
                  {ch.points_cles.map((pk, j) => (
                    <input key={j} type="text" placeholder={`Point clé ${j + 1}`}
                      value={pk}
                      onChange={e => {
                        const nouveaux = [...ch.points_cles]
                        nouveaux[j] = e.target.value
                        updateChapitre(i, 'points_cles', nouveaux)
                      }}
                      className={inputClass} />
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-50 pt-4">
                <label className="text-xs font-medium text-gray-600 mb-3 block">Quiz</label>
                {ch.quiz.map((q, j) => (
                  <div key={j} className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <input type="text" placeholder="Question du quiz"
                      value={q.question} onChange={e => updateQuiz(i, j, 'question', e.target.value)}
                      className={inputClass} />
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, k) => (
                        <input key={k} type="text" placeholder={`Option ${String.fromCharCode(65 + k)}`}
                          value={opt}
                          onChange={e => {
                            const nouvelles = [...q.options]
                            nouvelles[k] = e.target.value
                            updateQuiz(i, j, 'options', nouvelles)
                          }}
                          className={inputClass} />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Bonne réponse (ex: Option A)"
                        value={q.bonne_reponse} onChange={e => updateQuiz(i, j, 'bonne_reponse', e.target.value)}
                        className={inputClass} />
                      <input type="text" placeholder="Explication"
                        value={q.explication} onChange={e => updateQuiz(i, j, 'explication', e.target.value)}
                        className={inputClass} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button onClick={ajouterChapitre}
            className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-2xl hover:border-blue-400 hover:text-blue-600 transition-colors text-sm">
            + Ajouter un chapitre
          </button>

          <div className="flex justify-between">
            <button onClick={() => setEtape(1)}
              className="py-3 px-6 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50">
              ← Retour
            </button>
            <button onClick={() => setEtape(3)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700">
              Suivant : Finaliser →
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 — Finaliser */}
      {etape === 3 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-6">
          <h2 className="font-semibold text-gray-900">Récapitulatif</h2>

          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Titre</span>
              <span className="text-sm font-medium text-gray-900">{form.titre}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Domaine</span>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{form.domaine}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Niveau</span>
              <span className="text-sm text-gray-700">{form.niveau}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Durée</span>
              <span className="text-sm text-gray-700">{form.duree_estimee || 'Non définie'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Chapitres</span>
              <span className="text-sm text-gray-700">{chapitres.filter(ch => ch.titre).length} chapitres</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Score qualité</span>
              <span className="text-sm font-bold text-green-600">{form.score_qualite}/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Certification</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${form.certification ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {form.certification ? '✓ Activée' : '✗ Désactivée'}
              </span>
            </div>
          </div>

          {erreur && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-sm text-red-500">{erreur}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setEtape(2)}
              className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50">
              ← Retour
            </button>
            <button onClick={sauvegarder} disabled={sauvegarde}
              className="flex-1 py-3 bg-blue-600 text-white text-sm rounded-xl font-medium hover:bg-blue-700 disabled:opacity-60">
              {sauvegarde ? 'Publication...' : '🚀 Publier le cours'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}