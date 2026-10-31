import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Shell from './shell/Shell.jsx'

// Hash routing: works on GitHub Pages without server rewrites.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/w/:world" element={<Shell />} />
        <Route path="*" element={<Navigate to="/w/l2" replace />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
