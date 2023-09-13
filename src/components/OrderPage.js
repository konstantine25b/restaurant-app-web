import React from "react";
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

const OrderPage = () => {


    // Access orderInfo from state
    const orderInfo =JSON.parse(localStorage.getItem("orderedItems"));
    const orderInfo1 = orderInfo[0]
    console.log(orderInfo)
  return (
    <OrderDetailsContainer>
      <h2>Order Details</h2>
      <OrderItem>
        <strong>Order ID:</strong> {orderInfo1?.Id}
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
        <strong>Total Price:</strong> ₾{orderInfo1?.totalPrice?.toFixed(2)}
      </OrderItem>
      <UserId>
        <strong>Customer ID:</strong> {orderInfo1?.userId}
      </UserId>
      <OrderNotes>
        <strong>Notes:</strong> {orderInfo1?.notes || "No notes provided"}
      </OrderNotes>
    </OrderDetailsContainer>
  );
};

export default OrderPage;