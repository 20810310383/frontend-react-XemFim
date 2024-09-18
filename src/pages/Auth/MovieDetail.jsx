import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import NavBar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FavoriteContext } from "../Auth/FavoriteContext";
import { useContext } from "react";
//Trang chi tiết Phim
const MovieDetails = () => {
  const { duongdan } = useParams();
  const [movie, setMovie] = useState([]);
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [movieType, setMovieType] = useState("");
  const { favorites, toggleFavorite } = useContext(FavoriteContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${config.API_URL}/movies/duongdan/${duongdan}`) // Lấy Dữ Liệu chi tiết Phim
      .then((res) => {
        const movieData = res.data.movie;
        setMovie(res.data.movie);
        console.log(res.data.movie);
        if (res.data.movie.category && res.data.movie.category.length > 0) {
          setCategory(res.data.movie.category[0]);
        }
        if (res.data.movie.country && res.data.movie.country.length > 0) {
          setCountry(res.data.movie.country[0]);
        }
        setMovieType(movieData.type || "");
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
        setIsLoading(false);
      });
  }, [duongdan]);
  if (!movie) {
    return <Spinner />;
  }
  const handleHomeClick = () => {
    //ĐIều hướng sang trang chủ
    navigate("/");
  };
  const handleCountryClick = () => {
    //ĐIều hướng sang trang phim theo quốc gia
    if (country && country.slug) {
      navigate(`/quoc-gia/${country.slug}`);
    }
  };
  const handleCategoryClick = () => {
    //ĐIều hướng sang trang phim theo thể loại
    if (category && category.slug) {
      navigate(`/the-loai/${category.slug}`);
    }
  };
  const handleWatchMovie = () => {
    //ĐIều hướng sang trang xem phim
    navigate(`/xem-phim/${duongdan}`);
  };
  const handleTypeClick = () => {
    if (movieType === "series") {
      navigate("/phim-bo");
    } else {
      navigate("/phim-le");
    }
  }; //ĐIều hướng sang trang phim le hoac phim bo
  const checkUserStatus = async () => {
    //Kiểm tra trạng thái đăng nhập người dùng hiện tại
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

  const toggleFavoriteHandler = async () => {
    //Thay Đổi Trạng Thái Yêu Thích Phim(Bật hoặc tắt)
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
  useEffect(() => {
    if (movie) {
      checkFavoriteStatus();
    }
  }, [movie]);

  return (
    //Giao diện chi tiết phim
    <div className="bg-gray-900 text-gray-300 min-h-screen ">
      <NavBar />
      {/* Breadcrumb */}
      <div className="text-sm mb-4">
        <a
          onClick={handleHomeClick}
          className="text-gray-400 hover:text-white"
          style={{ cursor: "pointer" }}
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
          {" "}
          {country ? country.name : "Unknown Country"}
        </a>{" "}
        &gt;
        <a
          onClick={handleCategoryClick}
          className="text-gray-400 hover:text-white cursor-pointer"
        >
          {" "}
          {category ? category.name : "Unknown Category"}
        </a>{" "}
        &gt;
        <span className="text-white">{movie.name}</span>
      </div>

      {/* Movie Details */}
      <div className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row">
        {/* Movie Poster */}
        <div
          className="md:w-1/4 mb-4 md:mb-0"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={movie.thumb_url}
            alt="Unknown"
            className="w-full rounded-lg"
          />
          <div className="mt-2 space-x-2">
            <button
              onClick={handleWatchMovie}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Xem Phim
            </button>
            <button
              onClick={toggleFavoriteHandler}
              className={`px-4 py-2 rounded ${
                isFavorite ? "bg-red-600" : "bg-gray-600"
              }`}
            >
              {isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
            </button>
          </div>
          {/* Hiển thị thông báo */}
          {notification && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg max-w-md w-full">
                {notification}
              </div>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="md:w-3/4 md:pl-4">
          <h1 className="text-2xl font-bold text-purple-400 mb-4">
            {movie.name}(VIETSUB)
          </h1>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-cyan-400">Trạng thái</div>
            <div>{movie.episode_current}</div>
            <div className="text-cyan-400">Số tập</div>
            <div>{movie.episode_total}</div>
            <div className="text-cyan-400">Thời Lượng</div>
            <div>{movie.time}</div>
            <div className="text-cyan-400">Năm Phát Hành</div>
            <div>{movie.year}</div>
            <div className="text-cyan-400">Chất Lượng</div>
            <div>{movie.quality}</div>
            <div className="text-cyan-400">Ngôn Ngữ</div>
            <div>{movie.lang}</div>
            <div className="text-cyan-400">Đạo Diễn</div>
            <div>
              {movie.director && movie.director[0].trim().length > 0 ? (
                movie.director.join(", ")
              ) : (
                <span className="text-gray-400">
                  Không có thông tin Đạo Diễn
                </span>
              )}
            </div>
            <div className="text-cyan-400">Diễn Viên</div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(movie.actor) &&
              movie.actor[0].trim().length > 0 ? (
                movie.actor.map((actor, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-white rounded-full px-2 py-1 text-xs"
                  >
                    {actor}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">
                  Không có thông tin diễn viên
                </span>
              )}
            </div>
            <div className="text-cyan-400">Thể Loại</div>
            <div>{category ? category.name : "Unknown Category"}</div>
            <div className="text-cyan-400">Quốc Gia</div>
            <div>{country ? country.name : "Unknown Country"}</div>
          </div>
        </div>
      </div>

      {/* Movie Description */}
      <div className="mt-4 bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-2 text-cyan-400">Nội dung phim</h2>

        <div>
          {movie.content ? (
            <div dangerouslySetInnerHTML={{ __html: movie.content }} />
          ) : (
            <div>Đang Cập Nhật. . .</div>
          )}
        </div>
      </div>

      {/* Episode List */}
      <Footer />
    </div>
  );
};

export default MovieDetails;
