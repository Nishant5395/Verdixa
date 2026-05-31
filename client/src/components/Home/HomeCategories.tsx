import { Link } from "react-router-dom";
import { categoriesData } from "../../assets/assets";

const HomeCategories = () => {
  return (
    <section className="py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">
              Browse Categories
            </h2>

            <p className="text-sm sm:text-base text-zinc-500 mt-2">
              Find fresh groceries and daily essentials
            </p>
          </div>

          <Link
            to="/products"
            className="hidden sm:block text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
          >
            View All
          </Link>
        </div>

        {/* Categories */}
        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
          {categoriesData.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              onClick={() => window.scrollTo(0, 0)}
              className="group flex flex-col items-center min-w-[110px] sm:min-w-[130px]"
            >
              
              {/* Image Container */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 p-3 rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-100 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Category Name */}
              <span className="mt-3 text-sm font-medium text-zinc-700 text-center leading-tight group-hover:text-orange-500 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCategories;