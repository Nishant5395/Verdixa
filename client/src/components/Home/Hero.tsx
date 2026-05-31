// import { ArrowRightIcon, LeafIcon } from "lucide-react";
// import { heroSectionData } from "../../assets/assets";
// import { Link } from "react-router-dom";

// const Hero = () => {
//   return (
//     <section className="relative overflow-hidden min-h-[540px] mb-10 rounded-3xl flex items-center">
//         <img src={heroSectionData.hero_image} alt="Hero"
//         className="absolute inset-0 h-full w-full object-cover"/>
//         <div className="absolute inset-0 bg-lineear-to-r from-app-green vai-app-green/65 to-transparent"/>
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
//         <div className="max-w-xl xl:p1-10">
//             <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-orange-300 bg-orange-300/10 rounded-full mb-5">
//                <LeafIcon className="size-3"/>Farm-fresh & Organic</span>
//                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-5">Nourish your home with <span className="text-orange-300">Earth's finest</span>
//                </h1>
//                <p className="text-base text-while/70 leading-relaxed mb-8 max-w-md">{heroSectionData.description}</p>
//                <div className="flex flex-wrap gap-3">
//                    <Link to="/products" className="px-7 py-3 bg-orange-400 text-white font-semibold rounded-full hover:bg-orange-500 transition-all flex-center gap-2 active:scale-[0.98]">Shop Now <ArrowRightIcon className="size-4"/></Link>

//                    <Link to="/products" className="px-7 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20">Browse Categories</Link>
//                </div>
//           </div>
//       </div>
//     </section>
//   )
// }

// export default Hero

import { ArrowRightIcon, LeafIcon, Clock3Icon, ShieldCheckIcon } from "lucide-react";
import { heroSectionData } from "../../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[650px] rounded-[32px] flex items-center mb-12">
      
      {/* Background Image */}
      <img
        src={heroSectionData.hero_image}
        alt="Fresh groceries"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-950/60 to-black/20" />

      {/* Decorative Blur */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-orange-400/20 blur-3xl rounded-full" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-2xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-orange-300 text-sm font-medium mb-6">
            <LeafIcon className="size-4" />
            Farm Fresh & 100% Organic
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight text-white mb-6">
            Fresh Groceries
            <span className="block text-orange-400">
              Delivered Fast
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-white/75 leading-relaxed max-w-xl mb-8">
            {heroSectionData.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/30 active:scale-95"
            >
              Shop Now
              <ArrowRightIcon className="size-4" />
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold transition-all duration-300"
            >
              Browse Categories
            </Link>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-6 text-white/80">

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white/10 backdrop-blur-md">
                <Clock3Icon className="size-5 text-orange-300" />
              </div>

              <div>
                <p className="font-semibold">10-Min Delivery</p>
                <p className="text-sm text-white/60">
                  Super fast delivery
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white/10 backdrop-blur-md">
                <ShieldCheckIcon className="size-5 text-orange-300" />
              </div>

              <div>
                <p className="font-semibold">Fresh Guarantee</p>
                <p className="text-sm text-white/60">
                  Quality checked daily
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card */}
      <div className="hidden lg:flex absolute bottom-10 right-10 bg-white rounded-3xl shadow-2xl p-5 items-center gap-4 w-72 animate-bounce">
        
        <img
          src={heroSectionData.hero_image}
          alt="Product"
          className="w-20 h-20 rounded-2xl object-cover"
        />

        <div>
          <p className="text-sm text-zinc-500">
            Today’s Special
          </p>

          <h3 className="font-bold text-lg text-zinc-900">
            Fresh Vegetables
          </h3>

          <p className="text-orange-500 font-semibold">
            Up to 40% OFF
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;