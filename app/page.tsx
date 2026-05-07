'use client'

import { useState } from 'react'
import { verifierAdmin } from '@/lib/supabase'

export default function LoginAdmin() {
  const [form, setForm] = useState({ email: '', motdepasse: '', cleSecrete: '' })
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)
  const [afficherCle, setAfficherCle] = useState(false)

  const inputClass = "w-full px-4 py-3 border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-800 text-white placeholder-gray-500"

  const soumettre = async () => {
    if (!form.email || !form.motdepasse || !form.cleSecrete) {
      setErreur('Tous les champs sont obligatoires.')
      return
    }
    setErreur('')
    setChargement(true)
    try {
      await verifierAdmin(form.email, form.motdepasse, form.cleSecrete)
      window.location.href = '/dashboard'
    } catch (e: any) {
      setErreur(e.message || 'Accès refusé.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo NOVI */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <span className="text-white font-black text-2xl">N</span>
          </div>
          <h1 className="text-white font-bold text-xl tracking-widest">NOVi</h1>
          <p className="text-gray-500 text-xs tracking-widest uppercase mt-1">Admin Panel</p>
          <div className="w-8 h-0.5 bg-blue-600 mx-auto mt-3" />
        </div>

        {/* Formulaire */}
        <div className="space-y-4">

          <div className="bg-amber-950 border border-amber-800 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-amber-400 text-lg">🔐</span>
            <p className="text-xs text-amber-400">Accès réservé aux administrateurs NOVI</p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Email administrateur</label>
            <input type="email" placeholder="admin@noviEcosystem.com" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && soumettre()}
              className={inputClass} />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Mot de passe</label>
            <input type="password" placeholder="••••••••" value={form.motdepasse}
              onChange={e => setForm(p => ({ ...p, motdepasse: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && soumettre()}
              className={inputClass} />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Clé secrète</label>
            <div className="relative">
              <input
                type={afficherCle ? 'text' : 'password'}
                placeholder="Clé secrète NOVI Admin"
                value={form.cleSecrete}
                onChange={e => setForm(p => ({ ...p, cleSecrete: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && soumettre()}
                className={inputClass}
              />
              <button onClick={() => setAfficherCle(!afficherCle)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs">
                {afficherCle ? 'Masquer' : 'Afficher'}
              </button>
            </div>
          </div>

          {erreur && (
            <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3">
              <p className="text-xs text-red-400">{erreur}</p>
            </div>
          )}

          <button onClick={soumettre} disabled={chargement}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 text-sm mt-2">
            {chargement ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Vérification...
              </span>
            ) : 'Accéder au panel admin'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-700 mt-8">
          NOVI Ecosystem © 2026
        </p>
      </div>
    </main>
  )
}