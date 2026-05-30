import { BarChart, Bar, LineChart, Line, XAxis, YAxis, 
    Tooltip, ResponsiveContainer } from "recharts"
import { useState, useRef, useEffect } from "react"



function Statistics({
    items
}) {
    const [querySearch, setQuerySearch] = useState("")
    const [selectedReport, setSelectedReport] = useState(null) // state to track which report is selected
    const [timeFrame, setTimeFrame] = useState("Weekly") // state to track selected time frame for reports that require it
    const [reportData, setReportData] = useState([])

    const graphRef = useRef(null) // ref to the graph container, so it will scroll down for the user, doesn't rerender when changed

    useEffect(() => { // scroll automatically to the graph section when the user selects a report
        if (selectedReport && graphRef.current) {
            graphRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
            })
        }
    }, [selectedReport])

    useEffect(() => { // fetch report data whenever selected report or time frame changes - connected to backend
        if (selectedReport !== "Total Stock") {
            return
        }
        fetch(`http://127.0.0.1:8000/api/reports/total-stock/?timeFrame=${timeFrame}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setReportData(data)
            })
            .catch((error) => {
                console.error(error)
            })

    }, [selectedReport, timeFrame])


    const reports =  [
        "Total Stock",
        "Individual Item Stocks",
        "Most Popular Items",
        "Low Stock Items",
    ]

    const filteredReports = reports.filter(report =>
        report.toLowerCase().includes(querySearch.toLowerCase())
    )

    const totalStock = items.reduce( // calculate total stock across all items
        (total, item) => total + item.count, 0
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
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value)}
                >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
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

            {/* Selected Report Graph */}
            {selectedReport && ( // only show graph if a report is selected
            <div
                ref={graphRef}
                className="bg-[#F7F1EC] border border-[#E9D6C3] rounded-[22px] p-6"
            >
                <h2 className="text-xl font-serif text-[#3D2B1F] mb-4">
                {selectedReport}
                </h2>

                {selectedReport === "Total Stock" && (
                    <p className="font-serif text-[#3D2B1F]">
                        Time Frame: {timeFrame}
                    </p>
                )}

                {/* Graphs would go here, using the 'items' prop to generate data based on the selected report and time frame */}
                <div className="w-full h-[350px] mt-6">

                    {selectedReport === "Total Stock" && (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData}>
                                <XAxis dataKey="period" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="totalStock" fill="#D98C73" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}


                    {selectedReport === "Individual Item Stocks" && (
                        <div className="overflow-x-auto">
                            table
                        </div>
                    )}


                </div>

            </div>
            )}

        </div>
    );
}

export default Statistics;