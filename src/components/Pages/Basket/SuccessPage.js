import React, { useEffect,  } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

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
  const prevOrder = localStorage.getItem("orderedItems");
  
  

  useEffect(() => {
    if (savedData) {
      localStorage.removeItem("basket");
      let savedData1 = JSON.parse(savedData)
      console.log(savedData1)
      
      if (!prevOrder) {
        localStorage.setItem("orderedItems", JSON.stringify([savedData1]));
        console.log(prevOrder)
        
      } else {
        let prevOrder1 = JSON.parse(prevOrder)
        prevOrder1.push(savedData1)
        
        // let orderInfo0 = JSON.parse(prevOrder)
        // let sData = JSON.parse(savedData)
        // orderInfo0.push(sData)
        console.log(prevOrder1)
        localStorage.setItem("orderedItems", JSON.stringify(prevOrder1))
        // // const orderInfo1 = orderInfo0[0];
        // // let arr = [orderInfo1 , savedData];
        // console.log(orderInfo0)
        // localStorage.setItem("orderedItems", orderInfo0);
      }
      
    }
    // localStorage.removeItem("orderedItems")
    
    // console.log(savedData)
    // console.log(prevOrder)
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
          
          // Navigate to the page where the user can see their order
          navigate("/OrderPage");
        }}
      >
        See Your Order
      </SeeYourOrderButton>
    </SuccessPageContainer>
  );
};

export default SuccessOrderPage;
