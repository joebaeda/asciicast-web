'use client';

import React, { useEffect, useState } from 'react';
  
const InstallPWA = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault(); // Prevent the automatic prompt
      setDeferredPrompt(e); // Save the event for later use
      setModalVisible(true); // Show the custom modal
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt(); // Show the install prompt
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('user accepted the PWA install prompt');
      } else {
        console.log('user dismissed the PWA install prompt');
      }

      setDeferredPrompt(null);
      setModalVisible(false);
    }
  };

  return (
    <>
      {isModalVisible && (
        <div className="fixed p-4 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-[384px] bg-[#1f1f1f] rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">install asciicast app</h2>
            <p className="text-gray-700 mb-6">
              install asciicast app for quick and easy access directly from your home screen.
            </p>
            <div className="w-full flex justify-center items-center space-x-2">
              <button
                className="w-full bg-gray-300 px-4 py-2 rounded-xl hover:bg-gray-400"
                onClick={() => setModalVisible(false)}
              >
                cancel
              </button>
              <button
                className="w-full bg-pink-900 text-white px-4 py-2 rounded-xl hover:bg-pink-950"
                onClick={handleInstallClick}
              >
                install
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPWA;
