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
    <footer className="bg-gradient-to-b from-bg-section to-bg-main border-t border-border relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-20 right-1/4 w-96 h-96 bg-accent-alt/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
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
              <Heart className="w-8 h-8 text-danger animate-pulse" />
              <span className="text-3xl font-bold gradient-text font-playfair">
                CardioSense AI
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-text-muted text-lg mb-2 font-inter"
            >
              Heart Disease Risk Prediction System
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-text-muted text-sm font-inter"
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
            className="bg-gradient-to-r from-primary/10 to-accent-alt/10 border border-primary/30 rounded-xl p-6 max-w-3xl mx-auto backdrop-blur-sm"
          >
            <p className="text-text-main text-sm font-inter leading-relaxed">
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
              <h3 className="font-semibold text-text-main mb-4 text-sm uppercase tracking-wide font-inter">
                Resources
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-primary transition-colors font-inter"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-text-main mb-4 text-sm uppercase tracking-wide font-inter">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-text-muted hover:text-primary transition-colors font-inter">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-text-muted hover:text-primary transition-colors font-inter">
                    About
                  </a>
                </li>
                <li>
                  <a href="#predict" className="text-text-muted hover:text-primary transition-colors font-inter">
                    Predict
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-text-main mb-4 text-sm uppercase tracking-wide font-inter">
                Follow Us
              </h3>
              <div className="flex gap-4">
                {socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, color: '#00D4FF' }}
                      className="text-text-muted hover:text-primary transition-colors"
                      title={social.label}
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="border-t border-border pt-8 text-center"
          >
            <p className="text-text-muted text-sm font-inter">
              © {currentYear} CardioSense AI. All rights reserved. Built with ❤️ by Team PulseML
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
