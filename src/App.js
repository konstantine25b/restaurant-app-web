import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import { Provider } from "react-redux";
import {store} from './store'
import "./App.css"
import EachCategoryPage from "./components/EachCategoryPage";
import EachFoodDetailedInfo from "./components/EachFoodDetailedInfo";
import BasketPage from "./components/BasketPage";
import ConfirmPage from "./components/ConfirmPage";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = '/'>
       <Route index={true} element={<HomeScreen/>}/>
     
       <Route path='/categories' element={<EachCategoryPage/>}/>
       <Route path='/categories/EachFoodInfo' element={<EachFoodDetailedInfo/>}/>
       <Route path='/basket' element={<BasketPage/>}/>
       <Route path='/confirm' element={<ConfirmPage/>}/>
      
    </Route>
    

    
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
