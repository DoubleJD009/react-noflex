import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useMatch } from "react-router-dom";
import styled from "styled-components";
import {
  IGetBaseResult,
  getMovies,
  IGetMovieDetail,
  getMovieDetail,
  TYPES,
  TYPES_TV,
  getTvShows,
  ITvShowsDetail,
  getTvShowsDetail,
} from "../api";
import { makeImagePath, Ratings } from "../utils";

const SliderRow = styled.div`
  position: relative;
  height: 200px;
  top: -100px;
  margin-bottom: 80px;
`;

const Category = styled.h2`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 20px;
  margin-left: 10px;
  color: ${(props) => props.theme.white.lighter};
  text-transform: uppercase;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  margin-bottom: 10px;
  position: absolute;
  width: 100%;
`;

export const Box = styled(motion.div)<{ bg_photo: string }>`
  background-color: white;
  height: 200px;
  font-size: 64px;
  background-image: url(${(props) => props.bg_photo});
  background-size: cover;
  background-position: center center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  cursor: pointer;
`;

export const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
`;

export const BtnSlide = styled.div<{ isRight: boolean }>`
  position: absolute;
  right: ${(props) => (props.isRight ? 0 : null)};
  left: ${(props) => (props.isRight ? null : 0)};
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 40px;
  border: none;
  z-index: 2;
  color: ${(props) => props.theme.white.darker};
  svg {
    width: 40px;
    height: 40px;
  }
`;

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 3;
`;

export const BigMovie = styled(motion.div)<{ scrollY: number }>`
  position: absolute;
  width: 45vw;
  height: 85vh;
  top: ${(props) => props.scrollY + 75}px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
  z-index: 4;
`;

export const BigCover = styled.div<{ bg_photo: string }>`
  width: 100%;
  height: 450px;
  background-size: cover;
  background-image: linear-gradient(transparent, black),
    url(${(props) => props.bg_photo});
  background-position: center center;
  position: relative;
`;

export const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 18px 20px;
  font-size: 54px;
  font-weight: 800;
  position: absolute;
  bottom: -0px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 라인수 */
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  line-height: 130%;
`;

export const BigInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 20px 0px;
  div:first-child,
  div:last-child {
    margin: 0px 20px;
    font-weight: 1000;
    font-size: 24px;
  }
  div:last-child {
    margin: 0px 0px;
  }
`;

export const BigSubInfo = styled.div`
  margin: 0px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  position: absolute;
  bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  div {
    span:first-child {
      color: #808e9b;
    }
  }
`;

export const Adult = styled.div<{ adult: boolean | undefined }>`
  background-color: ${(props) =>
    props.adult ? props.theme.red : "rgb(40, 177, 231)"};
  color: ${(props) => props.theme.white.lighter};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  border-radius: 15px;
  font-weight: 800;
  margin-right: 20px;
`;

export const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 20px;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 7; /* 라인수 */
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  line-height: 130%;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

export const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    zIndex: 99,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

export const infoVariants = {
  hover: {
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
    opacity: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

export const offset = 6;

export function Slider({
  menu,
  type,
}: {
  menu: string;
  type: TYPES | TYPES_TV;
}) {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch(`/${menu}/${type}/:dataId`);
  const { data, isLoading } = useQuery<IGetBaseResult | undefined>(
    [menu, type],
    () => {
      if (menu === "movies") return getMovies(type as TYPES);
      else if (menu === "tv") return getTvShows(type as TYPES_TV);
    }
  );
  const { scrollY } = useScroll();
  const [clickReverse, setClickReverse] = useState(false);

  // 슬라이더 관리 로직 - 시작
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      // 이전 Animation 동작이 끝나기전까지는 Animation 동작을 막는 로직
      toggleLeaving();
      const totalCount = data.results.length - 1;
      const maxIndex = Math.floor(totalCount / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setClickReverse(true);
      toggleLeaving();
      const totalCount = data.results.length - 1;
      const maxIndex = Math.floor(totalCount / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  // 슬라이더 관리 로직 - 끝

  // 상세 정보 팝업
  const onBoxClicked = ({
    menu,
    dataId,
    clss,
  }: {
    menu: string;
    dataId: number;
    clss: string;
  }) => {
    navigate(`/${menu}/${clss}/${dataId}`);
  };

  // 상세 정보 팝업 후 Overlay 클릭 시 Home으로 이동
  const basePath = menu === "movies" ? "/" : "./";
  const onOverlayClick = () => navigate(basePath);

  // 상세 정보 팝업 클릭 시 상세 정보를 팝업에 보이게 동작
  const clickedBox =
    bigMovieMatch?.params.dataId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.dataId
    );
  // console.log(clickedBox);
  const { data: clickedBoxDetail, isLoading: isLoadingDetail } = useQuery<
    IGetMovieDetail | ITvShowsDetail | undefined
  >([bigMovieMatch?.params.dataId, "detail"], () => {
    if (menu === "movies") return getMovieDetail(bigMovieMatch?.params.dataId);
    else if (menu === "tv")
      return getTvShowsDetail(bigMovieMatch?.params.dataId);
  });

  return (
    <>
      <SliderRow key={type}>
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={{ clickReverse }}
        >
          <Category>{type.replaceAll("_", " ")}</Category>
          <Row
            key={type + index}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            custom={{ clickReverse }}
          >
            {data?.results
              .slice(offset * index, offset * index + offset)
              .map((data) => (
                <Box
                  layoutId={menu + type + data.id + ""}
                  key={menu + type + data.id}
                  variants={boxVariants}
                  onClick={() => {
                    onBoxClicked({ menu: menu, clss: type, dataId: data.id });
                  }}
                  initial="normal"
                  whileHover="hover"
                  transition={{
                    type: "tween",
                  }}
                  bg_photo={makeImagePath(
                    data.backdrop_path || data.poster_path,
                    "w500"
                  )}
                >
                  <Info variants={infoVariants}>
                    <h4>{data.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <BtnSlide onClick={decreaseIndex} isRight={false}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
            fill="currentColor"
          >
            <path d="M137.4 406.6l-128-127.1C3.125 272.4 0 264.2 0 255.1s3.125-16.38 9.375-22.63l128-127.1c9.156-9.156 22.91-11.9 34.88-6.943S192 115.1 192 128v255.1c0 12.94-7.781 24.62-19.75 29.58S146.5 415.8 137.4 406.6z" />
          </svg>
        </BtnSlide>
        <BtnSlide onClick={increaseIndex} isRight={true}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
            fill="currentColor"
          >
            <path d="M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z" />
          </svg>
        </BtnSlide>
      </SliderRow>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></Overlay>
            <BigMovie
              layoutId={menu + type + bigMovieMatch.params.dataId + ""}
              scrollY={scrollY.get()}
            >
              {clickedBox && (
                <>
                  <BigCover
                    bg_photo={makeImagePath(
                      clickedBox.backdrop_path || clickedBox.poster_path,
                      "w500"
                    )}
                  >
                    <BigTitle>{clickedBox.title}</BigTitle>
                  </BigCover>
                  <BigInfo>
                    <div>
                      {new Date(
                        clickedBoxDetail?.release_date as string
                      ).getFullYear()}
                    </div>
                    <Adult adult={clickedBoxDetail?.adult}>
                      {clickedBoxDetail?.adult ? 19 : "All"}
                    </Adult>
                    {type === TYPES.UPCOMING ||
                    (clickedBoxDetail?.vote_average as number) === 0.0 ? (
                      <div>Not Rated</div>
                    ) : (
                      <Ratings
                        rating={clickedBoxDetail?.vote_average as number}
                      />
                    )}
                  </BigInfo>
                  <BigOverview>{clickedBox.overview}</BigOverview>
                  <BigSubInfo>
                    <div>
                      <span>Genres: </span>
                      {clickedBoxDetail?.genres.map((data) => (
                        <span> {data.name} </span>
                      ))}
                    </div>
                    <div>
                      <span>Language: </span>
                      {clickedBoxDetail?.original_language.toUpperCase()}
                    </div>
                  </BigSubInfo>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
