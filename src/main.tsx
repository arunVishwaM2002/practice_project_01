import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { CityProvider } from '@/context/CityProvider'
import { router } from './router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CityProvider>
      <RouterProvider router={router} />
    </CityProvider>
  </StrictMode>,
)
