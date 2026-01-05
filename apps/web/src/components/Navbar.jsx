import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between">
      <Link to="/" className="font-bold">
        NC Investment Dashboard
      </Link>

      <div className="flex gap-4">
        {token && (
          <>
            <Link to="/" className="hover:underline">
              Dashboard
            </Link>

            <Link to="/register" className="hover:underline">
              Register
            </Link>

            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
