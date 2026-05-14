import { useEffect, useRef } from "react";

// Synthesizes ambient soundscapes (rain, wind, forest, lofi, cafe) using
// Web Audio API. The volume is decoupled so changing it doesn't restart
// the audio graph.
export function useAmbientAudio(activeAmbient, ambientVolume) {
  const audioCtxRef = useRef(null);
  const audioNodesRef = useRef(null);
  const masterGainRef = useRef(null);

  // Build/teardown the audio graph when the active ambient changes.
  useEffect(() => {
    // Stop the previous graph (if any) before starting a new one.
    if (audioNodesRef.current) {
      audioNodesRef.current.stop && audioNodesRef.current.stop();
      audioNodesRef.current = null;
      masterGainRef.current = null;
    }
    if (!activeAmbient) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const masterGain = ctx.createGain();
    masterGain.gain.value = ambientVolume;
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    let stopFn = () => {};

    if (activeAmbient === "rain" || activeAmbient === "wind" || activeAmbient === "forest") {
      // Pink-ish noise via 3-pole filter on white noise.
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0990460;
        b1 = 0.96300 * b1 + white * 0.2965164;
        b2 = 0.57000 * b2 + white * 1.0526913;
        output[i] = (b0 + b1 + b2 + white * 0.1848) * 0.15;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const filter = ctx.createBiquadFilter();
      if (activeAmbient === "rain") {
        filter.type = "highpass";
        filter.frequency.value = 800;
      } else if (activeAmbient === "wind") {
        filter.type = "lowpass";
        filter.frequency.value = 400;
      } else {
        filter.type = "bandpass";
        filter.frequency.value = 1200;
        filter.Q.value = 0.5;
      }
      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      stopFn = () => { try { noise.stop(); } catch { /* already stopped */ } };
    } else if (activeAmbient === "lofi") {
      // Two soft sine bass tones with slow LFO modulation.
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = "sine"; osc2.type = "sine";
      osc1.frequency.value = 110; osc2.frequency.value = 165;
      const g1 = ctx.createGain();
      const g2 = ctx.createGain();
      g1.gain.value = 0.15; g2.gain.value = 0.1;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.15;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.05;
      lfo.connect(lfoGain);
      lfoGain.connect(g1.gain);
      osc1.connect(g1); osc2.connect(g2);
      g1.connect(masterGain); g2.connect(masterGain);
      osc1.start(); osc2.start(); lfo.start();
      stopFn = () => { try { osc1.stop(); osc2.stop(); lfo.stop(); } catch { /* */ } };
    } else if (activeAmbient === "cafe") {
      // Bandpass noise + low rumble = café crowd.
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = (Math.random() * 2 - 1) * 0.2;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 600;
      filter.Q.value = 0.8;
      const rumble = ctx.createOscillator();
      rumble.type = "sine";
      rumble.frequency.value = 60;
      const rumbleGain = ctx.createGain();
      rumbleGain.gain.value = 0.05;
      noise.connect(filter);
      filter.connect(masterGain);
      rumble.connect(rumbleGain);
      rumbleGain.connect(masterGain);
      noise.start();
      rumble.start();
      stopFn = () => { try { noise.stop(); rumble.stop(); } catch { /* */ } };
    }

    audioNodesRef.current = { stop: stopFn };
    return () => stopFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAmbient]);

  // Smooth volume updates without rebuilding the graph.
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = ambientVolume;
    }
  }, [ambientVolume]);
}
