import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import Team from './pages/Team.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import CookiePolicy from './pages/CookiePolicy.jsx'
import Contact from './pages/Contact.jsx'

import AiOplossingen from './pages/AiOplossingen.jsx'
import Projecten from './pages/Projecten.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Workshops from './pages/Workshops.jsx'
import Resources from './pages/Resources.jsx'
import ResourceDetail, { NaarKennisbank } from './pages/ResourceDetail.jsx'
import ResourcePreview from './pages/ResourcePreview.jsx'
import NotFound from './pages/NotFound.jsx'
import ScrollToTop from './components/ui/ScrollToTop.jsx'
import CookieBanner from './components/ui/cookie-banner.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        {/* Het voorbeeld voor de ERP toont geen cookiebanner (en laadt dus ook geen analytics) */}
        {window.location.pathname !== '/kennisbank/voorbeeld' && <CookieBanner />}
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/team" element={<Team />} />
          <Route path="/privacybeleid" element={<PrivacyPolicy />} />
          <Route path="/cookiebeleid" element={<CookiePolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-oplossingen" element={<AiOplossingen />} />
          {/* Vroegere adressen van deze pagina (Custom tools en de conceptversie) sturen door naar AI-oplossingen;
              op Netlify ook via public/_redirects */}
          <Route path="/custom-oplossingen" element={<Navigate to="/ai-oplossingen" replace />} />
          <Route path="/oplossingen-v2" element={<Navigate to="/ai-oplossingen" replace />} />
          <Route path="/projecten" element={<Projecten />} />
          <Route path="/projecten/:slug" element={<ProjectDetail />} />
          <Route path="/workshops" element={<Workshops />} />
          {/* Kennisbank (in het Engels "Resources"): de artikels komen uit src/content/resources/ en worden
              beheerd vanuit de ERP. /kennisbank/voorbeeld is het voorbeeld dat de ERP in een venster toont (niet in
              Google). Het vroegere adres /resources stuurt door, op Netlify ook via public/_redirects */}
          <Route path="/kennisbank" element={<Resources />} />
          <Route path="/kennisbank/voorbeeld" element={<ResourcePreview />} />
          <Route path="/kennisbank/:slug" element={<ResourceDetail />} />
          <Route path="/resources" element={<Navigate to="/kennisbank" replace />} />
          <Route path="/resources/:slug" element={<NaarKennisbank />} />
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
