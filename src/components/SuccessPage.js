import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const SuccessPageContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

const SuccessMessage = styled.h2`
  font-size: 24px;
  color: #007bff; /* Blue color for success message */
`;

const SuccessIcon = styled.span`
  font-size: 48px;
  color: #007bff; /* Blue color for success icon */
`;

const SeeYourOrderButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const SuccessOrderPage = () => {
  
  const savedData = localStorage.getItem("basket");

  useEffect(() => {
    localStorage.setItem("orderedItems", savedData)
    localStorage.setItem("basket", '')
    
    
  }, [savedData]);

  

  const navigate = useNavigate();
  return (
    <SuccessPageContainer>
      <SuccessIcon>&#10003;</SuccessIcon>
      <SuccessMessage>Order Confirmed!</SuccessMessage>
      <p>Your order has been successfully placed.</p>
      {/* Add the "See Your Order" button */}
      <SeeYourOrderButton
        onClick={() => {
          setInterval(() => {
            window.location.reload(); // Reloads the page every second
          }, 500);
          // Navigate to the page where the user can see their order
          navigate("/OrderPage")
        }}
      >
        See Your Order
      </SeeYourOrderButton>
    </SuccessPageContainer>
  );
};

export default SuccessOrderPage;
