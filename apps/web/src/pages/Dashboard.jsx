import { useEffect, useState } from "react"
import api from "../api/axios"
import RoiChart from "../components/RoiChart"

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dailyROI, setDailyROI] = useState(0)
  const [roiHistory, setRoiHistory] = useState([])

  useEffect(() => {
    Promise.all([
      api.get("/dashboard"),
      api.get("/dashboard/daily-roi"),
      api.get("/dashboard/roi-history"),
    ]).then(([dash, daily, history]) => {
      setData(dash.data)
      setDailyROI(daily.data.dailyROI)
      setRoiHistory(history.data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Wallet Balance" value={data.walletBalance} />
        <StatCard label="Total Investment" value={data.totalInvestment} />
        <StatCard label="Total ROI" value={data.totalROI} />
        <StatCard
          label="Referral Income"
          value={data.totalReferralIncome}
        />
        <StatCard label="Today's ROI" value={dailyROI} />
      </div>

      {/* Investments Table */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-3">My Investments</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Plan</th>
              <th className="border p-2 text-left">Amount</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.investments.map((inv) => (
              <tr key={inv._id}>
                <td className="border p-2">{inv.plan}</td>
                <td className="border p-2">{inv.amount}</td>
                <td className="border p-2">{inv.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <RoiChart data={roiHistory} />
      </div>
    </div>
  )
}
