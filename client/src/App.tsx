import { Cards } from "./components/Cards"
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <div className="min-h-screen h-full w-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex justify-center items-center">
      <Cards />
      <Toaster />
    </div>
  )
}

export default App
