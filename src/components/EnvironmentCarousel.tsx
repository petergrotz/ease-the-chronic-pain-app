import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/modern-card";
import { Button } from "@/components/ui/modern-button";
import { Play } from "lucide-react";

// Import environment images
import forestMeadow from "@/assets/environments/forest-meadow.png";
import snowyGarden from "@/assets/environments/snowy-garden.png";
import cozyRainyDay from "@/assets/environments/cozy-rainy-day.png";
import starryNight from "@/assets/environments/starry-night.png";
import tropicalBeach from "@/assets/environments/tropical-beach.png";

const environments = [
  {
    id: "forest-meadow",
    name: "Forest Meadow",
    image: forestMeadow,
    description: "Peaceful mountain vista with a cozy reading spot"
  },
  {
    id: "snowy-garden", 
    name: "Snowy Garden",
    image: snowyGarden,
    description: "Tranquil Japanese garden in winter"
  },
  {
    id: "cozy-rainy-day",
    name: "Cozy Rainy Day", 
    image: cozyRainyDay,
    description: "Warm indoor sanctuary with gentle rain"
  },
  {
    id: "starry-night",
    name: "Starry Night",
    image: starryNight,
    description: "Peaceful night sky filled with stars"
  },
  {
    id: "tropical-beach",
    name: "Tropical Beach",
    image: tropicalBeach,
    description: "Serene beach with palm trees and ocean"
  }
];

const EnvironmentCarousel = () => {
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="font-modern text-2xl font-semibold text-foreground mb-2">
          Begin Wellness Session
        </h2>
        <p className="font-modern text-sm text-muted-foreground">
          Choose your virtual environment
        </p>
      </div>
      
      <Carousel className="w-full max-w-6xl mx-auto">
        <CarouselContent className="-ml-4">
          {environments.map((environment) => (
            <CarouselItem key={environment.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <Card className="group cursor-pointer overflow-hidden bg-gradient-seaglass border-2 border-transparent hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={environment.image}
                      alt={environment.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-modern font-semibold text-white text-lg mb-1 drop-shadow-lg">
                        {environment.name}
                      </h3>
                      <p className="font-modern text-white/90 text-xs drop-shadow-md">
                        {environment.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <Button 
                      variant="wellness" 
                      size="sm"
                      className="w-full text-sm"
                      onClick={() => console.log(`Selected environment: ${environment.id}`)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12 bg-primary/10 border-primary/20 hover:bg-primary/20" />
        <CarouselNext className="hidden md:flex -right-12 bg-primary/10 border-primary/20 hover:bg-primary/20" />
      </Carousel>
    </div>
  );
};

export default EnvironmentCarousel;