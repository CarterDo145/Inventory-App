import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useState, useRef } from "react"



function Statistics({
    items
}) {
    const [querySearch, setQuerySearch] = useState("")
    const [selectedReport, setSelectedReport] = useState(null) // state to track which report is selected
    const [timeFrame, setTimeFrame] = useState("weekly") // state to track selected time frame for reports that require it
    const graphRef = useRef() // ref to the graph container, so it will scroll down for the user


    const reports =  [
        "Current Inventory Amounts",
        "Total Stock - Weekly",
        "Individual Item Stocks",
        "Daily Comparisons"
    ]

    const filteredReports = reports.filter(report =>
        report.toLowerCase().includes(querySearch.toLowerCase())
    )

    return (
        <div>
            <h1 className="text-3xl font-serif text-[#3D2B1F] mt-6 mb-6"
                >Chu Long's Boba Shop Statistics
            </h1>

            {/* Search + Time Frame */}
            <div className="flex items-center gap-4 mb-6">
                <input
                    className="bg-[#FAF7F4] border border-[#E9D6C3]
                    rounded-xl px-4 py-2 w-[260px]
                    text-[#3D2B1F]
                    font-serif
                    focus:outline-none focus:ring-2 focus:ring-[#D98C73]
                    transition"
                    type="text"
                    placeholder="Search Parameters..."
                    value={querySearch}
                    onChange={(e) => setQuerySearch(e.target.value)}
                    onKeyDown={(e) => {
                    if (e.key === "Enter") setQuerySearch("")
                    }}
                />

                <select
                    className="appearance-none bg-[#FAF7F4] border border-[#E9D6C3]
                    rounded-xl px-4 py-2 w-[180px]
                    text-[#3D2B1F]
                    font-serif
                    focus:outline-none focus:ring-2 focus:ring-[#D98C73]
                    transition"
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>
            {/* Report Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
            {filteredReports.map((report) => (
                <button
                key={report}
                className="bg-[#E7B79C] border border-[#E9D6C3]
                    rounded-[18px] p-4 font-serif text-[#3D2B1F]
                    hover:bg-[#5a3e36] hover:text-white
                    hover:shadow-md transition"
                onClick={() => setSelectedReport(report)}
                >
                {report}
                </button>
            ))}
            </div>

            {/* Current Inventory Amount Bar Chart */}
            <div className="bg-[#F7F1EC] border border-[#E9D6C3] rounded-[22px] p-6">
                <h2 className="text-xl font-serif text-[#3D2B1F] mb-4">
                    Current Inventory Amounts
                </h2>
            </div>

        </div>
    );
}

export default Statistics;