import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Storage polyfill
if (typeof window !== "undefined") {
  window.storage = {
    get: async (key) => {
      const val = localStorage.getItem(key);
      if (val === null) throw new Error("not found");
      return { key, value: val };
    },
    set: async (key, value) => {
      localStorage.setItem(key, String(value));
      return { key, value };
    },
    delete: async (key) => {
      localStorage.removeItem(key);
      return { key, deleted: true };
    },
    list: async (prefix) => {
      const keys = Object.keys(localStorage).filter(k => !prefix || k.startsWith(prefix));
      return { keys };
    },
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
