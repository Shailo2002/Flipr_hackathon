import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="font-inter text-[#0E0E0E]">
      {/* NAVBAR */}
      <nav className="border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between py-5 px-4">
          <div className="text-xl font-bold">Logistic</div>

          <div className="hidden md:flex items-center gap-6">
            <span className="px-5 py-2 border-2 border-[#1A00E2] rounded-full font-semibold text-[#1A00E2]">
              Home
            </span>
            <span className="text-gray-500 font-semibold">About</span>
            <span className="text-gray-500 font-semibold">Packages</span>
            <span className="text-gray-500 font-semibold">News</span>
            <span className="text-gray-500 font-semibold">Services</span>
          </div>

          <div
            className="text-[#1A00E2] font-semibold cursor-pointer hover:text-blue-500"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-r from-[#3329FF] to-[#1A00E2] text-white">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16 px-4 py-28 items-center">
          <div>
            <h1 className="text-[64px] leading-[1.1] font-semibold">
              Elevating the world of{" "}
              <span className="opacity-80">Logistics.</span>
            </h1>

            <p className="mt-6 text-white/80">
              We set the standard in transporting goods from A to B.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <button className="bg-white text-[#1A00E2] px-6 py-3 rounded-lg font-semibold">
                Get a Quote
              </button>
              <span className="opacity-90">📞 +1 449 143 007</span>
            </div>
          </div>

          <div className="bg-white rounded-[30px] p-8">
            <div className="h-[320px] bg-gray-200 rounded-2xl flex items-center justify-center">
              Truck Image
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-28 px-4 max-w-[1200px] mx-auto">
        <h2 className="text-[44px] font-semibold text-center mb-16">
          From cargo transit to warehousing, we offer unparalleled support.
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {["Air Freight", "Ocean Freight", "Land Express"].map((title) => (
            <div
              key={title}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="h-[260px] bg-gray-200 flex items-center justify-center">
                Image
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl">{title}</h3>
                <p className="text-gray-500 mt-2">
                  Professional and scalable logistics solutions.
                </p>
                <span className="inline-block mt-4 font-semibold text-[#1A00E2]">
                  Learn more →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#F8F7FF] py-20">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 text-center gap-10">
          {[
            ["99%", "Client satisfaction"],
            ["13", "Years of experience"],
            ["570", "Clients worldwide"],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="text-[120px] font-semibold text-[#1A00E2] leading-none">
                {num}
              </div>
              <p className="font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-[1200px] mx-auto px-4 py-28">
        <div className="bg-[#F8F7FF] rounded-[50px] grid md:grid-cols-2 gap-16 p-16 items-center">
          <div>
            <h2 className="text-[44px] font-semibold mb-8">
              Logistics technology’s future begins with us.
            </h2>
            <button className="bg-[#1A00E2] text-white px-6 py-3 rounded-lg font-semibold">
              Learn more
            </button>
          </div>

          <div className="h-[420px] bg-gray-300 rounded-[30px] flex items-center justify-center">
            Warehouse Image
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-[#F8F7FF] py-28 px-4">
        <h2 className="text-[44px] font-semibold text-center mb-16">
          Discover what our satisfied clients are saying about us.
        </h2>

        <div className="max-w-[900px] mx-auto bg-white rounded-[30px] p-16 text-center">
          <p className="text-xl font-semibold mb-6">
            “I’ve worked with several logistics platforms, but this one truly
            stands out.”
          </p>
          <p className="font-semibold">Katie M.</p>
          <p className="text-gray-500">Marketing Manager</p>
        </div>
      </section>

      {/* BLOG */}
      <section className="py-28 px-4 max-w-[1200px] mx-auto">
        <h2 className="text-[44px] font-semibold text-center mb-16">
          Discover the latest tips, trends and ideas.
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-[200px] bg-gray-200 rounded-lg mb-4">
                Blog Image
              </div>
              <h3 className="font-semibold text-xl">
                Logistics trends shaping the future
              </h3>
              <span className="inline-block mt-4 font-semibold text-[#1A00E2]">
                Read more →
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1A00E2] text-white py-28 text-center px-4">
        <h2 className="text-[50px] font-semibold mb-8">
          Taking the leap? Secure your quote now.
        </h2>
        <button className="bg-white text-[#1A00E2] px-8 py-4 rounded-lg font-semibold">
          Get a Quote
        </button>
      </section>

      {/* CONTACT */}
      <section className="max-w-[1200px] mx-auto px-4 py-28">
        <div className="bg-[#F8F7FF] rounded-[50px] grid md:grid-cols-2 gap-16 p-16">
          <div className="bg-[#1A00E2] text-white rounded-[30px] p-10">
            <h2 className="text-[44px] font-semibold mb-6">
              Contact us to request a quote today.
            </h2>
            <p>Email: contact@logistic.com</p>
            <p className="mt-2">Phone: +1 345-678 00</p>
          </div>

          <form className="grid gap-4">
            <input className="p-4 rounded-lg border" placeholder="Name" />
            <input className="p-4 rounded-lg border" placeholder="Email" />
            <input className="p-4 rounded-lg border" placeholder="Phone" />
            <input className="p-4 rounded-lg border" placeholder="Company" />
            <textarea
              className="p-4 rounded-lg border h-28"
              placeholder="Message"
            />
            <button className="bg-[#1A00E2] text-white py-4 rounded-lg font-semibold">
              Get in Touch
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0E0E0E] text-gray-500 py-12 text-center">
        © Logistic. All rights reserved.
      </footer>
    </div>
  );
}
