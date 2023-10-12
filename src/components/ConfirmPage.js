import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToBasket,
  removeFromBasketWithIngredients,
  selectBasketItems,
  selectBasketTotal,
} from "../features/basketSlice";
import { selectRestaurant } from "../features/RestaurantSlice";
import COLORS from "../Themes/colors";
import styled from "styled-components";
import {
  ArrowLeftIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

import { API } from "../Processing/PrestoAPI";

export default function BasketPage() {
  const restaurant = JSON.parse(localStorage.getItem("restInfo"));
  const items = useSelector(selectBasketItems);
  const BasketTotal = useSelector(selectBasketTotal);
  const [newGroupedItemsInBasket, setNewGroupedItemsInBasket] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  


  const navigate = useNavigate();
  //es dros sazgvravs plius 10 wams umatebs orderis micemis funqciistvis

  const handleCreateOrder = async () => {
    const newTime = new Date();
    newTime.setMinutes(newTime.getMinutes() + 45);

    const orderData = {
      restaurantId: restaurant.id, // Replace with the desired restaurant ID
      orderRequestedDate: newTime,
      orderItems: orderItems,
    };
    const createOrderSuccess = await API.createOrder(orderData);
    let ordersArr = localStorage.getItem("allOrders")

    if(createOrderSuccess!=-1){
      if(ordersArr){
        
        let Arr = JSON.parse(ordersArr)
        // console.log(Arr)
        Arr.push(createOrderSuccess.orderId)
        // console.log(Arr)
        localStorage.setItem("allOrders" , JSON.stringify(Arr))
      
      }
      else{
        let OrderId = createOrderSuccess.orderId //es prosta stringifys gareshe ar gamodis
        let arr = []
        arr.push(OrderId)
        localStorage.setItem("allOrders" , JSON.stringify(arr))
      }

    }
    else{
      console.log("order failed!")
    }
    
    
    console.log(
      createOrderSuccess!=-1
        ? "Order created successfully!"
        : "Order creation failed."
    );
    console.log(createOrderSuccess)
    createOrderSuccess!=-1 ? navigate("/success") : navigate("/fail");
  };

  function areEqual(array1, array2) {
    if (array1.length === array2.length) {
      return array1.every((element, index) => {
        if (element === array2[index]) {
          return true;
        }

        return false;
      });
    }

    return false;
  }

  useEffect(() => {
    // console.log(items);
    // console.log(restaurant);
    let differnetItemsArr = [];
    for (let i = 0; i < items.length; i++) {
      if (i == 0) {
        differnetItemsArr.push([items[0], 1]);
      }

      if (i > 0) {
        let isAlreadyIn = false;
        for (let j = 0; j < differnetItemsArr.length; j++) {
          if (
            areEqual(
              items[i].unCheckedIngredients,
              differnetItemsArr[j][0].unCheckedIngredients
            ) &&
            differnetItemsArr[j][0].Title == items[i].Title
          ) {
            differnetItemsArr[j][1]++;
            isAlreadyIn = true;
            break;
          }
        }
        if (isAlreadyIn == false) {
          differnetItemsArr.push([items[i], 1]);
        }
      }
    }
    setNewGroupedItemsInBasket(differnetItemsArr);
    // console.log(newGroupedItemsInBasket);
  }, [items.length]);

  useEffect(() => {
    let arr = [];
    // console.log(items);
    for (let i = 0; i < items.length; i++) {
      let eachItem = items[i];
      if (eachItem.unCheckedIngredients.length != 0) {
        let notes1 = "Without: ";
        for (let j = 0; j < eachItem.unCheckedIngredients.length - 1; j++) {
          notes1 = notes1 + eachItem.unCheckedIngredients[j] + ", ";
        }
        notes1 =
          notes1 +
          eachItem.unCheckedIngredients[
            eachItem.unCheckedIngredients.length - 1
          ];
        arr.push({
          dishId: eachItem.Id,
          notes: notes1,
        });
      } else {
        arr.push({
          dishId: eachItem.Id,
          notes: "",
        });
      }
    }
    setOrderItems(arr);
  }, [items]);
  // console.log(orderItems);

  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [tableNumberError, setTableNumberError] = useState("");
  const [paymentMethodError, setPaymentMethodError] = useState("");

  const handleSubmit = () => {
    setTableNumberError(tableNumber ? "" : "Table Number is required");
    setPaymentMethodError(paymentMethod ? "" : "Payment Method is required");

    if (tableNumber && paymentMethod) {
      console.log(
        `Table Number: ${tableNumber}, Payment Method: ${paymentMethod}`
      );
      handleCreateOrder()
      setInterval(() => {
        window.location.reload(); // Reloads the page every second
      }, 1500);

    }
  };


  return (
    <MainDiv>
      <ContinueDiv>
        <SubTotalDiv>
          <SubTotalP1>Subtotal</SubTotalP1>
          <SubTotalP2>{BasketTotal} ₾</SubTotalP2>
        </SubTotalDiv>
        <ServiceFeeDiv>
          <ServiceFeeP1>Service Fee</ServiceFeeP1>
          <ServiceFeeP2>{10} ₾</ServiceFeeP2>
        </ServiceFeeDiv>
        <TotalDiv>
          <TotalP1>Total</TotalP1>
          <TotalP2>{BasketTotal + 10} ₾</TotalP2>
        </TotalDiv>
        <ContinueDivMain>
          <ContinueInside
          // onClick = {()=>navigation.navigate("ConfirmPage")}
          >
            <ContinueP
              onClick={() => {
                
                handleSubmit();
                
              }}
            >
              Confirm Order
            </ContinueP>
          </ContinueInside>
        </ContinueDivMain>
      </ContinueDiv>
      <MainInsideDiv>
        <UpperSide>
          <UpperSideTop>
            <UpperSideTopP1>Order Now</UpperSideTopP1>
            <UpperSideTopP2>{restaurant.title}</UpperSideTopP2>
          </UpperSideTop>
          <GoBackDiv
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeftIcon
              style={{
                width: 30,
                height: 30,
              }}
              color={COLORS.mainColor}
            />
          </GoBackDiv>
        </UpperSide>
        <LowerSide>
          <Container>
            <Label>
              Table Number:
              <RequiredMessage>*</RequiredMessage>
            </Label>
            <InputContainer>
              <TableNumberInput
                type="number"
                placeholder="Enter Table Number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                required
              />
            </InputContainer>
            {tableNumberError && <ErrorText>{tableNumberError}</ErrorText>}
            <Label>
              Select Payment Method:
              <RequiredMessage>*</RequiredMessage>
            </Label>
            <PaymentMethodSelect
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <PaymentOption value="" disabled>
                Select a payment method
              </PaymentOption>
              <PaymentOption value="credit">Credit Card</PaymentOption>
              <PaymentOption value="cash">Cash</PaymentOption>

              {/* Add more payment options if needed */}
            </PaymentMethodSelect>
            {paymentMethodError && <ErrorText>{paymentMethodError}</ErrorText>}
          </Container>
        </LowerSide>
      </MainInsideDiv>
    </MainDiv>
  );
}

const ContinueDiv = styled.div`
  position: fixed;
  bottom: 0px;
  width: 100%;
  z-index: 1;
  padding-bottom: 40px;
  background-color: ${COLORS.mainColor};
`;

const SubTotalDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  background-color: ${COLORS.mainColor};
`;

const SubTotalP1 = styled.p`
  color: gray;
  font-size: 15px;
  font-weight: 500;
  margin: 10px;
`;
const SubTotalP2 = styled.p`
  color: gray;
  font-size: 15px;
  font-weight: 500;
  margin: 10px;
`;

const ServiceFeeDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  background-color: ${COLORS.mainColor};
`;

const ServiceFeeP1 = styled.p`
  color: gray;
  font-size: 15px;
  font-weight: 500;
  margin: 10px;
`;
const ServiceFeeP2 = styled.p`
  color: gray;
  font-size: 15px;
  font-weight: 500;
  margin: 10px;
`;

const TotalDiv = styled.div`
  width: 100%;
  display: flex;
  padding-bottom: 5px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  background-color: ${COLORS.mainColor};
`;
const TotalP1 = styled.p`
  color: white;
  font-size: 17;
  font-weight: 500;
  margin: 12px;
`;
const TotalP2 = styled.p`
  color: white;
  font-size: 17;
  font-weight: 500;
  margin: 12px;
`;

const ContinueDivMain = styled.div`
  display: flex;
  padding-top: 20px;
  background-color: ${COLORS.mainColor};
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const ContinueInside = styled.div`
  background-color: white;
  display: flex;
  width: 70%;
  padding: 10px;
  border-radius: 4px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ContinueP = styled.p`
  color: ${COLORS.mainColor};
  font-size: 20px;
  font-weight: 700;
  margin: 0px;
`;
const MainDiv = styled.div`
  background-color: whitesmoke;
`;
const MainInsideDiv = styled.div``;
const UpperSide = styled.div`
  width: 100%;
  position: fixed;
  z-index: 1;
  top: 0px;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid ${COLORS.mainColor};
`;

const UpperSideTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  position: relative;
`;

const UpperSideTopP1 = styled.p`
  font-size: 25px;
  font-weight: 500;
  color: ${COLORS.mainColor};
  margin: 0;
`;

const UpperSideTopP2 = styled.p`
  font-size: 18px;
  font-weight: 400;
  margin: 0;
`;

const GoBackDiv = styled.div`
  background-color: lightgray;
  width: 30px;
  height: 30px;
  padding: 10px;
  margin: 0;
  border-radius: 50%;
  margin-top: 28px;
  position: absolute;
  z-index: 1px;
  top: -11px;
  left: 15px;
`;

const LowerSide = styled.div`
  padding-bottom: 400px;
  padding-top: 90px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  font-size: 20px;
  margin-bottom: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const RequiredMessage = styled.span`
  color: red;
  margin-left: 5px;
`;

const TableNumberInput = styled.input`
  padding: 12px;
  border: 2px solid #ccc;
  border-radius: 10px;
  font-size: 18px;
  outline: none;
  width: 100%;
  max-width: 300px;
  margin-right: 0;
`;

const PaymentMethodSelect = styled.select`
  padding: 12px;
  border: 2px solid #ccc;
  border-radius: 10px;
  font-size: 18px;
  outline: none;
  width: 100%;
  max-width: 300px;
`;

const PaymentOption = styled.option`
  font-size: 18px;
  background-color: #fff;
  color: #333;
  border-radius: 5px;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;
