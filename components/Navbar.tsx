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
          isScrolled
            ? 'bg-bg-section/80 backdrop-blur-xl border-b border-border shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <span className="text-xl sm:text-2xl group-hover:heart-pulse transition-all">💓</span>
            <span className="font-playfair font-bold text-base sm:text-lg md:text-xl gradient-text hidden sm:inline">
              CardioSense
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href.slice(1))}
                className={`text-sm font-medium transition-all duration-300 pb-2 border-b-2 ${
                  activeLink === link.href.slice(1)
                    ? 'text-primary border-primary shadow-glow'
                    : 'text-text-muted border-transparent hover:text-text-main hover:border-primary/50'
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
              <motion.div
                animate={apiHealthy === true ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-3 h-3 rounded-full transition-all ${
                  apiHealthy === true
                    ? 'bg-success shadow-lg'
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
              className="md:hidden p-2 hover:bg-bg-section rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-primary" />
              ) : (
                <Menu size={24} className="text-primary" />
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
              className="md:hidden bg-bg-section/95 backdrop-blur-xl border-t border-border overflow-hidden"
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
                    className="text-sm font-medium text-text-main hover:text-primary transition-colors py-2 border-l-2 border-transparent hover:border-primary pl-4"
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

