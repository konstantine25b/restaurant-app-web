import React, { useEffect, useLayoutEffect, useState } from "react";
import COLORS from "../../Themes/colors";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurant } from "../../features/RestaurantSlice";
import styled from "@emotion/styled";
import { MapPinIcon, StarIcon } from "@heroicons/react/24/solid";
import FoodCategories from "./HomeScreenComps/FoodCategories";
import Basket from "./PageComps/Basket";
import { selectBasketItems } from "../../features/basketSlice";
import { API } from "../../Processing/PrestoAPI";
import OrderNotification from "./HomeScreenComps/OrderedItems";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const [restInfo, setRestInfo] = useState();
  const NAME = "KFC";

  useLayoutEffect(() => {
    const gettingRestaurantsInfo = async () => {
      // am metodit mogvaqvs yvela restorani  da vsetavt mas reduxshi
      // setRestInfo(await getRestaurant(ID));
      await handleGetRestaurantByTitle(NAME);
    };
    gettingRestaurantsInfo();
  }, []);

  useEffect(() => {
    console.log(restInfo);
    localStorage.setItem("restInfo", JSON.stringify(restInfo));
  }, [restInfo]);

  const handleGetRestaurantByTitle = async (restaurantTitle) => {
    const restaurantByTitle = await API.getRestaurantByTitle(restaurantTitle);
    setRestInfo(JSON.parse(JSON.stringify(restaurantByTitle)));
  };
  const items = useSelector((state) => selectBasketItems(state));
  useEffect(() => {
    dispatch(
      setRestaurant({
        // am funqciit vagebinebt romeli restornidan vukvetavt
        Id: restInfo?.id,
        Title: restInfo?.title,
        MainImage: restInfo?.image,
        Address: restInfo?.address,
        Genre: restInfo?.genre,
        ShortDescription: restInfo?.shortdescription,
        Rating: restInfo?.rating,
        FoodCategories: restInfo?.categories,
      })
    );
  }, [dispatch, restInfo]);

  const prevOrder = localStorage.getItem("allOrders"); // es axalia rom vnaxot orderebi aris tu ara
  let prevOrder1;
  const avaibleOrders = localStorage.getItem("avaibleOrders");
  let avaibleOrders0;

  if (prevOrder) {
    prevOrder1 = JSON.parse(prevOrder);
    console.log(prevOrder1);
  }
  if (avaibleOrders) {
    avaibleOrders0 = JSON.parse(avaibleOrders);
    console.log(avaibleOrders0);
  }

  return (
    <MainDiv>
      {prevOrder ? (
        <OrderNotification
          orderCount={avaibleOrders0.length}
        ></OrderNotification>
      ) : null}
      {items.length > 0 ? <Basket theme={"light"} /> : null}
      <ImageDiv>
        <HeaderImage // es aris ukana fonze background image roa eg
          src={restInfo?.images[0]}
        />
      </ImageDiv>
      <HeaderComponentsDiv // aq aris agwera reitingis da adgilmdebareobis
      >
        <HeaderComponentsDivInside>
          <TitleP>{restInfo?.title}</TitleP>
          <HeaderInfoDiv1>
            <StarIcon
              color="orange"
              style={{
                width: 22,
                opacity: 0.7,
              }}
            />
            <HeaderInfoDiv1P>
              {restInfo?.rating} . {restInfo?.genre}
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
            <HeaderInfoDiv1P>{restInfo?.address}</HeaderInfoDiv1P>
          </HeaderInfoDiv1>
          <HeaderInfoDiv2P>{restInfo?.shortdescription}</HeaderInfoDiv2P>
        </HeaderComponentsDivInside>
      </HeaderComponentsDiv>
      <MenuDiv // es aris menu ro weria eg
      >
        <MenuP>Menu</MenuP>
      </MenuDiv>

      <div
        style={{
          paddingBottom: 130,
        }}
      >
        {restInfo?.categories?.map(
          (
            item // am metodit gadavurbent yvea categories elements da vawyobt matgan FoodCategories componentebs (ra kategoriebic aqvs restorans)
          ) => (
            <FoodCategories key={item.title} categories={item} />
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
  border-bottom: 1px solid ${COLORS.mainColor};
  border-top: 1px solid ${COLORS.mainColor};
`;
const MenuP = styled.p`
  text-align: center;
  font-weight: bold;
  font-size: 35px;
  margin: 8px;
  color: ${COLORS.mainColor};
`;
