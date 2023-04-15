import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import { Provider } from "react-redux";
import {store} from './store'
import "./App.css"


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route index = '/' element={<HomeScreen/>}/>
  )
)


function App() {
  return (
    <Provider store={store}>
      <RouterProvider router = {router}/>
    </Provider>
  )
}


export default App;
