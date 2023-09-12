import React from 'react';
import styled from 'styled-components';

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

const SuccessOrderPage = () => {
  return (
    <SuccessPageContainer>
      <SuccessIcon>&#10003;</SuccessIcon>
      <SuccessMessage>Order Confirmed!</SuccessMessage>
      <p>Your order has been successfully placed.</p>
      {/* You can add more content or links here */}
    </SuccessPageContainer>
  );
};

export default SuccessOrderPage;