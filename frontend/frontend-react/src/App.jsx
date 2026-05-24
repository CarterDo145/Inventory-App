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

  async function handleAddItem() { //async function to await the promise of the fetch request
    const itemName = newItem.trim();

    if (!itemName) return;

    const formData = new FormData(); // use form data bc no longer sending json, need to send multipart form data for image upload
    formData.append("name", itemName);
    formData.append("count", 0);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await fetch(apiBaseUrl, {
        method: "POST",
        body: formData,
      });

      if (response.status === 400) {
        throw new Error("Item already exists");
      }

      if (!response.ok) {
        throw new Error("Error adding item");
      }

      const createdItem = await response.json();

      setItems((previousItems) => [...previousItems, createdItem]);
      setNewItem("");
      setSelectedImage(null);
    } catch (err) {
      alert(err.message);
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
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<Home
            searchItem={searchItem}
            setSearchItem={setSearchItem}
            newItem={newItem}
            setNewItem={setNewItem}
            setSelectedImage={setSelectedImage}
            handleAddItem={handleAddItem}
            filteredItems={filteredItems}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            />} 
          />

          <Route path="/statistics" element={<Statistics 
            
          />} 
          />
          
          <Route path="/inventory" element={<Inventory 
            items={items}
            searchItem={searchItem}
            setSearchItem={setSearchItem}
            newItem={newItem}
            setSelectedImage={setSelectedImage}
            setNewItem={setNewItem}
            handleAddItem={handleAddItem}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            />} 
          />
        </Routes>
 
        
        
      </div>
    </div>
  </>
  )
}

export default App