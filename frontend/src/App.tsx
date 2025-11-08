import {Routes, Route} from 'react-router'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateAttempt from './pages/CreateAttempt'

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/create' element={<CreateAttempt />} />
        </Routes>
      </div>
    </>
  )
}

export default App