import React, { useState, useEffect } from "react";
import img1 from "../assets/AI Suggestion.png";
import img2 from "../assets/Goal Settings.png";
import img3 from "../assets/Expense Track img.png";
function DashboardCarousel() {
  const images = [
    {
      url: img1,
      title: "AI Suggestion",
    },
    {
      url: img2,
      title: "Goal Setting",
    },
    {
      url: img3,
      title: "Expense Tracking System",
    },
  ];

  const [current, setCurrent] = useState(0);

  // ✅ Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Helpers
  const prevIndex = (current - 1 + images.length) % images.length;
  const nextIndex = (current + 1) % images.length;

  return (
    <div className="relative w-full py-10 flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-white to-blue-50 rounded-3xl"></div>

      {/* LEFT SIDE IMAGE (Overlay) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-45 hidden md:block z-10">
        <img
          src={images[prevIndex].url}
          alt="prev"
          className="h-65 w-full object-cover rounded-2xl opacity-40 scale-90 blur-[1px] transition-all duration-500"
        />
      </div>

      {/* RIGHT SIDE IMAGE (Overlay) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-45 hidden md:block z-10">
        <img
          src={images[nextIndex].url}
          alt="next"
          className="h-65 w-full object-cover rounded-2xl opacity-40 scale-90 blur-[1px] transition-all duration-500"
        />
      </div>

      {/* CENTER CAROUSEL (UNCHANGED LOGIC) */}
      <div className="overflow-hidden w-full flex items-center justify-center z-20 px-10 rounded-2xl">
        {" "}
        <div
          className="flex transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: `translateX(-${current * 100}%)`,
            width: `${images.length * 100}%`,
          }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="w-full shrink-0 flex justify-center items-center"
            >
              <div
                className={`relative w-full max-w-5xl rounded-[28px] border border-gray-200 bg-white shadow-2xl overflow-hidden p-2"${
                  index === current
                    ? "scale-110 opacity-100"
                    : "scale-95 opacity-40"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="aspect-video w-full object-cover rounded-3xl"
                />

                {/* Gradient */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent rounded-b-[28px] p-6">
                  <h3 className="text-white text-xl font-semibold">
                    {img.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-6 flex justify-center w-full gap-3 z-30">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`cursor-pointer h-3 rounded-full transition-all duration-500 ${
              current === index
                ? "bg-blue-600 w-8"
                : "bg-gray-300 w-3 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardCarousel;
