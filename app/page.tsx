"use client";

import Carousel from "@/components/carousel";
import { Clock, PrayerSession, PrayerTime } from "@/components/prayertime";
import { Date } from "@/components/prayertime/Date";
import Marquee from "@/components/ui/marquee";
import Logo from "@/lib/assets/logo.svg";
import { getMediaFiles } from "@/lib/utils/getMediaFIles";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [mediaFiles, setMediaFiles] = useState<string[]>(["/media/makkah.jpg"]);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  const fetchMedia = useCallback(async () => {
    const files = await getMediaFiles();
    if (files.length > 0) {
      setMediaFiles(files);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchMedia();

    let retryTimeout: NodeJS.Timeout;
    const maxRetries = 5;

    function setupEventSource() {
      // Set up SSE listener
      const eventSource = new EventSource("/api/updates");

      eventSource.addEventListener("connect", (event) => {
        console.log("SSE connected successfully");
        setConnectionAttempts(0); // Reset counter on successful connection
      });

      eventSource.addEventListener("update", (event) => {
        console.log("Update event received");
        fetchMedia();
      });

      // Also listen for general messages as fallback
      eventSource.onmessage = (event) => {
        console.log("SSE message received:", event.data);
        if (event.data.includes("newImage")) {
          fetchMedia();
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);

        // Close the errored connection
        eventSource.close();

        // Try to reconnect if we haven't exceeded max retries
        if (connectionAttempts < maxRetries) {
          const retryDelay = Math.min(1000 * Math.pow(2, connectionAttempts), 10000);
          console.log(
            `Retrying connection in ${retryDelay}ms (attempt ${
              connectionAttempts + 1
            }/${maxRetries})`
          );

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
      console.log("Cleaning up SSE connection");
      clearTimeout(retryTimeout);
      eventSource.close();
    };
  }, [fetchMedia, connectionAttempts]);

  return (
    <>
      <div className="relative w-screen h-screen space-y-4 p-8 bg-gradient-to-b from-emerald-500 to-emerald-600">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-10 flex flex-col justify-between gap-4">
            <div className="flex justify-between gap-8 mx-4 text-shadow-md">
              <div className="flex justify-start items-center gap-4 m-auto w-full">
                <div className="h-20 w-20 rounded-lg bg-white shadow-md">
                  <Logo className="m-auto p-2 text-emerald-600" />
                </div>

                <div className="flex flex-col gap-2 pr-4 text-white">
                  <span className="text-4xl font-bold">Masjid Al-Ikhlash</span>
                  <span className="text-lg">Villa Mutiara Cikarang 1 Blok A</span>
                </div>
              </div>

              <div className="flex justify-center items-center gap-4 text-white">
                <Date className="text-2xl" />
                <Clock className="pb-1 text-7xl" />
              </div>
            </div>

            <div className="h-max p-2 bg-emerald-800/20 rounded-lg overflow-hidden">
              <div className="relative h-[78vh] rounded-lg overflow-hidden">
                <Carousel sources={mediaFiles} />

                <div className="absolute bottom-0 w-full text-xl font-medium italic bg-black/30 text-white backdrop-blur-md py-2 rounded-b-lg overflow-hidden">
                  <Marquee text="Bersungguh-sungguhlah pada perkara-perkara yang bermanfaat bagimu, mintalah pertolongan kepada Allah dan janganlah kamu bersikap lemah. (HR. Ahmad 9026)" />
                </div>
              </div>
            </div>
          </div>

          <PrayerTime className="col-span-2" />
        </div>

        <PrayerSession />
      </div>
    </>
  );
}
