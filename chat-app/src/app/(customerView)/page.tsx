import AboutSectionOne from "@/components/(customerView)/About/AboutSectionOne";
import AboutSectionTwo from "@/components/(customerView)/About/AboutSectionTwo";
import Blog from "@/components/(customerView)/Blog";
import Brands from "@/components/(customerView)/Brands";
import ScrollUp from "@/components/(customerView)/Common/ScrollUp";
// import Contact from "@/components/(customerView)/Contact";
import Features from "@/components/(customerView)/Features";
import Hero from "@/components/(customerView)/Hero";
import Pricing from "@/components/(customerView)/Pricing";
import Testimonials from "@/components/(customerView)/Testimonials";
import Header from "@/components/(customerView)/Header"
// import Video from "@/components/(customerView)/Video";


export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      {/* <Video /> */}
      <Brands />
      <AboutSectionOne />
      <AboutSectionTwo />
      <Testimonials />
      <Pricing />
      <Blog />
      {/* <Contact /> */}
    </>
  );
}