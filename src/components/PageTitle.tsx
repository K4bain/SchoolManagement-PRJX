"use client";

import { useEffect } from "react";

export function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = `${title} — SchoolHub`;
    return () => {
      document.title = "SchoolHub";
    };
  }, [title]);

  return null;
}
