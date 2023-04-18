import React, { useEffect, useLayoutEffect, useState } from "react";
import { getRestaurant } from "../Processing/Database";
import COLORS from "../Themes/colors";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurant } from "../features/RestaurantSlice";
import styled from "styled-components";

import { MapPinIcon, StarIcon } from "@heroicons/react/24/solid";
import FoodCategories from "./PageComponents/FoodCategories";
import Basket from "./Basket";
import { selectBasketItems } from "../features/basketSlice";

export default function HomeScreen() {
  const dispatch = useDispatch();

  const [restaurantInfo, setRestaurantInfo] = useState([]); // amashi iqneba romel restoransac gamovidzaxebt is
const ID = "KFC"
  useLayoutEffect(() => {
    const gettingRestaurantsInfo = async () => {
      // am metodit mogvaqvs yvela restorani  da vsetavt mas reduxshi

      setRestaurantInfo(await getRestaurant(ID));
    };
    gettingRestaurantsInfo();
  }, []);
  const items = useSelector((state) => selectBasketItems(state));
  useEffect(() => {
    dispatch(
      setRestaurant({
        // am funqciit vagebinebt romeli restornidan vukvetavt
        Id: restaurantInfo?.Title,
        Title: restaurantInfo?.Title,
        MainImage: restaurantInfo?.MainImage,
        Address: restaurantInfo?.Address,
        Genre: restaurantInfo?.Genre,
        ShortDescription: restaurantInfo?.ShortDescription,
        Rating: restaurantInfo?.Rating,
        FoodCategories: restaurantInfo?.FoodCategories,
      })
    );
  }, [dispatch, restaurantInfo]);

  console.log(restaurantInfo);

  return (
    <MainDiv>
      {items.length > 0 ? <Basket theme={"light"} /> : null}
      <ImageDiv>
        <HeaderImage // es aris ukana fonze background image roa eg
          src={restaurantInfo?.MainImage}
        />
      </ImageDiv>
      <HeaderComponentsDiv // aq aris agwera reitingis da adgilmdebareobis
      >
        <HeaderComponentsDivInside>
          <TitleP>{restaurantInfo?.Title}</TitleP>
          <HeaderInfoDiv1>
            <StarIcon
              color="orange"
              style={{
                width: 22,
                opacity: 0.7,
              }}
            />
            <HeaderInfoDiv1P>
              {restaurantInfo?.Rating} . {restaurantInfo?.Genre}
            </HeaderInfoDiv1P>
          </HeaderInfoDiv1>
          <HeaderInfoDiv1>
            <MapPinIcon
              color={COLORS.mainColor}
              style={{
                width: 22,
                opacity: 0.8,
              }}
            />
            <HeaderInfoDiv1P>{restaurantInfo?.Address}</HeaderInfoDiv1P>
          </HeaderInfoDiv1>
          <HeaderInfoDiv2P>
            {restaurantInfo?.ShortDescription}
          </HeaderInfoDiv2P>
        </HeaderComponentsDivInside>
      </HeaderComponentsDiv>
      <MenuDiv // es aris menu ro weria eg
      >
        <MenuP
          
        >
          Menu
        </MenuP>
      </MenuDiv>

      <div
          style={{
            paddingBottom: 130,
          }}
        >
          {restaurantInfo.FoodCategories?.map(
            (
              item // am metodit gadavurbent yvea categories elements da vawyobt matgan FoodCategories componentebs (ra kategoriebic aqvs restorans)
            ) => (
              <FoodCategories key={item.Title} categories={item} />
            )
          )}
        </div>
    </MainDiv>
  );
}

const MainDiv = styled.div`
  background-color: whitesmoke;
  width: 100%;
`;
const ImageDiv = styled.div`
  position: relative;
  
`;
const HeaderImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
`;

const HeaderComponentsDiv = styled.div`
  background-color: whitesmoke;
  position: relative;
  width: 100%;
`;
const TitleP = styled.p`
  font-size: 30px;
  font-weight: bold;
  color: ${COLORS.mainColor};
  margin: 0;
`;
const HeaderInfoDiv1 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const HeaderInfoDiv1P = styled.p`
  padding-left: 5px;
  width: 80%;
  margin: 5px;
`;
const HeaderComponentsDivInside = styled.div`
  padding-left: 15px;
`;
const HeaderInfoDiv2P = styled.p`
  color: gray;
  margin: 5px;
  margin-bottom: 10px;
`;
const MenuDiv = styled.div`
display: flex;

  justify-content: center;
  width: 100%;
  margin: 0;
  border-bottom : 1px solid ${COLORS.mainColor};
  border-top : 1px solid ${COLORS.mainColor};
`;
const MenuP = styled.p`
text-align: center;
font-weight: bold;
font-size: 35px;
margin: 8px;
color: ${COLORS.mainColor};
`