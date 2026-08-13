import React, { useRef, useState } from 'react';
import { Camera, AlertCircle, CheckCircle2, ChevronRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { extractPrescription } from '../lib/api';
import { AIExtractedMedicine } from '../types';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

import { generateId } from '../lib/utils';

export default function Scanner() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedMeds, setExtractedMeds] = useState<AIExtractedMedicine[] | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  
  const { addPrescription, activeProfileId, language } = useAppContext();
  const navigate = useNavigate();

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImage(base64);
      processImage(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64: string, mimeType: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await extractPrescription(base64, mimeType, language);
      setExtractedMeds(result.medicines);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze the prescription.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!extractedMeds || !activeProfileId) { console.error("Cannot save:", { extractedMeds, activeProfileId }); return; }

    const fullMeds = extractedMeds.map(m => ({
      ...m,
      id: generateId(),
      startDate: new Date().toISOString(),
    }));

    addPrescription({
      profileId: activeProfileId,
      medicines: fullMeds,
      imageUrl: undefined,
    });

    navigate('/'); 
  };

  const t = {
    verify: language === 'en' ? 'Verify these details' : language === 'hi' ? 'इन विवरणों को सत्यापित करें' : language === 'ur' ? 'ان تفصیلات کی تصدیق کریں' : 'এই তথ্যগুলো যাচাই করুন',
    verifyDesc: language === 'en' ? 'AI can make mistakes. Please check the extracted medicines against your physical prescription before saving.' : language === 'hi' ? 'एआई गलतियाँ कर सकता है। कृपया सहेजने से पहले अपने भौतिक पर्चे के खिलाफ निकाली गई दवाओं की जांच करें।' : language === 'ur' ? 'اے آئی غلطیاں کر سکتا ہے۔ براہ کرم محفوظ کرنے سے پہلے اپنے جسمانی نسخے کے خلاف نکالی گئی ادویات کی جانچ کریں۔' : 'এআই ভুল করতে পারে। সেভ করার আগে আপনার মূল প্রেসক্রিপশনের সাথে ওষুধগুলো মিলিয়ে নিন।',
    extractedMeds: language === 'en' ? 'Extracted Medicines' : language === 'hi' ? 'निकाली गई दवाएं' : language === 'ur' ? 'نکالی گئی ادویات' : 'উদ্ধারকৃত ওষুধসমূহ',
    lowConf: language === 'en' ? 'Low Confidence' : language === 'hi' ? 'कम आत्मविश्वास' : language === 'ur' ? 'کم اعتماد' : 'কম আত্মবিশ্বাস',
    freqRaw: language === 'en' ? 'Frequency (Raw):' : language === 'hi' ? 'आवृत्ति (मूल):' : language === 'ur' ? 'تعدد (خام):' : 'খাওয়ার নিয়ম (মূল):',
    simply: language === 'en' ? 'Simply:' : language === 'hi' ? 'सरलता से:' : language === 'ur' ? 'آسانی سے:' : 'সহজভাবে:',
    instructions: language === 'en' ? 'Instructions:' : language === 'hi' ? 'निर्देश:' : language === 'ur' ? 'ہدایات:' : 'নির্দেশনা:',
    duration: language === 'en' ? 'Duration:' : language === 'hi' ? 'अवधि:' : language === 'ur' ? 'مدت:' : 'মেয়াদ:',
    continuous: language === 'en' ? 'Continuous' : language === 'hi' ? 'निरंतर' : language === 'ur' ? 'مسلسل' : 'চলবে',
    days: language === 'en' ? 'days' : language === 'hi' ? 'दिन' : language === 'ur' ? 'دن' : 'দিন',
    save: language === 'en' ? 'Save to Tracker' : language === 'hi' ? 'ट्रैकर में सेव करें' : language === 'ur' ? 'ٹریکر میں محفوظ کریں' : 'ট্র্যাকারে সেভ করুন',
    scanTitle: language === 'en' ? 'Scan Prescription' : language === 'hi' ? 'पर्चा स्कैन करें' : language === 'ur' ? 'نسخہ اسکین کریں' : 'প্রেসক্রিপশন স্ক্যান করুন',
    scanDesc: language === 'en' ? "Take a photo of your prescription, and we'll extract the medicines and schedule them for you." : language === 'hi' ? 'अपने पर्चे की एक तस्वीर लें, और हम दवाएं निकाल लेंगे और उन्हें आपके रूटीन में शामिल कर देंगे।' : language === 'ur' ? 'اپنے نسخے کی تصویر لیں، اور ہم دوائیں نکال کر انہیں آپ کے شیڈول میں شامل کر دیں گے۔' : 'আপনার প্রেসক্রিপশনের একটি ছবি তুলুন, আর আমরা ওষুধগুলো বের করে আপনার রুটিনে যোগ করে দেব।',
    analyzing: language === 'en' ? 'Analyzing Image...' : language === 'hi' ? 'छवि का विश्लेषण हो रहा है...' : language === 'ur' ? 'تصویر کا تجزیہ ہو رہا ہے...' : 'ছবি বিশ্লেষণ করা হচ্ছে...',
    openCam: language === 'en' ? 'Open Camera' : language === 'hi' ? 'कैमरा खोलें' : language === 'ur' ? 'کیمرہ کھولیں' : 'ক্যামেরা খুলুন',
    openGallery: language === 'en' ? 'Open Gallery' : language === 'hi' ? 'गैलरी खोलें' : language === 'ur' ? 'گیلری کھولیں' : 'গ্যালারি খুলুন',
    ensureLit: language === 'en' ? 'Ensure the image is well-lit and the text is clearly visible for best results.' : language === 'hi' ? 'सर्वोत्तम परिणामों के लिए सुनिश्चित करें कि छवि में पर्याप्त प्रकाश है और पाठ स्पष्ट रूप से दिखाई दे रहा है।' : language === 'ur' ? 'بہترین نتائج کے لیے یقینی بنائیں کہ تصویر اچھی طرح سے روشن ہے اور متن واضح طور پر نظر آ رہا ہے۔' : 'ভালো ফলাফলের জন্য নিশ্চিত করুন ছবিতে পর্যাপ্ত আলো আছে এবং লেখা স্পষ্ট।',
  };

  if (extractedMeds) {
    return (
      <div className="p-4 pt-6 animate-in slide-in-from-bottom-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 p-4 rounded-xl flex gap-3 mb-6 items-start transition-colors">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <div className="text-sm">
            <p className="font-semibold mb-1 text-indigo-900 dark:text-indigo-200">{t.verify}</p>
            <p className="text-indigo-700 dark:text-indigo-300">{t.verifyDesc}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">{t.extractedMeds}</h2>
        
        <div className="space-y-4 mb-24">
          {extractedMeds.map((med, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{med.name} <span className="text-slate-500 dark:text-slate-400 font-normal text-sm">{med.dosage}</span></h3>
                {med.confidence < 80 ? (
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-full">{t.lowConf}</span>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {med.confidence}%
                  </span>
                )}
              </div>
              <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300 mt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">{t.freqRaw}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{med.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">{t.simply}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{med.simplifiedFrequency}</span>
                </div>
                {(med.instructions && med.instructions.toLowerCase() !== med.simplifiedFrequency.toLowerCase()) && (
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">{t.instructions}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{med.instructions}</span>
                </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">{t.duration}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{med.durationDays === -1 ? t.continuous : `${med.durationDays} ${t.days}`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 transition-colors">
          <button 
            onClick={handleConfirm}
            className="w-full max-w-md mx-auto flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-3.5 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            {t.save} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
        <Camera className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">{t.scanTitle}</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
        {t.scanDesc}
      </p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 text-sm flex gap-2 items-center">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-left">{error}</p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={cameraInputRef}
        onChange={handleImageCapture}
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={galleryInputRef}
        onChange={handleImageCapture}
      />
      <div className="w-full max-w-xs space-y-3">
        {loading ? (
          <div className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-4 rounded-xl opacity-70">
            <Loader2 className="w-5 h-5 animate-spin" />
            {t.analyzing}
          </div>
        ) : (
          <>
            <button
              disabled={loading}
              onClick={() => cameraInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70"
            >
              <Camera className="w-5 h-5" />
              {t.openCam}
            </button>
            <button
              disabled={loading}
              onClick={() => galleryInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-100 dark:border-slate-700 font-medium py-4 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-70"
            >
              <ImageIcon className="w-5 h-5" />
              {t.openGallery}
            </button>
          </>
        )}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-6 max-w-xs">
        {t.ensureLit}
      </p>
    </div>
  );
}
