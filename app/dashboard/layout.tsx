'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/components/AuthContext'
import { useMockAuth } from '@/lib/mockAuth'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const mockAuth = useMockAuth()
  const router = useRouter()

  // Get user info from either AuthContext or MockAuth
  const displayUser = user || (mockAuth.user ? { 
    name: mockAuth.user.email.split('@')[0], 
    email: mockAuth.user.email 
  } : null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    logout()
    await mockAuth.signOut()
    router.push('/')
  }

  return (
    <ProtectedRoute>
      <div>
        {/* Enhanced Navbar with Logout & User Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-border"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💓</span>
              <span className="font-playfair font-bold text-primary hidden sm:inline">
                CardioSense
              </span>
            </div>

            <div className="flex items-center gap-6">
              {displayUser && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-accent">
                      {displayUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-text-main">{displayUser.name}</p>
                    <p className="text-xs text-text-muted">{displayUser.email}</p>
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-text-main hover:bg-red-50 text-danger border border-red-200 rounded-lg transition-colors duration-300"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline text-sm font-semibold">Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Spacer for fixed navbar */}
        <div className="h-20" />

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  )
}
