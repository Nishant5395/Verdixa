import { Outlet } from "react-router-dom";
import Banner from "../components/Banner";

import Footer from "../components/Footer";
import CartSidebar from "../components/CartSidebar";
import Navbar from "../components/Navbar";
import ChatWidget from "../components/ChatWidget";

const AppLayout = () => {
  return (
    <>
    <Banner/>
    <Navbar/>
    <main className="min-h-screen">
      <Outlet/>
    </main>
   <Footer/>
    <CartSidebar/>
    <ChatWidget/>
    </>
  )
}

export default AppLayout
