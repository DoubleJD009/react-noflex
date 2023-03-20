import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import { TYPES, TYPES_TV } from "../api";
import { Slider } from "../components/Slider";

const Wrapper = styled.div`
  background: black;
  padding-top: 200px;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  return (
    <Wrapper>
      <Slider menu="search" type={TYPES.SEARCH} keyword={String(keyword)} />
      <Slider menu="search" type={TYPES_TV.SEARCH} keyword={String(keyword)} />
    </Wrapper>
  );
}

export default Search;
