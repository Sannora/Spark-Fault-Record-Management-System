import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FileUpload from './components/FileUpload/FileUpload.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FileUpload />
  </StrictMode>,
)
