'use client';

import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { href: 'https://www.heart.org/', label: 'American Heart Association' },
    { href: 'https://www.nhlbi.nih.gov/', label: 'National Heart, Lung, and Blood Institute' },
    { href: 'https://archive.ics.uci.edu/ml/datasets/heart+disease', label: 'Cleveland Heart Disease Dataset' },
  ];

  const socials = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@cardiosense.ai', label: 'Email' },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-[#F8FAFF] border-t border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* Logo Section */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <Heart className="w-8 h-8 text-[#EF4444]" />
              <span
                className="text-3xl font-bold text-[#0F172A]"
                style={{ fontFamily: 'Playfair Display' }}
              >
                CardioSense AI
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-[#64748B] text-lg mb-2"
              style={{ fontFamily: 'Inter' }}
            >
              Heart Disease Risk Prediction System
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-[#64748B] text-sm"
              style={{ fontFamily: 'Inter' }}
            >
              Built by Team PulseML
            </motion.p>
          </div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-3xl mx-auto"
          >
            <p className="text-[#0F172A] text-sm" style={{ fontFamily: 'Inter' }}>
              <strong>⚠️ Medical Disclaimer:</strong> CardioSense AI is an educational tool designed to demonstrate machine
              learning applications in healthcare. It is <strong>NOT</strong> a medical device and should never be used as a
              substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare
              professionals for any health concerns.
            </p>
          </motion.div>

          {/* Links Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Resources */}
            <div>
              <h3
                className="font-semibold text-[#0F172A] mb-4 text-sm uppercase tracking-wide"
                style={{ fontFamily: 'Inter' }}
              >
                Resources
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      whileHover={{ x: 4 }}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#64748B] hover:text-[#2563EB] transition-colors text-sm"
                      style={{ fontFamily: 'Inter' }}
                    >
                      {link.label} →
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dataset Info */}
            <div>
              <h3
                className="font-semibold text-[#0F172A] mb-4 text-sm uppercase tracking-wide"
                style={{ fontFamily: 'Inter' }}
              >
                Dataset
              </h3>
              <ul className="space-y-2 text-sm text-[#64748B]" style={{ fontFamily: 'Inter' }}>
                <li><strong>Name:</strong> Cleveland Heart Disease</li>
                <li><strong>Samples:</strong> 303 patients</li>
                <li><strong>Features:</strong> 13 clinical attributes</li>
                <li><strong>Source:</strong> UCI Machine Learning Repository</li>
              </ul>
            </div>

            {/* Model Info */}
            <div>
              <h3
                className="font-semibold text-[#0F172A] mb-4 text-sm uppercase tracking-wide"
                style={{ fontFamily: 'Inter' }}
              >
                Model
              </h3>
              <ul className="space-y-2 text-sm text-[#64748B]" style={{ fontFamily: 'Inter' }}>
                <li><strong>Algorithm:</strong> Logistic Regression</li>
                <li><strong>Training Accuracy:</strong> 83.51%</li>
                <li><strong>Test Accuracy:</strong> 81.97%</li>
                <li><strong>Overall:</strong> ~85% average</li>
              </ul>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-6 pt-8 border-t border-[#E2E8F0]"
          >
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full bg-[#F8FAFF] hover:bg-[#2563EB] text-[#64748B] hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center pt-8 border-t border-[#E2E8F0]"
          >
            <p className="text-[#64748B] text-xs" style={{ fontFamily: 'Inter' }}>
              © {currentYear} CardioSense AI by Team PulseML. Built with Next.js, React, and TensorFlow.js. All rights
              reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
