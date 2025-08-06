import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Environment data mapping using the same uploaded images from the carousel
const environmentData = {
  1: {
    name: "Forest Meadow",
    video: null,
    audio: "/Forest Meadow sound.mp3",
    image: "/lovable-uploads/748617aa-4040-41be-b7c8-f0f7ee20928e.png"
  },
  2: {
    name: "Snowy Garden",
    video: "/Zen Garden Video.mp4",
    audio: "/Zen garden sound.mp3",
    image: "/lovable-uploads/b57d8d62-e588-4736-b270-b83356e82d3d.png"
  },
  3: {
    name: "Tropical Beach",
    video: null,
    audio: "/Lake sound.mp3",
    image: "/lovable-uploads/4e07f67f-896c-4899-91ce-eee9bf5b32ce.png"
  },
  4: {
    name: "Starry Night Campfire",
    video: "/Campfire Video.mp4",
    audio: "/Campfire at night sound.mp3",
    image: "/lovable-uploads/780328a3-0b8b-4aa3-a1af-d61ce7fa6a47.png"
  },
  6: {
    name: "Cat Cafe",
    video: "/Cozy Cafe Video.mp4",
    audio: "/Cafe Sound.mp3",
    image: "/lovable-uploads/5d39738b-cee2-4aeb-b213-58a4eed50438.png"
  },
  7: {
    name: "Lakeside Retreat",
    video: "/Lakeside Retreat Video.mp4",
    audio: "/Lake sound.mp3",
    image: "/lovable-uploads/e5e6ddbd-8f7f-47b3-97ec-37cb07049f25.png"
  },
  8: {
    name: "Mountaintop Dawn",
    video: "/Mountain Sunrise Video.mp4",
    audio: "/Forest Meadow sound.mp3",
    image: "/lovable-uploads/cd383841-bc09-4ef7-9a25-ef939e071f23.png"
  },
  9: {
    name: "Relaxing Spa",
    video: "/Spa Retreat Video.mp4",
    audio: "/spa sound.mp3",
    image: "/lovable-uploads/acc2697c-41d0-48a5-9ea0-e71b200e34d0.png"
  },
  10: {
    name: "Verdant Greenhouse",
    video: null,
    audio: "/Greenhouse music.mp3",
    image: "/lovable-uploads/5b071dfe-e537-46ea-b5ef-2eb7374076c4.png"
  },
  11: {
    name: "Cozy Mountain Lodge",
    video: "/20250804_1720_Cozy Cabin Retreat_loop_01k1vsjx86fepajg9knasqfwqx.mp4",
    audio: "/Cozy Cabin Retreat sound.mp3",
    image: "/lovable-uploads/64c38433-d24d-47ba-8bf7-ec4091688485.png"
  }
};

const EnvironmentSession = () => {
  const { environmentId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState([80]);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  const environment = environmentData[Number(environmentId) as keyof typeof environmentData];

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
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

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
          className="absolute inset-0 h-full w-full object-contain bg-black"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={environment.video} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 h-full w-full bg-contain bg-center bg-no-repeat bg-black"
          style={{
            backgroundImage: `url(${environment.image})`,
          }}
        />
      )}

      {/* Audio Element */}
      {environment.audio && (
        <audio ref={audioRef} preload="auto">
          <source src={environment.audio} type="audio/mpeg" />
        </audio>
      )}

      {/* Logo overlay to cover watermarks on videos */}
      {environment.video && (
        <div className="absolute bottom-4 right-4 z-10">
          <img 
            src="/lovable-uploads/104c1d42-a0cc-4b8d-854e-dcfa6841a8a5.png" 
            alt="Ease Logo" 
            className="w-16 h-16 opacity-90"
          />
        </div>
      )}

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

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

      {/* Start Session Text - Center */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-retro text-white drop-shadow-lg">
            Start Session
          </h1>
        </div>
      </div>

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