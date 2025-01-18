'use client';

import { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters and spaces';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus('loading');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-extrabold text-text-light dark:text-text-dark tracking-tight sm:text-4xl">
          Contact Us
        </h2>
        <p className="mt-4 text-text-light/80 dark:text-text-dark/80">
          We'd love to hear from you. Please fill out the form below or reach out
          via the contact information provided.
        </p>
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text-light dark:text-text-dark"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-500' : 'border-card-light dark:border-card-dark'
                  } rounded-md shadow-sm placeholder-text-light/50 dark:placeholder-text-dark/50 focus:outline-none focus:ring-primary-accent focus:border-primary-accent sm:text-sm`}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-light dark:text-text-dark"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-card-light dark:border-card-dark'
                  } rounded-md shadow-sm placeholder-text-light/50 dark:placeholder-text-dark/50 focus:outline-none focus:ring-primary-accent focus:border-primary-accent sm:text-sm`}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-text-light dark:text-text-dark"
              >
                Message
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.message ? 'border-red-500' : 'border-card-light dark:border-card-dark'
                  } rounded-md shadow-sm placeholder-text-light/50 dark:placeholder-text-dark/50 focus:outline-none focus:ring-primary-accent focus:border-primary-accent sm:text-sm`}
                  required
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-accent hover:bg-secondary-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
              {status === 'success' && (
                <p className="mt-2 text-sm text-green-500 text-center" role="alert">
                  Thank you for contacting us! We will get back to you shortly.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-2 text-sm text-red-500 text-center" role="alert">
                  Oops! Something went wrong. Please try again later.
                </p>
              )}
            </div>
          </form>
        </div>
        <div className="mt-12 border-t border-card-light dark:border-card-dark pt-6">
          <h3 className="text-lg font-medium text-text-light dark:text-text-dark">
            Other ways to reach us:
          </h3>
          <div className="mt-4 space-y-2">
            <p className="text-text-light/80 dark:text-text-dark/80">
              Email us at <a href="mailto:support@eshop.com" className="text-link-light dark:text-link-dark hover:underline">support@eshop.com</a>
            </p>
            <p className="text-text-light/80 dark:text-text-dark/80">Call us at +1-555-123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
