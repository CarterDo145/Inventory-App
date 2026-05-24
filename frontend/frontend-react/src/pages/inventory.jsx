

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
    );

    return (
        <div>
            <h1 className="text-3xl font-serif text-[#3D2B1F] mt-6 mb-6">
                Chu Long's Boba Inventory
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
            <div className="grid grid-cols-[1fr_250px_200px_200px] px-8 mb-3 text-lg font-serif text-[#3D2B1F]">
                <p className="text-center">Products</p>
                <p className="text-center">Amount</p>
                <p className="text-center">Change</p>
                <p className="text-center">Delete</p>
            </div>



        </div>
    );
}

export default Inventory;