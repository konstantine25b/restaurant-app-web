import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const OrderDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const OrderItem = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  border: 1px solid #ccc;
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
  background-color: #007bff;
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
  border: 2px solid #007bff; /* Border style */
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

  // Access orderInfo from state
  const orderInfo = localStorage.getItem("orderedItems");
  const orderInfo0 = orderInfo ? JSON.parse(orderInfo) : "";
  console.log(orderInfo0)
  

  return (
    <OrderDetailsContainer>
      <h2>Order Details</h2>
      {orderInfo0?.map((orderInfo1, index) => (
        <OrderContainer key={index}>
          <OrderItem>
            <strong>Order ID:</strong> {orderInfo1[0]?.Id}
          </OrderItem>
          <OrderItem>
            <strong>Order Request Date:</strong>{" "}
            {new Date(orderInfo1?.orderRequestedDate).toLocaleString()}
          </OrderItem>
          <OrderItem>
            <strong>Order Sent Date:</strong>{" "}
            {orderInfo1?.orderSent
              ? new Date(orderInfo1?.orderSent).toLocaleString()
              : "Not sent yet"}
          </OrderItem>
          <OrderItem>
            <TotalPrice>
              Total Price:
            </TotalPrice>{" "}
            ₾{orderInfo1?.totalPrice?.toFixed(2)}
          </OrderItem>
          <UserId>
            <strong>Customer ID:</strong> {orderInfo1?.userId}
          </UserId>
          <OrderNotes>
            <strong>Notes:</strong> {orderInfo1?.notes || "No notes provided"}
          </OrderNotes>
        </OrderContainer>
      ))}
      <BackToHomeButton onClick={handleNavigation}>
        Add Another Order or See Menu
      </BackToHomeButton>
    </OrderDetailsContainer>
  );
};

export default OrderPage;