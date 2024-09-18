import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import axios from "axios";
import config from "../../config";
import Footer from "../../components/Footer.jsx";
import "swiper/css";
import "swiper/css/navigation";
import Spinner from "../../components/Spinner.jsx";
import ScrollToTopButton from "../../components/ScrollToTopButton.jsx";

//Phần hiển thị bảng Phim to ở trang chủ
const MainBanner = () => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchRandomMovie = async () => {
      // Lấy phim ngẫu nhiên
      try {
        const response = await axios.get(`${config.API_URL}/movies/random`);
        if (response.data.status) {
          setMovie(response.data.movie);
        } else {
          console.error("Failed to fetch random movie:", response.data.msg);
        }
      } catch (error) {
        console.error("Error fetching random movie:", error);
      }
    };

    fetchRandomMovie();
    const intervalId = setInterval(fetchRandomMovie, 30000); //thay đổi phim ngau nhien 30s
    return () => clearInterval(intervalId);
  }, []);

  if (!movie) return <Spinner />;

  const handlePlayClick = () => navigate(`/xem-phim/${movie.slug}`); //Điều hướng đến trang xem
  const handleMoreInfoClick = () =>
    navigate(`/detail/${movie.slug}`, { state: { showMoreInfo: true } });

  return (
    //Giao diện Phần Phim To
    <div
      className="relative w-full h-[50vh] md:h-[60vh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${movie.thumb_url}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60"></div>
      <div className="absolute bottom-10 left-10 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.name}</h1>
        <div className="flex space-x-4">
          <button
            onClick={handlePlayClick}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            ▶ Play
          </button>
          <button
            onClick={handleMoreInfoClick}
            className="bg-gray-600 px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            ⓘ More Info
          </button>
        </div>
      </div>
    </div>
  );
};

//Giao diện chung cho các hàng phim
const MovieRow = React.memo(
  ({ title, movies, onMovieClick, handleTitleClick, category, country }) => (
    <div className="my-8">
      <h2
        className="text-white text-2xl md:text-3xl font-bold mb-4 cursor-pointer"
        onClick={() => {
          console.log(`Title clicked: ${title}`);
          if (category) {
            handleTitleClick("category", category);
          } else if (country) {
            handleTitleClick("country", country);
          }
        }}
      >
        {title}
      </h2>
      <Swiper
        slidesPerView={4}
        slidesPerGroup={4}
        spaceBetween={10}
        navigation={true}
        loop={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        {movies.slice(0, 8).map((movie, index) => (
          <SwiperSlide key={index}>
            <div className="relative group" onClick={() => onMovieClick(movie)}>
              <img
                src={movie.thumb_url}
                alt={movie.name}
                className="w-full h-40 object-cover rounded-lg transition-transform transform group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-2xl font-extrabold leading-tight mb-4 text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  {movie.name}
                </p>
                {movie.tag && (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                    {movie.tag}
                  </span>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
);

const NetflixHomePage = () => {
  //Lấy dữ liệu cho các hàng Phim
  const [topShowsHanhDong, setTopShowsHanhDong] = useState([]);
  const [topShowsTaiLieu, setTopShowsTaiLieu] = useState([]);
  const [topShowsChienTranh, setTopShowsChienTranh] = useState([]);
  const [topShowsAuMy, setTopShowsAuMy] = useState([]);
  const [topShowsPhieuLuu, setTopShowsPhieuLuu] = useState([]);
  const [topShowsHanQuoc, setTopShowsHanQuoc] = useState([]);
  const [topShowsKinhDi, setTopShowsKinhDi] = useState([]);
  const [topShowsHaiHuoc, setTopShowsHaiHuoc] = useState([]);
  const [topShowsVietNam, setTopShowsVietNam] = useState([]);
  const navigate = useNavigate();

  const handleMovieClick = useCallback(
    (movie) => {
      try {
        console.log("Attempting to navigate to:", `/detail/${movie.slug}`);
        navigate(`/detail/${movie.slug}`);
      } catch (error) {
        console.error("Navigation error:", error);
      }
    },
    [navigate]
  );

  const handleTitleClick = useCallback(
    (type, value) => {
      console.log(`Navigating to: ${type}/${value}`);
      if (type === "category") {
        navigate(`/the-loai/${value}`);
      } else if (type === "country") {
        navigate(`/quoc-gia/${value}`);
      }
    },
    [navigate]
  );

  useEffect(() => {
    const fetchMoviesByCategory = async (category, setter) => {
      try {
        const response = await axios.get(
          `${config.API_URL}/movies/category/${category}`
        );
        setter(response.data.movies);
      } catch (error) {
        console.error(`Failed to fetch ${category} movies`, error);
      }
    };

    const fetchMoviesByCountry = async (country, setter) => {
      try {
        const response = await axios.get(
          `${config.API_URL}/movies/country/${country}`
        );
        setter(response.data.movies);
      } catch (error) {
        console.error(`Failed to fetch movies from ${country}`, error);
      }
    };

    fetchMoviesByCategory("hanh-dong", setTopShowsHanhDong);
    fetchMoviesByCategory("kinh-di", setTopShowsKinhDi);
    fetchMoviesByCategory("tai-lieu", setTopShowsTaiLieu);
    fetchMoviesByCategory("phieu-luu", setTopShowsPhieuLuu);
    fetchMoviesByCategory("hai-huoc", setTopShowsHaiHuoc);
    fetchMoviesByCategory("chien-tranh", setTopShowsChienTranh);
    fetchMoviesByCountry("han-quoc", setTopShowsHanQuoc);
    fetchMoviesByCountry("au-my", setTopShowsAuMy);
    fetchMoviesByCountry("viet-nam", setTopShowsVietNam);
  }, []);

  return (
    //Giao diện các hàng phim
    <div className="bg-black min-h-screen">
      <MainBanner />
      <div className="container mx-auto px-4">
        <MovieRow
          title="Top Phim Hành Động"
          movies={topShowsHanhDong}
          onMovieClick={handleMovieClick}
          handleTitleClick={handleTitleClick}
          category="hanh-dong"
        />
        <MovieRow
          title="Top Phim Chiến Tranh"
          movies={topShowsChienTranh}
          onMovieClick={handleMovieClick}
          handleTitleClick={handleTitleClick}
          category="chien-tranh"
        />
        <MovieRow
          title="Top Phim Hài Hước"
          movies={topShowsHaiHuoc}
          onMovieClick={handleMovieClick}
          handleTitleClick={handleTitleClick}
          category="hai-huoc"
        />
        <MovieRow
          title="Top Phim Phiêu Lưu"
          movies={topShowsPhieuLuu}
          onMovieClick={handleMovieClick}
          handleTitleClick={handleTitleClick}
          category="phieu-luu"
        />
        <MovieRow
          title="Top Phim Kinh Dị"
          movies={topShowsKinhDi}
          onMovieClick={handleMovieClick}
          handleTitleClick={handleTitleClick}
          category="kinh-di"
        />
        <MovieRow
          title="Top Phim Tài Liệu"
          movies={topShowsTaiLieu}
          onMovieClick={handleMovieClick}
          handleTitleClick={handleTitleClick}
          category="tai-lieu"
        />
        <MovieRow
          title="Top Phim Âu Mỹ"
          movies={topShowsAuMy}
          onMovieClick={handleMovieClick}
          handleTitleClick={handleTitleClick}
          country="au-my"
        />
        <MovieRow
          title="Top Phim Hàn Quốc"
          movies={topShowsHanQuoc}
          onMovieClick={handleMovieClick}
          handleTitleClick={handleTitleClick}
          country="han-quoc"
        />
        <MovieRow
          title="Top Phim Việt Nam"
          movies={topShowsVietNam}
          onMovieClick={handleMovieClick}
          handleTitleClick={handleTitleClick}
          country="viet-nam"
        />
      </div>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default NetflixHomePage;
