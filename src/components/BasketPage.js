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

export default function BasketPage() {
  const restaurant = useSelector(selectRestaurant);
  const items = useSelector(selectBasketItems);
  const BasketTotal = useSelector(selectBasketTotal);
  const [newGroupedItemsInBasket, setNewGroupedItemsInBasket] = useState([]);
  const dispatch = useDispatch();
 

  const navigate = useNavigate();

  const removeItemFromBasket = (Id, unCheckedIngredients) => {
    dispatch(removeFromBasketWithIngredients({ Id, unCheckedIngredients }));
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
            <ContinueP>Go to Payment</ContinueP>
          </ContinueInside>
        </ContinueDivMain>
      </ContinueDiv>
      <MainInsideDiv>
        <UpperSide>
          <UpperSideTop>
            <UpperSideTopP1>Basket items</UpperSideTopP1>
            <UpperSideTopP2>{restaurant.Title}</UpperSideTopP2>
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
          {newGroupedItemsInBasket.map((items, index) => {
            return (
              <EachItem key={index}>
                <EachItemInfo>
                  <EachItemInfoInside>
                    <EachItemInfoInsideP1>{items[1]} x</EachItemInfoInsideP1>
                    <EachItemImage src={items[0]?.FoodImage} />
                    <EachItemInfoInsideDiv>
                      <EachItemInfoInsideDivP1>
                        {items[0]?.Title}
                      </EachItemInfoInsideDivP1>
                      <EachItemInfoInsideDivP2>
                        {items[0]?.unCheckedIngredients?.map((items, index) => {
                          return index == 0
                            ? "Without: " + items
                            : " , " + items;
                        })}
                      </EachItemInfoInsideDivP2>
                    </EachItemInfoInsideDiv>
                  </EachItemInfoInside>

                  <EachItemPriceP>{items[0]?.Price} ₾</EachItemPriceP>
                </EachItemInfo>
                <EachItemInfoBottom>
                  <RemoveDiv
                    onClick={() => {
                      removeItemFromBasket(
                        items[0].Id,
                        items[0].unCheckedIngredients
                      );
                    }}
                  >
                    <RemoveP>Remove</RemoveP>
                    <MinusCircleIcon
                      color={items.length > 0 ? COLORS.mainColor : "gray"}
                      style={{
                        marginRight: 10,
                        width: 40,
                        height: 40,
                      }}
                    />
                  </RemoveDiv>
                  <AddDiv
                    onClick={() => {
                      dispatch(
                        addToBasket({
                          Id: items[0]?.Title,
                          ApproxTime: items[0]?.ApproxTime,
                          FoodImage: items[items.length]?.Image,
                          Title: items[0]?.Title,
                          Description: items[0]?.Description,
                          Price: items[0]?.Price,
                          unCheckedIngredients:
                            newGroupedItemsInBasket[index][0]
                              ?.unCheckedIngredients,
                        })
                      );
                    }}
                  >
                    <AddP>Add</AddP>
                    <PlusCircleIcon
                      color={items.length > 0 ? COLORS.mainColor : "gray"}
                      style={{
                        marginRight: 10,
                        width: 40,
                        height: 40,
                      }}
                    />
                  </AddDiv>
                </EachItemInfoBottom>
              </EachItem>
            );
          })}
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

const EachItem = styled.div`
  background-color: white;
  margin-top: 10px;
`;
const EachItemInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 96%;
  margin-left: 2%;
  justify-content: space-between;
`;

const EachItemInfoInside = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const EachItemInfoInsideP1 = styled.p`
  font-size: 14px;
  font-weight: 500;
`;

const EachItemImage = styled.img`
  margin-left: 5px;
  width: 80px;
  height: 80px;
`;

const EachItemInfoInsideDiv = styled.div`
  display: flex;
  width: 60%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const EachItemInfoInsideDivP1 = styled.p`
  margin-left: 7px;
  font-size: 17px;
  font-weight: 500;
  padding-bottom: 5px;
`;

const EachItemInfoInsideDivP2 = styled.p`
  font-size: 13px;
  color: gray;
  font-weight: 500;
  margin-left: 2%;
`;

const EachItemPriceP = styled.p``;

const EachItemInfoBottom = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 96%;
  margin-left: 2%;
  justify-content: space-between;
`;
const RemoveDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RemoveP = styled.p``;

const AddDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const AddP = styled.p``;
