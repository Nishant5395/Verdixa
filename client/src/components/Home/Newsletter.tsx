import { ArrowRightIcon } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl text-app-ink leading-tight mb-4">
          What's in season, in your inbox.
        </h2>

        <p className="text-zinc-500 text-base leading-relaxed mb-9 max-w-lg mx-auto">
          One email a week: fresh arrivals, seasonal picks, and the deals worth
          knowing about. No spam, unsubscribe anytime.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Your email address"
            required
            className="flex-1 min-w-0 px-5 py-3.5 rounded-full bg-white border border-zinc-200 outline-none focus:border-app-gold transition-colors"
          />

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-app-ink hover:bg-app-green text-app-cream font-semibold rounded-full transition-colors whitespace-nowrap"
          >
            Subscribe
            <ArrowRightIcon className="size-4" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
