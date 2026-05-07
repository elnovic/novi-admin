'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminsPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [chargement, setChargement] = useState(true)
  const [emailNouvel, setEmailNouvel] = useState('')
  const [message, setMessage] = useState('')
  const [erreur, setErreur] = useState('')

  useEffect(() => { chargerAdmins() }, [])

  const chargerAdmins = async () => {
    const { data } = await supabase
      .from('utilisateurs')
      .select('*')
      .eq('role', 'admin')
      .order('created_at', { ascending: false })
    setAdmins(data || [])
    setChargement(false)
  }

  const ajouterAdmin = async () => {
    if (!emailNouvel) { setErreur('Entre un email.'); return }
    setErreur(''); setMessage('')

    const { data: user, error } = await supabase
      .from('utilisateurs')
      .select('id, prenom, nom, role')
      .eq('email', emailNouvel)
      .single()

    if (error || !user) { setErreur('Utilisateur introuvable. Il doit d\'abord créer un compte sur NOVI.'); return }
    if (user.role === 'admin') { setErreur('Cet utilisateur est déjà administrateur.'); return }

    await supabase.from('utilisateurs').update({ role: 'admin' }).eq('email', emailNouvel)
    setMessage(`${user.prenom} ${user.nom} est maintenant administrateur.`)
    setEmailNouvel('')
    await chargerAdmins()
  }

  const retirerAdmin = async (id: string, nom: string) => {
    if (!confirm(`Retirer les droits admin de ${nom} ?`)) return
    await supabase.from('utilisateurs').update({ role: 'user' }).eq('id', id)
    await chargerAdmins()
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des administrateurs</h1>
        <p className="text-gray-500 mt-1">{admins.length} administrateur(s) actif(s)</p>
      </div>

      {/* Ajouter un admin */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Ajouter un administrateur</h2>
        <p className="text-sm text-gray-500">L'utilisateur doit d'abord avoir un compte sur NOVI Ecosystem.</p>
        <div className="flex gap-3">
          <input type="email" placeholder="email@exemple.com" value={emailNouvel}
            onChange={e => setEmailNouvel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && ajouterAdmin()}
            className="flex-1 px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-900" />
          <button onClick={ajouterAdmin}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">
            Ajouter
          </button>
        </div>
        {message && <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">{message}</p>}
        {erreur && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{erreur}</p>}
      </div>

      {/* Liste des admins */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Administrateurs actifs</h2>
        </div>
        {chargement ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {admins.map(admin => (
              <div key={admin.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{admin.prenom?.[0]}{admin.nom?.[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{admin.prenom} {admin.nom}</p>
                    <p className="text-xs text-gray-400">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-medium">Admin</span>
                  <button onClick={() => retirerAdmin(admin.id, `${admin.prenom} ${admin.nom}`)}
                    className="text-xs text-red-500 hover:underline">
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}