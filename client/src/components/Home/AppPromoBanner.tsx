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
