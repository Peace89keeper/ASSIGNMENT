// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import List from "./components/List";
import Sidebar from "./components/Sidebar";
import Graph from "./components/Graph";
import Details from "./components/Details";
import PhotoResult from "./components/PhotoResult";
import Map from "./components/Map";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              
              <Login />
            </>
          }
        />
        <Route
          path="/list"
          element={
            <>
              <Sidebar />
              <List />
            </>
          }
        />
        <Route
          path="/details/:id"
          element={<><Sidebar /><Details /></>}
        />

        <Route path="/graph" element={<><Sidebar /><Graph /></>} />
        <Route path="/photo" element={<><Sidebar /><PhotoResult /></>} />

        <Route path="/map" element={<><Sidebar /><Map /></>} />
      </Routes>
    </Router>
  );
}

export default App;
