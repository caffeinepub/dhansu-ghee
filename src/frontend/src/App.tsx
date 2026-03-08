import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AboutSection } from "@/components/pages/AboutSection";
import { AdminPage } from "@/components/pages/AdminPage";
import { CartSheet } from "@/components/pages/CartSheet";
import { ContactSection } from "@/components/pages/ContactSection";
import { HeroSection } from "@/components/pages/HeroSection";
import { ProductSection } from "@/components/pages/ProductSection";
import { SuccessPage } from "@/components/pages/SuccessPage";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";

function getRoute(): "home" | "success" | "admin" {
  const path = window.location.pathname;
  if (path.startsWith("/success")) return "success";
  if (path.startsWith("/admin")) return "admin";
  return "home";
}

function getSessionId(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("session_id");
}

export default function App() {
  const [route, setRoute] = useState<"home" | "success" | "admin">(getRoute);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    const handlePopState = () => setRoute(getRoute());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleAddToCart = (quantity: number) => {
    setCartQuantity((prev) => prev + quantity);
    setCartOpen(true);
  };

  const handleQuantityChange = (quantity: number) => {
    setCartQuantity(Math.max(0, quantity));
  };

  if (route === "success") {
    return (
      <>
        <SuccessPage sessionId={getSessionId()} />
        <Toaster />
      </>
    );
  }

  if (route === "admin") {
    return (
      <>
        <AdminPage />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Navbar cartCount={cartQuantity} onCartOpen={() => setCartOpen(true)} />

      <main>
        <HeroSection />
        <ProductSection onAddToCart={handleAddToCart} />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        quantity={cartQuantity}
        onQuantityChange={handleQuantityChange}
      />

      <Toaster />
    </>
  );
}
