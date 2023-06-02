import React, {useState} from 'react'
import './App.scss';

function App() {
  const [backendData, setBackendData] = useState(null)
  const [URL, setURL] = useState("")

  const handleURLcreation = async () => {
    fetch(`https://url-shortener-backend-1k9t.onrender.com/api/create?url=${URL}`).then(res => res.json()).then(data => {
      setBackendData(data)
    })
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${backendData.server}/${backendData.extension}`)
  }

  return (
    <div className='container'>
      <h1>URL Shortener</h1>
      <fieldset className='URLinput'>
        <input type="url" placeholder="www.somewhere.com" onChange={e => setURL(e.target.value)}/>
        <button onClick={handleURLcreation}>Shorten URL</button>
      </fieldset>
      <h2 className='outputLink' onClick={copyLink}>{backendData ? `${backendData.server}/${backendData.extension}` : ""}</h2>
    </div>
  )
}

export default App