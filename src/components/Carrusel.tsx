import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carrusel() {
  const slides = [
    { id: 1, imgUrl: "imagenhotel1.png", title: "Hotel Stelar" },
    { id: 2, imgUrl: "imagen2.png", title: "Hotel Rissort" },
    { id: 3, imgUrl: "imagen3.png", title: "Hotel Nashei" },
  ];

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(nextSlide, 7000); // cambia cada 7s
    return () => clearInterval(interval);
  }, [nextSlide, paused]);

  return (
    <div
      className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-lg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-orange-500 pl-3">
        Los Más Valorados
      </h2>

      {/* Slides */}
      <div className="relative h-[400px] sm:h-[500px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.imgUrl}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-full bg-linear-to-t from-black/70 via-black/40 to-transparent text-white text-center py-3 text-lg font-semibold">
              {slide.title}
            </div>
          </div>
        ))}
      </div>

      {/* Flechas */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-linear-to-r from-black/40 to-transparent hover:from-black/70 text-white rounded-full p-2 transition"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-linear-to-l from-black/40 to-transparent hover:from-black/70 text-white rounded-full p-2 transition"
      >
        <ChevronRight />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-300 ${
              i === current ? "bg-white w-4" : "bg-white/50"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
