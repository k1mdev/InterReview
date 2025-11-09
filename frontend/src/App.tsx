import {Routes, Route} from 'react-router'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateAttempt from './pages/CreateAttempt'
import SignUp from './pages/SignUp'
import Analysis from './pages/Analysis'
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./auth/AuthProvider";


function App() {

  return (
    <>
      <div>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/logIn' element={<Login />} />
            <Route path='/signUp' element={<SignUp />} />
            <Route path='/create' element={<ProtectedRoute><CreateAttempt /></ProtectedRoute>} />
            <Route path='/analysis/:attemptId' element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </div>
    </>
  )
}

export default App