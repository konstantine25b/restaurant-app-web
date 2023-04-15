import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route index = '/' element={<HomeScreen/>}/>
  )
)


function App() {
  return (
    <RouterProvider router = {router}/> 
  )
}

export default App;
