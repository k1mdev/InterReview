import {Routes, Route} from 'react-router'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateAttempt from './pages/CreateAttempt'
import Analysis from './pages/Analysis'

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/create' element={<CreateAttempt />} />
          <Route path='/analysis' element={<Analysis />} />
        </Routes>
      </div>
    </>
  )
}

export default App