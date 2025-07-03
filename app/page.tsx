"use client";

import Carousel from "@/components/carousel";
import { Clock, PrayerSession, PrayerTime } from "@/components/prayertime";
import Date from "@/components/prayertime/Date";
import { usePrayerStore } from "@/components/prayertime/usePrayerStore";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Marquee from "@/components/ui/marquee";
import Logo from "@/lib/assets/logo.svg";
import { useIsTv } from "@/lib/hooks/useIsTv";
import { cn } from "@/lib/utils";
import getMediaFiles from "@/lib/utils/getMediaFIles";
import { Suspense, useCallback, useEffect, useState } from "react";

function HomeContent() {
  const { initialize } = usePrayerStore();
  const [mediaFiles, setMediaFiles] = useState<string[]>(["/media/makkah.jpg"]);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const isTv = useIsTv();

  const fetchMedia = useCallback(async () => {
    const files = await getMediaFiles();
    if (files.length > 0) {
      setMediaFiles(files);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchMedia();
    initialize();

    let retryTimeout: NodeJS.Timeout;
    const maxRetries = 5;

    function setupEventSource() {
      // Set up SSE listener
      const eventSource = new EventSource("/api/updates");

      eventSource.addEventListener("connect", () => {
        setConnectionAttempts(0); // Reset counter on successful connection
      });

      eventSource.addEventListener("update", (event) => {
        switch (event.data) {
          case "newImage":
            fetchMedia();
            break;
          case "newSettings":
            initialize();
            break;
        }
      });

      // Also listen for general messages as fallback
      eventSource.onmessage = (event) => {
        console.log("SSE message received:", event.data);
      };

      eventSource.onerror = () => {
        console.error("SSE connection error");

        // Close the errored connection
        eventSource.close();

        // Try to reconnect if we haven't exceeded max retries
        if (connectionAttempts < maxRetries) {
          const retryDelay = Math.min(1000 * Math.pow(2, connectionAttempts), 10000);

          retryTimeout = setTimeout(() => {
            setConnectionAttempts((prev) => prev + 1);
            setupEventSource();
          }, retryDelay);
        }
      };

      return eventSource;
    }

    const eventSource = setupEventSource();

    return () => {
      clearTimeout(retryTimeout);
      eventSource.close();
    };
  }, [fetchMedia, connectionAttempts]);

  return (
    <main className="relative w-screen h-screen space-y-4 p-8 bg-gradient-to-b from-emerald-500 to-emerald-600">
      <div className="grid grid-cols-12 gap-4">
        <div
          className={cn("col-span-10 flex flex-col justify-between gap-4", isTv && "col-span-9")}
        >
          <div className="flex justify-between gap-8 mx-4 text-shadow-md">
            <div className="flex justify-start items-center gap-4 m-auto w-full">
              <div className={cn("h-20 w-20 rounded-lg bg-white shadow-md", isTv && "h-24 w-24")}>
                <Logo className="m-auto p-2 text-emerald-600" />
              </div>

              <div className="flex flex-col gap-2 pr-4 text-white">
                <span className={cn("text-4xl font-extrabold", isTv && "text-5xl")}>
                  Masjid Al-Ikhlash
                </span>
                <span className={cn("text-lg", isTv && "text-3xl font-bold")}>
                  Villa Mutiara Cikarang Blok A
                </span>
              </div>
            </div>

            <div className="flex justify-center items-center gap-4 text-white">
              <Date className={cn("text-2xl", isTv && "text-4xl font-bold")} />
              <Clock className={cn("pb-1 text-7xl", isTv && "text-8xl")} />
            </div>
          </div>

          <div className="h-max p-2 bg-emerald-800/20 rounded-lg overflow-hidden">
            <div className="relative h-[78vh] rounded-lg overflow-hidden">
              <AspectRatio ratio={16 / 9} className="h-full w-full">
                <Carousel interval={15000} sources={mediaFiles} />
              </AspectRatio>

              <div
                className={cn(
                  "absolute bottom-0 w-full bg-black/30 text-white backdrop-blur-md py-2 rounded-b-lg overflow-hidden",
                  isTv && "hidden"
                )}
              >
                <Marquee
                  className={cn("font-bold italic", isTv && "text-4xl")}
                  text="Bersungguh-sungguhlah pada perkara-perkara yang bermanfaat bagimu, mintalah pertolongan kepada Allah dan janganlah kamu bersikap lemah. (HR. Ahmad 9026)"
                />
              </div>
            </div>
          </div>
        </div>

        <PrayerTime className={cn("col-span-2", isTv && "col-span-3")} />
      </div>

      <PrayerSession />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
