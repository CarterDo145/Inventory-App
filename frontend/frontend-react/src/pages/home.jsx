import ItemCard from "../components/ItemCard.jsx";
import { useState } from "react";

function Home({
    searchItem,
    setSearchItem,
    filteredItems,
    handleUpdate,
    homeSortBy,
    setHomeSortBy,
    categories
    }) {

        const [touchStartX, setTouchStartX] = useState(null)

        const sortOptions = [
            "all",
            "Popularity",
            ...categories.map(category => category.name)
        ]

        function handleSwipeLeft() {
            const currentIndex = sortOptions.indexOf(homeSortBy)
            const nextIndex = (currentIndex + 1) % sortOptions.length
            setHomeSortBy(sortOptions[nextIndex])
        }

        function handleSwipeRight() {
            const currentIndex = sortOptions.indexOf(homeSortBy)

            const previousIndex =
                (currentIndex - 1 + sortOptions.length) %
                sortOptions.length

            setHomeSortBy(sortOptions[previousIndex])
        }

        const sortedItems = [...filteredItems]
        .filter(item => {
            if (homeSortBy === "all") {
                return true
            }

            if (homeSortBy === "Popularity") {
                return true
            }

            return (item.category || "None") === homeSortBy
        })
        .sort((a, b) => {
            if (homeSortBy === "Popularity") {
                return b.count - a.count
            }

            return 0
        })


    return (
        <div 
            className="mt-6 mb-6"
            onTouchStart={(e) => {
                setTouchStartX(e.touches[0].clientX)
            }}
            onTouchEnd={(e) => {
                if (touchStartX === null) return

                const touchEndX = e.changedTouches[0].clientX
                const difference = touchEndX - touchStartX

                // Swipe Right
                if (difference > 80) {
                    handleSwipeRight()
                }

                // Swipe Left
                if (difference < -80) {
                    handleSwipeLeft()
                }

                setTouchStartX(null)
            }}
        >
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

                <select
                    value={homeSortBy}
                    onChange={(e) => setHomeSortBy(e.target.value)}
                    className="bg-[#FAF7F4] border border-[#E9D6C3]
                    rounded-xl px-4 py-2 w-[220px]
                    text-[#3D2B1F]
                    font-serif
                    focus:outline-none focus:ring-2 focus:ring-[#D98C73]
                    transition"
                >
                    <option value="all">Sort By: All</option>
                    <option value="Popularity">Popularity</option>

                    {categories.map(category => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>

            </div>
            <div className="h-4 mb-4">
                <p className="font-serif text-[#5a3e36] text-lg">
                    {
                        homeSortBy === "all"
                            ? "All Items"
                            : homeSortBy === "Popularity"
                            ? "Popularity"
                            : homeSortBy
                    }
                </p>
            </div>

            {/*inventory items*/}
            <div className="grid grid-cols-5 gap-4">
                {sortedItems.map(item => (
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