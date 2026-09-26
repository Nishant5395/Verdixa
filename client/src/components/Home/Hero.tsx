import { ArrowRightIcon } from "lucide-react";
import { heroSectionData } from "../../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-app-linen mb-14 sm:mb-20">
      <div className="grid md:grid-cols-[1.05fr_0.95fr] items-center gap-10 md:gap-16 px-6 sm:px-10 md:px-14 py-14 md:py-20">
        {/* Left: editorial copy */}
        <div className="max-w-xl">
          <p className="font-serif italic text-app-gold-dark text-lg sm:text-xl mb-5">
            Sourced this morning, at your door by evening.
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] text-app-ink mb-6">
            The market,
            <br />
            brought to your door.
          </h1>

          <p className="text-app-text-light text-base sm:text-lg leading-relaxed max-w-md mb-9">
            {heroSectionData.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-app-ink text-app-cream rounded-full font-semibold hover:bg-app-green transition-colors active:scale-[0.98]"
            >
              Shop the collection
              <ArrowRightIcon className="size-4" />
            </Link>

            <Link
              to="/deals"
              className="inline-flex items-center gap-1.5 text-app-ink font-medium border-b border-app-ink/30 hover:border-app-ink pb-0.5 transition-colors"
            >
              See today's deals
            </Link>
          </div>
        </div>

        {/* Right: a framed photograph, not a full-bleed overlay */}
        <div className="relative mx-auto md:mx-0 w-full max-w-sm md:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -top-5 -left-5 sm:-top-7 sm:-left-7 size-24 sm:size-28 rounded-full bg-app-gold-light"
          />
          <img
            src={heroSectionData.hero_image}
            alt="Fresh produce ready for delivery"
            className="relative w-full aspect-[4/5] object-cover rounded-[1.75rem] shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
