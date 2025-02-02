import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config.js";
import { Link } from "react-router-dom";

//Trang Cập Nhật Hồ Sơ
const UserProfileUpdate = () => {
  const [user, setUser] = useState({
    username: "",
    email: "", // Thêm trường email
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    //Lấy dữ liệu người dùng hiện tại
    try {
      const response = await axios.get(`${config.API_URL}/users/user`, {
        withCredentials: true,
      });
      setUser((prevUser) => ({
        ...prevUser,
        username: response.data.user.username,
        email: response.data.user.email, // Thêm email
      }));
    } catch (error) {
      console.error("Failed to fetch user data", error);
      setMessage(
        "Failed to fetch user data: " +
          (error.response?.data?.msg || error.message)
      );
    }
  };

  const handleChange = (e) => {
    //Hàm thay đổi dữ liệu
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    //Hàm Xác nhận thay đổi
    e.preventDefault();
    try {
      const response = await axios.put(`${config.API_URL}/users/user`, user, {
        withCredentials: true,
      });
      setMessage("Cập Nhật Thành Công");
      setUser((prevUser) => ({
        ...prevUser,
        password: "", // Clear password field after update
      }));
    } catch (error) {
      console.error("Cập Nhật Hồ Sơ Thất Bại", error);
      setMessage(
        "Cập Nhật Hồ Sơ Thất Bại: " +
          (error.response?.data?.msg || error.message)
      );
    }
  };

  return (
    //giao diện cập nhật hồ sơ
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            CẬP NHẬT HỒ SƠ CỦA BẠN
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={user.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mật Khẩu Mới (Để trống nếu không đổi)"
                value={user.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              CẬP NHẬT
            </button>
          </div>
          <div className="mt-4">
            <Link
              to="/"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Trang Chủ
            </Link>
          </div>
        </form>
        {message && (
          <p className="mt-2 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default UserProfileUpdate;
