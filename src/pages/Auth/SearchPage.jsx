import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { Link } from "react-router-dom";
import ScrollToTopButton from "../../components/ScrollToTopButton.jsx";

//Trang tìm kiếm
const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      //Lấy dữ liệu thể loại và quốc gia
      try {
        const [genresRes, countriesRes] = await Promise.all([
          axios.get(`${config.API_URL}/genres`),
          axios.get(`${config.API_URL}/countries`),
        ]);

        if (genresRes.data && Array.isArray(genresRes.data)) {
          setGenres(genresRes.data);
        } else if (genresRes.data && Array.isArray(genresRes.data.genres)) {
          setGenres(genresRes.data.genres);
        } else {
          setGenres([]);
        }

        if (countriesRes.data && Array.isArray(countriesRes.data)) {
          setCountries(countriesRes.data);
        } else if (
          countriesRes.data &&
          Array.isArray(countriesRes.data.countries)
        ) {
          setCountries(countriesRes.data.countries);
        } else {
          setCountries([]);
        }

        const currentYear = new Date().getFullYear();
        setYears(Array.from({ length: 50 }, (_, i) => currentYear - i));
      } catch (error) {
        setGenres([]);
        setCountries([]);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    //Xử lý tìm kiếm
    setLoading(true);
    try {
      let url = `${config.API_URL}/movies/search?`;
      if (searchTerm) url += `term=${encodeURIComponent(searchTerm)}&`;
      if (selectedGenre) url += `genre=${selectedGenre}&`;
      if (selectedCountry) url += `country=${selectedCountry}&`;
      if (selectedYear) url += `year=${selectedYear}&`;
      if (selectedType) url += `type=${selectedType}`;

      const res = await axios.get(url);
      setSearchResults(res.data.movies || []);
      console.log(res.data);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (slug) => {
    navigate(`/detail/${slug}`); //Điều hướng sang trang chi tiết phim khi chọn phim
  };

  return (
    //Giao diện trang tìm kiếm
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
        Tìm kiếm phim
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập tên phim"
          className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả thể loại</option>
            {genres.map((genre) => (
              <option key={genre._id} value={genre.slug || genre._id}>
                {genre.name}
              </option>
            ))}
          </select>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả quốc gia</option>
            {countries.map((country) => (
              <option key={country._id} value={country.slug || country._id}>
                {country.name}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả năm</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả loại</option>
            <option value="single">Phim lẻ</option>
            <option value="series">Phim bộ</option>
          </select>
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white p-3 rounded-lg w-full hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
        </button>
      </div>
      <Link
        to="/"
        className="block text-center text-blue-600 hover:underline mb-4 text-lg"
      >
        Trang Chủ
      </Link>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {searchResults.map((movie) => (
          <div
            key={movie._id}
            className="border rounded-lg overflow-hidden shadow-md cursor-pointer bg-white hover:shadow-lg transition"
            onClick={() => handleMovieClick(movie.slug)}
          >
            <img
              src={movie.thumb_url || movie.poster_url}
              alt={movie.name || movie.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800 truncate">
                {movie.name || movie.title}
              </h3>
              <p className="text-gray-600">{movie.year}</p>
            </div>
          </div>
        ))}
      </div>
      {searchResults.length === 0 && !loading && (
        <p className="text-center text-gray-700 mt-4">
          Không tìm thấy kết quả nào.
        </p>
      )}
      <ScrollToTopButton />
    </div>
  );
};

export default SearchPage;
