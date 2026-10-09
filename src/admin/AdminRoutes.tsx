import { Route, Routes } from "react-router-dom";
import { AdminAuthProvider } from "./AdminAuth";
import { AdminLayout, AdminLogin } from "./AdminLayout";
import { AdminSettings, ContactAdmin, ContentAdmin, Dashboard, HomepageAdmin, SeoAdmin, SocialAdmin } from "./SettingsPages";
import { FaqsAdmin, ProjectsAdmin, ServicesAdmin, TestimonialsAdmin } from "./CrudPages";
import { MediaAdmin, QuotesAdmin } from "./QuotesMedia";

export default function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="content" element={<ContentAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="quotes" element={<QuotesAdmin />} />
          <Route path="testimonials" element={<TestimonialsAdmin />} />
          <Route path="faqs" element={<FaqsAdmin />} />
          <Route path="contact" element={<ContactAdmin />} />
          <Route path="social" element={<SocialAdmin />} />
          <Route path="homepage" element={<HomepageAdmin />} />
          <Route path="seo" element={<SeoAdmin />} />
          <Route path="media" element={<MediaAdmin />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
