"use client";

import { usePrayerStore } from "@/components/prayertime/usePrayerStore";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const {
    initialize,
    initialized,
    initializing,
    error,
    hijriDateOffset,
    adhan,
    iqamah,
    setHijriDateOffset,
    setAdhan,
    setIqamah,
    save,
  } = usePrayerStore();

  const [offset, setOffset] = useState(hijriDateOffset);
  const [adhanTimes, setAdhanTimes] = useState(adhan);
  const [iqamahTimes, setIqamahTimes] = useState(iqamah);

  const handleSave = async () => {
    setHijriDateOffset(offset);
    setAdhan(adhanTimes);
    setIqamah(iqamahTimes);

    await save();
  };

  useEffect(() => {
    // Only initialize if it hasn't been done yet
    if (!initialized && !initializing) {
      initialize();
    }
  }, [initialized, initializing, initialize]);

  if (initializing) {
    return <div className="p-6">Loading settings...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Prayer Settings</h1>

      {/* Hijri Date Offset */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Iqamah Times</h2>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Hijri Date Offset</label>
          <NumberInput
            value={offset}
            onChange={(val) => setOffset(val)}
            label="Hijri Date Offset"
          />
        </div>
      </div>

      {/* Adhan Times */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Adzan Times</h2>
        {Object.entries(adhanTimes).map(([prayer, minutes]) => (
          <div key={prayer} className="space-y-2">
            <label className="block text-sm font-medium">{prayer}</label>
            <NumberInput
              value={minutes}
              onChange={(val) => setAdhanTimes((prev) => ({ ...prev, [prayer]: Number(val) }))}
              label="minutes"
            />
          </div>
        ))}
      </div>

      {/* Iqamah Times */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Iqamah Times</h2>

        {Object.entries(iqamahTimes).map(([prayer, minutes]) => (
          <div key={prayer} className="space-y-2">
            <label className="block text-sm font-medium">{prayer}</label>
            <NumberInput
              value={minutes}
              onChange={(val) =>
                setIqamahTimes((prev) => ({
                  ...prev,
                  [prayer]: Number(val),
                }))
              }
              label="minutes"
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
