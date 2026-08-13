import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';

function pcmToBase64(pcmData: Float32Array) {
  const buffer = new ArrayBuffer(pcmData.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < pcmData.length; i++) {
    let s = Math.max(-1, Math.min(1, pcmData[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return window.btoa(binary);
}

export default function VoiceAssistant() {
  const { activeProfileId, prescriptions, doseLogs, language } = useAppContext();
  
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  const playAudioChunk = useCallback((base64Audio: string) => {
    if (!outputAudioCtxRef.current) return;
    const audioCtx = outputAudioCtxRef.current;
    
    const binaryString = window.atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const float32Data = new Float32Array(bytes.length / 2);
    const dataView = new DataView(bytes.buffer);
    for (let i = 0; i < float32Data.length; i++) {
      float32Data[i] = dataView.getInt16(i * 2, true) / 0x8000;
    }
    
    const audioBuffer = audioCtx.createBuffer(1, float32Data.length, 24000);
    audioBuffer.getChannelData(0).set(float32Data);
    
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    
    const currentTime = audioCtx.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime + 0.05;
    }
    
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += audioBuffer.duration;
  }, []);

  const stopAssistant = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
  }, []);

  const startAssistant = useCallback(async () => {
    setIsConnecting(true);
    try {
      const activePrescriptions = (prescriptions || []).filter(p => p.profileId === activeProfileId);
      const activeLogs = (doseLogs || []).filter(log => log.date === format(new Date(), 'yyyy-MM-dd'));

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'init',
          context: {
            appLanguage: language,
            prescriptions: activePrescriptions,
            todaysLogs: activeLogs,
            currentTime: format(new Date(), 'HH:mm a'),
          }
        }));
      };

      ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'ready') {
          setIsConnecting(false);
          setIsActive(true);
          
          // Setup audio capture
          inputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
          outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          nextStartTimeRef.current = 0;

          streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
          const source = inputAudioCtxRef.current.createMediaStreamSource(streamRef.current);
          
          processorRef.current = inputAudioCtxRef.current.createScriptProcessor(4096, 1, 1);
          source.connect(processorRef.current);
          processorRef.current.connect(inputAudioCtxRef.current.destination);

          processorRef.current.onaudioprocess = (e) => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
              wsRef.current.send(JSON.stringify({ type: 'audio', audio: base64 }));
            }
          };
        } else if (msg.type === 'audio') {
          playAudioChunk(msg.audio);
        } else if (msg.type === 'interrupted') {
          nextStartTimeRef.current = 0;
          if (outputAudioCtxRef.current) {
            outputAudioCtxRef.current.suspend();
            setTimeout(() => outputAudioCtxRef.current?.resume(), 50);
          }
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        stopAssistant();
      };

      ws.onclose = () => {
        stopAssistant();
      };

    } catch (err) {
      console.error('Error starting assistant:', err);
      stopAssistant();
    }
  }, [activeProfileId, prescriptions, doseLogs, language, playAudioChunk, stopAssistant]);

  useEffect(() => {
    return () => {
      stopAssistant();
    };
  }, [stopAssistant]);

  return (
      <button
        onClick={isActive ? stopAssistant : startAssistant}
        disabled={isConnecting}
        className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
          isActive 
            ? 'text-red-500 animate-pulse' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        } ${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}`}
        aria-label={isActive ? "Stop Voice Assistant" : "Start Voice Assistant"}
      >
        {isConnecting ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isActive ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
        <span>{language === 'bn' ? 'ভয়েস' : 'Voice'}</span>
      </button>
  );
}
