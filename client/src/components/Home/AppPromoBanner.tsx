// // import {
// //   appPromoBannerData,
// //   assets,
// // } from "../../assets/assets";

// // import {
// //   AppleIcon,
// //   PlayCircleIcon,
// //   StarIcon,
// // } from "lucide-react";

// // const AppPromoBanner = () => {
// //   return (
// //     <section className="py-16">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// //         {/* Banner */}
// //         <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-green-950 via-green-900 to-green-800 px-6 sm:px-10 lg:px-14 py-14 shadow-2xl">
          
// //           {/* Glow Effects */}
// //           <div className="absolute top-0 right-0 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl" />

// //           <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-400/10 rounded-full blur-3xl" />

// //           {/* Content */}
// //           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            
// //             {/* Left Content */}
// //             <div className="max-w-xl text-center lg:text-left">
              
// //               {/* Badge */}
// //               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-orange-300 text-sm font-medium mb-6">
// //                 <StarIcon className="size-4 fill-orange-300 text-orange-300" />
// //                 #1 Grocery Delivery App
// //               </div>

// //               {/* Heading */}
// //               <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
// //                 Groceries Delivered
// //                 <span className="block text-orange-400">
// //                   In Minutes
// //                 </span>
// //               </h2>

// //               {/* Description */}
// //               <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8">
// //                 {appPromoBannerData.description}
// //               </p>

// //               {/* Buttons */}
// //               <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                
// //                 {/* App Store */}
// //                 <button className="flex items-center gap-3 px-5 py-3.5 bg-white hover:bg-orange-50 text-zinc-900 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105">
                  
// //                   <AppleIcon className="size-7" />

// //                   <div className="text-left">
// //                     <p className="text-[11px] text-zinc-500">
// //                       Download on the
// //                     </p>

// //                     <p className="text-sm font-semibold">
// //                       App Store
// //                     </p>
// //                   </div>
// //                 </button>

// //                 {/* Google Play */}
// //                 <button className="flex items-center gap-3 px-5 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-2xl transition-all duration-300 hover:scale-105">
                  
// //                   <PlayCircleIcon className="size-7 text-orange-400" />

// //                   <div className="text-left">
// //                     <p className="text-[11px] text-white/60">
// //                       GET IT ON
// //                     </p>

// //                     <p className="text-sm font-semibold">
// //                       Google Play
// //                     </p>
// //                   </div>
// //                 </button>
// //               </div>

// //               {/* Stats */}
// //               <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-10">
                
// //                 <div>
// //                   <h3 className="text-2xl font-bold text-white">
// //                     10M+
// //                   </h3>

// //                   <p className="text-sm text-white/60">
// //                     App Downloads
// //                   </p>
// //                 </div>

// //                 <div>
// //                   <h3 className="text-2xl font-bold text-white">
// //                     4.5★
// //                   </h3>

// //                   <p className="text-sm text-white/60">
// //                     User Ratings
// //                   </p>
// //                 </div>

// //                 <div>
// //                   <h3 className="text-2xl font-bold text-white">
// //                     15 Min
// //                   </h3>

// //                   <p className="text-sm text-white/60">
// //                     Average Delivery
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Right Image */}
// //             <div className="relative">
              
// //               {/* Glow */}
// //               <div className="absolute inset-0 bg-orange-400/20 blur-3xl rounded-full" />

// //               <img
// //                 src={assets.delivery_truck}
// //                 alt="Delivery Truck"
// //                 className="relative w-full max-w-sm lg:max-w-lg object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default AppPromoBanner;

// import { assets } from "../../assets/assets";
// import {
//   MapPinnedIcon,
//   WalletIcon,
//   RotateCcwIcon,
//   MessageCircleIcon,
// } from "lucide-react";

// const trustPoints = [
//   {
//     icon: MapPinnedIcon,
//     title: "Live tracking, start to finish",
//     desc: "Watch your rider on the map, and hand-off is confirmed with a delivery code.",
//   },
//   {
//     icon: WalletIcon,
//     title: "Pay your way",
//     desc: "Card or cash on delivery - whichever's easier for you.",
//   },
//   {
//     icon: RotateCcwIcon,
//     title: "Change your mind",
//     desc: "Cancel any order yourself, right up until we start packing it.",
//   },
//   {
//     icon: MessageCircleIcon,
//     title: "Real answers, instantly",
//     desc: "Ask our support chat about your order, a coupon, or anything else.",
//   },
// ];

// const AppPromoBanner = () => {
//   return (
//     <section className="py-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="relative overflow-hidden rounded-[2.5rem] bg-app-ink px-6 sm:px-10 lg:px-14 py-14">
//           <div className="relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-12">
//             {/* Left: trust points */}
//             <div>
//               <h2 className="font-serif text-3xl sm:text-4xl text-app-cream leading-tight mb-4">
//                 Every order, held to the same standard.
//               </h2>

//               <p className="text-app-cream/60 text-base leading-relaxed max-w-md mb-10">
//                 Here's what stays true no matter what's in your cart.
//               </p>

//               <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
//                 {trustPoints.map((point) => (
//                   <div key={point.title} className="flex gap-4">
//                     <point.icon className="size-6 text-app-gold shrink-0 mt-0.5" />
//                     <div>
//                       <h3 className="text-app-cream font-semibold mb-1">{point.title}</h3>
//                       <p className="text-app-cream/55 text-sm leading-relaxed">{point.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right: illustration */}
//             <div className="hidden lg:block">
//               <img
//                 src={assets.delivery_truck}
//                 alt=""
//                 className="w-full max-w-md mx-auto object-contain"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AppPromoBanner;

import { assets } from "../../assets/assets";
import {
  MapPinnedIcon,
  WalletIcon,
  RotateCcwIcon,
  MessageCircleIcon,
} from "lucide-react";

const trustPoints = [
  {
    icon: MapPinnedIcon,
    title: "Live tracking, start to finish",
    desc: "Watch your rider on the map, and hand-off is confirmed with a delivery code.",
  },
  {
    icon: WalletIcon,
    title: "Pay your way",
    desc: "Card or cash on delivery - whichever's easier for you.",
  },
  {
    icon: RotateCcwIcon,
    title: "Change your mind",
    desc: "Cancel any order yourself, right up until we start packing it.",
  },
  {
    icon: MessageCircleIcon,
    title: "Real answers, instantly",
    desc: "Ask our support chat about your order, a coupon, or anything else.",
  },
];

const AppPromoBanner = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-app-ink px-6 sm:px-10 lg:px-14 py-14">
          <div className="relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-12">
            {/* Left: trust points */}
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl text-app-cream leading-tight mb-4">
                Every order, held to the same standard.
              </h2>

              <p className="text-app-cream/60 text-base leading-relaxed max-w-md mb-10">
                Here's what stays true no matter what's in your cart.
              </p>

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                {trustPoints.map((point) => (
                  <div key={point.title} className="flex gap-4">
                    <point.icon className="size-6 text-app-gold shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-app-cream font-semibold mb-1">{point.title}</h3>
                      <p className="text-app-cream/55 text-sm leading-relaxed">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: illustration */}
            <div className="hidden lg:block">
              <img
                src={assets.delivery_truck}
                alt=""
                className="w-full max-w-md mx-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromoBanner;
