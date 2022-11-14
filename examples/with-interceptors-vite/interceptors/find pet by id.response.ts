import { definePrismResponseInterceptor } from "../../../dist";

export default definePrismResponseInterceptor<string>(({ output }) => {
  output.data = "Hello world!";
  return output;
});
