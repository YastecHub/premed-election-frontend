import { VALIDATION } from '../constants';

export const validateMatricNumber = (matricNumber: string): boolean => {
  return VALIDATION.MATRIC_NUMBER.PATTERN.test(matricNumber);
};

export const validateEmail = (email: string): boolean => {
  return VALIDATION.EMAIL.PATTERN.test(email);
};

export const formatMatricNumber = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const formatAccessCode = (value: string): string => {
  return value.toUpperCase();
};

export const getStepStatus = (currentStep: string, targetStep: string): 'current' | 'complete' | 'upcoming' => {
  if (currentStep === targetStep) return 'current';
  
  const steps = ['register', 'verify', 'vote'];
  const currentIndex = steps.indexOf(currentStep);
  const targetIndex = steps.indexOf(targetStep);
  
  return currentIndex > targetIndex ? 'complete' : 'upcoming';
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};