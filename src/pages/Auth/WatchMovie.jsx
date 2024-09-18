import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import Spinner from "../../components/Spinner";
import NavBar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { FavoriteContext } from "./FavoriteContext.jsx";
import ScrollToTopButton from "../../components/ScrollToTopButton.jsx";
//Giao diện trang xem phim
const WatchMovie = () => {
  const { duongdan } = useParams();
  const [movie, setMovie] = useState(null);
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentServer, setCurrentServer] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [movieType, setMovieType] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const { toggleFavorite } = useContext(FavoriteContext);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieResponse, suggestedResponse] = await Promise.all([
          axios.get(`${config.API_URL}/movies/duongdan/${duongdan}`), //Lấy Dữ Liệu Phim đang Xem
          axios.get(`${config.API_URL}/movies/suggested`), //Lấy dữ liệu Phim Đề Xuất
        ]);
        setMovie(movieResponse.data.movie); //Đặt dữ liệu phim đang xem vào SetMovie
        setSuggestedMovies(
          //Đặt dữ Liệu phim đề xuất vào setSuggestedMovies
          Array.isArray(suggestedResponse.data.movies)
            ? suggestedResponse.data.movies
            : []
        );
        setMovieType(movieResponse.data.movie.type || ""); //Đặt dữ liệu Phim Bộ hoặc Phim lẻ vào setMovieType
        setCountry(
          movieResponse.data.movie.country &&
            movieResponse.data.movie.country.length > 0
            ? movieResponse.data.movie.country[0]
            : {}
        );
        setCategory(
          //Đặt dữ liệu Thể Loại vào setCategory
          movieResponse.data.movie.category &&
            movieResponse.data.movie.category.length > 0
            ? movieResponse.data.movie.category[0]
            : {}
        );
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [duongdan]);
  const checkUserStatus = async () => {
    //Lấy dữ liệu người dùng
    try {
      const response = await axios.get(`${config.API_URL}/users/profile`);
      console.log("User data:", response.data); // In ra dữ liệu người dùng
      setIsLoggedIn(response.data.status === true);
    } catch (err) {
      console.error("Failed to fetch user status", err);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  useEffect(() => {
    if (movie) {
      checkFavoriteStatus(); //KIểm tra Trạng Thái Yêu Thích
    }
  }, [movie]);

  const handleHomeClick = () => navigate("/"); //Điều hướng  đến trang chủ
  const handleCountryClick = () =>
    country && country.slug && navigate(`/quoc-gia/${country.slug}`); //Điều hướng đến phim Quốc Gia
  const handleCategoryClick = () =>
    category && category.slug && navigate(`/the-loai/${category.slug}`); //Điều hướng đến Thể Loại phim
  const handleTypeClick = () =>
    navigate(movieType === "series" ? "/phim-bo" : "/phim-le"); //Điều hướng đến trang Phim Bộ hoặc Phim lẻ

  const toggleFavoriteHandler = async () => {
    //Thay Đổi Trạng Thái Yêu Thích Phim
    console.log("isLoggedIn:", isLoggedIn); // Kiểm tra giá trị isLoggedIn
    if (isLoggedIn) {
      if (movie) {
        try {
          await toggleFavorite(movie._id);
          setIsFavorite((prevState) => !prevState);
        } catch (error) {
          console.error("Failed to toggle favorite:", error);
        }
      }
    } else {
      setNotification("Bạn phải đăng nhập để thực hiện thao tác này !!");
      console.log("Notification set");
      setTimeout(() => setNotification(""), 3000); // Xóa thông báo sau 3 giây
    }
  };
  const checkFavoriteStatus = async () => {
    //Kiểm tra Trạng Thái Yêu Thích
    if (movie) {
      try {
        const response = await axios.get(
          `${config.API_URL}/movies/favorite/${movie._id}`,
          { withCredentials: true }
        );
        setIsFavorite(response.data.isFavorite);
      } catch (error) {
        console.error("Failed to check favorite status:", error);
      }
    }
  };

  if (loading) return <Spinner />; // Hien thi Spinner khi đang load du lieu
  if (error) return <div>Error: {error}</div>; // Hien thi thong bao khi bi Lỗi
  if (!movie) return <div>Không tìm thấy dữ liệu phim</div>; //HIển thị thông báo khi không có dữ liệu phim

  const serverData = movie.episodes && movie.episodes[currentServer]; //Lay thong tin Server
  const episodeData = serverData && serverData.server_data[currentEpisode]; //Lay thong tin Tập

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8 flex">
        <div className="w-3/4 pr-8">
          {/* Đường Dẫn */}
          <div className="text-sm mb-4">
            <a
              onClick={handleHomeClick}
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              Trang Chủ
            </a>{" "}
            &gt;
            <a
              onClick={handleTypeClick}
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              {movieType === "series" ? "Phim Bộ" : "Phim Lẻ"}
            </a>{" "}
            &gt;
            <a
              onClick={handleCountryClick}
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              {country.name || "Unknown Country"}
            </a>{" "}
            &gt;
            <a
              onClick={handleCategoryClick}
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              {category.name || "Unknown Category"}
            </a>{" "}
            &gt;
            <span className="text-white">{movie.name}</span>
          </div>

          {/* Video Phim */}
          <div className="video-player mb-4">
            {episodeData && (
              <iframe
                key={`${currentServer}-${currentEpisode}`}
                src={episodeData.link_embed}
                width="100%"
                height="500px"
                allowFullScreen
              ></iframe>
            )}
          </div>
          {/* Hiển thị thông báo */}
          {notification && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg max-w-md w-full">
                {notification}
              </div>
            </div>
          )}

          {/* Nút Yêu thích */}
          <button
            onClick={toggleFavoriteHandler}
            className={`px-4 py-2 rounded ${
              isFavorite ? "bg-red-600" : "bg-gray-600"
            }`}
          >
            {isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
          </button>

          {/* Chọn Server Và Tập */}
          <div className="server-selection mb-4">
            <h3 className="text-lg font-semibold mb-2">Chọn server</h3>
            {movie.episodes.map((server, index) => (
              <button
                key={index}
                onClick={() => setCurrentServer(index)}
                className={`mr-2 mb-2 px-4 py-2 rounded ${
                  currentServer === index ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                {server.server_name}
              </button>
            ))}
          </div>

          <div className="episode-selection">
            <h3 className="text-lg font-semibold mb-2">Chọn tập phim</h3>
            <div className="grid grid-cols-8 gap-2">
              {serverData?.server_data.map((episode, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentEpisode(index)}
                  className={`px-3 py-2 rounded ${
                    currentEpisode === index ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  Tập {episode.name}
                </button>
              ))}
            </div>
          </div>

          {/* Nội dung Phim */}
          <div className="mt-4 bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2 text-cyan-400">
              Nội dung phim
            </h2>
            <div>
              {movie.content ? (
                <div dangerouslySetInnerHTML={{ __html: movie.content }} />
              ) : (
                <div>Đang Cập Nhật. . . </div>
              )}
            </div>
          </div>
        </div>

        {/* Phim Đề Xuất */}
        <div className="w-1/4">
          <h3 className="text-xl font-semibold mb-4">Phim đề xuất</h3>
          <div className="space-y-4">
            {suggestedMovies.length > 0 ? (
              suggestedMovies.map((movie) => (
                <Link
                  key={movie._id}
                  to={`/detail/${movie.slug}`}
                  className="block"
                >
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={movie.thumb_url}
                      alt={movie.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <h4 className="font-semibold truncate">{movie.name}</h4>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{movie.year}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>Không có phim đề xuất</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default WatchMovie;
