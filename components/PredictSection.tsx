'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import ResultCard from './ResultCard';
import { predictHeartRisk } from '@/lib/api';
import type { PatientData as PatientDataType } from '@/lib/types';

interface FormData {
  age: string;
  sex: string;
  cp: string;
  trestbps: string;
  chol: string;
  fbs: string;
  restecg: string;
  thalach: string;
  exang: string;
  oldpeak: string;
  slope: string;
  ca: string;
  thal: string;
}

interface DisplayResult {
  risk: 'high' | 'low';
  probability: number;
}

interface ValidationError {
  field: string;
  message: string;
}

export default function PredictSection() {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DisplayResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const fieldConfigs = [
    { key: 'age', label: 'Age', type: 'number', min: 18, max: 120, required: true },
    { key: 'sex', label: 'Sex', type: 'select', options: [{ value: '0', label: 'Female' }, { value: '1', label: 'Male' }], required: true },
    { key: 'cp', label: 'Chest Pain Type', type: 'select', options: [
      { value: '0', label: 'Typical Angina' },
      { value: '1', label: 'Atypical Angina' },
      { value: '2', label: 'Non-anginal Pain' },
      { value: '3', label: 'Asymptomatic' }
    ], required: true },
    { key: 'trestbps', label: 'Resting BP (mmHg)', type: 'number', min: 80, max: 200, required: true },
    { key: 'chol', label: 'Cholesterol (mg/dl)', type: 'number', min: 100, max: 400, required: true },
    { key: 'fbs', label: 'Fasting Blood Sugar > 120', type: 'select', options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }], required: true },
    { key: 'restecg', label: 'Resting ECG', type: 'select', options: [
      { value: '0', label: 'Normal' },
      { value: '1', label: 'ST Abnormality' },
      { value: '2', label: 'LV Hypertrophy' }
    ], required: true },
    { key: 'thalach', label: 'Max Heart Rate', type: 'number', min: 60, max: 220, required: true },
    { key: 'exang', label: 'Exercise Induced Angina', type: 'select', options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }], required: true },
    { key: 'oldpeak', label: 'ST Depression', type: 'number', min: 0, max: 10, step: 0.1, required: true },
    { key: 'slope', label: 'ST Slope', type: 'select', options: [
      { value: '1', label: 'Upsloping' },
      { value: '2', label: 'Flat' },
      { value: '3', label: 'Downsloping' }
    ], required: true },
    { key: 'ca', label: 'Major Vessels Count', type: 'select', options: [
      { value: '0', label: '0' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' }
    ], required: true },
    { key: 'thal', label: 'Thalassemia', type: 'select', options: [
      { value: '3', label: 'Normal' },
      { value: '6', label: 'Fixed Defect' },
      { value: '7', label: 'Reversible Defect' }
    ], required: true },
  ];

  const validateForm = (): boolean => {
    const errors: ValidationError[] = [];

    fieldConfigs.forEach((config) => {
      const value = formData[config.key as keyof FormData];
      
      if (!value) {
        errors.push({ field: config.key, message: `${config.label} is required` });
        return;
      }

      if (config.type === 'number') {
        const numValue = parseFloat(value);
        const min = config.min as number;
        const max = config.max as number;

        if (isNaN(numValue)) {
          errors.push({ field: config.key, message: `${config.label} must be a number` });
        } else if (numValue < min || numValue > max) {
          errors.push({ field: config.key, message: `${config.label} must be between ${min} and ${max}` });
        }
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValidationErrors((prev) => prev.filter((err) => err.field !== name));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      const numericData: PatientDataType = {
        age: parseFloat(formData.age),
        sex: parseFloat(formData.sex),
        cp: parseFloat(formData.cp),
        trestbps: parseFloat(formData.trestbps),
        chol: parseFloat(formData.chol),
        fbs: parseFloat(formData.fbs),
        restecg: parseFloat(formData.restecg),
        thalach: parseFloat(formData.thalach),
        exang: parseFloat(formData.exang),
        oldpeak: parseFloat(formData.oldpeak),
        slope: parseFloat(formData.slope),
        ca: parseFloat(formData.ca),
        thal: parseFloat(formData.thal),
      };

      const data = await predictHeartRisk(numericData);
      setResult({
        risk: data.risk_level,
        probability: data.probability,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReanalyze = () => {
    setResult(null);
    setFormData({
      age: '',
      sex: '',
      cp: '',
      trestbps: '',
      chol: '',
      fbs: '',
      restecg: '',
      thalach: '',
      exang: '',
      oldpeak: '',
      slope: '',
      ca: '',
      thal: '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (result) {
    return (
      <div ref={resultRef}>
        <ResultCard result={result} onReanalyze={handleReanalyze} />
      </div>
    );
  }

  return (
    <section id="predict" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-bg-section to-bg-main relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 right-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold gradient-text font-playfair">
              Risk Assessment
            </h2>
          </div>
          <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            Enter patient data to predict heart disease risk using our trained ML model
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="card-dark backdrop-blur-sm bg-gradient-to-br from-bg-card to-bg-section"
        >
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-danger/20 border border-danger rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              <p className="text-danger">
                {apiError}
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {fieldConfigs.map((config, index) => {
              const error = validationErrors.find((err) => err.field === config.key);
              const value = formData[config.key as keyof FormData];

              return (
                <motion.div
                  key={config.key}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <label
                    htmlFor={config.key}
                    className="block text-sm font-semibold text-text-main mb-2"
                  >
                    {config.label}
                  </label>
                  {config.type === 'select' ? (
                    <select
                      id={config.key}
                      name={config.key}
                      value={value}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all bg-bg-main text-text-main placeholder-text-muted focus:outline-none ${
                        error
                          ? 'border-danger focus:ring-2 focus:ring-danger/50'
                          : 'border-border hover:border-primary/50 focus:ring-2 focus:ring-primary/30 focus:border-primary'
                      }`}
                    >
                      <option value="">Select {config.label.toLowerCase()}</option>
                      {(config.options || []).map((option: any) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={config.key}
                      type={config.type}
                      name={config.key}
                      value={value}
                      onChange={handleChange}
                      min={(config as any).min}
                      max={(config as any).max}
                      step={(config as any).step || 1}
                      placeholder={`Enter ${config.label.toLowerCase()}`}
                      className={`w-full px-4 py-3 rounded-lg border transition-all bg-bg-main text-text-main placeholder-text-muted focus:outline-none ${
                        error
                          ? 'border-danger focus:ring-2 focus:ring-danger/50'
                          : 'border-border hover:border-primary/50 focus:ring-2 focus:ring-primary/30 focus:border-primary'
                      }`}
                    />
                  )}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-danger"
                    >
                      {error.message}
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Get Prediction
              </>
            )}
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-accent-alt/10 border border-primary/30 rounded-lg backdrop-blur-sm"
        >
          <p className="text-sm text-text-muted leading-relaxed">
            <strong className="text-primary">📊 Model Information:</strong> This prediction is based on a Logistic Regression model trained on the Cleveland Heart Disease dataset
            (303 patients, 13 clinical features) with approximately 85% accuracy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
