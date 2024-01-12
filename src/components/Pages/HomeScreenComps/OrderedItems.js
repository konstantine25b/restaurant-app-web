import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const ShoppingCartButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10;
  background-color: #007bff;
  color: #fff;
  padding: 15px 20px; /* Adjusted padding for larger height */
  border: none;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 120px; /* Adjusted width */

  &:hover {
    background-color: #0056b3;
  }
`;

const OrderCount = styled.span`
  font-weight: bold;
`;

const OrderNotification = ({ orderCount }) => {
  const navigate = useNavigate();
  return (
    <ShoppingCartButton
      onClick={() => {
        // Navigate to the page where the user can see their order
        navigate("/OrderPage");
      }}
    >
      <ShoppingCartIcon width="24" height="24" />
      You have <OrderCount>{orderCount}</OrderCount> orders
    </ShoppingCartButton>
  );
};

export default OrderNotification;
