import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CmsProvider } from './context/CmsContext.jsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { portalQueryClient } from './portal/portalQueryClient.js'
import { PortalToastProvider } from './portal/PortalToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={portalQueryClient}>
        <PortalToastProvider>
          <CmsProvider>
            <App />
          </CmsProvider>
        </PortalToastProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
