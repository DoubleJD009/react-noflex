import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Tv from "./routes/Tv";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <Switch>
        <Route path={"/tv"}>
          <Tv />
        </Route>
        <Route path={"/search"}>
          <Search />
        </Route>
        <Route path={"/"}>
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
