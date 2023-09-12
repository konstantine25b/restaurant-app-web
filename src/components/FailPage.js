import React from 'react';
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

const FailureOrderPage = () => {
  return (
    <FailurePageContainer>
      <FailureIcon>&#10060;</FailureIcon>
      <FailureMessage>Order Failed!</FailureMessage>
      <p>Sorry, there was an issue processing your order.</p>
      {/* You can add more content or links here */}
    </FailurePageContainer>
  );
};

export default FailureOrderPage;