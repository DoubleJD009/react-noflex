import { useQuery } from "react-query";
import styled from "styled-components";
import { getTvShows, getTvShowsLatest, IResult, TYPES_TV } from "../api";
import { makeImagePath } from "../utils";
import { Slider } from "../components/Slider";

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

function Tv() {
  //상영중인 Tv 데이터 GET
  const { data, isLoading } = useQuery<IResult>(["tv", "latest"], () =>
    getTvShowsLatest(TYPES_TV.LATEST)
  );
  console.log(data);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bg_photo={makeImagePath(data?.backdrop_path || "")}>
            <Title>{data?.name}</Title>
            <Overview>{data?.overview}</Overview>
          </Banner>
          <Slider menu="tv" type={TYPES_TV.TOP_RATED} />
          <Slider menu="tv" type={TYPES_TV.POPULAR} />
          <Slider menu="tv" type={TYPES_TV.AIRING_TODAY} />
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
