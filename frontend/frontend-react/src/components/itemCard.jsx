import placeholderImg from "../assets/placeholder.jpg";

function ItemCard({ item, handleDelete, handleUpdate }) {


  return (
    // card container
    <div
        className="relative bg-[#E7B79C] border border-[#E9D6C3]
            rounded-[22px] p-5
            shadow-[0_10px_25px_rgba(61,43,31,0.15)]
            hover:shadow-[0_14px_30px_rgba(61,43,31,0.22)]
            hover:scale-[1.02]
            transition duration-200 flex flex-col justify-between"
        >
            
        {/* delete button */}
        <button
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center
                rounded-full bg-[#F7F1EC] text-[#3D2B1F]
                hover:bg-[#5a3e36] hover:text-white
                hover:scale-110 active:scale-95
                transition"
            onClick={() => {
            if (confirm("Delete this item?")) {
                handleDelete(item.id);
            }
            }}
        >
            ✕
        </button>

        {/* item image placeholder */}
        <div
            className="bg-white rounded-[18px] w-full h-[110px]
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
            <div className="text-xl font-serif text-[#3D2B1F]">
            {item.name}
            </div>
            {/* separator line */}
            <div className="w-24 h-px bg-[#C08F72] my-2 mx-auto"></div>
        </div>



        {/* update functions */}
        <div className="flex items-center justify-center gap-6 mt-2">
            <button
                className="w-10 h-10 rounded-full
                    flex items-center justify-center
                    text-2xl font-bold
                    text-[#3D2B1F]
                    hover:bg-[#F7F1EC]
                    transition"
                onClick={() => handleUpdate(item.id, -1)}
            >
                <span className="-translate-y-[1px]">−</span>
            </button>

            <div className="text-3xl font-serif font-bold text-[#3D2B1F]">
            {item.count}
            </div>

            <button
                className="w-10 h-10 rounded-full
                    flex items-center justify-center
                    text-2xl font-bold
                    text-[#3D2B1F]
                    hover:bg-[#F7F1EC]
                    transition"
                onClick={() => handleUpdate(item.id, 1)}
            >
                <span className="-translate-y-[1px]">+</span>
            </button>
        </div>
    </div>
  );
}

export default ItemCard;