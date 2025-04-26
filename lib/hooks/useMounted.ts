"use client";

import { useEffect, useState } from "react";

export default function useMounted() {
  const [mount, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mount;
}
