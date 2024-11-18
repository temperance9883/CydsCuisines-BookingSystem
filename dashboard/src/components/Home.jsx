import { useState, useEffect } from "react";

export default function Home() {
  const [index, setIndex] = useState(0);
  const totalImages = 5; // Number of images in the carousel

  // Function to move to the next image
  const showNextImage = () => {
    setIndex((prevIndex) => (prevIndex + 1) % totalImages); // Loop back to the first image after the last one
  };

  // Automatically switch images every 10 seconds
  useEffect(() => {
    const interval = setInterval(showNextImage, 10000);
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="text-white flex flex-col min-h-screen">
      {/* Carousel Section */}
      <section className="bg-black w-full max-w-4xl mx-auto mt-8 overflow-hidden rounded-lg shadow-lg">
        <div
          className="carousel flex transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${index * 75}%)`, // Adjust for each image width
          }}
        >
          <img
            src="/Couple.png"
            alt="Event Setup 1"
            className="w-4/5 object-cover h-80"
          />
          <img
            src="/Cyd's photo 1.png"
            alt="Event Setup 2"
            className="w-4/5 object-cover h-80"
          />
          <img
            src="/Cyd's photo.png"
            alt="Event Setup 3"
            className="w-4/5 object-cover h-80"
          />
          <img
            src="/Cyd'sphoto.png"
            alt="Event Setup 4"
            className="w-4/5 object-cover h-80"
          />
          <img
            src="/Food.png"
            alt="Event Setup 5"
            className="w-4/5 object-cover h-80"
          />
        </div>
      </section>

      {/* Quote Section */}
      <h1 className="home-quote text-center bg-cover bg-[url('/goldpaper.jpg')] p-3 border-b border-white rounded text-black mt-14 font-bold text-3xl">
        "Your personalized hub for seamless bookings and perfect events - all in
        one place."
      </h1>

      {/* Footer Section */}
      <footer className="text-center text-sm text-black w-full py-4 mt-auto">
        <p className="text-1xl">© 2024 Cyd's Cuisines. All rights reserved.</p>
      </footer>
    </div>
  );
}
