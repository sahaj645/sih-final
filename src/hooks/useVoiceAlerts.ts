import { useState, useCallback, useRef } from 'react';
import { VoiceSettings, Language, Alert } from '@/types';

const languageVoices: Record<Language, string[]> = {
  en: ['en-US', 'en-GB', 'en-AU'],
  hi: ['hi-IN'],
  bn: ['bn-IN', 'bn-BD'], 
  as: ['as-IN'],
  mni: ['mni-IN'],
  grt: ['grt-IN'],
  lus: ['lus-IN'],
  kha: ['kha-IN'],
  nag: ['nag-IN'],
  kok: ['kok-IN'],
  sat: ['sat-IN'],
  bod: ['bod-IN'],
};

const translations = {
  en: {
    alert: 'Alert',
    warning: 'Warning',
    critical: 'Critical Alert',
    contamination: 'Water contamination detected',
    emergency: 'Emergency situation detected',
    system: 'System notification',
    maintenance: 'Maintenance required',
  },
  hi: {
    alert: 'चेतावनी',
    warning: 'सावधान',
    critical: 'महत्वपूर्ण चेतावनी',
    contamination: 'पानी में संदूषण का पता चला',
    emergency: 'आपातकालीन स्थिति का पता चला',
    system: 'सिस्टम सूचना',
    maintenance: 'रखरखाव आवश्यक',
  },
  bn: {
    alert: 'সতর্কতা',
    warning: 'সাবধান',
    critical: 'জরুরি সতর্কতা',
    contamination: 'পানিতে দূষণ সনাক্ত করা হয়েছে',
    emergency: 'জরুরি পরিস্থিতি সনাক্ত করা হয়েছে',
    system: 'সিস্টেম বিজ্ঞপ্তি',
    maintenance: 'রক্ষণাবেক্ষণ প্রয়োজন',
  },
  as: {
    alert: 'সতৰ্কবাণী',
    warning: 'সাৱধান',
    critical: 'জৰুৰী সতৰ্কবাণী',
    contamination: 'পানীত দূষণ চিনাক্ত কৰা হৈছে',
    emergency: 'জৰুৰী পৰিস্থিতি চিনাক্ত কৰা হৈছে',
    system: 'ছিষ্টেম জাননী',
    maintenance: 'ৰক্ষণাবেক্ষণৰ প্ৰয়োজন',
  },
  mni: {
    alert: 'চেকশিন্নবা',
    warning: 'চেকশিল্লু',
    critical: 'অশেংবা চেকশিন্নবা',
    contamination: 'ইশিংদা মৈরাং খংবা ফংখ্রে',
    emergency: 'খুদোংচাবা মতম ফংখ্রে',
    system: 'সিস্টেমগী পাউদম',
    maintenance: 'য়েংশিন্নবা মতৌ',
  },
  grt: {
    alert: 'চিমানো',
    warning: 'চিবিলানি',
    critical: 'গিসিক চিমানো',
    contamination: 'চিদাবে অসুগিপা দং',
    emergency: 'বিআ মান্দিয়া',
    system: 'সিস্টেমনি খবর',
    maintenance: 'গেজেরানি দরকার',
  },
  lus: {
    alert: 'Hriattirna',
    warning: 'Fimkhur rawh',
    critical: 'Harsattak hriattirna',
    contamination: 'Tui bawlhhlawh hmuh a ni',
    emergency: 'Harsat dinhmun a awm',
    system: 'System hriat tirna',
    maintenance: 'Enkawl a ngai',
  },
  kha: {
    alert: 'Ka jingpyrkhat',
    warning: 'Sngewbha',
    critical: 'Ka jingpyrkhat bha mynta',
    contamination: 'Ka jingbaw um ha ka doh',
    emergency: 'Ka jinghikai bad kwah a jop',
    system: 'System ka jingpyrkhat',
    maintenance: 'Ka jingsngew a ngai',
  },
  nag: {
    alert: 'Chekiba',
    warning: 'Chenba',
    critical: 'Agi chekiba',
    contamination: 'Tizu raimon ase',
    emergency: 'Bisi manu ase',
    system: 'System khabur',
    maintenance: 'Saikiba lagibo',
  },
  kok: {
    alert: 'Khobor',
    warning: 'Saikolo',
    critical: 'Bohu mukhya khobor',
    contamination: 'Panit mail lagi ase',
    emergency: 'Joldi somoy ase',
    system: 'System khobor',
    maintenance: 'Rakhiba lagibo',
  },
  sat: {
    alert: 'Sarkauti',
    warning: 'Hoshiyar',
    critical: 'Ahuri sarkauti',
    contamination: 'Dak me ganda mila',
    emergency: 'Jhapat hala',
    system: 'System katha',
    maintenance: 'Sambhal lagao',
  },
  bod: {
    alert: 'ཐུགས་རྒྱུད།',
    warning: 'གསལ་པོ།',
    critical: 'གནད་ཆེན་པོ།',
    contamination: 'ཆུ་དག་མ་འདུག',
    emergency: 'གློ་བུར་གནས་སྟངས།',
    system: 'རིམ་ལུགས་གནས་ཚུལ།',
    maintenance: 'བསྲུང་སྐྱོབ་དགོས།',
  },
};

// ElevenLabs API function
const callElevenLabsAPI = async (text: string, voiceId: string, apiKey: string): Promise<void> => {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.5,
          use_speaker_boost: true
        }
      })
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
    }
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
  }
};

export const useVoiceAlerts = () => {
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: true,
    language: 'en',
    rate: 1,
    pitch: 1,
    volume: 0.8,
    useElevenLabs: false,
  });

  const [isSupported] = useState(() => 'speechSynthesis' in window);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const getAvailableVoices = useCallback((): SpeechSynthesisVoice[] => {
    if (!isSupported) return [];
    return speechSynthesis.getVoices();
  }, [isSupported]);

  const getBestVoice = useCallback((language: Language): SpeechSynthesisVoice | null => {
    const voices = getAvailableVoices();
    const preferredLangs = languageVoices[language];
    
    for (const lang of preferredLangs) {
      const voice = voices.find(v => v.lang.startsWith(lang));
      if (voice) return voice;
    }
    
    // Fallback to any voice for the language family
    return voices.find(v => v.lang.startsWith(language)) || null;
  }, [getAvailableVoices]);

  const speak = useCallback(async (text: string, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
    if (!settings.enabled) return;

    // Stop current speech for high priority alerts
    if (priority === 'critical' || priority === 'high') {
      speechSynthesis.cancel();
    }

    // Use ElevenLabs if configured
    if (settings.useElevenLabs && settings.elevenLabsApiKey && settings.elevenLabsVoiceId) {
      setIsSpeaking(true);
      try {
        await callElevenLabsAPI(text, settings.elevenLabsVoiceId, settings.elevenLabsApiKey);
      } finally {
        setIsSpeaking(false);
      }
      return;
    }

    // Fallback to browser speech synthesis
    if (!isSupported) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestVoice(settings.language);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      currentUtterance.current = null;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      currentUtterance.current = null;
    };

    currentUtterance.current = utterance;
    speechSynthesis.speak(utterance);
  }, [isSupported, settings, getBestVoice]);

  const speakAlert = useCallback((alert: Alert) => {
    if (!settings.enabled) return;

    const translations_lang = translations[settings.language];
    let message = '';

    // Build the message based on alert type and severity
    switch (alert.severity) {
      case 'critical':
        message = `${translations_lang.critical}. `;
        break;
      case 'high':
        message = `${translations_lang.warning}. `;
        break;
      default:
        message = `${translations_lang.alert}. `;
        break;
    }

    // Add alert type specific message
    switch (alert.type) {
      case 'contamination':
        message += translations_lang.contamination;
        break;
      case 'emergency':
        message += translations_lang.emergency;
        break;
      case 'system':
        message += translations_lang.system;
        break;
      case 'maintenance':
        message += translations_lang.maintenance;
        break;
    }

    speak(message, alert.severity);
  }, [speak, settings.enabled, settings.language]);

  const testVoice = useCallback(() => {
    const translations_lang = translations[settings.language];
    speak(`${translations_lang.alert}. Test message.`, 'medium');
  }, [speak, settings.language]);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    currentUtterance.current = null;
  }, []);

  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Auto-set ElevenLabs voice ID when language changes
      if (newSettings.language && updated.useElevenLabs) {
        const languageVoiceMap: Record<Language, string> = {
          en: 'EXAVITQu4vr4xnSDxMaL', // Sarah
          hi: 'pFZP5JQG7iQjIQuC4Bku', // Lily  
          bn: 'cgSgspJ2msm6clMCkdW9', // Jessica
          as: 'N2lVS1w4EtoT3dr4eOWO', // Callum
          mni: 'SAz9YHcvj6GT2YYXdXww', // River
          grt: 'TX3LPaxmHKxFdv7VOQHJ', // Liam
          lus: 'XB0fDUnXU5powFXDhCwa', // Charlotte
          kha: 'Xb7hH8MSUJpSbSDYk0k2', // Alice
          nag: 'bIHbv24MWmeRgasZH58o', // Will
          kok: 'iP95p4xoKVk53GoZ742B', // Chris
          sat: 'nPczCjzI2devNBz1zQrb', // Brian
          bod: 'onwK4e9ZLuTAKqWW03F9', // Daniel
        };
        
        updated.elevenLabsVoiceId = languageVoiceMap[newSettings.language];
      }
      
      return updated;
    });
  }, []);

  return {
    settings,
    updateSettings,
    speak,
    speakAlert,
    testVoice,
    stopSpeaking,
    isSpeaking,
    isSupported,
    getAvailableVoices,
    getBestVoice,
  };
};