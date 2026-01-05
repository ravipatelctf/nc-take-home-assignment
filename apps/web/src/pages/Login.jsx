import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState("login") // login | register
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    referrerId: "",
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "login") {
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        })

        localStorage.setItem("token", res.data.token)
        navigate("/")
      } else {
        await api.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
          referrerId: form.referrerId || undefined,
        })

        alert("Registration successful. Please login.")
        setMode("login")
      }
    } catch (err) {
      alert("Operation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              name="name"
              className="border p-2 w-full mb-3"
              placeholder="Name"
              onChange={handleChange}
            />
          )}

          <input
            name="email"
            className="border p-2 w-full mb-3"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            className="border p-2 w-full mb-3"
            placeholder="Password"
            onChange={handleChange}
          />

          {mode === "register" && (
            <input
              name="referrerId"
              className="border p-2 w-full mb-3"
              placeholder="Referrer ID (optional)"
              onChange={handleChange}
            />
          )}

          <button
            disabled={loading}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-sm text-center mt-4">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </p>

        {/* Test credentials */}
        <div className="mt-6 text-sm bg-yellow-100 p-3 rounded">
          <p className="font-semibold mb-1">Test Credentials</p>
          <p>Email: <b>alice@test.com</b></p>
          <p>Password: <b>password123</b></p>
        </div>
      </div>
    </div>
  )
}
