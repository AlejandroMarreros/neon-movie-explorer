import {Routes,Route,BrowserRouter} from "react-router-dom";

import './App.css'
import FormSearch from './components/FormSearch'
import Movies from './components/Movies'
import MainPage from "./components/MainPage";
import SingleMovie from "./components/SingleMovie";

function App() {
 

  return (
    <div className="App">
      <BrowserRouter basename="/neon-movie-explorer/">
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/movies/:id" element={<SingleMovie/>}/>

        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App
