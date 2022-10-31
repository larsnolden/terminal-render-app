import React from "react";
import ReactAnime from "react-animejs";
import styled from "styled-components";
const { Anime } = ReactAnime;

const Container = styled(Anime)`
  position: relative;
  display: flex;
  flex-direction: row;
`;

const OuterRing = styled.div`
  position: relative;
  border: 5px solid;
  border-radius: 50%;
  border-color: black;
  width: 8rem;
  height: 6rem;
  margin: 2rem;
  border-radius: 6rem;
`;

const SmallDot = styled.div`
  width: 0.8rem;
  height: 0.8rem;
  border: none;
  background-color: black;
  border-radius: 40px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 2.6rem;
`;

const Recognize = () => (
  // <div>
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-4xl self-start mt-12">Recognizing...</div>
    <Anime
      animeConfig={{
        autoplay: true,
      }}
      initial={[
        {
          targets: [".first", ".second"],
          keyframes: [
            { translateX: 0, translateY: 0 },
            { translateX: 100, translateY: 5 },
            { translateX: -200, translateY: -5 },
            { translateX: 0, translateY: 0 },
          ],
          duration: 12000,
          loop: true,
          easing: "easeOutQuint(.4, 1)",
        },
      ]}
    >
      <div>
        <Container
          initial={[
            {
              targets: ".small",
              keyframes: [
                { translateX: 13, translateY: 13 },
                { translateX: 0, translateY: 0 },
                { translateX: -13, translateY: 13 },
                { translateX: 0, translateY: 0 },
              ],
              duration: 12000,
              easing: "easeOutQuint(.4, 1)",
              loop: true,
            },
          ]}
        >
          <OuterRing className="first">
            <SmallDot className="small" />
          </OuterRing>
          <OuterRing className="second">
            <SmallDot className="small" />
          </OuterRing>
        </Container>
      </div>
    </Anime>
  </div>
);

export default Recognize;
