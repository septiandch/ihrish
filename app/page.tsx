"use client";

import Carousel from "@/components/carousel";
import PrayerTime, { Clock } from "@/components/prayertime";
import { Date } from "@/components/prayertime/Date";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Marquee from "@/components/ui/marquee";
import Logo from "@/lib/assets/logo.svg";

export default function Home() {
  return (
    <div className="relative w-screen h-screen space-y-4 p-8 bg-gradient-to-b from-emerald-500 to-emerald-600">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-5 flex flex-col justify-between gap-4">
          <div className=" flex justify-between gap-8 px-8 text-emerald-900">
            <div className="flex justify-start items-center gap-4 m-auto w-full">
              <Logo className="h-20 w-20" />

              <div className="flex flex-col gap-2">
                <span className="text-4xl font-bold">Masjid Al-Ikhlash</span>
                <span className="text-lg">Villa Mutiara Cikarang 1 Blok A</span>
              </div>
            </div>

            <div className="flex justify-center items-center gap-4">
              <Date />
              <Clock className="pb-1" />
            </div>
          </div>

          <div className="h-max p-2 bg-emerald-800/20 rounded-lg overflow-hidden">
            <div className="relative max-h-[75vh] rounded-lg overflow-hidden">
              <AspectRatio ratio={16 / 9}>
                <Carousel
                  sources={[
                    "/media/1.jpg",
                    "/media/2.jpg",
                    "/media/3.jpg",
                    "/media/4.jpg",
                    "/media/5.jpg",
                    "/media/6.jpg",
                    "/media/7.jpg",
                    "/media/8.jpg",
                  ]}
                />
              </AspectRatio>

              <div className="absolute bottom-0 w-full text-xl font-medium italic bg-black/30 text-white backdrop-blur-md py-2 rounded-b-lg overflow-hidden">
                <Marquee text="Bersungguh-sungguhlah pada perkara-perkara yang bermanfaat bagimu, mintalah pertolongan kepada Allah dan janganlah kamu bersikap lemah. (HR. Ahmad 9026)" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 w-full">
          <PrayerTime />
        </div>
      </div>
    </div>
  );
}
