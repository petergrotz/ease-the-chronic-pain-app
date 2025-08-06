import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/modern-card";
import { Button } from "@/components/ui/modern-button";
import { Play } from "lucide-react";

// Use the uploaded environment images directly
const forestMeadow = "/lovable-uploads/748617aa-4040-41be-b7c8-f0f7ee20928e.png";
const snowyGarden = "/lovable-uploads/b57d8d62-e588-4736-b270-b83356e82d3d.png";
const cozyRainyDay = "/lovable-uploads/38fa2365-88c6-408b-bccb-884c473228aa.png";
const tropicalBeach = "/lovable-uploads/4e07f67f-896c-4899-91ce-eee9bf5b32ce.png";
const starryNightCampfire = "/lovable-uploads/780328a3-0b8b-4aa3-a1af-d61ce7fa6a47.png";
const mountaintopDawn = "/lovable-uploads/cd383841-bc09-4ef7-9a25-ef939e071f23.png";
const relaxingSpa = "/lovable-uploads/acc2697c-41d0-48a5-9ea0-e71b200e34d0.png";
const cozyMountainLodge = "/lovable-uploads/64c38433-d24d-47ba-8bf7-ec4091688485.png";
const verdantGreenhouse = "/lovable-uploads/5b071dfe-e537-46ea-b5ef-2eb7374076c4.png";
const catCafe = "/lovable-uploads/5d39738b-cee2-4aeb-b213-58a4eed50438.png";
const lakesideRetreat = "/lovable-uploads/e5e6ddbd-8f7f-47b3-97ec-37cb07049f25.png";

const environments = [
  {
    id: "forest-meadow",
    name: "Forest Meadow",
    image: forestMeadow,
    description: "Serene forest clearing with mountain backdrop"
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
    id: "tropical-beach",
    name: "Tropical Beach",
    image: tropicalBeach,
    description: "Serene beach with palm trees and ocean"
  },
  {
    id: "starry-night-campfire",
    name: "Starry Night Campfire",
    image: starryNightCampfire,
    description: "Peaceful campfire under starlit sky"
  },
  {
    id: "mountaintop-dawn",
    name: "Mountaintop Dawn",
    image: mountaintopDawn,
    description: "Tranquil sunrise over mountain peaks"
  },
  {
    id: "relaxing-spa",
    name: "Relaxing Spa",
    image: relaxingSpa,
    description: "Luxurious spa sanctuary with fountain"
  },
  {
    id: "cozy-mountain-lodge",
    name: "Cozy Mountain Lodge",
    image: cozyMountainLodge,
    description: "Warm lodge with fireplace and snowy views"
  },
  {
    id: "verdant-greenhouse",
    name: "Verdant Greenhouse",
    image: verdantGreenhouse,
    description: "Lush greenhouse filled with plants"
  },
  {
    id: "cat-cafe",
    name: "Cat Cafe",
    image: catCafe,
    description: "Cozy cafe with feline companions"
  },
  {
    id: "lakeside-retreat",
    name: "Lakeside Retreat",
    image: lakesideRetreat,
    description: "Peaceful dock overlooking mountain lake"
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
      
      <Carousel 
        className="w-full max-w-6xl mx-auto"
        opts={{
          align: "start",
          loop: true,
        }}
      >
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
        <CarouselPrevious className="flex -left-4 md:-left-12 bg-primary/10 border-primary/20 hover:bg-primary/20" />
        <CarouselNext className="flex -right-4 md:-right-12 bg-primary/10 border-primary/20 hover:bg-primary/20" />
      </Carousel>
    </div>
  );
};

export default EnvironmentCarousel;