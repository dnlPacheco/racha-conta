import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { GroupDetails } from '@/pages/GroupDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/group/:id" element={<GroupDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
