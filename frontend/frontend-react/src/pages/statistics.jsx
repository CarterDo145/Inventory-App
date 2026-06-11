import { BarChart, Bar, LineChart, Line, XAxis, YAxis, 
    Tooltip, ResponsiveContainer } from "recharts"
import { useState, useRef, useEffect } from "react"



function Statistics({
    items,
    lowStockItems
}) {
    const [querySearch, setQuerySearch] = useState("")
    const [selectedReport, setSelectedReport] = useState(null) // state to track which report is selected
    const [timeFrame, setTimeFrame] = useState("Weekly") // state to track selected time frame for reports that require it
    const [reportData, setReportData] = useState([])
    const [graphSearch, setGraphSearch] = useState("") // state to search specific graphs
    const [popularitySelector, setPopularitySelector] = useState(5) 
    const [dismissLowStockAlert, setDismissLowStockAlert] = useState(false) // state to allow user to dismiss low stock alert on page

    const graphRef = useRef(null) // ref to the graph container, so it will scroll down for the user, doesn't rerender when changed

    useEffect(() => { // scroll automatically to the graph section when the user selects a report
        if (selectedReport && graphRef.current) {
            graphRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
            })
        }
    }, [selectedReport])

    useEffect(() => {
        setReportData([])
    }, [selectedReport])

    useEffect(() => { // fetch report data whenever selected report or time frame changes - connected to backend
        let reportUrl = null

        if (selectedReport === "Inventory Trends") {
            reportUrl = `http://127.0.0.1:8000/api/reports/item-history/?timeFrame=${timeFrame}`
        }

        if (selectedReport === "Most Popular Items") {
            reportUrl = `http://127.0.0.1:8000/api/reports/most-popular-items/?timeFrame=${timeFrame}&limit=${popularitySelector}`
        }

        if (!reportUrl) {
            setReportData([])
            return
        }

        fetch(reportUrl)
            .then((response) => response.json())
            .then((data) => {
                setReportData(data || []) // set report data to the response, or an empty array if response is undefined
            })
            .catch((error) => {
                console.error(error)
                setReportData([])
            })

    }, [selectedReport, timeFrame, popularitySelector])


    const reports =  [
        "Inventory Trends",
        "Most Popular Items",
        "Low Stock Items",
    ]

    const filteredReports = reports.filter(report =>
        report.toLowerCase().includes(querySearch.toLowerCase())
    )

    const sortedGraphData =
        selectedReport === "Inventory Trends"
            ? Object.entries(reportData)
                .filter(([itemName]) => {
                if (graphSearch.trim() === "") {
                    return true
                }

                return itemName
                    .toLowerCase()
                    .includes(graphSearch.toLowerCase())
                })
                .sort(([currentItemName], [comparedItemName]) =>
                currentItemName.localeCompare(comparedItemName)
                )
            : []

    return (
        <div>

            <h1 className="text-3xl font-serif text-[#3D2B1F] mt-6 mb-6"
                >Chu Long's Boba Shop Statistics
            </h1>

            {lowStockItems.length > 0 && !dismissLowStockAlert && (
                <div className="mb-6 bg-[#FFE7D0] border border-[#D98C73] rounded-[18px] p-4 flex items-center justify-between gap-4">
                    <p className="font-serif text-[#3D2B1F]">
                    Low stock alert: {lowStockItems.map(item => item.name).join(", ")}
                    </p>

                    <button
                    className="font-serif text-[#3D2B1F] hover:text-[#5a3e36] cursor-pointer transition"
                    onClick={() => setDismissLowStockAlert(true)}
                    >
                    Dismiss
                    </button>
                </div>
            )}

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
                    cursor-pointer
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
                    hover:shadow-md cursor-pointer transition"
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

                {/* Graphs would go here, using the 'items' prop to generate data based on the selected report and time frame */}
                {selectedReport === "Inventory Trends" && (
                    <div className="mt-6 space-y-8">
                        {/* Graph Search */}
                        <input
                            className="bg-[#FAF7F4] border border-[#E9D6C3]
                            rounded-xl px-4 py-2 w-[260px]
                            text-[#3D2B1F]
                            font-serif
                            focus:outline-none focus:ring-2 focus:ring-[#D98C73]
                            transition mb-6"
                            type="text"
                            placeholder="Search item graphs..."
                            value={graphSearch}
                            onChange={(e) => setGraphSearch(e.target.value)}
                        />

                        {sortedGraphData.length === 0 && (
                            <p className="font-serif text-[#5a3e36] mb-4">
                                No item graphs found.
                            </p>
                        )}
                        
                        {sortedGraphData.map(([itemName, history]) => (
                            <div
                                key={itemName}
                                className="bg-[#FAF7F4] border border-[#E9D6C3] rounded-[18px] p-5"
                            >
                                <h3 className="text-lg font-serif text-[#3D2B1F] mb-4">
                                    {itemName}
                                </h3>

                                <div className="w-full h-[260px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={history}>
                                            <XAxis dataKey="period" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="change"
                                                stroke="#D98C73"
                                                strokeWidth={3}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {selectedReport === "Most Popular Items" && (
                    <div className="mt-6">

                        <div className="flex items-center gap-3 mb-6">
                            <label className="font-serif text-[#3D2B1F]">
                                Show:
                            </label>

                            <select
                                className="appearance-none bg-[#FAF7F4]
                                border border-[#E9D6C3]
                                rounded-xl px-4 py-2
                                text-[#3D2B1F]
                                font-serif
                                focus:outline-none
                                focus:ring-2 focus:ring-[#D98C73]
                                transition"
                                value={popularitySelector}
                                onChange={(e) => setPopularitySelector(Number(e.target.value))}
                            >
                                <option value={5}>Top 5</option>
                                <option value={10}>Top 10</option>
                                <option value={15}>Top 15</option>
                            </select>
                        </div>

                        <div className="w-full h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="used" fill="#D98C73" />
                            </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {selectedReport === "Low Stock Items" && (
                    <div className="mt-6">
                        <table className="w-full font-serif text-[#3D2B1F]">
                        <thead>
                            <tr className="border-b border-[#E9D6C3]">
                            <th className="text-left py-3 px-4">
                                Item
                            </th>

                            <th className="text-center py-3 px-4">
                                Count
                            </th>
                            </tr>
                        </thead>

                        <tbody>
                            {lowStockItems.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-[#E9D6C3] hover:bg-[#FAF7F4] transition"
                            >
                                <td className="py-3 px-4">
                                {item.name}
                                </td>

                                <td className="py-3 px-4 text-center">
                                {item.count}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    )}




            </div>
            )}

        </div>
    );
}

export default Statistics;