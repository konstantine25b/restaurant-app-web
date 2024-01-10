import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addToBasket,
  removeFromBasketWithIngredients,
  selectBasketItemsWithIdAndIngredients,
} from "../../../features/basketSlice";
import {
  CheckIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import COLORS from "../../../Themes/colors";
import styled from "@emotion/styled";

export default function EachFoodDetailedInfo() {
  const { state } = useLocation();
  const { dishes } = state;

  const [offset, setOffset] = useState(window.scrollY);
  const [showdiv, setShowdiv] = useState(false);

  const navigate = useNavigate();

  const Id = dishes.id;
  const ApproxTime = dishes.approxtime;
  const Title = dishes.title;
  const FoodImage = dishes.image;
  const Description = dishes.description;
  const Price = dishes.price;
  const Ingredients = dishes.ingredients;
  let ingerdientsArr = [];

  for (let i = 0; i < Ingredients.length; i++) {
    ingerdientsArr.push(true);
  }

  const [isCheckedIngr, setIsCheckedIngr] = useState(ingerdientsArr);

  const dispatch = useDispatch();

  const itemCount = useRef(1); // es localurad am pageze ramden items nishnavs

  const [unCheckedIngredients, setUnCheckedIngredients] = useState([]);

  const items = useSelector((state) =>
    selectBasketItemsWithIdAndIngredients(state, Id, unCheckedIngredients)
  );
  const addItemToBasket = () => {
    dispatch(
      addToBasket({
        Id,
        ApproxTime,
        FoodImage,
        Title,
        Description,
        Price,
        unCheckedIngredients,
      })
    );
  };

  const removeItemFromBasket = () => {
    if (!items.length > 0) return;
    dispatch(removeFromBasketWithIngredients({ Id, unCheckedIngredients }));
  };

  useEffect(() => {
    function handleScroll() {
      setOffset(window.scrollY);
    }
    if (offset > 100 && !showdiv) {
      setShowdiv(true);
    } else if (offset <= 100 && showdiv) {
      setShowdiv(false);
    }

    setOffset(offset);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [window.scrollY]);

  return (
    <MainDiv>
      <GoBackDiv
        onClick={() => {
          navigate(-1);
        }}
      >
        {offset < 100 && (
          <XMarkIcon
            style={{
              width: 40,
              height: 40,
            }}
            color={COLORS.mainColor}
          />
        )}
      </GoBackDiv>
      {showdiv && (
        <NavBar>
          <NavbarP>{Title}</NavbarP>
          <NavGoBack
            onClick={() => {
              navigate(-1);
            }}
          >
            <XMarkIcon
              color="white"
              style={{
                width: 40,
              }}
            />
          </NavGoBack>
        </NavBar>
      )}
      <InnerMainDiv>
        <UpperSide>
          <ImageDiv>
            <MainImage src={FoodImage} />
          </ImageDiv>
          <UpperSideIn>
            <TitleDiv>
              <TitleP>{Title}</TitleP>
            </TitleDiv>

            <PriceandTime>
              <PriceDiv>
                <PriceP>{Price} ₾</PriceP>
              </PriceDiv>
              <TimeDiv>
                <AproxP>Aprox. Time: </AproxP>
                <TimeP>{ApproxTime}</TimeP>
              </TimeDiv>
            </PriceandTime>
            <DescriptionDiv>
              <DescriptionP>{Description}</DescriptionP>
            </DescriptionDiv>
          </UpperSideIn>
        </UpperSide>

        <LowerSide>
          <LowerSideInside>
            <IngredientsMain>
              {Ingredients?.map((ingredient, index) => {
                return (
                  <EachIngr key={index}>
                    <EachIngInside
                      onClick={() => {
                        if (isCheckedIngr[index] == true) {
                          setUnCheckedIngredients([
                            ...unCheckedIngredients,
                            ingredient,
                          ]);
                        } else {
                          const removeIndex = unCheckedIngredients.findIndex(
                            (item) => item == ingredient
                          );
                          let newUnCheckedIngredients = [
                            ...unCheckedIngredients,
                          ];
                          newUnCheckedIngredients.splice(removeIndex, 1);
                          setUnCheckedIngredients(newUnCheckedIngredients);
                        }
                        let newisCheckedIngr = isCheckedIngr;
                        newisCheckedIngr[index] = !newisCheckedIngr[index];
                        setIsCheckedIngr(newisCheckedIngr);

                        // console.log(unCheckedIngredients)
                      }}
                    >
                      <IngTitle>{ingredient}</IngTitle>
                      <CheckDiv>
                        {isCheckedIngr[index] ? (
                          <CheckIcon
                            color="blue"
                            style={{
                              fontWeight: "900",
                              width: 27,
                              height: 27,
                            }}
                          />
                        ) : null}
                      </CheckDiv>
                    </EachIngInside>
                  </EachIngr>
                );
              })}
            </IngredientsMain>
            <AddRemoveDiv>
              <RemoveItemDiv
                disabled={itemCount.current == 1 ? true : false} // es 0 ze minusis gilaks tishavs
                onClick={() => {
                  removeItemFromBasket();
                  itemCount.current = itemCount.current - 1;
                }}
              >
                <MinusCircleIcon
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: 10,
                  }}
                  color={itemCount.current > 1 ? COLORS.mainColor : "gray"}
                />
              </RemoveItemDiv>
              <ItemcountP>{itemCount.current}</ItemcountP>
              <AddItemDiv
                onClick={() => {
                  addItemToBasket();
                  itemCount.current = itemCount.current + 1;
                }}
              >
                <PlusCircleIcon
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: 10,
                  }}
                  color={COLORS.mainColor}
                />
              </AddItemDiv>
            </AddRemoveDiv>
          </LowerSideInside>
        </LowerSide>
      </InnerMainDiv>
      <AddingDiv
        onClick={() => {
          addItemToBasket();
          navigate(-1);
        }}
      >
        <AddingP>
          Add {itemCount.current} item to the basket for{" "}
          {Number(dishes.price) * Number(itemCount.current)} ₾
        </AddingP>
      </AddingDiv>
    </MainDiv>
  );
}
const MainDiv = styled.div`
  background-color: whitesmoke;
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 100%;
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
`;
const NavBar = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  padding: 5px;
  background-color: ${COLORS.mainColor};
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
`;
const NavbarP = styled.p`
  color: white;
  font-size: 20px;
  font-weight: 700;
  padding-left: 10px;
`;

const NavGoBack = styled.div`
  padding-right: 10px;
`;

const InnerMainDiv = styled.div``;
const UpperSide = styled.div``;
const ImageDiv = styled.div`
  width: 100%;
  flex-direction: row;
`;
const MainImage = styled.img`
  width: 100%;
  height: 330px;
  object-fit: cover;
`;
const LowerSide = styled.div`
  padding-left: 10px;
  padding-right: 10px;
`;
const LowerSideInside = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IngredientsMain = styled.div`
  width: 100%;
  margin: 0;
`;
const EachIngr = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const EachIngInside = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 90%;
  justify-content: space-between;
  padding-left: 5px;
`;
const IngTitle = styled.p`
  font-size: 17px;
  font-weight: 500;
`;
const CheckDiv = styled.div`
  width: 25px;
  height: 25px;
  border: 2px solid ${COLORS.mainColor};

  align-items: center;
  justify-content: center;
`;
const AddRemoveDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  padding-top: 20px;
  border-radius: 4px;
  padding-bottom: 150px;
`;
const RemoveItemDiv = styled.div``;
const ItemcountP = styled.p`
  font-size: 25;
  font-weight: 600;
`;
const AddItemDiv = styled.div``;
const AddingDiv = styled.div`
  position: fixed;
  width: 90%;
  height: 70px;
  background-color: ${COLORS.mainColor};
  opacity: 0.9;
  bottom: 30px;
  align-self: center;
  border-radius: 10px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const UpperSideIn = styled.div`
  padding-left: 10px;
  padding-right: 10px;
`;
const TitleDiv = styled.div`
  padding-bottom: 15px;
`;
const TitleP = styled.p`
  font-size: 30px;
  margin: 0;
  font-weight: 600;
`;

const PriceandTime = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const PriceDiv = styled.div``;
const PriceP = styled.p`
  color: black;
  font-size: 20px;
  margin: 0;
`;
const TimeDiv = styled.div``;
const TimeP = styled.p`
  color: black;
  font-size: 16px;
  margin: 0;
`;
const AproxP = styled.p`
  font-size: 12px;
  color: gray;
  margin: 0;
`;

const DescriptionDiv = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 0.7px solid ${COLORS.mainColor};
`;

const DescriptionP = styled.p`
  font-size: 14px;
  color: gray;
`;

const AddingP = styled.p`
  color: white;
  font-size: 20px;
`;
