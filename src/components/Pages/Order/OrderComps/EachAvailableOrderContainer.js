import React, { useState } from "react";
import COLORS from "../../../../Themes/colors";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const OrderItem = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  border: 1px solid ${COLORS.mainColor};
  padding: 10px;
  border-radius: 5px;
`;

const OrderButton = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  border: 1px solid ${COLORS.mainColor};
  background-color: ${COLORS.mainColor};
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.03);
  }
`;

const TotalPrice = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 5px;
  margin-top: 10px;
  display: inline;
`;

const CancelOrderButton = styled.button`
  background-color: #ff0000;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.03);
  }
`;

const OrderNotes = styled.div`
  font-size: 16px;
  padding: 5px;
  margin-top: 10px;
`;

const OrderContainer = styled.div`
  width: 80%;
  border: 2px solid ${COLORS.mainColor};
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  margin-top: 20px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.03);
  }
`;

const formatTime = (time) => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);

  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default function EachAvailableOrderContainer({
  order,
  cancelingOrder,
  timeRemaining,
}) {
  const navigate = useNavigate();

  if (!order) {
    // Skip null or undefined orders
    return null;
  }

  const remainingTime = timeRemaining[order.id] || 0;
  const timeFormatted = formatTime(Math.max(remainingTime, 0));

  let statusStyle = { color: "blue" };
  let cancelButtonStyle = {
    backgroundColor: "red",
    color: "#fff",
  };
  let cancelButtonText = "Cancel Order";
  let cancelationInfo = null;
  let isCancelButtonActive = true;

  if (remainingTime <= 0) {
    statusStyle = { color: "red" };
    cancelButtonStyle = { backgroundColor: "black", color: "#fff" };
    cancelButtonText = "Order Expired";
    cancelationInfo = (
      <OrderNotes style={{ color: "red" }}>Order cannot be canceled</OrderNotes>
    );
    isCancelButtonActive = false;
  } else if (remainingTime < 1800000) {
    // Less than 30 minutes (1800000 milliseconds)
    statusStyle = { color: "blue" };
    cancelButtonStyle = { backgroundColor: "black", color: "#fff" };
    cancelButtonText = "Cancellation Not Possible";
    cancelationInfo = (
      <OrderNotes style={{ color: "red" }}>
        Cancellation not possible if less than 30 minutes left
      </OrderNotes>
    );
    isCancelButtonActive = false;
  } else if (remainingTime <= -86400000) {
    // Expired for more than 1 day (86400000 milliseconds)
    statusStyle = { color: "red" };
    cancelButtonStyle = { backgroundColor: "black", color: "#fff" };
    cancelButtonText = "Order Expired";
    cancelationInfo = (
      <OrderNotes style={{ color: "red" }}>Order cannot be canceled</OrderNotes>
    );
    isCancelButtonActive = false;
  }

  return (
    <OrderContainer key={order.id}>
      <OrderButton
        onClick={() => {
          navigate("/OrderPage/Eachorder", {
            state: { order: order },
          });
        }}
      >
        See Full Order Details
      </OrderButton>
      <OrderItem>
        <strong>Order Request Date:</strong>{" "}
        <span style={statusStyle}>
          {new Date(order?.orderRequestedDate).toLocaleString()}
        </span>
        <br />
        <strong>Time Remaining:</strong>{" "}
        <span style={statusStyle}>{timeFormatted}</span>
      </OrderItem>
      <OrderItem>
        <TotalPrice>Order Status:</TotalPrice>
        <span
          style={{
            color:
              order.orderState === 0
                ? "orange"
                : order.orderState === 1
                ? "blue"
                : "red",
          }}
        >
          {order.orderState === 0
            ? "Pending"
            : order.orderState === 1
            ? "Confirmed"
            : "Denied"}
        </span>
      </OrderItem>
      <OrderItem>
        <TotalPrice>Total Price: {order?.totalPrice?.toFixed(2)} </TotalPrice>
      </OrderItem>
      <OrderItem>
        <TotalPrice>
          Table Number: {order?.orderTable > 0 ? order?.orderTable : "None"}
        </TotalPrice>
      </OrderItem>
      <CancelOrderButton
        onClick={() => {
          if (isCancelButtonActive && remainingTime > 0) {
            cancelingOrder(order?.id);
          }
        }}
        style={cancelButtonStyle}
        disabled={!isCancelButtonActive}
      >
        {cancelButtonText}
      </CancelOrderButton>
      {cancelationInfo}
    </OrderContainer>
  );
}
