import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/Navbar.jsx";
import axios from "axios";
import NetflixHomePage from "./HomePageMain";

const Home = () => {
  //trang chủ với 2 thành phần thứ nhất là thanh tùy chọn ở dưới là trang HomePageMain
  axios.withCredentials = true;

  return (
    <div>
      <NavBar />
      <NetflixHomePage />
    </div>
  );
};

export default Home;
