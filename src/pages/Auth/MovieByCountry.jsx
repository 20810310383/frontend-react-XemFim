import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import NavBar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import ScrollToTopButton from "../../components/ScrollToTopButton.jsx";
//Giao diện trang phim Quốc Gia
const MovieByCountry = () => {
  const { slug } = useParams();
  const [movies, setMovies] = useState([]);
  const [countryName, setCountryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 30;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMoviesByCountry = async () => {
      //Lấy dữ liệu bộ phim theo quốc gia
      try {
        setLoading(true);
        const response = await axios.get(
          `${config.API_URL}/movies/country/${slug}`
        );
        setMovies(response.data.movies);
        setCurrentPage(1);
        console.log(response.data.movies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies by country:", error);
        setLoading(false);
      }
    };

    const fetchCountryBySlug = async () => {
      //Lấy dữ liệu quốc gia theo slug
      try {
        console.log("Fetching country with slug:", slug);
        const response = await axios.get(`${config.API_URL}/countries/${slug}`);
        console.log("Response:", response.data);
        setCountryName(response.data.country.name);
      } catch (error) {
        console.error(
          "Error fetching country by slug:",
          error.response?.data || error.message
        );
      }
    };

    fetchCountryBySlug();
    fetchMoviesByCountry();
  }, [slug]);

  if (loading) {
    return <Spinner />; // Hien thi thanh tải khi tải trang web
  }

  const handleMovieClick = (movie) => {
    //Xử lý điều hướng khi ấn vào phim
    console.log("Movie clicked:", movie);
    navigate(`/detail/${movie.slug}`); //Điều hướng sang trang chi tiết phim
  };

  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const getPageNumbers = () => {
    let numbers = [];
    if (totalPages <= 5) {
      numbers = [...Array(totalPages)].map((_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        numbers = [1, 2, 3, 4, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        numbers = [
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        numbers = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }
    return numbers;
  }; //Chia số trang

  const changePage = (page) => {
    //Chuyển trang
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    //giao diện trang phim Quốc Gia
    <div className="container mx-auto px-4 bg-black text-white">
      <NavBar />
      <h1 className="text-3xl font-bold my-6">Phim {countryName}</h1>
      <div className="grid grid-cols-5 gap-4">
        {currentMovies.map((movie) => (
          <div
            key={movie._id}
            className="relative group"
            onClick={() => handleMovieClick(movie)}
          >
            <img
              src={movie.thumb_url}
              alt={movie.name}
              className="w-full h-64 object-cover rounded-md"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-2xl font-extrabold leading-tight mb-4 text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                {movie.name}
              </p>
              {movie.year && (
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                  {movie.year}
                </span>
              )}
            </div>
            <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-tl-md">
              HD VIETSUB
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={() => changePage(1)}
          className="mx-1 px-2 py-1 rounded bg-gray-200 text-black"
          disabled={currentPage === 1}
        >
          {"<<"}
        </button>
        {getPageNumbers().map((number, index) => (
          <button
            key={index}
            onClick={() =>
              typeof number === "number" ? changePage(number) : null
            }
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === number
                ? "bg-blue-500 text-white"
                : number === "..."
                ? "bg-gray-200 text-black cursor-default"
                : "bg-gray-200 text-black"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => changePage(currentPage + 1)}
          className="mx-1 px-2 py-1 rounded bg-gray-200 text-black"
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
        <button
          onClick={() => changePage(totalPages)}
          className="mx-1 px-2 py-1 rounded bg-gray-200 text-black"
          disabled={currentPage === totalPages}
        >
          {">>"}
        </button>
      </div>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default MovieByCountry;
