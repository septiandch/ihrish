import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Carousel as BaseCarousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { MouseEvent, ReactNode, useCallback, useEffect, useRef } from "react";

type CarouselProps = {
  sources?: string[];
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onContentScroll?: (index: number) => void;
};

const Carousel = ({ children, sources = ["/images/no-image.png"], ...props }: CarouselProps) => {
  const plugin = useRef(Autoplay({ delay: 5000 }));
  const videoRef = useRef<HTMLVideoElement>(null);

  const carouselPlugin = plugin.current;

  const handleVideoPlay = useCallback(() => {
    // Pause carousel when video starts playing
    if (carouselPlugin) {
      carouselPlugin.stop();
    }
  }, [carouselPlugin]);

  const handleVideoEnded = useCallback(() => {
    // Resume carousel when video ends
    if (carouselPlugin) {
      carouselPlugin.play();
    }
  }, [carouselPlugin]);

  const handleContentScroll = (index: number) => {
    const currentSlide = sources[index];

    if (currentSlide?.endsWith(".mp4") && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  useEffect(() => {
    return () => {
      // Destroy carousel plugin if it exists and has destroy method
      if (carouselPlugin && typeof carouselPlugin.destroy === "function") {
        try {
          carouselPlugin.destroy();
        } catch (error) {
          console.warn("Failed to destroy carousel plugin:", error);
        }
      }
    };
  }, [carouselPlugin]);

  return (
    <BaseCarousel plugins={[plugin.current]} {...props} onContentScroll={handleContentScroll}>
      <CarouselContent>
        {sources.map((src, index) => (
          <CarouselItem key={index} className="h-full w-full bg-gray-800">
            <AspectRatio ratio={15 / 7}>
              {src?.endsWith(".mp4") ? (
                <video
                  autoPlay
                  src={src}
                  ref={videoRef}
                  onPlay={handleVideoPlay}
                  onEnded={handleVideoEnded}
                  loop={sources.length === 1}
                  className="mx-auto block h-full w-full object-cover"
                  preload="metadata"
                  playsInline
                  muted
                />
              ) : (
                <img alt="" className="h-full w-full object-cover" src={src} />
              )}
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>

      {children}
    </BaseCarousel>
  );
};

export default Carousel;
