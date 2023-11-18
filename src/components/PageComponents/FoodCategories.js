import React from "react";
import styled from "styled-components";
import COLORS from "../../Themes/colors";
import { useNavigate } from "react-router-dom";



export default function FoodCategories(props) {
  const { categories} = props;

    const navigate = useNavigate()

    const handleNavigation = ()=>{
      
      navigate('/categories' , {
        state:{
          categorieTitle: categories.title,
          dishes: categories.dishes,
          
        }
        
      })
     }

    

  return (
    <StyledButton // aris patar divi razec restornis titoeul kategoriasd vantavsebt
    onClick={handleNavigation}
    >
      <P>{categories.title}</P>
      <Image src={categories.image} />
    </StyledButton>
  );
}

const StyledButton = styled.button`
all: unset;
  margin-top: 15px;
  width: 94%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 120px;
  background-color: ${COLORS.mainColor};
  flex-direction: row;
  margin-left: 3%;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  
`;
const P = styled.p`
  color: white;
  font-size: 25px;
  font-weight: 700;
`;
const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;

  
`;
