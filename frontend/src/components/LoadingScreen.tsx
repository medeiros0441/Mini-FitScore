// src/components/LoadingScreen.tsx
"use client";

import { LoaderCircle } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Carregando..." }: LoadingScreenProps) {
  return (
        <div className="flex flex-col items-center justify-center h-60 gap-4">
          <LoaderCircle className="animate-spin w-16 h-16 text-gray-800" />
          <p className="text-gray-900 text-lg text-center">{message}</p>
        </div>
  );
}
