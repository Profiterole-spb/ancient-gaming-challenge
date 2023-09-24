import Lobby from "./pages/Lobby.jsx";
import Game from "./pages/Game.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />}/>
        <Route path={'game'}>
          <Route path={":title"}  element={<Game/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
