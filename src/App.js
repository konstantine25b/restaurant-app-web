import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import { Provider } from "react-redux";
import {store} from './store'
import "./App.css"
import EachCategoryPage from "./components/EachCategoryPage";
import EachFoodDetailedInfo from "./components/EachFoodDetailedInfo";
import BasketPage from "./components/BasketPage";
import ConfirmPage from "./components/ConfirmPage";
import SuccessPage from "./components/SuccessPage"
import FailPage from "./components/FailPage"
import OrderPage from "./components/OrderPage";
import EachOrderDetails from "./components/EachOrderDetails";




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = '/'>
       <Route index={true} element={<HomeScreen/>}/>
     
       <Route path='/categories' element={<EachCategoryPage/>}/>
       <Route path='/categories/EachFoodInfo' element={<EachFoodDetailedInfo/>}/>
       <Route path='/basket' element={<BasketPage/>}/>
       <Route path='/confirm' element={<ConfirmPage/>}/>
       <Route path='/success' element={<SuccessPage/>}/>
       <Route path='/fail' element={<FailPage/>}/>
       <Route path='/OrderPage' element={<OrderPage/>}/>
       <Route path='/OrderPage/Eachorder' element={<EachOrderDetails/>}/>

      
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
