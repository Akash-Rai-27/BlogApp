import { useState, useEffect } from "react"
import {useDispatch} from 'react-redux'
import authService from './appwrite/auth'
import {login,logout} from './store/authSlice'
import { Footer, Header } from "./components"

function App() {
  
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(()=>{
    authService.getCurrentUser()
      .then((userData)=>{
        if(userData) {
          dispatch(login({userData}))
          console.log("user login")
        }
        else {
          dispatch(logout())
          console.log("user logout")
        }
      })
      .catch((error)=> (console.log("Error in getCurrentUser :: login ::", error)))

      .finally(()=> setLoading(false))
  },[])

  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-500">
       <div className="w-full block">
          <Header/>
          <main>
            todo
          </main>
          <Footer/>
       </div>
    </div>
  ) : null

}

export default App
