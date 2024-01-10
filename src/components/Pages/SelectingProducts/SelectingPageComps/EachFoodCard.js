import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "@emotion/styled";
import {
  addToBasket,
  removeFromBasketWithIngredients,
  selectBasketItemsWithId,
} from "../../../../features/basketSlice";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import COLORS from "../../../../Themes/colors";
import { useNavigate } from "react-router-dom";

export default function EachFoodCard({ dish }) {
  // console.log(dish)
  const Id = dish.id;
  const ApproxTime = dish.approxtime;
  const FoodImage = dish.image;
  const Title = dish.title;
  const Description = dish.description;
  const Price = dish.price;
  const Ingredients = dish.ingredients;

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

  const [isPressed, setIsPressed] = useState(false); // amiti xdeba daechira tu ara imis kontroli

  const [sameIngredients, setSameIngredients] = useState([]);

  const items = useSelector((state) => selectBasketItemsWithId(state, Id)); // amis funqcia aris is rom basket itemsidan gvitxras romeli food ramdeni aqvs archeuli

  const dispatch = useDispatch();

  const addItemToBasket = (i) => {
    dispatch(
      addToBasket({
        Id,
        ApproxTime,
        FoodImage,
        Title,
        Description,
        Price,
        unCheckedIngredients: sameIngredients[i][0].unCheckedIngredients,
      })
    );
  };

  const removeItemFromBasket = (unCheckedIngredients) => {
    if (!items.length > 0) return;
    dispatch(removeFromBasketWithIngredients({ Id, unCheckedIngredients }));
  };

  useEffect(() => {
    setIsPressed(items.length > 0 ? true : false);
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
            )
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
    setSameIngredients(differnetItemsArr);
  }, [items.length]);

  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/categories/EachFoodInfo", {
      state: {
        dishes: dish,
      },
    });
  };

  return (
    <>
      <MainDiv onClick={() => handleNavigation()}>
        <LeftDiv>
          <TitleP>{dish.title}</TitleP>
          <DeskP>{Description}</DeskP>
        </LeftDiv>
        <RightDiv // es marjvena mxares rac aris yvelafers
        >
          <FoodImg src={FoodImage} />
          <RightBotDiv>
            <TimeDiv>
              <TimeP1>Aprox. Time: </TimeP1>
              <TimeP2>{ApproxTime}</TimeP2>
            </TimeDiv>
            <PriceDiv>
              <PriceP1>Price: </PriceP1>
              <PriceP2>{Price} ₾</PriceP2>
            </PriceDiv>
          </RightBotDiv>
        </RightDiv>
      </MainDiv>

      {isPressed &&
        sameIngredients.map((item, index) => {
          return (
            <BottomMain key={index}>
              <UpperBottomMain>
                <UpperBottomMainP>{item[1]}x</UpperBottomMainP>
                <UpperBottomMainDiv>
                  <UpperBottomMainDivP1> {item[0]?.Title}</UpperBottomMainDivP1>
                  <UpperBottomMainDivP2>
                    {item[0]?.unCheckedIngredients?.map((items, index) => {
                      return index == 0 ? "Without: " + items : " , " + items;
                    })}
                  </UpperBottomMainDivP2>
                </UpperBottomMainDiv>
                <BottomPriceP> {item[0]?.Price} ₾</BottomPriceP>
              </UpperBottomMain>
              <LowerBottomMain>
                <LowerBottomMainTop
                  disabled={item[1] == 0 ? true : false} // es 0 ze minusis gilaks tishavs
                  onClick={() => {
                    removeItemFromBasket(item[0].unCheckedIngredients);
                  }}
                >
                  <MinusCircleIcon
                    style={{
                      width: 30,
                      height: 30,
                    }}
                    color={item[1] > 0 ? COLORS.mainColor : "gray"}
                  />
                  <LowerBottomMainTopP>Remove</LowerBottomMainTopP>
                </LowerBottomMainTop>

                <LowerBottomMainBottom
                  onClick={() => {
                    addItemToBasket(index);
                  }}
                >
                  <LowerBottomMainBottomP>Add</LowerBottomMainBottomP>
                  <PlusCircleIcon
                    style={{
                      width: 30,
                      height: 30,
                    }}
                    color={COLORS.mainColor}
                  />
                </LowerBottomMainBottom>
              </LowerBottomMain>
            </BottomMain>
          );
        })}
    </>
  );
}

const MainDiv = styled.div`
  width: 98%;
  margin-left: 1%;
  margin-top: 15px;
  display: flex;
  background-color: white;
  border-radius: 10px;

  flex-direction: row;
  justify-content: space-between;
`;

const LeftDiv = styled.div`
  width: 55%;
  padding: 10px;
`;
const TitleP = styled.p`
  font-size: 18px;
  color: black;
  padding-bottom: 10px;
`;
const DeskP = styled.p`
  font-size: 13px;
  color: gray;
`;
const RightDiv = styled.div`
  padding: 10px;
  display: flex;

  flex-direction: column;
  justify-content: space-between;
`;

const FoodImg = styled.img`
  width: 130px;
  height: 130px;
  border-radius: 5px;
  object-fit: cover;
`;
const RightBotDiv = styled.div`
  margin-top: 7px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const TimeDiv = styled.div``;
const TimeP1 = styled.p`
  font-size: 11px;
  margin: 0;
  color: gray;
`;
const TimeP2 = styled.p`
  color: black;
  font-size: 15px;
  margin: 0;
`;
const PriceDiv = styled.div``;
const PriceP1 = styled.p`
  font-size: 11px;
  margin: 0;
  color: gray;
`;
const PriceP2 = styled.p`
  color: black;
  font-size: 15px;
  margin: 0;
`;
const BottomMain = styled.div`
  margin-left: 3%;
  margin-right: 3%;
  background-color: #e1d6cf;
  padding: 5px;
  margin-top: 2px;
  border-radius: 1px;
  border: 0.8px solid lightgray;
`;

const UpperBottomMain = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: baseline;
  justify-content: space-between;
  padding-left: 2%;
  padding-right: 2%;
  margin: 0;
`;
const UpperBottomMainP = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0;
`;
const UpperBottomMainDiv = styled.div`
  width: 60%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;
const UpperBottomMainDivP1 = styled.p`
  font-size: 17px;
  font-weight: 600;
  padding-bottom: 2px;
  margin: 0;
`;
const UpperBottomMainDivP2 = styled.p`
  font-size: 13px;
  color: gray;
  font-weight: 500;
  margin-left: 2%;
  margin: 0;
`;
const BottomPriceP = styled.p`
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  margin-right: 2%;
`;
const LowerBottomMain = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 5px;
  align-items: center;
  justify-content: space-between;
`;
const LowerBottomMainTop = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const LowerBottomMainTopP = styled.p`
  font-size: 12px;
`;
const LowerBottomMainBottom = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const LowerBottomMainBottomP = styled.p`
  font-size: 13px;
`;
