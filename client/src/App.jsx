import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FileUpload from './components/FileUpload/FileUpload'
import RecordList from './components/RecordList/RecordList'

function App() {


  return (
    
    <BrowserRouter>
      <Routes>
        <Route path='/upload' element={<FileUpload />} />
        <Route path='/record-list' element={<RecordList />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
