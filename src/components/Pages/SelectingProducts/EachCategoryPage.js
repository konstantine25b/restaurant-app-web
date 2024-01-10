import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import COLORS from "../../../Themes/colors";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import styled from "@emotion/styled";
import EachFoodCard from "./SelectingPageComps/EachFoodCard";
import Basket from "../PageComps/Basket";
import { useSelector } from "react-redux";
import { selectBasketItems } from "../../../features/basketSlice";

function EachCategoryPage() {
  const { state } = useLocation();
  const { dishes, categorieTitle } = state;
  const navigate = useNavigate();
  const items = useSelector((state) => selectBasketItems(state));

  return (
    <>
      <MainDiv>
        <HeaderDiv // es arissadac weria restornis saxeli ukan gasvlis gilaki da search gilaki
        >
          <BackButton
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeftIcon
              color={COLORS.mainColor}
              style={{
                width: 25,
              }}
            />
          </BackButton>
          <P>{categorieTitle}</P>
        </HeaderDiv>
        <EachFoodMainDiv>
          {dishes.map((dish) => {
            return dish?.available ? (
              <EachFoodCard key={dish.title} dish={dish} />
            ) : null; // aq ! nishani unda movashoro imitoro avaibility dasamatebelia
          })}
        </EachFoodMainDiv>
      </MainDiv>
      {items.length > 0 ? <Basket theme={"dark"} /> : null}
    </>
  );
}

const MainDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: whitesmoke;
`;
const HeaderDiv = styled.div`
  height: 90px;
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: ${COLORS.mainColor};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const BackButton = styled.button`
  all: unset;
  width: 25px;
  height: 25px;
  background-color: lightgray;
  padding: 10px;
  border-radius: 50%;
  margin-left: 10px;
`;
const P = styled.p`
  color: white;
  font-size: 25px;
  font-weight: 400;
  padding-right: 30px;
`;
const EachFoodMainDiv = styled.div`
  padding-top: 90px;
  padding-bottom: 210px;
`;

export default EachCategoryPage;
