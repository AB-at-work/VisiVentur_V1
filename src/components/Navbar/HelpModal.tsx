'use client';

import { useRef, useEffect } from 'react';
import { useNavbarStore } from './store';
import { cn } from '@/lib/utils';

export default function HelpModal() {
  const { isHelpModalOpen, setIsHelpModalOpen } = useNavbarStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (isHelpModalOpen) {
      // Focus the close button when modal opens
      closeButtonRef.current?.focus();
      
      // Trap focus within modal
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;
        
        if (!focusableElements.length) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      
      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isHelpModalOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isHelpModalOpen) {
        setIsHelpModalOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isHelpModalOpen, setIsHelpModalOpen]);

  if (!isHelpModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsHelpModalOpen(false)}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className={cn(
            'relative w-full max-w-md rounded-2xl bg-background shadow-xl',
            'border border-gray-200 dark:border-gray-700'
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 id="help-modal-title" className="text-lg font-semibold text-foreground">
              Help & Support
            </h2>
            <button
              ref={closeButtonRef}
              onClick={() => setIsHelpModalOpen(false)}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2"
              aria-label="Close help modal"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-4">
            {/* FAQ Section */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-foreground">Frequently Asked Questions</h3>
              <div className="space-y-2">
                <details className="group">
                  <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 rounded">
                    How do I change my currency?
                  </summary>
                  <p className="mt-2 pl-4 text-sm text-gray-600 dark:text-gray-400">
                    Use the currency selector in the navigation bar to switch between INR, USD, EUR, and GBP.
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 rounded">
                    What payment methods are supported?
                  </summary>
                  <p className="mt-2 pl-4 text-sm text-gray-600 dark:text-gray-400">
                    We support Razorpay for INR payments and Stripe for USD, EUR, and GBP payments.
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 rounded">
                    How do I contact support?
                  </summary>
                  <p className="mt-2 pl-4 text-sm text-gray-600 dark:text-gray-400">
                    Use the contact options below to reach our support team.
                  </p>
                </details>
              </div>
            </div>
            
            {/* Contact Options */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">Contact Us</h3>
              
              <a
                href="mailto:support@visiventur.com"
                className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2"
              >
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="text-sm font-medium text-foreground">Email Support</div>
                  <div className="text-xs text-gray-500">support@visiventur.com</div>
                </div>
              </a>
              
              <a
                href="https://twitter.com/visiventur"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2"
              >
                <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                <div>
                  <div className="text-sm font-medium text-foreground">Twitter</div>
                  <div className="text-xs text-gray-500">@visiventur</div>
                </div>
              </a>
              
              <button
                className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3 w-full transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2"
                onClick={() => {
                  // Placeholder for AI chat functionality
                  alert('AI Chat feature coming soon!');
                }}
              >
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div className="text-left">
                  <div className="text-sm font-medium text-foreground">Chat with AI</div>
                  <div className="text-xs text-gray-500">Get instant help</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}