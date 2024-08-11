import { Cards } from "./components/Cards"
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <div className="min-h-screen h-full w-full flex justify-center items-center">
      <Cards />
      <Toaster />
    </div>
  )
}

export default App
