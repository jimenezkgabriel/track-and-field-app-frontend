import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import RegisterForm from './components/RegisterForm.jsx'
import LoginForm from './components/LoginForm.jsx'
import HundredMeterForm from './components/HundredMeterForm.jsx'
import HundredMeterList from './components/HundredMeterList.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState('This is blank')

  // In dev, force the Vite proxy to avoid CORS.
  const API_BASE = import.meta.env.DEV
    ? '/api'
    : (import.meta.env.VITE_API_URL ?? '/api');

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      console.log('Response:', res)
      const data = await res.json();
      setData(data.message)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h1>{data}</h1>
      <RegisterForm />
      <LoginForm />
      <HundredMeterForm />
      <HundredMeterList />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
