// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* fixed header—add enough top padding on main so content isn't hidden */}
      <Header />

      {/* this grows to fill the space between header & footer */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* will sit at bottom if main is short, or below content if main is tall */}
      <Footer />
    </div>
  );
}
