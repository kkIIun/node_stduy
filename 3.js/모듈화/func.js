import { odd, even } from "./var.js";

const checkOddOrEven = (num) => {
  if (num % 2) {
    console.log(odd);
  } else {
    console.log(even);
  }
};

console.log(checkOddOrEven(10));

export default checkOddOrEven;
