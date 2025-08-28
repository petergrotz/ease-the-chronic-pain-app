import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Volume2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Environment data mapping using the same uploaded images from the carousel
const environmentData = {
  1: {
    name: "Forest Meadow",
    video: null,
    audio: "/forest-meadow-sound.mp3",
    image: "/lovable-uploads/748617aa-4040-41be-b7c8-f0f7ee20928e.png"
  },
  2: {
    name: "Snowy Garden",
    video: "/zen-garden-video.mp4",
    audio: "/zen-garden-sound.mp3",
    image: "/lovable-uploads/b57d8d62-e588-4736-b270-b83356e82d3d.png"
  },
  3: {
    name: "Tropical Beach",
    video: null,
    audio: "/lake-sound.mp3",
    image: "/lovable-uploads/4e07f67f-896c-4899-91ce-eee9bf5b32ce.png"
  },
  4: {
    name: "Starry Night Campfire",
    video: "/campfire-video.mp4",
    audio: "/campfire-at-night-sound.mp3",
    image: "/lovable-uploads/780328a3-0b8b-4aa3-a1af-d61ce7fa6a47.png"
  },
  6: {
    name: "Cat Cafe",
    video: "/cozy-cafe-video.mp4",
    audio: "/cafe-sound.mp3",
    image: "/lovable-uploads/5d39738b-cee2-4aeb-b213-58a4eed50438.png"
  },
  7: {
    name: "Lakeside Retreat",
    video: "/lakeside-retreat-video.mp4",
    audio: "/lake-sound.mp3",
    image: "/lovable-uploads/e5e6ddbd-8f7f-47b3-97ec-37cb07049f25.png"
  },
  8: {
    name: "Mountaintop Dawn",
    video: "/mountain-sunrise-video.mp4",
    audio: "/forest-meadow-sound.mp3",
    image: "/lovable-uploads/cd383841-bc09-4ef7-9a25-ef939e071f23.png"
  },
  9: {
    name: "Relaxing Spa",
    video: "/spa-retreat-video.mp4",
    audio: "/spa-sound.mp3",
    image: "/lovable-uploads/acc2697c-41d0-48a5-9ea0-e71b200e34d0.png"
  },
  10: {
    name: "Verdant Greenhouse",
    video: null,
    audio: "/greenhouse-music.mp3",
    image: "/lovable-uploads/5b071dfe-e537-46ea-b5ef-2eb7374076c4.png"
  },
  11: {
    name: "Cozy Mountain Lodge",
    video: "/cozy-cabin-retreat-loop.mp4",
    audio: "/cozy-cabin-retreat-sound.mp3",
    image: "/lovable-uploads/64c38433-d24d-47ba-8bf7-ec4091688485.png"
  }
};

const EnvironmentSession = () => {
  const { environmentId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bodyScanAudioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState([80]);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isBodyScanPlaying, setIsBodyScanPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const activityOptions = [
    "Body Scan",
    "Progressive Muscle Relaxation", 
    "Activity Pacing",
    "Pain Education"
  ];

  const environment = environmentData[Number(environmentId) as keyof typeof environmentData];

  const handleActivitySelect = (activity: string) => {
    console.log(`Starting ${activity} in ${environment.name}`);
    
    if (activity === "Body Scan") {
      // Keep ambient audio playing in background, just lower its volume
      if (audioRef.current) {
        audioRef.current.volume = (volume[0] / 100) * 0.3; // Lower ambient volume to 30% of slider value
      }
      
      // Play ElevenLabs body scan audio
      if (bodyScanAudioRef.current) {
        setIsBodyScanPlaying(true);
        setAudioProgress(0);
        bodyScanAudioRef.current.currentTime = 0;
        bodyScanAudioRef.current.volume = volume[0] / 100;
        bodyScanAudioRef.current.play().catch(console.warn);
      }
    }
  };

  // Setup body scan audio event listeners
  useEffect(() => {
    const audio = bodyScanAudioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      setAudioProgress(progress);
    };

    const handleEnded = () => {
      setIsBodyScanPlaying(false);
      setAudioProgress(0);
      // Restore ambient audio volume to full
      if (audioRef.current && environment.audio) {
        audioRef.current.volume = volume[0] / 100;
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [environment.audio]);

  useEffect(() => {
    if (!environment) {
      navigate("/");
      return;
    }

    // Setup audio
    if (audioRef.current && environment.audio) {
      audioRef.current.volume = volume[0] / 100;
      audioRef.current.loop = true;
      audioRef.current.play().catch(console.warn);
    }

    // Setup video
    if (videoRef.current && environment.video) {
      videoRef.current.loop = true;
      videoRef.current.muted = true; // Video is muted, audio comes from separate audio element
      videoRef.current.play().catch(console.warn);
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [environment, navigate]);

  // Update audio volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      // If body scan is playing, keep ambient audio at lower volume, otherwise full volume
      audioRef.current.volume = isBodyScanPlaying ? (volume[0] / 100) * 0.3 : volume[0] / 100;
    }
    if (bodyScanAudioRef.current) {
      bodyScanAudioRef.current.volume = volume[0] / 100;
    }
  }, [volume, isBodyScanPlaying]);

  if (!environment) {
    return null;
  }

  const handleReturnToMenu = () => {
    navigate("/");
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Background Media */}
      {environment.video ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover md:object-contain bg-black"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={environment.video} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 h-full w-full bg-cover md:bg-contain bg-center bg-no-repeat bg-black"
          style={{
            backgroundImage: `url(${environment.image})`,
          }}
        />
      )}

      {/* Audio Elements */}
      {environment.audio && (
        <audio ref={audioRef} preload="auto">
          <source src={environment.audio} type="audio/mpeg" />
        </audio>
      )}
      
      {/* ElevenLabs Body Scan Audio */}
      <audio ref={bodyScanAudioRef} preload="auto">
        <source src="/body-scan-audio.mp3" type="audio/mpeg" />
      </audio>

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

      {/* Progress Bar - Top of Screen (only show when body scan is playing) */}
      {isBodyScanPlaying && (
        <div className="absolute top-0 left-0 right-0 z-30 p-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center gap-3 text-white">
              <span className="text-sm">Body Scan Session</span>
              <Progress 
                value={audioProgress} 
                className="flex-1 h-2 bg-white/20" 
              />
              <span className="text-sm">{Math.round(audioProgress)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Return to Main Menu Button - Top Left */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          onClick={handleReturnToMenu}
          variant="secondary"
          className="bg-black/40 hover:bg-black/60 text-white border-white/20 backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Main Menu
        </Button>
      </div>

      {/* Start Session Dropdown - Center (only show when not playing body scan) */}
      {!isBodyScanPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary"
                  className="bg-black/40 hover:bg-black/60 text-white border-white/20 backdrop-blur-sm px-8 py-4 text-lg"
                >
                  <span className="font-retro">Start Session</span>
                  <ChevronDown className="w-5 h-5 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 bg-black/80 backdrop-blur-sm border border-white/20 z-50"
                align="center"
              >
                {activityOptions.map((activity) => (
                  <DropdownMenuItem
                    key={activity}
                    onClick={() => handleActivitySelect(activity)}
                    className="font-retro text-white text-base cursor-pointer hover:bg-white/10 focus:bg-white/10 py-3"
                  >
                    {activity}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Volume Control - Bottom Right */}
      <div 
        className="absolute bottom-6 right-6 z-20"
        onMouseEnter={() => setShowVolumeControl(true)}
        onMouseLeave={() => setShowVolumeControl(false)}
      >
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-white/20 transition-all duration-300 hover:bg-black/60">
          <div className="flex items-center gap-3">
            <Volume2 className="h-5 w-5 text-white" />
            <div 
              className={`transition-all duration-300 overflow-hidden ${
                showVolumeControl ? 'w-24 opacity-100' : 'w-0 opacity-0'
              }`}
            >
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                min={0}
                step={1}
                className="w-24"
              />
            </div>
            <span className="text-white text-sm min-w-[2rem] text-right">
              {volume[0]}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSession;