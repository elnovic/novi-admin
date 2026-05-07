import { createClient } from '@supabase/supabase-js'

// Instance unique de Supabase
let supabaseInstance: any = null

function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return supabaseInstance
}

export const supabase = getSupabase()

// Clé secrète admin fixe
const CLE_SECRETE_ADMIN = 'novi_admin_2026'

export async function verifierAdmin(email: string, motdepasse: string, cleSecrete: string) {
  console.log('Clé reçue:', cleSecrete)
  console.log('Clé attendue:', CLE_SECRETE_ADMIN)
  console.log('Match:', cleSecrete === CLE_SECRETE_ADMIN)

  if (cleSecrete.trim() !== CLE_SECRETE_ADMIN) {
    throw new Error('Clé secrète incorrecte')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: motdepasse
  })
  if (error) throw new Error(error.message)

  const { data: user, error: userError } = await supabase
    .from('utilisateurs')
    .select('*')
    .eq('auth_id', data.user.id)
    .single()

  if (userError || !user) throw new Error('Profil utilisateur introuvable')
  if (user.role !== 'admin') throw new Error('Accès refusé — compte non administrateur')

  return user
}

export async function getAdminConnecte() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('utilisateurs')
    .select('*')
    .eq('auth_id', user.id)
    .single()

  if (!data || data.role !== 'admin') return null
  return data
}

export async function deconnecterAdmin() {
  await supabase.auth.signOut()
}