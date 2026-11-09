import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import Team from './pages/Team.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import CookiePolicy from './pages/CookiePolicy.jsx'
import Contact from './pages/Contact.jsx'

import CustomOplossingen from './pages/CustomOplossingen.jsx'
import Projecten from './pages/Projecten.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Workshops from './pages/Workshops.jsx'
import NotFound from './pages/NotFound.jsx'
import ScrollToTop from './components/ui/ScrollToTop.jsx'
import CookieBanner from './components/ui/cookie-banner.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <CookieBanner />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/team" element={<Team />} />
          <Route path="/privacybeleid" element={<PrivacyPolicy />} />
          <Route path="/cookiebeleid" element={<CookiePolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/custom-oplossingen" element={<CustomOplossingen />} />
          <Route path="/projecten" element={<Projecten />} />
          <Route path="/projecten/:slug" element={<ProjectDetail />} />
          <Route path="/workshops" element={<Workshops />} />
          {/* De pagina over AI-agents (src/pages/AiBegeleiding.jsx) is tijdelijk offline tot er genoeg bewijs
              is (beslissing Lucas, 6/11). Het adres stuurt door naar de homepage, ook op Netlify
              (public/_redirects, met 302 omdat ze terugkomt). Terugzetten: importeer AiBegeleiding en
              zet hier weer element={<AiBegeleiding />} */}
          <Route path="/ai-begeleiding" element={<Navigate to="/" replace />} />
          {/* Elk ander adres: de 404-pagina */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
)
