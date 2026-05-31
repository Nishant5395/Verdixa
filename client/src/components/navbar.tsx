// import { ArrowUpRightIcon, BikeIcon, ChevronDownIcon, LogOutIcon, MapPinIcon, MenuIcon, PackageIcon, SearchIcon, ShieldIcon, ShoppingCartIcon, UserIcon, XIcon } from "lucide-react";
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";


// const navbar = () => {
//     const user: any={name:"John Doe",email:"john@example.com",isAdimin:true}
//     const {cartCount,setIsCartOpen}={
//         cartCount:5,
//         setIsCartOpen:(_data:any)=>{}

//     };
//     const [searchQuery,setSearchQuery]=useState("")
//     const [userMenuOpen,setUserMenuOpen]=useState(false)
//     const navigate=useNavigate()
//     const handleSearch=(e:React.SubmitEvent)=>{
//         e.preventDefault()
//         if(searchQuery.trim()){
//             navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
//             setSearchQuery("")
//         }
//     }
//     const handleLogout=()=>{
//         setUserMenuOpen(false)
//         navigate("/")
//     }
    
//   return (
//    <nav className="bg-white sticky top-0 z-50 border-app-border">
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
//         {/* Logo */}
//         <Link to='/' className="flex items-center gap-2 text-[22px] font-medium shrink-0">
//         <BikeIcon size={24} />Instacart
//         </Link>
//         <div className="w-full flex items-center justify-end gap-4 lg:gap-10">
//             {/*Nav Links-Desktop */}
//             <div className="hidden md:flex items-center gap-6 text-sm text-zinc-600">
//                 <Link to='/'>Home</Link>
//                 <Link to='/products'>Products</Link>
//                 <Link to='/deals' className="text-app-orange">Deals</Link>
//             </div>
//             {/* Search */}
//             <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-sm text-xs sm:text-sm">
//                 <div className="relative w-full">
//                     <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500"/>
//                     <input type="text"
//                     placeholder="Search for groceries..."
//                     value={searchQuery}
//                     onChange={(e)=>setSearchQuery(e.target.value)}
//                     className="w-full pl-8 p-2 bg-orange-50 rounded-full ring ring-app-orange/15 focus:ring-app-orange/30"/>
//                 </div>

//             </form>
//             {/*Right actions */}
//             <div className="flex items-center gap-3">
//                 {/* Cart */}
//                 <button className="relative p-2 rounded-xl" onClick={()=>setIsCartOpen(true)}>
//                     <ShoppingCartIcon className="size-5 text-zinc-900"/>
//                     {cartCount>0 && <span className="absolute -top-1 -right-1 size-4 bg-app-orange text-white text-[10px] rounded-full flex-center">{cartCount}</span>}
//                 </button>
//                 {/* User */}
//                 <div className="relative">
//                     {user ? (
//                         <button onClick={()=>setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-2">
//                             <div className="size-7 rounded-full bg-green-950 text-white flex-center">{user.name.charAt(0).toUpperCase()}</div>
//                             <ChevronDownIcon className="size-3 text-zinc-500"/>

//                         </button>
//                     )
//                     : (
//                         <div className="flex-center gap-2">
//                             <Link to='/login' className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-950-light transition-colors">
//                             <UserIcon size={16}/>sign In
//                             </Link>
//                             {userMenuOpen ? <XIcon className="md:hidden"
//                             onClick={()=>setUserMenuOpen(!userMenuOpen)}/>:
//                             <MenuIcon className="md:hidden" onClick={()=>setUserMenuOpen(!userMenuOpen)}/>}
//                         </div>
//                     )}
//                     {userMenuOpen && (
//                         <>
//                         <div className="fixed inset-0 z-40" onClick={()=>setUserMenuOpen(false)}/>
//                             <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-xl shadow-lg border
//                             border-app-border py-2 z-50 animate-fade-in">{user && (
//                                 <div className="px-4 py-2 border-b border-app-border">
//                                     <p className="text-sm font-medium text-zinc-900">{user?.name}</p>
//                                     <p className="text-xs text-zinc-500">{user?.email}</p>
//                                     </div>
//                             )}
//                             <div onClick={()=>setUserMenuOpen(false)}>
//                                 {!user && <Link to='/login' className="dropdown-link"><UserIcon size={16}/>Sign In </Link>}
//                                 {user && <Link to='/orders' className="dropdown-link"><PackageIcon size={16}/>My Orders</Link>}
//                                 {user && <Link to='/addresses' className="dropdown-link"><MapPinIcon size={16}/>Addresses</Link>}
//                                 <Link to='/products' className="dropdown-link md:hidden"><ArrowUpRightIcon size={16}/>Products</Link>
//                                 <Link to='/deals' className="dropdown-link md:hidden"><ArrowUpRightIcon size={16}/>Deals</Link>
//                                 {user?.isAdmin && (
//                                      <Link to='/admin/products' className="dropdown-link"><ShieldIcon className="text-app-orange-dark" size={16}/>
//                                      <span className="text-app-orange-dark">Admin Panel</span></Link>
//                                 )}
//                                 {user && (
//                                     <div className="border-t border-app-border pt-1">
//                                         <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-app-error hover:bg-red-50 w-full transition-colors">
//                                             <LogOutIcon size={16} />Logout
//                                         </button>
//                                         </div>
//                                 )}
//                             </div>
//                             </div>
                        
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     </div>
//    </nav>
//   )
// }

// export default navbar

import {
  ArrowUpRightIcon,
  BikeIcon,
  ChevronDownIcon,
  LogOutIcon,
  MapPinIcon,
  MenuIcon,
  PackageIcon,
  SearchIcon,
  ShieldIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const user: any = {
    name: "John Doe",
    email: "john@example.com",
    isAdmin: true,
  };

  const { cartCount, setIsCartOpen } = useCart()

  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-green-700 shrink-0"
        >
          <BikeIcon size={28} />
          <span>Instacart</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-700">
          <Link to="/" className="hover:text-green-700 transition-colors">
            Home
          </Link>

          <Link
            to="/products"
            className="hover:text-green-700 transition-colors"
          >
            Products
          </Link>

          <Link
            to="/deals"
            className="text-orange-500 hover:text-orange-600 transition-colors"
          >
            Deals
          </Link>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex flex-1 max-w-lg"
        >
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />

            <input
              type="text"
              placeholder="Search for groceries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-zinc-100 border border-transparent focus:border-green-500 focus:bg-white outline-none transition-all"
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <ShoppingCartIcon className="size-5 text-zinc-800" />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <ChevronDownIcon className="size-4 text-zinc-500" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-green-700 hover:bg-green-800 text-white text-sm font-medium transition-colors"
                >
                  <UserIcon size={16} />
                  Sign In
                </Link>

                {userMenuOpen ? (
                  <XIcon
                    className="md:hidden cursor-pointer"
                    onClick={() => setUserMenuOpen(false)}
                  />
                ) : (
                  <MenuIcon
                    className="md:hidden cursor-pointer"
                    onClick={() => setUserMenuOpen(true)}
                  />
                )}
              </div>
            )}

            {/* Dropdown */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />

                <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  
                  {/* User Info */}
                  {user && (
                    <div className="px-4 py-3 border-b border-zinc-100">
                      <p className="text-sm font-semibold text-zinc-900">
                        {user.name}
                      </p>

                      <p className="text-xs text-zinc-500">
                        {user.email}
                      </p>
                    </div>
                  )}

                  <div
                    className="py-1"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    {!user && (
                      <Link to="/login" className="dropdown-link">
                        <UserIcon size={16} />
                        Sign In
                      </Link>
                    )}

                    {user && (
                      <>
                        <Link to="/orders" className="dropdown-link">
                          <PackageIcon size={16} />
                          My Orders
                        </Link>

                        <Link to="/addresses" className="dropdown-link">
                          <MapPinIcon size={16} />
                          Addresses
                        </Link>
                      </>
                    )}

                    <Link
                      to="/products"
                      className="dropdown-link md:hidden"
                    >
                      <ArrowUpRightIcon size={16} />
                      Products
                    </Link>

                    <Link
                      to="/deals"
                      className="dropdown-link md:hidden"
                    >
                      <ArrowUpRightIcon size={16} />
                      Deals
                    </Link>

                    {user?.isAdmin && (
                      <Link
                        to="/admin/products"
                        className="dropdown-link text-orange-600"
                      >
                        <ShieldIcon size={16} />
                        Admin Panel
                      </Link>
                    )}

                    {user && (
                      <div className="border-t border-zinc-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOutIcon size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;