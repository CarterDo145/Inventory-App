import placeholderImg from "../assets/placeholder.jpg"
import { useState } from "react"

function ItemCard({ item, handleUpdate }) {

    const [flashSide, setFlashSide] = useState(null) // when an update happens flash the side that was updated

    function handleTap(side, delta) {
        setFlashSide(side)

        handleUpdate(item.id, delta)

        setTimeout(() => {
            setFlashSide(null)
        }, 100)
    }

    return (
        // card container
        <div
            className="relative bg-[#E7B79C] border border-[#E9D6C3]
            rounded-[22px] p-2 min-h-[100px] overflow-hidden
            shadow-[0_10px_25px_rgba(61,43,31,0.15)]
            transition duration-200"

            >

            {flashSide === "left" && (
                <div className="absolute inset-y-0 left-0 w-1/2 bg-[#3D2B1F]/10 pointer-events-none z-0" />
            )}

            {flashSide === "right" && (
                <div className="absolute inset-y-0 right-0 w-1/2 bg-[#3D2B1F]/10 pointer-events-none z-0" />
            )}

            <div className="relative z-10">
                
                {/* item image placeholder */}
                <div
                    className="bg-white rounded-[18px] w-full h-[75px]
                        flex items-center justify-center
                        border border-[#E8E2DC] shadow-inner overflow-hidden"
                >
                    <img
                        src={item.image || placeholderImg}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* item name and count */}
                <div className="text-center mt-4">
                    <div className="text-2xl font-serif text-[#3D2B1F]">
                    {item.name}
                    </div>
                    {/* separator line */}
                    <div className="w-24 h-px bg-[#C08F72] my-2 mx-auto"></div>
                </div>



                {/* update functions */}
                <div className="grid grid-cols-3 items-center mt-2">
                    <button
                        className="w-full py-3 flex justify-end pr-2
                            text-2xl font-bold text-[#3D2B1F]
                            transition"
                        onClick={() => handleTap("left", -1)}
                    >
                        <span className="-translate-y-[1px] text-3xl">−</span>
                    </button>

                    <div className="text-3xl font-serif font-bold text-[#3D2B1F] text-center">
                    {item.count}
                    </div>

                    <button
                        className="w-full py-3 flex justify-start pl-4
                            text-2xl font-bold text-[#3D2B1F]
                            transition"
                        onClick={() => handleTap("right", 1)}
                    >
                        <span className="-translate-y-[1px] text-3xl">+</span>
                    </button>


                </div>
            </div>
        </div>
    );
}

export default ItemCard