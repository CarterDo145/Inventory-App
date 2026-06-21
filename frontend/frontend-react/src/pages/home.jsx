import ItemCard from "../components/ItemCard.jsx";

function Home({
    searchItem,
    setSearchItem,
    filteredItems,
    handleUpdate
    }) {
    return (
        <div className="mt-6 mb-6">
            <h1 className="text-3xl font-serif text-[#3D2B1F]">
                Chu Long's Boba Shop
            </h1>

            {/* SEARCH */}
            <div className="flex items-center justify-between gap-6 my-6 flex-wrap">

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

            </div>

            {/*inventory items*/}
            <div className="grid grid-cols-5 gap-4">
                {filteredItems.map(item => (
                    <ItemCard
                    key={item.id}
                    item={item}
                    handleUpdate={handleUpdate}
                />
                ))}
            </div>
        </div>
    );
}
export default Home