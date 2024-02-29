import { Load, Wrapper } from "./styles";

const Loader = () => {
  return (
    <Wrapper className="loader-container">
      <Load className="loader"></Load>
    </Wrapper>
  );
};

export default Loader;