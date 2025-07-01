"use client";

import { usePrayerStore } from "@/components/prayertime/usePrayerStore";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SettingsPage() {
  const { hijriDateOffset, adhan, iqamah, setHijriDateOffset, setAdhan, setIqamah } =
    usePrayerStore();

  const [offset, setOffset] = useState(hijriDateOffset);
  const [adhanTimes, setAdhanTimes] = useState(adhan);
  const [iqamahTimes, setIqamahTimes] = useState(iqamah);

  const handleSave = () => {
    setHijriDateOffset(offset);
    setAdhan(adhanTimes);
    setIqamah(iqamahTimes);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Prayer Settings</h1>

      {/* Hijri Date Offset */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Hijri Date Offset</h2>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            className="w-24 p-2 border rounded"
          />
          <span className="text-sm text-gray-600">days</span>
        </div>
      </div>

      {/* Adhan Times */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Adhan Times</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(adhanTimes).map(([prayer, minutes]) => (
            <div key={prayer} className="space-y-2">
              <label className="block text-sm font-medium">{prayer}</label>
              <input
                type="number"
                value={minutes}
                onChange={(e) =>
                  setAdhanTimes((prev) => ({
                    ...prev,
                    [prayer]: Number(e.target.value),
                  }))
                }
                className="w-24 p-2 border rounded"
              />
              <span className="text-sm text-gray-600 ml-2">minutes</span>
            </div>
          ))}
        </div>
      </div>

      {/* Iqamah Times */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Iqamah Times</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(iqamahTimes).map(([prayer, minutes]) => (
            <div key={prayer} className="space-y-2">
              <label className="block text-sm font-medium">{prayer}</label>
              <input
                type="number"
                value={minutes}
                onChange={(e) =>
                  setIqamahTimes((prev) => ({
                    ...prev,
                    [prayer]: Number(e.target.value),
                  }))
                }
                className="w-24 p-2 border rounded"
              />
              <span className="text-sm text-gray-600 ml-2">minutes</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
