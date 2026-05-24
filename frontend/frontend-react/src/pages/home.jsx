import ItemCard from "../components/ItemCard.jsx";

function Home({
    searchItem,
    setSearchItem,
    newItem,
    setNewItem,
    setSelectedImage,
    handleAddItem,
    filteredItems,
    handleDelete,
    handleUpdate
    }) {
    return (
        <div className="mt-6 mb-6">
            <h1 className="text-3xl font-serif text-[#3D2B1F]">
                Chu Long's Boba Shop
            </h1>

            {/* SEARCH + ADD CONTROLS */}
            <div className="flex items-center justify-between gap-6 my-6 flex-wrap">

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

            {/*inventory items*/}
            <div className="grid grid-cols-4 gap-8">
                {filteredItems.map(item => (
                    <ItemCard
                    key={item.id}
                    item={item}
                    handleDelete={handleDelete}
                    handleUpdate={handleUpdate}
                />
                ))}
            </div>
        </div>
    );
}
export default Home