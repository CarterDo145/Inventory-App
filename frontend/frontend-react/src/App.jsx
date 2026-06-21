import { useState, useEffect } from 'react'
import './App.css'

import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/home.jsx'
import Statistics from './pages/statistics.jsx'
import Inventory from './pages/inventory.jsx'


function App() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState("")
  const [searchItem, setSearchItem] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [categories, setCategories] = useState(["None"])

  const [textBox, setTextBox] = useState(false) // create the text box on the inventory page
  const [bulkUpdate, setBulkUpdate] = useState("") // state to track the value of the bulk update text area

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

  // Set a threshold for low stock items
  const lowStockThreshold = 5
  const lowStockItems = items.filter(
    item => item.count <= lowStockThreshold
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

  async function handleAddItem() { //async function to await the promise of the fetch request
    const itemName = newItem.trim()

    if (!itemName) return

    const formData = new FormData() // use form data bc no longer sending json, need to send multipart form data for image upload
    formData.append("name", itemName)
    formData.append("count", 0)

    if (selectedImage) {
      formData.append("image", selectedImage)
    }

    try {
      const response = await fetch(apiBaseUrl, {
        method: "POST",
        body: formData,
      })

      if (response.status === 400) {
        throw new Error("Item already exists")
      }

      if (!response.ok) {
        throw new Error("Error adding item")
      }

      const createdItem = await response.json()

      setItems((previousItems) => [...previousItems, createdItem])
      setNewItem("")
      setSelectedImage(null)
    } catch (err) {
      alert(err.message)
    }
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

  async function handleBulkUpdate() {
    const lines = bulkUpdate
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "")

    if (lines.length === 0) {
      alert("Please enter at least one update.")
      return
    }

    const invalidFormat = []
    const notFoundItems = []
    const updatedItems = []

    for (const line of lines) {
      const parts = line.split(" ")
      const addCount = Number(parts[0])
      const itemName = parts.slice(1).join(" ").trim()

      if (isNaN(addCount) || addCount <= 0 || !itemName) {
        invalidFormat.push(line)
        continue
      }

      const existingItem = items.find(
        item => item.name.toLowerCase() === itemName.toLowerCase()
      )

      if (!existingItem) {
        notFoundItems.push(itemName)
        continue
      }

      try {
        await postLedger(existingItem.id, addCount)

        setItems(previousItems =>
          previousItems.map(item =>
            item.id === existingItem.id
              ? { ...item, count: item.count + addCount }
              : item
          )
        )

        updatedItems.push(`${itemName} +${addCount}`)
      } catch (err) {
        invalidFormat.push(line)
      }
    }

    let message = ""

    if (updatedItems.length > 0) {
      message += `Updated ${updatedItems.length} item(s):\n`
      message += updatedItems.map(item => `- ${item}`).join("\n")
    }

    if (notFoundItems.length > 0) {
      message += `\n\nItems not found:\n`
      message += notFoundItems.map(item => `- ${item}`).join("\n")
    }

    if (invalidFormat.length > 0) {
      message += `\n\nInvalid lines:\n`
      message += invalidFormat.map(line => `- ${line}`).join("\n")
    }

    alert(message)

    setBulkUpdate("")
    setTextBox(false)
    
  }

  async function handleUpdateImage(itemId, imageFile) { // allow the image to be updated
    if (!imageFile) return

    const formData = new FormData()
    formData.append("image", imageFile)

    try {
      const response = await fetch(`${apiBaseUrl}${itemId}/`, {
        method: "PATCH",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update image")
      }

      const updatedItem = await response.json()

      setItems(previousItems =>
        previousItems.map(item =>
          item.id === itemId ? updatedItem : item
        )
      )
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleCategoryChange(itemId, category) {
    try {
      const response = await fetch(`${apiBaseUrl}${itemId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      })

      if (!response.ok) {
        throw new Error("Failed to update category")
      }

      const updatedItem = await response.json()

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? updatedItem : item
        )
      )
    } catch (error) {
      console.error(error)
    }
  }





  return (
  <>
    <div className="min-h-screen bg-[#FAF7F4] p-6">
      <div className="max-w-7xl mx-auto bg-[#F7F1EC] rounded-[30px] p-6 border border-[#E9D6C3] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        
        {/*header*/}
        <div className="bg-[#F1E2D3] rounded-[18px] h-16 flex items-center px-4 gap-6 border border-[#E9D6C3]">
          <Link
            to="/"
            className="text-[#3D2B1F] font-[Times_New_Roman] text-xl"
            >
            Home
          </Link>

          <Link
            to="/statistics"
            className="text-[#3D2B1F] font-[Times_New_Roman] text-xl"
            >
            Statistics

          </Link>

          <Link
            to="/inventory"
            className="text-[#3D2B1F] font-[Times_New_Roman] text-xl"
            >
            Inventory
            {lowStockItems.length > 0 && (
              <span
                className="ml-2 bg-[#B90E0A] text-white
                rounded-full px-2 py-1 text-xs"
                >
                {lowStockItems.length}
              </span>
            )}
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<Home
            searchItem={searchItem}
            setSearchItem={setSearchItem}
            newItem={newItem}
            setNewItem={setNewItem}
            setSelectedImage={setSelectedImage}
            filteredItems={filteredItems}
            handleUpdate={handleUpdate}
            />} 
          />

          <Route path="/statistics" element={<Statistics 
            items={items}
            lowStockItems={lowStockItems}
            />} 
          />
          
          <Route path="/inventory" element={<Inventory 
            items={items}
            setItems={setItems}
            searchItem={searchItem}
            setSearchItem={setSearchItem}
            newItem={newItem}
            setSelectedImage={setSelectedImage}
            setNewItem={setNewItem}
            handleAddItem={handleAddItem}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            textBox={textBox}
            setTextBox={setTextBox}
            bulkUpdate={bulkUpdate}
            setBulkUpdate={setBulkUpdate}
            handleBulkUpdate={handleBulkUpdate}
            handleUpdateImage={handleUpdateImage}
            lowStockItems={lowStockItems}
            handleCategoryChange={handleCategoryChange}
            categories={categories}
            setCategories={setCategories}
            />} 
          />
        </Routes>
 
        
        
      </div>
    </div>
  </>
  )
}

export default App