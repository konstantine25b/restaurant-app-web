import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { API } from "../../../Processing/PrestoAPI";
import { XMarkIcon } from "@heroicons/react/24/solid";
import COLORS from "../../../Themes/colors";
import EachAvailableOrderContainer from "./OrderComps/EachAvailableOrderContainer";
import EachExpiredOrderContainer from "./OrderComps/EachExpiredOrderContainer";

const OrderDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  animation: fadeIn 0.5s ease;
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  background-color: ${COLORS.mainColor};
  margin: 20px 0;
`;

const GoBackDiv = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #eee;
  }
`;

const BackToHomeButton = styled.div`
  background-color: ${COLORS.mainColor};
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 21px;
  text-decoration: none;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.03);
  }
`;

const ExpiredOrdersContainer = styled.div`
  margin-top: 20px;
  border-top: 2px solid ${COLORS.mainColor};
  padding-top: 20px;
`;

const OrderSectionTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
  text-align: center;
`;

const OrderPage = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/");
  };

  let orderIds = localStorage.getItem("allOrders");
  let orderIds0 = orderIds ? JSON.parse(orderIds) : "";

  const [orders, setOrders] = useState([]);

  const [availableOrders, setAvailableOrders] = useState([]);
  const [expiredOrders, setExpiredOrders] = useState([]);

  let avaibleArr = [];

  const cancelingOrder = async (orderId) => {
    // Ask the user for confirmation
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return; // Do nothing if the user cancels
    }

    const cancel = API.cancelOrder(orderId);
    console.log(cancel, orderId);
    cancel
      .then((result) => {
        // 'result' contains the resolved value of the Promise
        if (result) {
          // Remove the canceled orderId from orderIds0
          const updatedOrderIds = orderIds0.filter((id) => id !== orderId);
          // Update localStorage with the new orderIds
          localStorage.setItem("allOrders", JSON.stringify(updatedOrderIds));

          // Filter out the canceled order from orders state
          const updatedOrders = orders.filter(
            (order) => order && order.id !== orderId
          );
          setOrders(updatedOrders);

          // Filter out the canceled order from orders state
          const updatedAvailableOrders = availableOrders.filter(
            (order) => order && order.id !== orderId
          );
          setAvailableOrders(updatedAvailableOrders);
          localStorage.setItem(
            "avaibleOrders",
            JSON.stringify(updatedAvailableOrders)
          );

          alert("Order canceled successfully!");
        } else {
          alert("Order cancellation failed.");
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the Promise execution
        console.error(error);
      });
  };

  let dataReturnded = false;
  // Access orderInfo from state

  const [timeRemaining, setTimeRemaining] = useState({});
  const fetchOrders = async () => {
    orderIds0 = orderIds0.reverse();
    for (let i = 0; i < orderIds0.length; i++) {
      const orderId = orderIds0[i];
      try {
        const order = await API.getOrderById(orderId);

        // Calculate time remaining for each order
        const currentTime = new Date();
        const requestTime = new Date(order?.orderRequestedDate);
        const timeDifference = requestTime - currentTime;
        if (order) {
          setTimeRemaining((prevTimeRemaining) => ({
            ...prevTimeRemaining,
            [order.id]: timeDifference,
          }));

          if (timeDifference > -86400000) {
            // Order is available

            setAvailableOrders((prevAvailableOrders) => [
              ...prevAvailableOrders,
              order,
            ]);

            avaibleArr.push(order);
            localStorage.setItem("avaibleOrders", JSON.stringify(avaibleArr));
          } else {
            // Order is expired for more than 1 day
            setExpiredOrders((prevExpiredOrders) => [
              ...prevExpiredOrders,
              order,
            ]);
          }

          setOrders((prevOrders) => [...prevOrders, order]);
        }
      } catch (error) {
        // Handle errors here
        console.error(`Error fetching order with ID ${orderId}:`, error);
      }
    }
  };

  useEffect(() => {
    if (dataReturnded === false && orderIds0) {
      dataReturnded = true;
      fetchOrders();
    }
  }, []);

  useEffect(() => {
    // Update timeRemaining every second
    const timer = setInterval(() => {
      const updatedTimeRemaining = { ...timeRemaining };
      for (const orderId in updatedTimeRemaining) {
        updatedTimeRemaining[orderId] -= 1000; // Subtract one second
      }
      setTimeRemaining(updatedTimeRemaining);
    }, 1000);

    return () => {
      clearInterval(timer); // Cleanup interval on unmount
    };
  }, [timeRemaining]);
  console.log(orders);

  return (
    <OrderDetailsContainer>
      <GoBackDiv onClick={handleNavigation}>
        <XMarkIcon
          style={{
            width: 40,
            height: 40,
          }}
          color={COLORS.mainColor}
        />
      </GoBackDiv>

      <h2>Order Details</h2>
      <BackToHomeButton onClick={handleNavigation}>
        Add Another Order or See Menu
      </BackToHomeButton>

      <OrderSectionTitle>Still Available Orders</OrderSectionTitle>
      {availableOrders.map((order, index) => {
        return (
          <EachAvailableOrderContainer
            key={index}
            order={order}
            cancelingOrder={cancelingOrder}
            timeRemaining={timeRemaining}
          />
        );
      })}

      <Divider />

      <ExpiredOrdersContainer>
        <OrderSectionTitle>Expired Orders (More than 1 Day)</OrderSectionTitle>
        {expiredOrders?.map((order, index) => {
          return (
            <EachExpiredOrderContainer
              key={index}
              order={order}
              timeRemaining={timeRemaining}
            />
          );
        })}
      </ExpiredOrdersContainer>
    </OrderDetailsContainer>
  );
};

export default OrderPage;
