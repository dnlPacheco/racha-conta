import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { GroupDetails } from '@/pages/GroupDetails'

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/group/:id" element={<GroupDetails />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

export default App
