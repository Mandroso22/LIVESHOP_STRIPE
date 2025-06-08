"use client";

import dynamic from "next/dynamic";

const SuccessClient = dynamic(() => import("./SuccessClient"), {
  ssr: false,
});

export default function SuccessWrapper() {
  return <SuccessClient />;
}
