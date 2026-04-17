"use client";

import { useEffect } from "react";
import { recordActivity } from "@/lib/streak";

export default function RecordActivity() {
  useEffect(() => { recordActivity(); }, []);
  return null;
}
