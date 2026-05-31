// const FilterPanel = ({categories,category,minPrice,maxPrice,updateFilter,clearFilters,hasFilters}:any) => {
//     const categoriesWithAll=[{slug:"",name:"All Categories"},...categories]
//   return (
//     <div className="space-y-6">
//         {/* Categories */}
//       <div>
//         <h3 className="text-sm font-semibold text-app-green mb-3">Categories</h3>
//         <div className="space-y-1.5">
//             {categoriesWithAll.map((cat:any)=>(
//                 <button key={cat.slug}
//                 onClick={()=>updateFilter("category",cat.slug)}
//                 className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-all ${category === cat.slug ? "bg-app-green text-white": "text-app-text-light hover:bg-app-cream"}`}>{cat.name}</button>
//             ))}
//         </div>
//       </div>
//       {/* Price Range */}
//       <div>
//         <h3 className="text-sm font-semibold text-app-green mb-3">Price Range</h3>
//         <div className="flex items-center gap-2">
//           <input type="number" placeholder="Min" value={minPrice}
//           onChange={(e)=>updateFilter('minPrice',e.target.value)}
//           className="w-full px-3 py-2 text-sm bg-white rounded-lg border not-focus:border-app-border"/>
//           <span className="text-app-text-light">-</span>

//           <input type="number" placeholder="Max" value={maxPrice}
//           onChange={(e)=>updateFilter('maxPrice',e.target.value)}
//           className="w-full px-3 py-2 text-sm bg-white rounded-lg border not-focus:border-app-border"/>

//         </div>
//       </div>
//       {hasFilters && (
//         <button onClick={clearFilters}
//         className="w-full py-2 text-sm text-app-error hover:bg-red-50 rounded-lg transition-colors font-medium">Clear All Filters</button>
//       )}

//     </div>
//   )
// }

// export default FilterPanel
import {
  LeafIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

interface Props {
  categories: any[];
  category: string;
  organic: string;
  minPrice: string;
  maxPrice: string;
  updateFilter: (
    key: string,
    value: string
  ) => void;
  clearFilters: () => void;
  hasFilters: boolean;
}

const FilterPanel = ({
  categories,
  category,
  organic,
  minPrice,
  maxPrice,
  updateFilter,
  clearFilters,
  hasFilters,
}: Props) => {
  const categoriesWithAll = [
    {
      slug: "",
      name: "All Categories",
    },
    ...categories,
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-orange-100 flex items-center justify-center">
            <SlidersHorizontalIcon className="size-4 text-orange-500" />
          </div>

          <div>
            <h2 className="font-semibold text-zinc-900">
              Filters
            </h2>

            <p className="text-xs text-zinc-500">
              Refine your products
            </p>
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">
          Categories
        </h3>

        <div className="space-y-2">
          {categoriesWithAll.map((cat: any) => (
            <button
              key={cat.slug}
              onClick={() =>
                updateFilter(
                  "category",
                  cat.slug
                )
              }
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                category === cat.slug
                  ? "bg-green-950 text-white shadow-md"
                  : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700"
              }`}
            >
              <span>{cat.name}</span>

              {category === cat.slug && (
                <span className="size-2 rounded-full bg-orange-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Organic Filter */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">
          Preferences
        </h3>

        <button
          onClick={() =>
            updateFilter(
              "organic",
              organic === "true"
                ? ""
                : "true"
            )
          }
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
            organic === "true"
              ? "bg-green-950 text-white"
              : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <LeafIcon className="size-4" />

            <span className="text-sm font-medium">
              Organic Products
            </span>
          </div>

          <div
            className={`w-5 h-5 rounded-md border flex items-center justify-center ${
              organic === "true"
                ? "bg-orange-400 border-orange-400"
                : "border-zinc-300"
            }`}
          >
            {organic === "true" && (
              <div className="size-2 rounded-full bg-white" />
            )}
          </div>
        </button>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">
          Price Range
        </h3>

        <div className="flex items-center gap-3">
          
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
              $
            </span>

            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) =>
                updateFilter(
                  "minPrice",
                  e.target.value
                )
              }
              className="w-full pl-7 pr-3 py-3 text-sm bg-white border border-zinc-200 rounded-2xl outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all"
            />
          </div>

          <span className="text-zinc-400">
            —
          </span>

          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
              $
            </span>

            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) =>
                updateFilter(
                  "maxPrice",
                  e.target.value
                )
              }
              className="w-full pl-7 pr-3 py-3 text-sm bg-white border border-zinc-200 rounded-2xl outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Clear Button */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 transition-all font-medium"
        >
          <RotateCcwIcon className="size-4" />
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default FilterPanel;