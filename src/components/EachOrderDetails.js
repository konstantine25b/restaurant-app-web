import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/solid";
import COLORS from "../Themes/colors";
import { API } from "../Processing/PrestoAPI";

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
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #eee;
    transform: scale(1.1);
  }
`;

const OrderTitle = styled.h2`
  font-size: 24px;
  color: ${COLORS.mainColor};
  margin-bottom: 20px;
`;

const OrderItem = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  background-color: white;
  border: 1px solid ${COLORS.mainColor};
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  color: ${COLORS.mainColor};
`;
const OrderItemContainer = styled.div`
  margin-top: 20px;
  width: 80%;
  background-color: white;
  border: 1px solid ${COLORS.mainColor};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  color: ${COLORS.mainColor};
`;

const OrderItemDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const OrderItemText = styled.div`
  flex: 1;
  margin-left: 10px;
  font-size: 18px;
  color: ${COLORS.mainColor};
`;

const OrderItemImage = styled.img`
  width: 50px;
  height: 50px;
  border: 1px solid black;

  object-fit: cover;
`;
const TotalPrice = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 5px;
  margin-top: 10px;
  color: ${COLORS.mainColor};
`;

const OrderNotes = styled.div`
  font-size: 16px;
  padding: 5px;
  margin-top: 10px;
`;

const RemainingTimeContainer = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 5px;
  margin-top: 20px;
  display: flex;
  align-items: center;
`;

const TimeRemaining = styled.span`
  font-size: 24px;
  margin-left: 10px;
  animation: pulse 1.5s infinite;
  color: ${(props) => (props.red ? "red" : "blue")};

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const CancelationInfo = styled.div`
  font-size: 16px;
  padding: 5px;
  margin-top: 5px;
  color: red;
`;
const CancelOrderButton = styled.button`
  background-color: #ff0000;
  color: white;
  padding: 10px 20px;
  margin-top: 40px;
  margin-bottom: 10px;
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

const EachOrderDetails = () => {
  const { state } = useLocation();
  const orderInfo = state.order;
  const navigate = useNavigate();
  // console.log(orderInfo);

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  const [dishes, setDishes] = useState([]);
  const [fetchedDishes, setFetchedDishes] = useState([]);

  // Calculate the time remaining based on the request date
  function calculateTimeRemaining() {
    const requestDate = new Date(orderInfo?.orderRequestedDate);
    const currentTime = new Date();
    const timeDifference = requestDate - currentTime;
    return Math.max(timeDifference, 0);
  }

  // Update the time remaining every second
  useEffect(() => {
    async function getDishesArr() {
      const arr = orderInfo?.orderItems;
      const fetchedDishes = [];

      for (let i = 0; i < arr.length; i++) {
        const dish = await API.getDishById(arr[i].dish_id);
        fetchedDishes.push(dish);
        setFetchedDishes([...fetchedDishes]); // Update the state with the new dish
      }
    }

    getDishesArr();

    const requestDate = new Date(orderInfo?.orderRequestedDate);
    const updateRemainingTime = () => {
      const currentTime = new Date();
      const timeDifference = requestDate - currentTime;
      setTimeRemaining(Math.max(timeDifference, 0));
    };

    // Calculate initial time remaining
    updateRemainingTime();

    // Update the time remaining every second
    const timer = setInterval(updateRemainingTime, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [orderInfo]);

  let orderIds = localStorage.getItem("allOrders");
  let orderIds0 = orderIds ? JSON.parse(orderIds) : "";
  const [availableOrders, setAvailableOrders] = useState([]);

  const cancelingOrder = async (orderId) => {
    // Ask the user for confirmation
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return; // Do nothing if the user cancels
    }

    const cancel = API.cancelOrder(orderId);
    // console.log(cancel, orderId);
    cancel
      .then((result) => {
        // 'result' contains the resolved value of the Promise
        if (result) {
          // Remove the canceled orderId from orderIds0
          const updatedOrderIds = orderIds0.filter((id) => id !== orderId);
          // Update localStorage with the new orderIds
          localStorage.setItem("allOrders", JSON.stringify(updatedOrderIds));

          // Filter out the canceled order from orders state
          const updatedAvailableOrders = availableOrders.filter(
            (order) => order && order.id !== orderId
          );
          setAvailableOrders(updatedAvailableOrders);
          localStorage.setItem(
            "avaibleOrders",
            JSON.stringify(updatedAvailableOrders)
          );

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

  // Format the time remaining for display
  function formatTimeRemaining() {
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  let statusStyle = { color: "blue" };
  let cancelButtonStyle = {
    backgroundColor: "red",
    color: "#fff",
  };
  let cancelButtonText = "Cancel Order";

  let isCancelButtonActive = true;
  if (timeRemaining <= 0) {
    statusStyle = { color: "red" };
    cancelButtonStyle = { backgroundColor: "black", color: "#fff" };
    cancelButtonText = "Order Expired";

    isCancelButtonActive = false;
  } else if (timeRemaining < 1800000) {
    // Less than 30 minutes (1800000 milliseconds)
    statusStyle = { color: "blue" };
    cancelButtonStyle = { backgroundColor: "black", color: "#fff" };
    cancelButtonText = "Cancellation Not Possible";

    isCancelButtonActive = false;
  } else if (timeRemaining <= -86400000) {
    // Expired for more than 1 day (86400000 milliseconds)
    statusStyle = { color: "red" };
    cancelButtonStyle = { backgroundColor: "black", color: "#fff" };
    cancelButtonText = "Order Expired";

    isCancelButtonActive = false;
  }

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
      <RemainingTimeContainer>
        <strong>Time Remaining:</strong>{" "}
        <TimeRemaining red={timeRemaining < 1800000}>
          {formatTimeRemaining()}
        </TimeRemaining>
      </RemainingTimeContainer>

      <OrderItemContainer>
        <h3>Order Items:</h3>
        {fetchedDishes.map((dish, index) => {
          // console.log(dish.title)
          return (
            <OrderItemDiv key={index}>
              
              <OrderItemText>
                <strong>Item {index + 1}:</strong>{" "}
                <span style={{ color: "black" }}>
                  {dish ? dish.title : "Unknown"}
                </span>
                <br />
                <strong>Notes:</strong>{" "}
                <span style={{ color: "black" }}>
                  {orderInfo?.orderItems[index]?.notes || "No special notes"}
                </span>
              </OrderItemText>
              <OrderItemImage
                src={dish ? dish.image : "placeholder-image-url"}
                alt={dish ? dish.title : "Unknown"}
              />
            </OrderItemDiv>
          );
        })}
      </OrderItemContainer>
      <CancelOrderButton
        onClick={() => {
          if (isCancelButtonActive && timeRemaining > 0) {
            cancelingOrder(orderInfo?.id);
          }
        }}
        style={cancelButtonStyle}
        disabled={!isCancelButtonActive}
      >
        {cancelButtonText}
      </CancelOrderButton>

      <CancelationInfo>
        Order cannot be canceled if less than 30 minutes remaining
      </CancelationInfo>
    </OrderDetailsContainer>
  );
};

export default EachOrderDetails;
