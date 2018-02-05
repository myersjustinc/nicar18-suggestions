import { format } from 'd3-format';

const decimalsFormat = format(',.1f');
const numeralsFormat = format(',d');
const numberSpellings = [
  'zero', 'one', 'two', 'three', 'four',
  'five', 'six', 'seven', 'eight', 'nine'];

export default function apNumber(number) {
  if (number % 1 !== 0) {
    return decimalsFormat(number);
  }
  if (number >= 0 && number < 10) {
    return numberSpellings[number];
  }
  return numeralsFormat(number);
}
