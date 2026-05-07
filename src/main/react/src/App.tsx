import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Header from './components/header/Header.tsx'
import Footer from './components/footer/Footer.tsx'
import AppRoutes from './routes/AppRoutes.tsx'

function App() {
  return (
    <BrowserRouter>
      <main className="bg-bg dark:bg-bg-dark text-gray dark:text-gray-dark flex min-h-screen flex-col">
        <Header />
        <div className="mx-auto w-[90%] flex-grow text-xs md:text-base">
          <AppRoutes />
        </div>
        <Footer />
      </main>
    </BrowserRouter>
  )
}

export default App
