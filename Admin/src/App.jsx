import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
function App() {

  return (
    <>
      <div className="app-content">
        <Sidebar />
        {/* <Routes>
        </Routes> */}
        <div>
            <h2>hello
            </h2>
        </div>
      </div>
    </>
  )
}

export default App

