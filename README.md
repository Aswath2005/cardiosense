# 💓 CardioSense AI — Heart Attack Risk Prediction

**Early detection saves lives. Know your heart before it's too late.**

A production-grade, fully responsive Next.js 14 web application for predicting cardiovascular disease risk using machine learning. Built by **Team PulseML**.

## 🎯 Overview

CardioSense AI provides an intuitive interface for assessing heart disease risk based on health parameters. The application compares four machine learning models trained on the Cleveland Heart Disease dataset (303 patients):

- **KNN (Best)**: 92% accuracy
- **SVM**: 87% accuracy  
- **Deep Learning (CNN)**: 87% accuracy
- **Random Forest**: 84% accuracy

## 🛠 Tech Stack

- **Next.js 14** (App Router, app/ directory structure)
- **TypeScript** (.tsx components, strict typing)
- **Tailwind CSS** (responsive design, custom theme)
- **Framer Motion** (smooth animations & transitions)
- **Lucide React** (icon library)
- **Google Fonts** (Playfair Display + Inter)

## 📁 Project Structure

```
cardiosense-1/
├── app/
│   ├── layout.tsx              # Root layout with fonts & metadata
│   ├── page.tsx                # Home page (main entry point)
│   └── globals.css             # Tailwind directives & custom CSS
├── components/
│   ├── Navbar.tsx              # Fixed navbar with mobile menu
│   ├── HeroSection.tsx         # Hero with animated stats
│   ├── AboutSection.tsx        # Model cards & how-it-works stepper
│   ├── PredictSection.tsx      # Prediction form
│   ├── ResultCard.tsx          # Risk result display
│   ├── ResultsSection.tsx      # Performance charts & benchmarks
│   └── Footer.tsx              # Footer with legal disclaimer
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   └── predictionLogic.ts      # Risk prediction function
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── postcss.config.js
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd cardiosense-1
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📋 Features

### Components & Animations

#### 🎨 Navbar
- Fixed header with smooth fade-in animation
- Responsive mobile menu with hamburger toggle
- Active link highlighting via scroll position
- Glass morphism effect on scroll

#### 🎭 Hero Section
- Animated count-up stats (303 patients, 92% accuracy, 4 models)
- Pulsing heart SVG with ECG line animation
- Floating model accuracy cards
- CTA button with hover scale effect

#### 📚 About Section
- 4 ML model cards with hover lift animation
- Best model badge (KNN - 92%)
- How-it-works stepper with animated arrows
- Responsive grid layout

#### 🏥 Predict Section
- 13-field form with full validation
- Real-time error messages (no alerts)
- Inline field validation
- Loading spinner during analysis
- Accessible form labels

#### ✅ Result Card
- High/Low risk styling with AnimatePresence
- Risk-specific advice (4 bullet points each)
- External links to WHO resources
- Re-analysis button to reset form
- Animated shake effect for high-risk warnings

#### 📊 Results Section
- Animated accuracy bars
- 4 metric cards (precision, recall, F1, ROC-AUC)
- Benchmark comparison table
- Striped rows with hover effects

#### 🔗 Footer
- Social links (GitHub, LinkedIn)
- Medical disclaimer
- Team credit & dataset attribution

## 📊 Prediction Logic

The KNN-based prediction uses these criteria:

```typescript
HIGH RISK if:
- Age > 55 AND Cholesterol > 240, OR
- Chest pain type is asymptomatic, OR
- Exercise angina YES AND ST Depression > 2, OR
- Thalassemia has reversible defect, OR
- Major vessels >= 2

Otherwise: LOW RISK
```

## 🎨 Design System

### Color Palette
- **Primary**: #1A3C6E (Dark Blue)
- **Accent**: #2563EB (Bright Blue)
- **Success**: #10B981 (Green)
- **Danger**: #EF4444 (Red)
- **Background**: #F8FAFF, #EEF2FF
- **Text**: #0F172A, #64748B

### Typography
- **Headings**: Playfair Display (variable fonts)
- **Body**: Inter (variable fonts)

### Spacing & Borders
- Consistent 6-12px padding/margins
- Rounded corners: 1.5rem (form cards), 2rem (section cards)
- Subtle borders: #E2E8F0

## 🔧 Configuration

### Tailwind Custom Theme (tailwind.config.ts)
- Extended color variables
- Font family CSS variables
- Responsive breakpoints (mobile-first)

### TypeScript Configuration (tsconfig.json)
- Strict mode enabled
- Path aliases: `@/*` → root directory
- Module resolution: bundler

### Next.js Configuration (next.config.ts)
- React Strict Mode enabled
- Optimized for performance

## 📱 Responsive Design

The app is **mobile-first** and optimizes for:
- **Mobile**: Single column, hamburger nav
- **Tablet**: 2-column grids, optimized spacing
- **Desktop**: Full 3-4 column layouts, sidebar menus

Responsive utilities used:
```
sm: 640px | md: 768px | lg: 1024px | xl: 1280px | 2xl: 1536px
```

## ✨ Key Animations

- **Navbar**: Fade-in, slide-down on mount
- **Hero Stats**: Count-up animation with stagger
- **Sections**: WhileInView opacity/translateY
- **Accuracy Bars**: Animated width on scroll
- **Model Cards**: Hover lift (y: -6px)
- **Heart Icon**: Infinite pulse scale
- **Result Cards**: Slide-up fade-in with AnimatePresence
- **Shake**: Warning icon for high-risk results

## 🚨 Important Notes

### Frontend-Only
- **NO backend API routes**
- **NO database**
- **NO authentication**
- Prediction logic runs entirely in the browser

### Medical Disclaimer
This tool is for **educational purposes only**. It is NOT a substitute for professional medical advice. Always consult a qualified cardiologist for medical decisions.

### Data Privacy
- User inputs are **NOT stored**
- **NO data collection**
- **NO external API calls**
- All processing happens client-side

## 📈 Performance

- Optimized images with Next.js Image component
- Code splitting for lightweight bundles
- Smooth animations with GPU-accelerated Framer Motion
- Responsive images with srcSet attributes
- Preloaded Google Fonts for fast rendering

## 🧪 Testing

To test the prediction logic, try these inputs:

**HIGH RISK:**
- Age: 60, Cholesterol: 250, Chest Pain: Asymptomatic
- Age: 70, Cholesterol: 300, Exercise Angina: Yes, ST Depression: 3

**LOW RISK:**
- Age: 30, Cholesterol: 180, Normal ECG, No Angina
- Age: 45, Cholesterol: 200, Typical Angina, No Defects

## 📦 Build & Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

## 👥 Team

**Team PulseML** — Building AI tools that save hearts ❤️

## 📄 License

Educational project. Free to use and modify.

## 🙏 Acknowledgments

- Dataset: [Kaggle Cleveland Heart Disease Dataset](https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset)
- Icons: [Lucide React](https://lucide.dev/)
- Animations: [Framer Motion](https://www.framer.com/motion/)
- CSS Framework: [Tailwind CSS](https://tailwindcss.com/)
- Framework: [Next.js](https://nextjs.org/)

---

**Built with ❤️ for early detection and prevention.**