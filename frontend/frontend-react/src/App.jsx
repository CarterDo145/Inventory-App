import { useState, useEffect } from 'react'
import './App.css'
import ItemCard from './itemCard.jsx'

function App() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState("")
  const [searchItem, setSearchItem] = useState("")

  const apiBaseUrl = "http://127.0.0.1:8000/api/items/"
  const ledgerApiUrl = "http://127.0.0.1:8000/api/ledger/"

  useEffect(() =>{
    fetch(apiBaseUrl)
      .then(res => res.json())
      .then(data => {
        setItems(data)
      })
      .catch(err => console.log("Error fetching items: ", err))
  }, [])

  const filteredItems = items.filter(item => // way to filter items based on search, also used to structure main display of items
    item.name.toLowerCase().includes(searchItem.toLowerCase())
  )

  // Function to post ledger updates to the backend
  function postLedger(itemId, delta) {
    return fetch(ledgerApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({
          item: itemId,
          delta: delta
        })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(JSON.stringify(err))
        })
      }
      return res.json()
    })
  }

  // Handle the update of the count when plus or minus buttons are clicked
  function handleUpdate(itemId, delta) {
    // Find the item in the current state
    const item = items.find(item => item.id === itemId)
    if (!item) {
      return
    }
    // Calculate the new count and prevent it from going negative
    const newCount = item.count + delta
    if (newCount < 0) {
      return
    }

    // Update the count in the backend and then update the state
    postLedger(itemId, delta).then(() => {
      setItems(previousItems => { 
        return previousItems.map(item => {
          if (item.id === itemId) {
            return {...item, count: newCount}
          } else {  
            return item
          }
        })
      })
    })
    .catch(err => console.log("Error Updating the count", err))
  }

  function handleAddItem() {
    const itemName = newItem.trim()

    if (!itemName) {
      return
    }

    fetch(apiBaseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({name: itemName})
    })
    .then(res => {
      if (res.status === 400) throw new Error("Item already exists")
      if (!res.ok) throw new Error("Error adding item")
        return res.json()
    })
    .then(createdItem => {
      setItems(previousItems => [
        ...previousItems, createdItem
      ])
      setNewItem("")
    })
    .catch(err => alert(err.message))

  }

  function handleDelete(itemId) {
    fetch(`${apiBaseUrl}${itemId}/`, {
      method: "DELETE"
    })
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to delete item")
      }
      setItems(previousItems => {
        return previousItems.filter(item => item.id !== itemId)
      })
    })
    .catch(err => {
      console.log("Error deleting items: ", err)
    })
  }





  return (
      <>
      <div className="min-h-screen bg-[#FAF7F4] p-6">
        <div className="max-w-7xl mx-auto bg-[#F7F1EC] rounded-[30px] p-6 border border-[#E9D6C3] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          {/*header*/}
          <div className="bg-[#F1E2D3] rounded-[18px] h-16 flex items-center px-4 gap-6 border border-[#E9D6C3]">
            <div className="text-[#3D2B1F] font-[Times_New_Roman] text-xl cursor-pointer">Home 🏠</div>
            <div className="text-[#3D2B1F] font-[Times_New_Roman] text-xl cursor-pointer">Statistics 📈</div>
            <div className="text-[#3D2B1F] font-[Times_New_Roman] text-xl cursor-pointer">Inventory 📦</div>
          </div>

          
          {/*main inventory container*/}
          <div className="mt-6 mb-6">
            <h1 className="text-3xl font-serif text-[#3D2B1F]">
              Chu Long's Boba Inventory
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
        </div>
      </div>
    </>
  )
}

export default App