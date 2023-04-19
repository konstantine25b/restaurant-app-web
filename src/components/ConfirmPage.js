import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigation } from 'react-router-dom';
import { selectBasketTotal } from '../features/basketSlice';
import { selectRestaurant } from '../features/RestaurantSlice';

export default function ConfirmPage() {

    const navigation = useNavigation();
  const BasketTotal = useSelector(selectBasketTotal);
  const restaurant = useSelector(selectRestaurant);
  const [selected, SetSelected] = useState("");

  return (
    <div>ConfirmPage</div>
  )
}
