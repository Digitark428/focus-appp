import { useEffect, useRef } from "react";

// Plays user-uploaded music tracks. Volume can be adjusted live.
export function useCustomAudio(activeCustomTrack, customTracks, ambientVolume) {
  const customAudioRef = useRef(null);

  useEffect(() => {
    if (customAudioRef.current) {
      customAudioRef.current.pause();
      customAudioRef.current = null;
    }
    if (!activeCustomTrack) return;

    const track = customTracks.find((t) => t.id === activeCustomTrack);
    if (!track) return;

    const audio = new Audio(track.url);
    audio.loop = true;
    audio.volume = ambientVolume;
    audio.play().catch(() => { /* user may need to interact first */ });
    customAudioRef.current = audio;

    return () => { audio.pause(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCustomTrack, customTracks]);

  useEffect(() => {
    if (customAudioRef.current) {
      customAudioRef.current.volume = ambientVolume;
    }
  }, [ambientVolume]);
}
