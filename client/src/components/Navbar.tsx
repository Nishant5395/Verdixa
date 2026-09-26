import {
  ArrowUpRightIcon,
  BikeIcon,
  ChevronDownIcon,
  LogOutIcon,
  MapPinIcon,
  MenuIcon,
  PackageIcon,
  ShieldIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/authContext";
import SearchAutocomplete from "./SearchAutocomplete";

const Navbar = () => {
 const {user,logout}=useAuth()

  const { cartCount, setIsCartOpen } = useCart()

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
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
        <SearchAutocomplete />

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <ShoppingCartIcon className="size-5 text-zinc-800" />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
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