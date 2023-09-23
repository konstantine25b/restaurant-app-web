import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { API } from "../Processing/PrestoAPI";
import { XMarkIcon } from "@heroicons/react/24/solid";
import COLORS from "../Themes/colors";

const OrderDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  animation: fadeIn 0.5s ease;
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  background-color: ${COLORS.mainColor};
  margin: 20px 0;
`;

const GoBackDiv = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #eee;
  }
`;

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
`;

const UserId = styled.div`
  font-size: 16px;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 15px;
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

const BackToHomeButton = styled.div`
  background-color: ${COLORS.mainColor};
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  text-decoration: none;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.03);
  }
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

const ExpiredOrdersContainer = styled.div`
  margin-top: 20px;
  border-top: 2px solid ${COLORS.mainColor};
  padding-top: 20px;
`;

const OrderSectionTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
  text-align: center;
`;

const OrderPage = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/");
  };

  let orderIds = localStorage.getItem("allOrders");
  let orderIds0 = orderIds ? JSON.parse(orderIds) : "";

  const [orders, setOrders] = useState([]);

  const cancelingOrder = async (orderId) => {
    // Ask the user for confirmation
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return; // Do nothing if the user cancels
    }

    const cancel = API.cancelOrder(orderId);
    console.log(cancel, orderId);
    cancel
      .then((result) => {
        // 'result' contains the resolved value of the Promise
        if (result) {
          // Remove the canceled orderId from orderIds0
          const updatedOrderIds = orderIds0.filter((id) => id !== orderId);
          // Update localStorage with the new orderIds
          localStorage.setItem("allOrders", JSON.stringify(updatedOrderIds));

          // Filter out the canceled order from orders state
          const updatedOrders = orders.filter(
            (order) => order && order.id !== orderId
          );
          setOrders(updatedOrders);

          alert("Order canceled successfully!");
        } else {
          alert("Order cancellation failed.");
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the Promise execution
        console.error(error);
      });
  };

  const calculateTimeRemaining = (order) => {
    const currentTime = new Date();
    const requestTime = new Date(order?.orderRequestedDate);
    const timeDifference = requestTime - currentTime;

    return Math.max(timeDifference, 0); // Ensure time remaining is not negative
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  let dataReturnded = false;
  // Access orderInfo from state

  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      orderIds0 = orderIds0.reverse();
      for (let i = 0; i < orderIds0.length; i++) {
        const orderId = orderIds0[i];
        try {
          const order = await API.getOrderById(orderId);

          // Calculate time remaining for each order
          const currentTime = new Date();
          const requestTime = new Date(order?.orderRequestedDate);
          const timeDifference = requestTime - currentTime;

          if (order) {
            setTimeRemaining((prevTimeRemaining) => ({
              ...prevTimeRemaining,
              [order.id]: timeDifference,
            }));
            setOrders((prevOrders) => [...prevOrders, order]);
          }
        } catch (error) {
          // Handle errors here
          console.error(`Error fetching order with ID ${orderId}:`, error);
        }
      }
    };

    if (dataReturnded === false && orderIds0) {
      dataReturnded = true;
      fetchOrders();
    }
  }, []);

  useEffect(() => {
    // Update timeRemaining every second
    const timer = setInterval(() => {
      const updatedTimeRemaining = { ...timeRemaining };
      for (const orderId in updatedTimeRemaining) {
        updatedTimeRemaining[orderId] -= 1000; // Subtract one second
      }
      setTimeRemaining(updatedTimeRemaining);
    }, 1000);

    return () => {
      clearInterval(timer); // Cleanup interval on unmount
    };
  }, [timeRemaining]);
  console.log(orders);

  return (
    <OrderDetailsContainer>
      <GoBackDiv onClick={handleNavigation}>
        <XMarkIcon
          style={{
            width: 40,
            height: 40,
          }}
          color={COLORS.mainColor}
        />
      </GoBackDiv>
      <h2>Order Details</h2>

      <OrderSectionTitle>Still Available Orders</OrderSectionTitle>
      {orders
        ?.filter(
          (order) => !order || (timeRemaining[order.id] || 0) > -86400000
        )
        .map((order, index) => {
          if (!order) {
            // Skip null or undefined orders
            return null;
          }

          const remainingTime = timeRemaining[order.id] || 0;
          const timeFormatted = formatTime(Math.max(remainingTime, 0));

          let statusStyle = { color: "blue" };
          let cancelButtonStyle = {
            backgroundColor: COLORS.mainColor,
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
              <OrderNotes style={{ color: "red" }}>
                Order cannot be canceled
              </OrderNotes>
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
              <OrderNotes style={{ color: "red" }}>
                Order cannot be canceled
              </OrderNotes>
            );
            isCancelButtonActive = false;
          }

          return (
            <OrderContainer key={index}>
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
                <TotalPrice>Total Price:</TotalPrice> ₾
                {order?.totalPrice?.toFixed(2)}
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
        })}

      <Divider />

      <ExpiredOrdersContainer>
        <OrderSectionTitle>Expired Orders (More than 1 Day)</OrderSectionTitle>
        {orders?.map((order, index) => {
          if (!order) {
            // Skip null or undefined orders
            return null;
          }

          const remainingTime = timeRemaining[order.id] || 0;
          const timeFormatted = formatTime(Math.max(remainingTime, 0));

          if (remainingTime <= -86400000) {
            // Expired for more than 1 day (86400000 milliseconds)
            let statusStyle = { color: "red" };
            let cancelButtonStyle = { backgroundColor: "black", color: "#fff" };
            let cancelButtonText = "Order Expired";

            return (
              <OrderContainer key={index}>
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
                  <TotalPrice>Total Price:</TotalPrice> ₾
                  {order?.totalPrice?.toFixed(2)}
                </OrderItem>
                <CancelOrderButton
                  onClick={() => {
                    // Expired orders cannot be canceled
                  }}
                  style={cancelButtonStyle}
                  disabled={true}
                >
                  {cancelButtonText}
                </CancelOrderButton>
                <OrderNotes style={{ color: "red" }}>
                  Order cannot be canceled
                </OrderNotes>
              </OrderContainer>
            );
          }

          return null;
        })}
      </ExpiredOrdersContainer>
      <BackToHomeButton onClick={handleNavigation}>
        Add Another Order or See Menu
      </BackToHomeButton>
    </OrderDetailsContainer>
  );
};

export default OrderPage;
