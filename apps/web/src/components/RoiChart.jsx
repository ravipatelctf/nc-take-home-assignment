import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function RoiChart({ data }) {
  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="font-semibold mb-3">ROI History</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tickFormatter={(d) =>
              new Date(d).toLocaleDateString()
            }
          />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="roiAmount"
            stroke="#2563eb"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
