import dynamic from "next/dynamic";
import type { Metadata } from "next";

const MapApp = dynamic(() => import("../components/MapApp"), { ssr: false });

export const metadata: Metadata = {
  title: "Umeda Survival Map",
  description: "Find toilets, coin lockers, ATMs and station exits around Umeda.",
};

export default function HomePage() {
  return <MapApp />;
}
