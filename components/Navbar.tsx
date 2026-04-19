'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { checkHealth } from '@/lib/api'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('home')
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null)

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check API health on mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      const healthy = await checkHealth()
      setApiHealthy(healthy)
    }

    checkBackendHealth()

    // Check health every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#predict', label: 'Predict' },
    { href: '#results', label: 'Results' },
  ]

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <span className="text-2xl">💓</span>
            <span className="font-playfair font-bold text-xl text-primary hidden sm:inline">
              CardioSense AI
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href.slice(1))}
                className={`text-sm font-medium transition-colors ${
                  activeLink === link.href.slice(1)
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right section: Health indicator + Mobile menu */}
          <div className="flex items-center gap-4">
            {/* API Health Indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full transition-colors ${
                  apiHealthy === true
                    ? 'bg-success'
                    : apiHealthy === false
                      ? 'bg-danger'
                      : 'bg-text-muted'
                }`}
              />
              <span className="text-xs text-text-muted hidden sm:inline">
                {apiHealthy === true ? 'Online' : apiHealthy === false ? 'Offline' : 'Checking...'}
              </span>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-bg-main rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-text-main" />
              ) : (
                <Menu size={24} className="text-text-main" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-border overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setActiveLink(link.href.slice(1))
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-sm font-medium text-text-main hover:text-accent transition-colors py-2 border-l-2 border-transparent hover:border-accent pl-4"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-20" />
    </>
  )
}
