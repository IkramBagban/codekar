import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProjectPage from '@/pages/Project.tsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/projects/:projectId', element: <ProjectPage /> },
  {
    path: '*', element: (
      <div className="min-h-screen grid place-items-center bg-black text-zinc-200">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-2">404 - Page not found</h1>
          <p className="text-zinc-400">The page you are looking for does not exist.</p>
        </div>
      </div>
    )
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
