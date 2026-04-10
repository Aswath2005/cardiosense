'use client'

import { Github, Linkedin } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">💓</span>
            <span className="font-playfair font-bold text-2xl text-primary">
              CardioSense AI
            </span>
          </div>

          {/* Description */}
          <p className="text-text-muted text-lg mb-2">
            Built by Team PulseML as a mini research project
          </p>
          <p className="text-text-muted text-sm mb-8">
            Dataset: Kaggle Cleveland Heart Disease Dataset
          </p>

          {/* Disclaimer */}
          <p className="text-text-muted italic text-sm mb-8 max-w-2xl mx-auto leading-relaxed">
            This tool is for educational purposes only and is not a substitute for professional medical advice. Always consult with a qualified healthcare professional for medical decisions.
          </p>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-6 mb-12">
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="p-3 rounded-full hover:bg-bg-main transition-colors text-text-muted hover:text-accent"
              aria-label="GitHub"
            >
              <Github size={24} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="p-3 rounded-full hover:bg-bg-main transition-colors text-text-muted hover:text-accent"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </motion.a>
          </div>

          {/* Copyright */}
          <p className="text-text-muted text-xs border-t border-border pt-8">
            © 2025 Team PulseML. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
