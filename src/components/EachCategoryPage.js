import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import COLORS from "../Themes/colors";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import styled from "styled-components";
import EachFoodCard from "./PageComponents/EachFoodCard";

function EachCategoryPage() {
  const { state } = useLocation();
  const { dishes,categorieTitle} = state;
  console.log(dishes,categorieTitle);

  const navigate = useNavigate();

  return (
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
        <P>{categorieTitle }</P>
      </HeaderDiv>
      {dishes.map((dish )=>{
           return <EachFoodCard dish = {dish}/>
      })}

      {/* <FlatList // amit chven vawyobt bevr titoeul foodze divs
          data={dishes}
          contentContainerStyle={{ paddingBottom: 350 }}
          renderItem={({ item }) => <EachFoodCard dishes={item} />}
          keyExtractor={(item) => item.Title}
        /> */}
    </MainDiv>
  );
}

const MainDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const HeaderDiv = styled.div`
  height: 90;
  display: flex;
  width: 100%;
  background-color: ${COLORS.mainColor};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;
const BackButton = styled.button`
  all: unset;
  width: 25px;
  height: 25px;
  background-color: lightgray;
  padding: 10px;
  border-radius: 50%;
`;
const P = styled.p`
  color: white;
  font-size: 25px;
  font-weight: 400;
  padding-right: 30px;

`;

export default EachCategoryPage;
