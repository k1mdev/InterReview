import {Routes, Route} from 'react-router'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateAttempt from './pages/CreateAttempt'
import SignUp from './pages/SignUp'

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/logIn' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/create' element={<CreateAttempt />} />
        </Routes>
      </div>
    </>
  )
}

export default App