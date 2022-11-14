import { definePrismResponseInterceptor } from "../../../dist";

export default definePrismResponseInterceptor(({ output }) => {
  output.data[0].name = "Rambo";
  output.data[0].goodBoy = true;
  return output;
});
