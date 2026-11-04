import type { Metadata } from "next";
import AboutStory from "@/components/AboutStory";
import Cta from "@/components/Cta";
import "./about.css";

export const metadata: Metadata = {
  title: "About",
  description: "Why we bake at night, how a loaf is made, and what we stand for.",
};

export default function AboutPage() {
  return (
    <>
      <AboutStory />
      <Cta />
    </>
  );
}
