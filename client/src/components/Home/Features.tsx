import { heroSectionData } from "../../assets/assets";

const Features = () => {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Container */}
        <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-zinc-200">
            
            {heroSectionData.hero_features.map((feature, i) => (
              <div
                key={i}
                className="group flex items-start gap-4 p-6 hover:bg-orange-50/40 transition-all duration-300"
              >
                
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="size-6" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-zinc-900 mb-1">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;