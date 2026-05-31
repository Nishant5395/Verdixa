import {
  appPromoBannerData,
  assets,
} from "../../assets/assets";

import {
  AppleIcon,
  PlayCircleIcon,
  StarIcon,
} from "lucide-react";

const AppPromoBanner = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Banner */}
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-green-950 via-green-900 to-green-800 px-6 sm:px-10 lg:px-14 py-14 shadow-2xl">
          
          {/* Glow Effects */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl" />

          <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-400/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Content */}
            <div className="max-w-xl text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-orange-300 text-sm font-medium mb-6">
                <StarIcon className="size-4 fill-orange-300 text-orange-300" />
                #1 Grocery Delivery App
              </div>

              {/* Heading */}
              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
                Groceries Delivered
                <span className="block text-orange-400">
                  In Minutes
                </span>
              </h2>

              {/* Description */}
              <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8">
                {appPromoBannerData.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                
                {/* App Store */}
                <button className="flex items-center gap-3 px-5 py-3.5 bg-white hover:bg-orange-50 text-zinc-900 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105">
                  
                  <AppleIcon className="size-7" />

                  <div className="text-left">
                    <p className="text-[11px] text-zinc-500">
                      Download on the
                    </p>

                    <p className="text-sm font-semibold">
                      App Store
                    </p>
                  </div>
                </button>

                {/* Google Play */}
                <button className="flex items-center gap-3 px-5 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-2xl transition-all duration-300 hover:scale-105">
                  
                  <PlayCircleIcon className="size-7 text-orange-400" />

                  <div className="text-left">
                    <p className="text-[11px] text-white/60">
                      GET IT ON
                    </p>

                    <p className="text-sm font-semibold">
                      Google Play
                    </p>
                  </div>
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-10">
                
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    10M+
                  </h3>

                  <p className="text-sm text-white/60">
                    App Downloads
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    4.5★
                  </h3>

                  <p className="text-sm text-white/60">
                    User Ratings
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    15 Min
                  </h3>

                  <p className="text-sm text-white/60">
                    Average Delivery
                  </p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              
              {/* Glow */}
              <div className="absolute inset-0 bg-orange-400/20 blur-3xl rounded-full" />

              <img
                src={assets.delivery_truck}
                alt="Delivery Truck"
                className="relative w-full max-w-sm lg:max-w-lg object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromoBanner;