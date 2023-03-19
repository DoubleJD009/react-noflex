import { useLocation } from "react-router";

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);
  return <h1>{keyword}</h1>;
}

export default Search;
