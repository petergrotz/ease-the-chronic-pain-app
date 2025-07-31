import { PixelButton } from "@/components/ui/pixel-button";
import { PixelCard, PixelCardContent, PixelCardDescription, PixelCardHeader, PixelCardTitle } from "@/components/ui/pixel-card";
import easeLogo from "@/assets/ease-logo.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-light-gradient crt-effect">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src={easeLogo} 
            alt="EASE Logo" 
            className="w-24 h-24 mx-auto mb-6 pixel-art"
            style={{ imageRendering: 'pixelated' }}
          />
          <h1 className="font-pixel text-2xl md:text-4xl text-foreground mb-4 tracking-wider">
            EASE
          </h1>
          <p className="font-pixel text-xs text-muted-foreground tracking-wide">
            CHRONIC PAIN RELIEF
          </p>
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Journal */}
          <PixelCard className="group cursor-pointer transition-all duration-300">
            <PixelCardHeader>
              <div className="text-center py-6">
                <div className="text-4xl mb-4">📔</div>
                <PixelCardTitle>Journal</PixelCardTitle>
                <PixelCardDescription className="mt-2">
                  Record thoughts and track your healing journey
                </PixelCardDescription>
              </div>
            </PixelCardHeader>
            <PixelCardContent>
              <PixelButton 
                variant="retro" 
                className="w-full"
                onClick={() => console.log('Navigate to Journal')}
              >
                Open Journal
              </PixelButton>
            </PixelCardContent>
          </PixelCard>

          {/* Track Pain */}
          <PixelCard className="group cursor-pointer transition-all duration-300">
            <PixelCardHeader>
              <div className="text-center py-6">
                <div className="text-4xl mb-4">📉</div>
                <PixelCardTitle>Track Pain</PixelCardTitle>
                <PixelCardDescription className="mt-2">
                  Monitor symptoms and view progress trends
                </PixelCardDescription>
              </div>
            </PixelCardHeader>
            <PixelCardContent>
              <PixelButton 
                variant="secondary" 
                className="w-full"
                onClick={() => console.log('Navigate to Pain Tracking')}
              >
                Track Pain
              </PixelButton>
            </PixelCardContent>
          </PixelCard>

          {/* Start Session */}
          <PixelCard className="group cursor-pointer transition-all duration-300">
            <PixelCardHeader>
              <div className="text-center py-6">
                <div className="text-4xl mb-4">🎮</div>
                <PixelCardTitle>Start Session</PixelCardTitle>
                <PixelCardDescription className="mt-2">
                  Begin guided meditation and mindfulness exercises
                </PixelCardDescription>
              </div>
            </PixelCardHeader>
            <PixelCardContent>
              <PixelButton 
                variant="default" 
                className="w-full"
                onClick={() => console.log('Navigate to Environment Select')}
              >
                Start Session
              </PixelButton>
            </PixelCardContent>
          </PixelCard>

          {/* Options */}
          <PixelCard className="group cursor-pointer transition-all duration-300">
            <PixelCardHeader>
              <div className="text-center py-6">
                <div className="text-4xl mb-4">⚙️</div>
                <PixelCardTitle>Options</PixelCardTitle>
                <PixelCardDescription className="mt-2">
                  Customize app settings and preferences
                </PixelCardDescription>
              </div>
            </PixelCardHeader>
            <PixelCardContent>
              <PixelButton 
                variant="outline" 
                className="w-full"
                onClick={() => console.log('Navigate to Settings')}
              >
                Settings
              </PixelButton>
            </PixelCardContent>
          </PixelCard>

        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="font-pixel text-xs text-muted-foreground">
            Take control of your pain. One breath at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;