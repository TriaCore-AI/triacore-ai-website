import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import Team from './pages/Team.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import CookiePolicy from './pages/CookiePolicy.jsx'
import Contact from './pages/Contact.jsx'

import CustomOplossingen from './pages/CustomOplossingen.jsx'
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
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
)
