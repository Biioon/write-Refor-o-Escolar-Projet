// Input validation and sanitization utilities

export const sanitizeText = (text: string): string => {
  // Basic XSS protection - remove HTML tags and dangerous characters
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: "A senha deve ter pelo menos 8 caracteres" };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: "A senha deve conter pelo menos uma letra minúscula" };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: "A senha deve conter pelo menos uma letra maiúscula" };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: "A senha deve conter pelo menos um número" };
  }
  
  return { valid: true };
};

export const validateTextLength = (text: string, maxLength: number = 5000): boolean => {
  return text.trim().length > 0 && text.length <= maxLength;
};

export const sanitizeNote = (content: string): string => {
  // More permissive sanitization for notes but still safe
  return content
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};