import { Routes, Route } from "react-router-dom"

function Login() {
  return <h1 className="text-xl">Login Page</h1>
}

function Dashboard() {
  return <h1 className="text-xl">Dashboard</h1>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  )
}
