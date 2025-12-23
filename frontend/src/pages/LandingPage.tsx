import { useNavigate } from "react-router-dom";

export default function LandingPage() {
        const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  return (
    <div className="font-inter text-[#0E0E0E] bg-white min-h-screen">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between py-5 px-6">
          <img
            src="/logo.svg"
            alt="Logistic logo"
            className="h-12 w-auto flex-shrink-0 cursor-pointer"
            onClick={() => scrollToSection("home")}
          />
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("home")}
              className="px-5 py-2 border-2 border-[#1A00E2] rounded-full font-semibold text-[#1A00E2] hover:bg-[#1A00E2] hover:text-white transition"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-600 font-semibold hover:text-[#1A00E2] transition cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-gray-600 font-semibold hover:text-[#1A00E2] transition cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-600 font-semibold hover:text-[#1A00E2] transition cursor-pointer"
            >
              Contact
            </button>
          </div>
          <button
            className="px-6 py-2 border-2 border-[#1A00E2] rounded-full font-semibold text-[#1A00E2] hover:bg-[#1A00E2] hover:text-white transition"
            onClick={() => navigate("/signup")}
          >
            Get Stated
          </button>
        </div>
      </nav>

      <main>
        <section
          id="home"
          className="relative bg-white min-h-[92dvh] flex items-center overflow-hidden"
        >
          <div className="absolute bottom-0 left-0 w-full h-[50%] z-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 1920 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path d="M0 800L400 400L1920 600L1920 800Z" fill="#1A00E2" />
            </svg>
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 z-0 opacity-30">
            <svg
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="200"
                cy="200"
                r="180"
                fill="#1A00E2"
                fillOpacity="0.2"
              />
              <path
                d="M200 20 Q380 200 200 380 Q20 200 200 20"
                fill="#0066FF"
                fillOpacity="0.3"
              />
            </svg>
          </div>

          <div className="absolute bottom-0 right-0 w-96 h-96 z-0 opacity-20">
            <svg
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M400 400 Q200 300 0 400 Q200 200 400 0 Z"
                fill="#3329FF"
                fillOpacity="0.3"
              />
            </svg>
          </div>

          <div className="max-w-[1400px] mx-auto px-6 py-20 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="text-[#0E0E0E]">Elevating the</span>
                <br />
                <span className="text-[#0E0E0E]">world of</span>
                <br />
                <span className="text-[#1A00E2]">Logistics.</span>
              </h1>

              <p className="text-xl text-gray-600 max-w-lg">
                We set the standard in transporting goods from A to B.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-6">
                <button
                  className="px-8 py-4 border-2 border-[#1A00E2] rounded-lg font-semibold text-lg text-[#1A00E2] hover:bg-[#1A00E2] hover:text-white transition"
                  onClick={() => navigate("/signup")}
                >
                  Get Stated
                </button>

                <div className="flex items-center gap-4">
                  <button className="w-14 h-14 bg-white border border-[#1A00E2] rounded-full flex items-center justify-center hover:bg-[#000DA7] transition shadow-lg">
                    <svg
                      className="w-6 h-6 text-[#1A00E2]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </button>
                  <span className="text-lg font-semibold border border-[#1A00E2] bg-white rounded-full px-2">
                    Call us: +1 449 143 007
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-2xl">
                <img
                  src="/truck.svg"
                  alt="Truck"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-24 px-6 max-w-[1200px] mx-auto">
          <div className="flex items-center justify-center mb-6">
            <span className="w-2 h-2 rounded-full bg-[#1A00E2] mr-2" />
            <span className="text-xs font-semibold text-[#1A00E2] tracking-wide uppercase">
              Our Services
            </span>
          </div>

          <h2 className="text-3xl md:text-[34px] font-semibold text-center leading-snug">
            From cargo transit to
            <br />
            warehousing,
            <br />
            <span className="text-[#1A00E2]">
              we offer unparalleled support.
            </span>
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] overflow-hidden relative">
              <div className="relative">
                <img
                  src="/1.svg"
                  alt="Air Freight"
                  className="w-full h-[260px] object-cover"
                />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)] flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#1A00E2] flex items-center justify-center text-white text-xl">
                    ✈️
                  </div>
                </div>
              </div>
              <div className="pt-12 pb-8 px-8">
                <h3 className="font-semibold text-lg mb-2">Air Freight</h3>
                <p className="text-sm text-gray-600 mb-4">
                  In airfreight, the only constant is change – it's the
                  heartbeat of the sector.
                </p>
                <button className="text-sm font-semibold text-[#1A00E2] border-b border-[#1A00E2]">
                  Learn more
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] overflow-hidden relative">
              <div className="relative">
                <img
                  src="/2.svg"
                  alt="Ocean Freight"
                  className="w-full h-[260px] object-cover"
                />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)] flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#1A00E2] flex items-center justify-center text-white text-xl">
                    🚢
                  </div>
                </div>
              </div>
              <div className="pt-12 pb-8 px-8">
                <h3 className="font-semibold text-lg mb-2">Ocean Freight</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your unique ocean freight needs drive our specialized service
                  offerings.
                </p>
                <button className="text-sm font-semibold text-[#1A00E2] border-b border-[#1A00E2]">
                  Learn more
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] overflow-hidden relative">
              <div className="relative">
                <img
                  src="/3.svg"
                  alt="Land Express"
                  className="w-full h-[260px] object-cover"
                />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)] flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#1A00E2] flex items-center justify-center text-white text-xl">
                    🚚
                  </div>
                </div>
              </div>
              <div className="pt-12 pb-8 px-8">
                <h3 className="font-semibold text-lg mb-2">Land Express</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our non-asset Land model guarantees adaptive solutions,
                  superior service.
                </p>
                <button className="text-sm font-semibold text-[#1A00E2] border-b border-[#1A00E2]">
                  Learn more
                </button>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-gray-500">
            This is just the tip of the iceberg. We mold our services around
            your{" "}
            <span className="underline cursor-pointer">specific demands.</span>
          </p>

          <div className="mt-16 grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#1A00E2] to-[#1A00E2]/40">
                99%
              </div>
              <p className="mt-2 text-sm text-gray-700 font-semibold">
                Client satisfaction
              </p>
            </div>
            <div>
              <div className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#1A00E2] to-[#1A00E2]/40">
                13
              </div>
              <p className="mt-2 text-sm text-gray-700 font-semibold">
                Years of experience
              </p>
            </div>
            <div>
              <div className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#1A00E2] to-[#1A00E2]/40">
                570
              </div>
              <p className="mt-2 text-sm text-gray-700 font-semibold">
                Clients worldwide
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="bg-[#1A00E2] py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="bg-[#F5F4FF] rounded-[32px] grid md:grid-cols-2 overflow-hidden mb-12">
              <div className="px-10 py-12 md:py-16 flex flex-col justify-center items-left">
                <div className="inline-flex items-center text-xs font-semibold text-[#1A00E2] bg-white rounded-full px-4 py-2 mb-8 w-[110px]">
                  <span className="w-2 h-2 rounded-full bg-[#1A00E2] mr-2" />
                  About us
                </div>
                <h2 className="text-3xl md:text-[34px] font-semibold mb-4">
                  Logistics technology's future{" "}
                  <span className="text-[#1A00E2]">begins with us.</span>
                </h2>
                <button className="mt-6 w-[140px] inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#1A00E2] text-white text-sm font-semibold hover:bg-[#000DA7] transition">
                  Learn more
                </button>
              </div>
              <div className="relative flex items-stretch">
                <img
                  src="/4.svg"
                  alt="Warehouse"
                  className="w-full h-full object-cover"
                />
                <button className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-[0_10px_30px_rgba(15,23,42,0.35)]">
                  <span className="w-10 h-10 rounded-full border border-[#1A00E2] flex items-center justify-center">
                    <span className="ml-1 border-l-[10px] border-l-[#1A00E2] border-y-[6px] border-y-transparent" />
                  </span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-[24px] px-8 py-10">
                <div className="w-10 h-10 rounded-full border border-[#1A00E2] flex items-center justify-center text-[#1A00E2] mb-6 text-xl">
                  🚆
                </div>
                <h3 className="font-semibold mb-2 text-sm">Rail freight</h3>
                <p className="text-xs text-gray-600 mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <button className="text-xs font-semibold text-[#1A00E2] border-b border-[#1A00E2]">
                  Learn more
                </button>
              </div>
              <div className="bg-white rounded-[24px] px-8 py-10">
                <div className="w-10 h-10 rounded-full border border-[#1A00E2] flex items-center justify-center text-[#1A00E2] mb-6 text-xl">
                  🏭
                </div>
                <h3 className="font-semibold mb-2 text-sm">Warehousing</h3>
                <p className="text-xs text-gray-600 mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <button className="text-xs font-semibold text-[#1A00E2] border-b border-[#1A00E2]">
                  Learn more
                </button>
              </div>
              <div className="bg-white rounded-[24px] px-8 py-10">
                <div className="w-10 h-10 rounded-full border border-[#1A00E2] flex items-center justify-center text-[#1A00E2] mb-6 text-xl">
                  📦
                </div>
                <h3 className="font-semibold mb-2 text-sm">
                  Logistic services
                </h3>
                <p className="text-xs text-gray-600 mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <button className="text-xs font-semibold text-[#1A00E2] border-b border-[#1A00E2]">
                  Learn more
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-white py-24 px-6">
          <div className="max-w-[1200px] mx-auto bg-[#F5F4FF] rounded-[40px] grid md:grid-cols-2 overflow-hidden">
            <div className="bg-[#1A00E2] text-white px-10 py-12 md:py-16 flex flex-col justify-center">
              <div className="inline-flex items-center text-xs font-semibold bg-white/10 rounded-full px-4 py-2 mb-8 w-[120px]">
                <span className="w-2 h-2 rounded-full bg-white mr-2" />
                Contact us
              </div>
              <h2 className="text-3xl md:text-[34px] font-semibold leading-snug mb-6">
                Contact us to
                <br />
                request
                <br />
                <span className="text-white/70">a quote today.</span>
              </h2>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="uppercase text-xs tracking-wide text-white/60">
                    Email
                  </p>
                  <a
                    href="mailto:contact@logistic.com"
                    className="underline text-white"
                  >
                    contact@logistic.com
                  </a>
                </div>
                <div>
                  <p className="uppercase text-xs tracking-wide text-white/60">
                    Phone
                  </p>
                  <a href="tel:+134567800" className="underline text-white">
                    +1 345-678 00
                  </a>
                </div>
              </div>
            </div>

            <div className="px-10 py-12 md:py-16 bg-[#F5F4FF]">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Name
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1A00E2] focus:border-transparent"
                      defaultValue="John Doe"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Email
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1A00E2] focus:border-transparent"
                      defaultValue="contact@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Phone
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1A00E2] focus:border-transparent"
                      defaultValue="+1 345-678"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Company
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1A00E2] focus:border-transparent"
                      defaultValue="Add Company"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Message
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1A00E2] focus:border-transparent h-32 resize-none"
                    placeholder="Please type your message here..."
                  />
                </div>

                <button className="w-full mt-4 inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#1A00E2] text-white text-sm font-semibold hover:bg-[#000DA7] transition">
                  Get in Touch
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* footer section */}
        <section className="flex flex-col bg-[#1A00E2] pt-24">
          <div className="max-w-[1200px] mx-auto px-6 pb-20 grid md:grid-cols-2 items-center gap-10">
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-semibold mb-4">
                Taking the leap?
                <br />
                <span className="text-white/70">Secure your quote now.</span>
              </h2>
              <button
                className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-[#1A00E2] text-sm font-semibold hover:bg-gray-100 transition"
                onClick={() => navigate("/signup")}
              >
                Get Stated
              </button>
            </div>
            <div className="flex justify-end">
              <img
                src="5.svg"
                alt="Container"
                className="w-full max-w-[520px] h-auto object-contain"
              />
            </div>
          </div>

          <footer className="bg-[#05040C] text-gray-300 px-6 py-16">
            <div className="max-w-[1200px] mx-auto grid gap-12 sm:grid-cols-2 md:grid-cols-[2fr_1.2fr_1.2fr_1.2fr]">
              {/* Brand / Newsletter */}
              <div>
                <div className="text-white text-xl font-semibold mb-4">
                  Logistic
                </div>
                <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                  Turn to Logistic for the best-in-class Webflow Template
                  tailored for modern freight.
                </p>

                <div className="mt-8">
                  <p className="text-sm font-semibold mb-3">
                    Sign up for our newsletter
                  </p>
                  <div className="flex items-center bg-black rounded-full border border-gray-700 overflow-hidden max-w-sm">
                    <input
                      type="email"
                      className="flex-1 bg-transparent px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 outline-none"
                      placeholder="Enter your email..."
                    />
                    <button className="w-10 h-10 mr-1 rounded-full bg-[#1A00E2] flex items-center justify-center text-white text-lg hover:bg-[#2a18ff] transition">
                      →
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">
                  Navigation
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="hover:text-white cursor-pointer">Home</li>
                  <li className="hover:text-white cursor-pointer">About</li>
                  <li className="hover:text-white cursor-pointer">Packages</li>
                  <li className="hover:text-white cursor-pointer">
                    Style Guide
                  </li>
                  <li className="hover:text-white cursor-pointer">Licensing</li>
                  <li className="hover:text-white cursor-pointer">Legal</li>
                </ul>
              </div>

              {/* Practice Areas */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">
                  Practice Areas
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="hover:text-white cursor-pointer">
                    Air Freight
                  </li>
                  <li className="hover:text-white cursor-pointer">
                    Ocean Freight
                  </li>
                  <li className="hover:text-white cursor-pointer">
                    Land Express
                  </li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">
                  Find us
                </h4>
                <div className="flex items-center gap-4 text-lg text-gray-400">
                  <span className="hover:text-white cursor-pointer">X</span>
                  <span className="hover:text-white cursor-pointer">f</span>
                  <span className="hover:text-white cursor-pointer">in</span>
                </div>
              </div>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
