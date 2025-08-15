import { useState } from 'react';

interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: boolean;
  [key: string]: string | boolean | undefined;
}

export function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (
    name: string,
    value: string,
    confirmValue?: string,
  ) => {
    let error = '';

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          error = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters long';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== confirmValue) {
          error = 'Passwords do not match';
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === '';
  };

  const validateForm = (formData: FormData, isSignup = false) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Common validation
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    // Signup-specific validation
    if (isSignup) {
      if (!formData.firstName?.trim()) {
        newErrors.firstName = 'First name is required';
        isValid = false;
      }

      if (!formData.lastName?.trim()) {
        newErrors.lastName = 'Last name is required';
        isValid = false;
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }

      if (!formData.agreeToTerms) {
        newErrors.terms =
          'You must agree to the Terms of Service and Privacy Policy';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const clearErrors = () => setErrors({});

  return { errors, validateField, validateForm, clearErrors };
}
