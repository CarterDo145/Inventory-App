import placeHolderImg from "../assets/placeholder.jpg"
import { FaTrash } from "react-icons/fa"

function Inventory({
    items,
    searchItem,
    setSearchItem,
    newItem,
    setSelectedImage,
    setNewItem,
    handleAddItem,
    handleDelete,
    handleUpdate
}) {

    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchItem.toLowerCase())
    )


    // handling the set count where user can directly input a number for the count
    function handleSetCount(item, newCountValue) {
        const newCount = Number(newCountValue)

        if (isNaN(newCount) || newCount < 0) {
            alert("Please enter a valid non-negative number for count.")
            return
        }

        const confirmedCount = confirm(`Change ${item.name} count to ${newCount}?`)
        if (!confirmedCount) {
            return
        }

        const delta = newCount - item.count
        handleUpdate(item.id, delta)
    }

    return (
        <div>
            <h1 className="text-3xl font-serif text-[#3D2B1F] mt-6 mb-6">
                Chu Long's Boba Shop Inventory
            </h1>

            {/* SEARCH + ADD CONTROLS */}
            <div className="flex items-center justify-between gap-6 my-6 flex-wrap border-b border-[#5a3e36] pb-6">

                {/* SEARCH */}
                <input
                    className="bg-[#FAF7F4] border border-[#E9D6C3]
                        rounded-xl px-4 py-2 w-[260px]
                        text-[#3D2B1F]
                        font-serif
                        focus:outline-none focus:ring-2 focus:ring-[#D98C73]
                        transition"
                    type="text"
                    placeholder="Search items..."
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") setSearchItem("")
                    }}
                />

                {/* ADD ITEM */}
                <div className="flex items-center gap-3">

                    <input
                        className="bg-[#FAF7F4] border border-[#E9D6C3]
                        rounded-xl px-4 py-2 w-[260px]
                        font-serif
                        text-[#3D2B1F]
                        focus:outline-none focus:ring-2 focus:ring-[#D98C73]
                        transition"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddItem()
                        }}
                        placeholder="Enter new item..."
                    />

                    <label className="cursor-pointer bg-[#FAF7F4] border border-[#E9D6C3]
                    rounded-xl px-4 py-2 font-serif text-[#3D2B1F]
                    hover:bg-[#F2E8DE] transition">

                        Choose Image

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setSelectedImage(e.target.files[0])}
                        />
                    </label>

                    <button
                        className="bg-[#E7B79C] text-[#3D2B1F]
                        px-5 py-2 rounded-xl
                        border border-[#E9D6C3]
                        font-serif
                        hover:bg-[#5a3e36] hover:text-white
                        hover:shadow-md
                        active:scale-95
                        transition"
                        onClick={handleAddItem}
                    >
                    Add Item
                    </button>
                </div>
            </div>

            {/* Column Labels */}
            <div className="grid grid-cols-[1fr_340px_250px_200px_200px] px-6 pb-4 mb-3 text-lg font-serif text-[#3D2B1F]">
                <p className="text-center text-xl">Products</p>
                <p></p>
                <p className="text-center text-xl">Amount</p>
                <p className="text-center text-xl">Adjust</p>
                <p className="text-center text-xl">Delete</p>
            </div>

            {/* Inventory Items */}
            <div className="space-y-4">
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-[1fr_250px_200px_200px]
                            items-center px-6 py-4 mb-4 bg-[#E7B79C]
                            border border-[#E9D6C3] rounded-[22px]
                            shadow-[0_8px_18px_rgba(61,43,31,0.12)]
                            hover:shadow-[0_14px_30px_rgba(61,43,31,0.22)]
                            hover:scale-[1.02]
                            transition duration-200"

                    >
                        {/* Products */}
                        <div className="flex items-center justify-between">
                        
                        {/* img and item name */}
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-20 bg-white rounded-xl overflow-hidden">
                            <img
                                src={item.image || placeHolderImg}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                            </div>

                            <p className="text-xl font-serif text-[#3D2B1F]">
                            {item.name}
                            </p>
                        </div>

                        {/* divider */}
                        <div className="w-px h-16 bg-[#5a3e36]"></div>

                        </div>

                        {/* count */}
                        <div className="flex justify-center">
                            <p className="text-2xl font-serif text-[#3D2B1F]">
                                {item.count}
                            </p>
                        </div>

                        {/* adjust count */}
                        <div className="flex items-center justify-center gap-6">
                            <input
                                type="number"
                                min="0"
                                placeholder={item.count}
                                className="w-24 bg-[#FAF7F4] border border-[#E9D6C3]
                                    rounded-xl px-3 py-2 text-center font-serif text-[#3D2B1F]
                                    focus:outline-none focus:ring-2 focus:ring-[#D98C73]"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSetCount(item, e.target.value)
                                        e.target.value = ""
                                    }
                                }}
                            />
                        </div>

                        {/* delete button */}
                        <div className="flex items-center justify-center">
                            <button
                                className="w-12 h-12 rounded-xl bg-[#FAF7F4]
                                    border border-transparent border-[#E9D6C3]
                                    flex items-center justify-center
                                    hover:bg-[#5a3e36]
                                    text-[#3D2B1F] 
                                    hover:text-white
                                    hover:shadow-[0_14px_30px_rgba(61,43,31,0.22)]
                                    hover:scale-[1.02] 
                                    transition"
                                onClick={() => {
                                    if (confirm("Delete this item?")) {
                                        handleDelete(item.id)
                                    }
                                }}
                                >
                                <FaTrash className="text-lg" />
                            </button>
                        </div>
                        
                    </div>
                ))}
            </div>


        </div>
    );
}

export default Inventory