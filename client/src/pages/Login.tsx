// import React, { useState } from "react";
// import { heroSectionData } from "../assets/assets";
// import { Link } from "react-router-dom";
// import { BikeIcon, Loader2Icon, LockIcon, MailIcon, UserIcon } from "lucide-react";

// const Login = () => {
//   const [isLoginState,setIsLoginState]=useState(true)
//   const [name,setName]=useState("")
//   const [email,setEmail]=useState("")
//   const [password,setPassword]=useState("")
//   const [loading,setLoading]=useState(false)

//   const handleSubmit=async (e: React.SubmitEvent)=>{
//     e.preventDefault()
//     setLoading(true);
//     setTimeout(()=>window.location.href= "/",1000)

//   }

//   return (
//     <div className="min-h-screen flex">
//       {/* Left Side */}
//       <div className="hidden lg:flex lg:w-1/2 bg-app-green relative items-center justify-center">
//       <img src={heroSectionData.hero_image} alt="" className="absolute inset-0 object-cover h-full bg-center opacity-10"/>
//       <div className="relative text-center px-12">
//         <h2 className="text-4xl font-semibold text-white mb-4">Welcome back to Instacart</h2>
//         <p className="text-white/60 font-serif text-xl max-w-sm mx-auto">Fresh groceries and organic products delivered to your doorstep.</p>
//       </div>
//       </div>

//       {/* Right Side */}
//       <div className="flex-1 flex-center px-4 py-12 bg-app-cream">
//         {/*form header message */}
//         <div className="text-center mb-8">
//           <Link to="/" className="inline-flex items-center gap-2 mb-6">
//           <BikeIcon className="size-8 text-app-green" />
//           <span className="text-2xl font-semibold text-app-green">Instacart</span>
//           </Link>
//           <h1>
//             {isLoginState ? "sign in to your account":"Sign up for an account"}
//           </h1>
//           <p className="text-sm text-app-text-light">
//             {isLoginState ? "Don't have an account?": "Already have an account?"}
//             <button onClick={()=>setIsLoginState(!isLoginState)}
//               className="text-orange-500 ml-1 font-semibold hover:text-orange-600 transition-colors">
//               {isLoginState ? "create one": "Sign in"}
//             </button>
//           </p>
//         </div>
//         {/* Login/Register Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {!isLoginState && (
//             <label className="text-sm flex flex-col gap-1">
//               Name 
//               <div className="relative">
//                 <UserIcon className="absolute left-3.5 top-1/2-translate-y-1/2 size-4 text-app-text-light"/>
//                 <input
//                  type="text"
//                 value={name}
//                  onChange={(e)=>setName(e.target.value)}
//                  required
//                  placeholder="Your name"
//                  className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"/>
//               </div>
//             </label>
//           )}
//            <label className="text-sm flex flex-col gap-1">
//               Email Address
//               <div className="relative">
//                 <MailIcon className="absolute left-3.5 top-1/2-translate-y-1/2 size-4 text-app-text-light"/>
//                 <input
//                  type="email"
//                 value={email}
//                  onChange={(e)=>setEmail(e.target.value)}
//                  required
//                  placeholder="you@example.com"
//                  className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"/>
//               </div>
//             </label>
//              <label className="text-sm flex flex-col gap-1">
//              Password
//               <div className="relative">
//                 <LockIcon className="absolute left-3.5 top-1/2-translate-y-1/2 size-4 text-app-text-light"/>
//                 <input
//                  type="password"
//                 value={password}
//                  onChange={(e)=>setPassword(e.target.value)}
//                  required
//                  placeholder="*******"
//                  className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"/>
//               </div>
//             </label>
//             <button type="submit" disabled={loading} className="flex-center w-full py-3 bg-green-950 text-white font-semibold rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50">
//               {loading ? <Loader2Icon className="animate-spin"/>:isLoginState?"Sign In" :"Sign Up"}
//             </button>
//         </form>
//       </div>
      
//     </div>
//   )
// }

// export default Login

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BikeIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { useAuth } from "../context/authContext";
import { toast } from "react-hot-toast";

const Login = () => {
  const [isLoginState, setIsLoginState] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {login,register}=useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      if(isLoginState){
        await login(email,password)
      }else{
        await register(name,email,password)
      }
    } catch (error:any) {
      toast.error(error.response?.data?.message || error?.message);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f7f8f5]">
      {/* LEFT SECTION */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-green-700 to-green-900 items-center justify-center">

        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />

        <div className="relative z-10 text-center px-12">
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Fresh groceries <br /> delivered fast
          </h1>

          <p className="text-lg text-green-100 max-w-md mx-auto leading-relaxed">
            Shop your favorite groceries, organic produce, and daily essentials
            delivered straight to your doorstep.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl text-white">
              🚚 Fast Delivery
            </div>

            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl text-white">
              🥬 Fresh Products
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">

        <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">

          {/* LOGO */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-6"
            >
              <div className="bg-green-700 p-2 rounded-xl">
                <BikeIcon className="size-6 text-white" />
              </div>

              <span className="text-3xl font-bold text-green-800">
                Instacart
              </span>
            </Link>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isLoginState ? "Welcome Back " : "Create Account"}
            </h2>

            <p className="text-gray-500">
              {isLoginState
                ? "Sign in to continue shopping"
                : "Join Instacart today"}
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME FIELD */}
            {!isLoginState && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* EMAIL FIELD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* FORGOT PASSWORD */}
            {isLoginState && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-green-700 hover:text-green-800 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin size-5" />
                  Please wait...
                </>
              ) : isLoginState ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* TOGGLE AUTH */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isLoginState
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              onClick={() => setIsLoginState(!isLoginState)}
              className="ml-2 text-green-700 font-semibold hover:text-green-800"
            >
              {isLoginState ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;