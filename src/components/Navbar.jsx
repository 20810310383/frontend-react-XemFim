import React from "react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

//Thanh trên cùng của trang Web

const NavBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); //Trạng thái đăng nhập
  const [isAdmin, setIsAdmin] = useState(false); // Trạng thái admin
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  axios.defaults.withCredentials = true;
  const checkUserStatus = async () => {
    //Kiểm tra trạng thái đăng nhập và quyền của người dùng  hiện tại
    try {
      const response = await axios.get(`${config.API_URL}/users/profile`);
      console.log("User data:", response.data); // In ra dữ liệu người dùng
      setIsLoggedIn(response.data.status === true);
      setIsAdmin(response.data.user.isAdmin || false); // Xác định người dùng có phải là admin
    } catch (err) {
      console.error("Failed to fetch user status", err);
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  const Logout = async () => {
    //Thực thi Đăng xuất
    try {
      await axios.get(`${config.API_URL}/users/logout`); // Kết nối API đăng xuất
      setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
      setIsAdmin(false); // Đặt lại trạng thái admin

      navigate("/"); // Chuyển hướng về trang chủ sau khi đăng xuất
    } catch (err) {
      console.error("Đăng xuất thất bại", err);
    }
  };
  useEffect(() => {
    const checkLoginStatus = async () => {
      //Kiểm tra trạng thái đăng nhập
      try {
        const response = await axios.get(`${config.API_URL}/users/profile`);
        setIsLoggedIn(response.data.status === true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []); // Chỉ chạy một lần khi component mount

  useEffect(() => {
    const fetchGenres = async () => {
      //Kết nối API gọi dữ liệu thể loại
      try {
        const response = await axios.get(`${config.API_URL}/genres`);
        setGenres(response.data.genres);
      } catch (err) {
        console.error("Lấy dữ liệu thể loại thát bại", err);
      }
    };
    fetchGenres();
  }, []); // Chỉ chạy một lần khi component mount

  useEffect(() => {
    const fetchCountries = async () => {
      //Kết nối API gọi dữ liệu quốc gia
      try {
        const response = await axios.get(`${config.API_URL}/countries`);
        if (Array.isArray(response.data)) {
          setCountries(response.data);
        } else if (
          response.data.countries &&
          Array.isArray(response.data.countries)
        ) {
          setCountries(response.data.countries);
        } else {
          console.error("Unexpected API response format:", response.data);
          setCountries([]);
        }
      } catch (error) {
        console.error("Lấy dữ liệu quốc gia thất bại", error);
        setCountries([]);
      }
    };
    fetchCountries();
  }, []); // Chỉ chạy một lần khi component mount
  const [timerId, setTimerId] = useState(null); //Biến để lưu thời gian tắt thanh dropdown của quốc gia thể loại phim bộ phim lẻ
  const [countryTimerId, setCountryTimerId] = useState(null);
  const handleMouseEnter = () => {
    //Dropdown thể loại khi trỏ chuột vào
    clearTimeout(timerId); // Xóa timeout cũ nếu có
    setShowGenreDropdown(true);
  };
  const handleMouseLeave = () => {
    //Dropdown thể loại khi trỏ chuột ra
    // Đặt timeout mới để đóng dropdown sau 10 giây khi rời khỏi vùng
    const id = setTimeout(() => {
      setShowGenreDropdown(false);
    }, 50); // 1 giây

    setTimerId(id); // Lưu lại id của timeout
  };
  const handleCountryMouseEnter = () => {
    //Dropdown quốc gia khi trỏ chuột vào
    clearTimeout(countryTimerId);
    setShowCountryDropdown(true);
  };

  const handleCountryMouseLeave = () => {
    //Dropdown quốc gia khi trỏ chuột ra
    const id = setTimeout(() => {
      setShowCountryDropdown(false);
    }, 50);
    setCountryTimerId(id);
  };

  return (
    //Giao diện Thanh tùy chọn
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-8">
        <a href="/">
          <img src="/netflix.png" alt="Netflix" className="h-10 w-10" />{" "}
        </a>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-gray-300">
              Trang Chủ
            </Link>
          </li>
          <li>
            <Link to="/phim-le" className="hover:text-gray-300">
              Phim Lẻ
            </Link>
          </li>
          <li>
            <Link to="/phim-bo" className="hover:text-gray-300">
              Phim Bộ
            </Link>
          </li>
          <li>
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span className="hover:text-gray-300 cursor-pointer">
                Thể Loại
              </span>
              {showGenreDropdown && (
                <div className="absolute left-0 mt-2 bg-black rounded-md shadow-lg py-1 z-10 grid grid-cols-3 min-w-[30rem]">
                  {genres.map((genre) => (
                    <Link
                      key={genre._id}
                      to={`/the-loai/${genre.slug}`}
                      className="block px-5 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </li>
          <li>
            <div
              className="relative"
              onMouseEnter={handleCountryMouseEnter}
              onMouseLeave={handleCountryMouseLeave}
            >
              <span className="hover:text-gray-300 cursor-pointer">
                Quốc Gia
              </span>
              {showCountryDropdown && (
                <div className="absolute left-0 mt-2 bg-black rounded-md shadow-lg py-1 z-10 grid grid-cols-3 min-w-[30rem]">
                  {countries.map((country) => (
                    <Link
                      key={country._id}
                      to={`/quoc-gia/${country.slug}`}
                      className="block px-5 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    >
                      {country.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>
      <div className="flex items-center space-x-4">
        {isAdmin && (
          <div>
            <Link to="/admin" className="hover:text-gray-300">
              Quản Lý
            </Link>
          </div>
        )}
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <Link to="/favorites" className="hover:text-gray-300">
              Phim yêu thích
            </Link>
            <button onClick={Logout} className="hover:text-gray-300">
              Log Out
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300  ">
              Log In
            </Link>
            <Link to="/register" className="hover:text-gray-300">
              Sign Up
            </Link>
          </>
        )}
        <Link to="/search" className="hover:text-gray-300">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </Link>

        {isLoggedIn ? (
          <button className="hover:text-gray-300">
            <Link to="/profile" className="hover:text-gray-300">
              <img
                src="/Profile.jpg"
                alt="Profile"
                className="w-8 h-8 rounded mx-2"
              />
              Profile
            </Link>
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300  "></Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
