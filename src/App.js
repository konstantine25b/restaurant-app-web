import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import HomeScreen from "./components/Pages/HomeScreen";
import { Provider } from "react-redux";
import { store } from "./store";
import EachCategoryPage from "./components/Pages/SelectingProducts/EachCategoryPage";
import EachFoodDetailedInfo from "./components/Pages/SelectingProducts/EachFoodDetailedInfo";
import BasketPage from "./components/Pages/Basket/BasketPage";
import ConfirmPage from "./components/Pages/Basket/ConfirmPage";
import SuccessPage from "./components/Pages/Basket/SuccessPage";
import FailPage from "./components/Pages/Basket/FailPage";
import OrderPage from "./components/Pages/Order/OrderPage";
import EachOrderDetails from "./components/Pages/Order/OrderComps/EachOrderDetails";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index={true} element={<HomeScreen />} />

      <Route path="/categories" element={<EachCategoryPage />} />
      <Route
        path="/categories/EachFoodInfo"
        element={<EachFoodDetailedInfo />}
      />
      <Route path="/basket" element={<BasketPage />} />
      <Route path="/confirm" element={<ConfirmPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/fail" element={<FailPage />} />
      <Route path="/OrderPage" element={<OrderPage />} />
      <Route path="/OrderPage/Eachorder" element={<EachOrderDetails />} />
    </Route>
  )
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
