import { useReducer } from "react";
import {
  UPDATE_PRODUCTS,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
} from "./actions";

export const reducer = (state, action) => {
  switch (action.type) {
    // if action type value is the value of UPDATE_<>
    // return a new state object with an updated products array
    case UPDATE_PRODUCTS:
      return { ...state, products: [...action.products] };

    case UPDATE_CATEGORIES:
      return { ...state, categories: [...action.categories] };

    case UPDATE_CURRENT_CATEGORY:
      return {
        ...state,
        currentCategory: action.currentCategory,
      };

    // if it's none of these actions,
    // do not update state at all and keep things the same
    default:
      return state;
  }
};

// used to help initialize our global state object
// then provide us with the functionality for updating that state
// by automatically running it through our custom reducer() function
export function useProductReducer(initialState) {
  return useReducer(reducer, initialState);
}
