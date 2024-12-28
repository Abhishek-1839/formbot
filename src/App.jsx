import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import DashBoard from './pages/DashBoard'
import Setting from './pages/Setting'
import './App.css'
import FormBuilder from './pages/FormBuilder'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/dashboard' element={<DashBoard />}/>
        <Route path='/setting' element={<Setting />}/>
        <Route path='/formbuilding' element={<FormBuilder />}/>
      </Routes>
    </Router>
    // <div><DashBoard/></div>
  )
}

export default App
