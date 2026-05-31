import { MailIcon, SparklesIcon } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[36px] bg-gradient-to-br from-green-950 via-green-900 to-green-800 px-6 sm:px-10 py-16 shadow-2xl">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl" />

        <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-400/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          
          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center mx-auto mb-7 shadow-lg">
            <MailIcon
              className="size-10 text-orange-400"
              strokeWidth={1.7}
            />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-orange-300 text-sm font-medium mb-6">
            <SparklesIcon className="size-4" />
            Weekly Deals & Exclusive Offers
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-5">
            Subscribe To Our
            <span className="block text-orange-400">
              Newsletter
            </span>
          </h2>

          {/* Description */}
          <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-10">
            Get weekly updates on fresh groceries, seasonal offers,
            and exclusive discounts delivered straight to your inbox.
          </p>

          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
          >
            
            {/* Input */}
            <div className="flex-1 relative">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white placeholder:text-white/50 outline-none focus:border-orange-400 focus:bg-white/15 transition-all"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>

          {/* Bottom Text */}
          <p className="text-sm text-white/50 mt-5">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;