import { lazy, Suspense, useEffect } from "react";
import { HashRouter, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { SiteProvider } from "@/context/SiteContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { ScrollProgress } from "@/components/ScrollProgress";
import Home from "@/pages/Home";

const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const Projects = lazy(() => import("@/pages/Projects"));
const Contact = lazy(() => import("@/pages/Contact"));
const Quote = lazy(() => import("@/pages/Quote"));
const AdminRoutes = lazy(() => import("@/admin/AdminRoutes"));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-charcoal focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Suspense fallback={<div className="min-h-[70vh]" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="*" element={<Home />} />
          </Route>
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<div className="min-h-screen grid place-items-center text-sm text-charcoal/50">Loading…</div>}>
                <AdminRoutes />
              </Suspense>
            }
          />
        </Routes>
      </HashRouter>
    </SiteProvider>
  );
}
