import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectBasketItems,
  selectBasketTotal,
} from "../../../features/basketSlice";
import COLORS from "../../../Themes/colors";
import styled from "@emotion/styled";

export default function Basket(props) {
  const { theme } = props;
  const items = useSelector(selectBasketItems);

  const basketTotal = useSelector(selectBasketTotal);

  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/basket");
  };

  return (
    // onClick ={()=>{navigation.navigate("BasketPage")}}

    <MainDiv onClick={handleNavigation}>
      {theme == "dark" ? (
        <MainButton1>
          <div>
            {theme == "dark" ? (
              <ItemsLength1> {items.length}</ItemsLength1>
            ) : (
              <ItemsLength2> {items.length}</ItemsLength2>
            )}
          </div>
          {theme == "dark" ? (
            <BasketText1>Order Now</BasketText1>
          ) : (
            <BasketText2>Order Now</BasketText2>
          )}

          {theme == "dark" ? (
            <BasketTotal1>{basketTotal} ₾</BasketTotal1>
          ) : (
            <BasketTotal2>{basketTotal} ₾</BasketTotal2>
          )}
        </MainButton1>
      ) : (
        <MainButton2>
          <div>
            {theme == "dark" ? (
              <ItemsLength1> {items.length}</ItemsLength1>
            ) : (
              <ItemsLength2> {items.length}</ItemsLength2>
            )}
          </div>
          {theme == "dark" ? (
            <BasketText1>Order Now</BasketText1>
          ) : (
            <BasketText2>Order Now</BasketText2>
          )}

          {theme == "dark" ? (
            <BasketTotal1>{basketTotal} ₾</BasketTotal1>
          ) : (
            <BasketTotal2>{basketTotal} ₾</BasketTotal2>
          )}
        </MainButton2>
      )}
    </MainDiv>
  );
}

const MainDiv = styled.div``;

const MainButton1 = styled.div`
  position: fixed;
  width: 90%;
  height: 70px;
  background-color: ${COLORS.mainColor};
  opacity: 0.9;
  bottom: 30px;
  margin-left: 5%;
  border-radius: 10px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
const ItemsLength1 = styled.p`
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  padding: 10px 15px;
  border-radius: 20%;
`;
const BasketText1 = styled.p`
  color: white;
  font-size: 18px;
  font-weight: 700;
`;
const BasketTotal1 = styled.p`
  color: white;
  font-size: 18px;
  font-weight: 700;
`;

const MainButton2 = styled.div`
  position: fixed;
  width: 90%;
  height: 70px;
  background-color: white;
  opacity: 0.9;
  bottom: 30px;
  margin-left: 5%;
  border-radius: 10px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
const ItemsLength2 = styled.p`
  color: ${COLORS.mainColor};
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  padding: 10px 15px;
  border-radius: 20%;
`;
const BasketText2 = styled.p`
  color: ${COLORS.mainColor};
  font-size: 18px;
  font-weight: 700;
`;
const BasketTotal2 = styled.p`
  color: ${COLORS.mainColor};
  font-size: 18px;
  font-weight: 700;
`;
