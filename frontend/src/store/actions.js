import { CHANGE_SEARCHFIELD } from './constants.js';

export const setSearchField = text => {
  console.log(text);
  return {
    type: CHANGE_SEARCHFIELD,
    payload: text
  }
}