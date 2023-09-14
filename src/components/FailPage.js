import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const FailurePageContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

const FailureMessage = styled.h2`
  font-size: 24px;
  color: #ff0000; /* Red color for failure message */
`;

const FailureIcon = styled.span`
  font-size: 48px;
  color: #ff0000; /* Red color for failure icon */
`;

const GoBackButton = styled.div`
  background-color: #ff0000;
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
    background-color: #cc0000;
  }
`;

const FailureOrderPage = () => {
  const navigate = useNavigate();
  return (
    <FailurePageContainer>
      <FailureIcon>&#10060;</FailureIcon>
      <FailureMessage>Order Failed!</FailureMessage>
      <p>Sorry, there was an issue processing your order.</p>
      <GoBackButton onClick={() => {
          
          // Navigate to the page where the user can see their order
          navigate("/basket");
        }}>Go Back to Basket</GoBackButton>
    </FailurePageContainer>
  );
};

export default FailureOrderPage;