import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Tv from "./routes/Tv";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="movies/:category/:movieId" element={<Home />}></Route>
        </Route>
        <Route path="/tv" element={<Tv />}>
          <Route path="tvs/:category/:tvId" element={<Tv />} />
        </Route>
        <Route path="/search" element={<Search />}>
          <Route path=":movieId" element={<Search />}></Route>
          <Route path=":tvId" element={<Search />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
