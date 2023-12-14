import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import COLORS from "../../Themes/colors";
import { XMarkIcon } from "@heroicons/react/24/solid";

const OrderDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  border-radius: 10px;
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

const OrderTitle = styled.h2`
  font-size: 24px;
  color: ${COLORS.mainColor}; /* Colored text */
  margin-bottom: 20px;
`;

const OrderItem = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  background-color: white; /* White background */
  border: 1px solid ${COLORS.mainColor}; /* Colored border */
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  color: ${COLORS.mainColor}; /* Colored text */
`;

const TotalPrice = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 5px;
  margin-top: 10px;
  color: ${COLORS.mainColor}; /* Colored text */
`;

const UserId = styled.div`
  font-size: 16px;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 15px;
  color: ${COLORS.mainColor}; /* Colored text */
`;

const OrderNotes = styled.div`
  font-size: 16px;
  padding: 5px;
  margin-top: 10px;
  color: ${COLORS.mainColor}; /* Colored text */
`;

const OrderItemContainer = styled.div`
  margin-top: 20px;
  width: 80%;
  background-color: white; /* White background */
  border: 1px solid ${COLORS.mainColor}; /* Colored border */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  color: ${COLORS.mainColor}; /* Colored text */
`;

const EachOrderDetails = () => {
  const { state } = useLocation();
  const orderInfo = state.order;
  const navigate = useNavigate();

  return (
    <OrderDetailsContainer>
      <GoBackDiv
        onClick={() => {
          navigate(-1);
        }}
      >
        <XMarkIcon
          style={{
            width: 40,
            height: 40,
          }}
          color={COLORS.mainColor}
        />
      </GoBackDiv>
      <OrderTitle>Order Details</OrderTitle>
      <OrderItem>
        <strong>Order ID:</strong> {orderInfo?.id}
      </OrderItem>
      <OrderItem>
        <strong>Order Number:</strong>{" "}
        {orderInfo?.orderTable > 0 ? orderInfo?.orderTable : "none"}
      </OrderItem>
      <OrderItem>
        <strong>Order Request Date:</strong>{" "}
        <span style={{ color: "black" }}>
          {new Date(orderInfo?.orderRequestedDate).toLocaleString()}
        </span>
      </OrderItem>
      <OrderItem>
        <strong>Order Sent Date:</strong>{" "}
        <span style={{ color: "black" }}>
          {orderInfo?.orderSent
            ? new Date(orderInfo?.orderSent).toLocaleString()
            : "Not sent yet"}
        </span>
      </OrderItem>
      <OrderItem>
        <TotalPrice>Total Price:</TotalPrice>{" "}
        <span style={{ color: "black" }}>
          ₾{orderInfo?.totalPrice?.toFixed(2)}
        </span>
      </OrderItem>
      <UserId>
        <strong>Customer ID:</strong> {orderInfo?.userId}
      </UserId>
      <OrderNotes>
        <strong>Notes:</strong>{" "}
        <span style={{ color: "black" }}>
          {orderInfo?.notes || "No notes provided"}
        </span>
      </OrderNotes>
      <OrderItemContainer>
        <h3>Order Items:</h3>
        {orderInfo?.orderItems.map((item, index) => (
          <div key={index}>
            <p>
              <strong>Item {index + 1}:</strong>{" "}
              <span style={{ color: "black" }}>
                {item.dish ? item.dish.name : "Unknown"}
              </span>
            </p>
            <p>
              <strong>Notes:</strong>{" "}
              <span style={{ color: "black" }}>
                {item.notes || "No special notes"}
              </span>
            </p>
          </div>
        ))}
      </OrderItemContainer>
    </OrderDetailsContainer>
  );
};

export default EachOrderDetails;
