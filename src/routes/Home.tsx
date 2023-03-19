import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult, TYPES } from "../api";
import { makeImagePath } from "../utils";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Slider from "../components/Slider";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bg_photo: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bg_photo});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

function Home() {
  //상영중인 영화 데이터 GET
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    () => getMovies(TYPES.NOW_PLAYING)
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bg_photo={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider type={TYPES.NOW_PLAYING} />
          <Slider type={TYPES.POPULAR} />
          <Slider type={TYPES.TOP_RATED} />
          <Slider type={TYPES.UPCOMING} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
