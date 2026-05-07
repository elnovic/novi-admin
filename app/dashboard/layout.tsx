'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getAdminConnecte, deconnecterAdmin } from '@/lib/supabase'

const menu = [
  { href: '/dashboard', label: 'Vue d\'ensemble', icon: '▣' },
  { href: '/dashboard/cours', label: 'Cours', icon: '◈' },
  { href: '/dashboard/cours/generer', label: 'Générer avec l\'IA', icon: '⬡' },
  { href: '/dashboard/utilisateurs', label: 'Utilisateurs', icon: '◉' },
  { href: '/dashboard/admins', label: 'Administrateurs', icon: '◈' },
  { href: '/dashboard/publications', label: 'Publications', icon: '◧' },
  { href: '/dashboard/opportunites', label: 'Opportunités', icon: '◈' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [admin, setAdmin] = useState<any>(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    getAdminConnecte().then(user => {
      if (!user) { window.location.href = '/'; return }
      setAdmin(user)
      setChargement(false)
    })
  }, [])

  const seDeconnecter = async () => {
    await deconnecterAdmin()
    window.location.href = '/'
  }

  if (chargement) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Vérification des accès...</p>
      </div>
    </div>
  )

  if (!admin) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-60 bg-gray-950 flex flex-col fixed h-full z-40">

        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-base">N</span>
            </div>
            <div>
              <p className="text-white font-bold tracking-widest text-sm">NOVi</p>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-gray-600 text-xs font-medium px-3 py-2 uppercase tracking-widest">Navigation</p>
          {menu.map(item => {
            const actif = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                  actif
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}>
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Lien vers le site */}
        <div className="px-3 py-3 border-t border-gray-800">
          <a href="https://novi-platform.vercel.app" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-sm">
            <span>↗</span>
            <span>Voir le site NOVI</span>
          </a>
        </div>

        {/* Profil admin */}
        <div className="px-3 py-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{admin.prenom?.[0]}{admin.nom?.[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{admin.prenom} {admin.nom}</p>
              <p className="text-gray-500 text-xs truncate">{admin.email}</p>
            </div>
          </div>
          <button onClick={seDeconnecter}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-all text-xs">
            <span>→</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 ml-60 min-h-screen">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>NOVI Admin</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {menu.find(m => m.href === pathname)?.label || 'Dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">API connectée</span>
          </div>
        </div>

        {/* Page content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}