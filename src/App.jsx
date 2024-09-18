import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// Import các component cho từng trang
import Home from "./pages/Auth/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import MovieDetails from "./pages/Auth/MovieDetail";
import UserProfileUpdate from "./pages/UserProfileUpdate";
import MovieByGenre from "./pages/Auth/MovieByGenre";
import MovieByCountry from "./pages/Auth/MovieByCountry";
import SingleMovie from "./pages/Auth/SingleMovie";
import SeriesMovie from "./pages/Auth/SeriesMovie";
import WatchMovie from "./pages/Auth/WatchMovie";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import SearchPage from "./pages/Auth/SearchPage";
import FavoriteMovie from "./pages/Auth/FavoriteMovie";
// Import FavoriteProvider để quản lý trạng thái yêu thích
import { FavoriteProvider } from "./pages/Auth/FavoriteContext";

const App = () => {
  return (
    <>
      {/* Bao bọc toàn bộ ứng dụng trong FavoriteProvider để chia sẻ trạng thái yêu thích */}
      <FavoriteProvider>
        {/* Định nghĩa các route cho ứng dụng */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Trang Chủ */}
          <Route path="/login" element={<Login />} />
          {/* Trang Đăng Nhập */}
          <Route path="/register" element={<Register />} />{" "}
          {/* Trang Đăng Ký */}
          <Route path="/detail/:duongdan" element={<MovieDetails />} />{" "}
          {/* Trang Chi Tiết Phim */}
          <Route path="/the-loai/:slug" element={<MovieByGenre />} />{" "}
          {/* Trang Thể Loại */}
          <Route path="/quoc-gia/:slug" element={<MovieByCountry />} />{" "}
          {/* Trang Quốc Gia */}
          <Route path="/phim-le" element={<SingleMovie />} />{" "}
          {/* Trang Phim Lẻ */}
          <Route path="/phim-bo" element={<SeriesMovie />} />{" "}
          {/* Trang Phim Bộ */}
          <Route path="/xem-phim/:duongdan" element={<WatchMovie />} />{" "}
          {/* Trang Xem Phim */}
          <Route path="/profile" element={<UserProfileUpdate />} />{" "}
          {/* Trang Cập nhật Hồ Sơ */}
          <Route path="/search" element={<SearchPage />} />{" "}
          {/* Trang Tìm Kiếm */}
          <Route path="/favorites" element={<FavoriteMovie />} />{" "}
          {/* Trang Yêu Thích Phim */}
          <Route path="/admin/*" element={<AdminDashboard />} />{" "}
          {/* Trang Admin */}
        </Routes>
      </FavoriteProvider>
    </>
  );
};

export default App;
