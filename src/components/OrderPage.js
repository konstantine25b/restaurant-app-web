import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { API } from "../Processing/PrestoAPI";
import { XMarkIcon } from "@heroicons/react/24/solid";
import COLORS from "../Themes/colors";

const OrderDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const GoBackDiv = styled.div`
  margin-top: 34px;
  position: fixed;
  z-index: 1;
  top: -21px;
  right: 10px;
  width: 50px;
  height: 50px;
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;
const OrderItem = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  border: 1px solid ${COLORS.mainColor};
  padding: 10px;
  border-radius: 5px;
`;

const TotalPrice = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 5px;
  margin-top: 10px;
`;

const UserId = styled.div`
  font-size: 16px;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 15px;
`;

const OrderNotes = styled.div`
  font-size: 16px;
  padding: 5px;
  margin-top: 10px;
`;

const BackToHomeButton = styled.div`
  background-color: ${COLORS.mainColor};
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  text-decoration: none;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const OrderContainer = styled.div`
  width: 80%; /* Adjust the width as needed */
  border: 2px solid ${COLORS.mainColor}; /* Border style */
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Add shadow */
  padding: 20px;
  margin-top: 20px; /* Adjust the margin as needed */
`;

const OrderPage = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/");
  };

  const [orders, setOrders] = useState([]);

  let dataReturnded = false;
  // Access orderInfo from state

  const getOrders = async (arr) => {
    let newOrders = [];
    for (let i = 0; i < arr.length; i++) {
      const order = await API.getOrderById(arr[i]);
      newOrders.push(order);
    }
    setOrders(newOrders);
  };

  let orderIds = localStorage.getItem("allOrders");
  let orderIds0 = orderIds ? JSON.parse(orderIds) : "";

  useEffect(() => {
    console.log(dataReturnded);
    if (dataReturnded == false && orderIds0) {
      dataReturnded = true;
      getOrders(orderIds0);
    }
    
  }, []);
  console.log(orders)

 

  return (
    <OrderDetailsContainer>
      <GoBackDiv
        onClick={handleNavigation}
      >
        
          <XMarkIcon
            style={{
              width: 40,
              height: 40,
            }}
            color={COLORS.mainColor}
          />
        
      </GoBackDiv>
      <h2>Order Details</h2>
      {orders?.map((order, index) => (
        
        <OrderContainer key={index}>
          <OrderItem>
            <strong>Order ID:</strong> {order?.id}
          </OrderItem>
          <OrderItem>
            <strong>Order Request Date:</strong>{" "}
            {new Date(order?.orderRequestedDate).toLocaleString()}
          </OrderItem>
          <OrderItem>
            <strong>Order Sent Date:</strong>{" "}
            {order?.orderSent
              ? new Date(order?.orderSent).toLocaleString()
              : "Not sent yet"}
          </OrderItem>
          <OrderItem>
            <TotalPrice>Total Price:</TotalPrice> ₾
            {order?.totalPrice?.toFixed(2)}
          </OrderItem>
          
        </OrderContainer>
      ))}
      <BackToHomeButton onClick={handleNavigation}>
        Add Another Order or See Menu
      </BackToHomeButton>
    </OrderDetailsContainer>
  );
};

export default OrderPage;
