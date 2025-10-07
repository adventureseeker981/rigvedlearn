// Web Speech API utilities for Sanskrit pronunciation

export const speakSanskrit = (text, options = {}) => {
  if (!window.speechSynthesis) {
    console.warn('Speech synthesis not supported in this browser');
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Configure voice settings for Sanskrit
  utterance.lang = options.lang || 'hi-IN'; // Hindi voice is closest to Sanskrit
  utterance.rate = options.rate || 0.7; // Slower for learning
  utterance.pitch = options.pitch || 1.0;
  utterance.volume = options.volume || 1.0;

  // Try to find a suitable voice
  const voices = window.speechSynthesis.getVoices();
  const hindiVoice = voices.find(voice => voice.lang.startsWith('hi')) || 
                     voices.find(voice => voice.lang.startsWith('en-IN')) ||
                     voices[0];
  
  if (hindiVoice) {
    utterance.voice = hindiVoice;
  }

  // Event callbacks
  if (options.onStart) {
    utterance.onstart = options.onStart;
  }
  
  if (options.onEnd) {
    utterance.onend = options.onEnd;
  }
  
  if (options.onError) {
    utterance.onerror = options.onError;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
};

export const stopSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

export const pauseSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.pause();
  }
};

export const resumeSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.resume();
  }
};

export const getAvailableVoices = () => {
  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
    }
  });
};