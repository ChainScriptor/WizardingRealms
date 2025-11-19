import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './styles/globals.css'
import SuiProvider from './sui/Provider'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SuiProvider>
    </QueryClientProvider>
  </React.StrictMode>
)

