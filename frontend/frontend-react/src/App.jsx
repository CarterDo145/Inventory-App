import { useState, useEffect } from 'react'
import './App.css'

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
      <div className="bg-[#d2a679] p-4 border border-black rounded-lg mx-3 mb-4">
        <p className="text-lg font-bold font-['Times_New_Roman']">Home</p>
      </div>
      <div className="mx-3 p-4 bg-[#f4d9c3] min-h-screen border border-black rounded-lg">
        <h1 className="text-3xl font-bold mb-4 font-['Times_New_Roman']">Chu Long's Boba Inventory</h1>

        <div className="flex items-center justify-between my-5">
          <input
            className="px-3 py-1 text-base rounded border border-black shadow bg-[#f8f6f0] focus:outline-none focus:ring-0 font-['Times_New_Roman']"
            id="search"
            type="text"
            placeholder="Search items..."
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                setSearchItem("")
            }}
          />
          <div className="flex items-center gap-2">
            <input 
              className="px-3 py-1 text-base rounded border border-black shadow bg-[#f8f6f0] focus:outline-none focus:ring-0 font-['Times_New_Roman']"
              id="item" 
              value={newItem} 
              onChange={(e)=> setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddItem()
                }
              }} 
              placeholder="Enter a new item name:" 
            />
            <button className="bg-[#efe3d8] border border-black text-black px-3 py-1 rounded hover:bg-[#5a3e36] hover:text-white transition font-['Times_New_Roman']" onClick={handleAddItem}>Add Item</button>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2.5">
          {filteredItems.map(item => (
            <div className="relative bg-[#d2a679] border border-[#5a3e36] rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-[1.02] transition" key={item.id}>
              <div className="text-2xl h-12 font-['Times_New_Roman']">{item.name}</div>
              <div className="flex items-baseline justify-center gap-8">
                <button className="w-12 h-12 text-4xl font-bold flex items-center justify-center cursor-pointer" onClick={() => handleUpdate(item.id, -1)}>-</button>
                <div className="text-[32px] h-14 font-['Times_New_Roman'] font-bold">{item.count}</div>
                <button className="w-12 h-12 text-4xl font-bold flex items-center justify-center cursor-pointer" onClick={() => handleUpdate(item.id, 1)}>+</button>
              </div>
              <button
                className="absolute top-3 right-5 w-8 h-8 flex items-center justify-center 
                  rounded-full bg-transparent hover:text-white
                  hover:bg-[#3e2a24] hover:shadow-md hover:scale-110
                  active:scale-95 transition duration-200"
                onClick={() => {
                  if (confirm("Delete this item?")) {
                    handleDelete(item.id)
                  }
                }}
              >
                <span className="leading-none -translate-y-[1px]">✕</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App