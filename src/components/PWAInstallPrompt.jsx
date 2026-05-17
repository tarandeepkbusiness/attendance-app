import React, { useState, useEffect } from 'react';

function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) {
      return;
    }

    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    // If iOS, show standard tip
    if (ios) {
      const dismissed = localStorage.getItem('pwa_ios_prompt_dismissed');
      if (!dismissed) {
        // Show after 4 seconds of activity
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 4000);
        return () => clearTimeout(timer);
      }
    }

    // Standard Android/Chrome installation event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      // Store event so it can be triggered later
      setDeferredPrompt(e);
      
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Handle installed event
    const handleAppInstalled = () => {
      console.log('PWA installed successfully!');
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the browser install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    // Clear deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('pwa_ios_prompt_dismissed', 'true');
    } else {
      localStorage.setItem('pwa_prompt_dismissed', 'true');
    }
  };

  if (!showPrompt) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '400px',
      borderRadius: 'var(--border-radius-md)',
      boxShadow: 'var(--shadow-lg)',
      border: '2px solid var(--secondary-color)',
      padding: '1.25rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
    }}>
      <style>
        {`
          @keyframes slideUp {
            from { opacity: 0; transform: translate(-50%, 40px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `}
      </style>
      
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <img 
          src="/logo.png" 
          alt="App Icon" 
          style={{ width: '48px', height: '48px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', objectFit: 'cover' }}
          onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }}
        />
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-color)' }}>
            Attendance App
          </h4>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'rgba(128, 90, 64, 0.8)', lineHeight: 1.4 }}>
            {isIOS 
              ? "Install the app on your home screen for quick offline registration in crowded events."
              : "Install our app for offline usage and quick home screen access."
            }
          </p>
        </div>
        <button 
          onClick={handleDismiss}
          style={{ 
            color: 'rgba(128, 90, 64, 0.5)', 
            fontSize: '1.5rem', 
            padding: '4px',
            lineHeight: 1,
            cursor: 'pointer',
            border: 'none',
            background: 'none'
          }}
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      {isIOS ? (
        <div style={{ 
          fontSize: '0.8rem', 
          color: 'var(--text-color)', 
          backgroundColor: 'rgba(212, 175, 55, 0.08)',
          padding: '0.75rem',
          borderRadius: 'var(--border-radius-sm)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          lineHeight: 1.4
        }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>⎋</span>
          <span>
            Tap the <strong>Share</strong> button in Safari, then select <strong>'Add to Home Screen'</strong>.
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={handleDismiss}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: 'var(--border-radius-lg)',
              border: '1px solid rgba(128, 90, 64, 0.2)',
              color: 'var(--text-color)',
              fontWeight: 500,
              fontSize: '0.9rem',
              textAlign: 'center',
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}
          >
            Later
          </button>
          <button 
            onClick={handleInstallClick}
            style={{
              flex: 2,
              padding: '0.75rem',
              borderRadius: 'var(--border-radius-lg)',
              backgroundColor: 'var(--secondary-color)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.9rem',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(212, 175, 55, 0.3)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Install App
          </button>
        </div>
      )}
    </div>
  );
}

export default PWAInstallPrompt;
