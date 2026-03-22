import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Upload, Music, Image as ImageIcon, Repeat, Shuffle, Repeat1 } from 'lucide-react';

const defaultLyrics = `[00:00.00]Yeah! Let's go!
[00:15.80]The sun is shining down across the eastern coast
[00:18.90]Grab a cold one, raise a glass, we’re making a toast
[00:21.90]To the legend of the hour, yeah, she’s stealing the scene
[00:25.10]The brightest energy that we have ever seen
[00:28.40]Happy birthday, Kendra Fishman!
[00:31.60]Forty-nine and you’re shining like a diamond
[00:34.30]Riding the wave, yeah, you’re feeling alive
[00:37.70]Let's hear it for Kendra at forty-nine!
[00:43.70]Oh yeah, Kendra at forty-nine!
[00:47.70]From the city lanes to the sandy ground
[00:51.10]We’re turning up the speakers, it’s a beautiful sound
[00:54.30]Not a worry in the world, just the wind in your hair
[00:57.70]Forty-nine years young with that Aussie flair
[01:00.70]Happy birthday, Kendra Fishman!
[01:04.00]Forty-nine and you’re shining like a diamond
[01:06.50]Riding the wave, yeah, you’re feeling alive
[01:09.80]Let's hear it for Kendra at forty-nine!
[01:20.90]One year to fifty, but who’s keeping score?
[01:23.70]Every single day we just love you more
[01:26.50]So let the guitars jangle and the good vibes play
[01:30.00]It’s a Kendra Fishman kind of day!
[01:52.00]Happy birthday, Kendra Fishman!
[01:55.30]Forty-nine and you’re shining like a diamond
[01:58.00]Riding the wave, yeah, you’re feeling alive
[02:01.10]Let's hear it for Kendra at forty-nine!
[02:07.20]Yeah, cheers to forty-nine!
[02:10.60]Happy birthday, Kendra!
[02:13.50]Keep catching those waves!`;

const parseLRC = (lrc: string) => {
  const lines = lrc.split('\n');
  const parsed: { time: number; text: string }[] = [];
  const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3], 10);
      const msMultiplier = match[3].length === 2 ? 100 : 1000;
      const time = minutes * 60 + seconds + milliseconds / msMultiplier;
      const text = match[4].trim() || '♪';
      parsed.push({ time, text });
    }
  }
  return parsed;
};

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [playMode, setPlayMode] = useState<'sequence' | 'repeat-one' | 'shuffle'>('sequence');

  // Use the provided image and audio files
  const coverImage = '/cover.png';
  const audioSrc = '/A Kendra Kind of Day.mp3';
  const songTitle = 'A Kendra Kind of Day';
  const artistName = 'Kendra Fishman';

  const audioRef = useRef<HTMLAudioElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const lyrics = useMemo(() => parseLRC(defaultLyrics), []);

  useEffect(() => {
    if (!lyrics.length) return;

    const index = lyrics.findIndex((lyric, i) => {
      const nextLyric = lyrics[i + 1];
      return progress >= lyric.time && (!nextLyric || progress < nextLyric.time);
    });

    if (index !== -1 && index !== activeLyricIndex) {
      setActiveLyricIndex(index);

      if (lyricsContainerRef.current) {
        const container = lyricsContainerRef.current;
        const activeElement = container.children[0].children[index] as HTMLElement;
        if (activeElement) {
          container.scrollTo({
            top: activeElement.offsetTop - container.clientHeight / 2 + activeElement.clientHeight / 2,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [progress, lyrics, activeLyricIndex]);

  const togglePlay = () => {
    if (!audioSrc) return;

    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    if (playMode === 'repeat-one' || playMode === 'shuffle') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      setIsPlaying(false);
      setProgress(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handleSkipForward = () => {
    handleEnded();
  };

  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleShuffle = () => {
    setPlayMode(prev => prev === 'shuffle' ? 'sequence' : 'shuffle');
  };

  const toggleRepeat = () => {
    setPlayMode(prev => prev === 'repeat-one' ? 'sequence' : 'repeat-one');
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 1;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (progress / duration) * 100 : 0;
  const volumePercentage = isMuted ? 0 : volume * 100;

  return (
    <div className="w-full max-w-md bg-[#121212] rounded-[2rem] p-8 shadow-2xl border border-white/5 text-white font-sans relative overflow-hidden">
      {/* Dynamic Background Blur */}
      {coverImage && (
        <div
          className="absolute inset-0 opacity-20 blur-3xl z-0 transition-all duration-1000"
          style={{ backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      )}

      <div className="relative z-10">
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={audioSrc || undefined}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />

        {/* Header */}
        <div className="flex justify-center items-center mb-10">
          <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Now Playing</span>
        </div>

        {/* Vinyl Record Area */}
        <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
          <style>{`
            @keyframes stylus-swing {
              0%, 100% { transform: rotate(-2deg); }
              50% { transform: rotate(6deg); }
            }
          `}</style>
          {/* Record Player Base Shadow */}
          <div className="absolute inset-4 bg-black/40 rounded-full blur-xl translate-y-4"></div>

          <div
            className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden shadow-[0_0_0_4px_#1a1a1a,inset_0_0_20px_rgba(255,255,255,0.05)]"
            style={{
              animation: 'spin 12s linear infinite',
              animationPlayState: isPlaying ? 'running' : 'paused'
            }}
          >
            {/* Vinyl Grooves (Multiple thin borders) */}
            <div className="absolute inset-[8%] rounded-full border border-white/5"></div>
            <div className="absolute inset-[16%] rounded-full border border-white/5"></div>
            <div className="absolute inset-[24%] rounded-full border border-white/5"></div>
            <div className="absolute inset-[32%] rounded-full border border-white/5"></div>
            <div className="absolute inset-[40%] rounded-full border border-white/5"></div>

            {/* Vinyl Light Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/5 to-transparent opacity-50"></div>

            {/* Center Label (Cover Art) */}
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[#111] z-10 shadow-inner">
              {coverImage ? (
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                  <Music size={32} className="text-neutral-600" />
                </div>
              )}
            </div>

            {/* Spindle Hole */}
            <div className="absolute w-3 h-3 bg-[#1a1a1a] rounded-full z-20 border border-black shadow-inner"></div>
          </div>

          {/* Professional Stylus Arm */}
          <div
            className={`absolute -right-2 top-2 w-12 h-48 origin-[24px_24px] transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-30 ${isPlaying ? 'rotate-[28deg]' : 'rotate-0'}`}
          >
            <div
              className="w-full h-full origin-[24px_24px]"
              style={{
                animation: isPlaying ? 'stylus-swing 6s ease-in-out infinite' : 'none'
              }}
            >
              {/* Counterweight */}
              <div className="absolute top-[-12px] left-[18px] w-3 h-8 bg-gradient-to-b from-[#444] via-[#aaa] to-[#222] rounded-sm shadow-lg border border-black/50"></div>

              {/* Pivot Base */}
              <div className="absolute top-[8px] left-[8px] w-8 h-8 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#0a0a0a] shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-[#555] flex items-center justify-center z-20">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#777] to-[#fff] border border-[#222] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#111] shadow-inner"></div>
                </div>
              </div>

              {/* Main Arm Tube */}
              <div className="absolute top-[32px] left-[21px] w-1.5 h-28 bg-gradient-to-r from-[#999] via-[#eee] to-[#777] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] z-10"></div>

              {/* Headshell Connector */}
              <div className="absolute top-[140px] left-[19px] w-2.5 h-4 bg-gradient-to-b from-[#333] to-[#111] rounded-sm z-10 shadow-md"></div>

              {/* Headshell */}
              <div className="absolute top-[142px] left-[14px] w-5 h-11 bg-gradient-to-b from-[#222] to-[#0a0a0a] rounded-t-sm rounded-b-lg shadow-xl rotate-[20deg] origin-top border border-[#444] z-20">
                {/* Cartridge */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-4 bg-gradient-to-b from-[#d4af37] to-[#997a00] rounded-sm shadow-inner"></div>
                {/* Stylus Tip */}
                <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-0.5 h-2.5 bg-red-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Track Info */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white truncate mb-1.5 tracking-tight">{songTitle}</h2>
          <p className="text-sm text-neutral-400 truncate">{artistName}</p>
        </div>

        {/* Lyrics */}
        <div
          ref={lyricsContainerRef}
          className="mb-8 h-40 overflow-y-auto no-scrollbar relative"
          style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}
        >
          <div className="flex flex-col items-center py-6 gap-3">
            {lyrics.map((lyric, index) => (
              <p
                key={index}
                className={`text-center transition-all duration-300 px-4 ${index === activeLyricIndex ? 'text-white text-base font-bold scale-105' : 'text-neutral-500 text-sm'}`}
              >
                {lyric.text}
              </p>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8"
          onMouseEnter={() => setIsHoveringProgress(true)}
          onMouseLeave={() => setIsHoveringProgress(false)}>
          <div className="relative h-1.5 w-full bg-neutral-800 rounded-full flex items-center group cursor-pointer">
            {/* Custom Range Input */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={handleProgressChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            {/* Filled Track */}
            <div
              className={`absolute left-0 h-full rounded-full pointer-events-none z-10 ${isHoveringProgress ? 'bg-[#1db954]' : 'bg-white'}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
            {/* Thumb */}
            <div
              className={`absolute h-3 w-3 bg-white rounded-full shadow-md pointer-events-none z-10 -ml-1.5 transition-opacity ${isHoveringProgress ? 'opacity-100' : 'opacity-0'}`}
              style={{ left: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-neutral-400 mt-2 font-mono font-medium">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between mb-8 px-2">
          <button 
            onClick={toggleShuffle} 
            className={`transition-colors ${playMode === 'shuffle' ? 'text-[#1db954]' : 'text-neutral-400 hover:text-white'}`}
            title="随机播放"
          >
            <Shuffle size={20} />
          </button>

          <div className="flex items-center gap-6">
            <button onClick={handleSkipBack} className="text-neutral-400 hover:text-white transition-colors" title="上一首">
              <SkipBack size={28} fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              disabled={!audioSrc}
              className={`w-16 h-16 flex items-center justify-center rounded-full transition-all duration-300 ${audioSrc
                ? 'bg-white hover:scale-105 text-black'
                : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                }`}
            >
              {isPlaying ? (
                <Pause size={28} fill="currentColor" />
              ) : (
                <Play size={28} fill="currentColor" className="ml-1" />
              )}
            </button>

            <button onClick={handleSkipForward} className="text-neutral-400 hover:text-white transition-colors" title="下一首">
              <SkipForward size={28} fill="currentColor" />
            </button>
          </div>

          <button 
            onClick={toggleRepeat}
            className={`transition-colors ${playMode === 'repeat-one' ? 'text-[#1db954]' : 'text-neutral-400 hover:text-white'}`}
            title={playMode === 'repeat-one' ? "单曲循环" : "按顺序播放"}
          >
            {playMode === 'repeat-one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 group">
          <button onClick={toggleMute} className="text-neutral-400 hover:text-white transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="relative h-1 w-full bg-neutral-800 rounded-full flex items-center">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            <div
              className="absolute left-0 h-full bg-white group-hover:bg-[#1db954] rounded-full pointer-events-none z-10 transition-colors"
              style={{ width: `${volumePercentage}%` }}
            ></div>
            <div
              className="absolute h-3 w-3 bg-white rounded-full shadow-md pointer-events-none z-10 -ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${volumePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
