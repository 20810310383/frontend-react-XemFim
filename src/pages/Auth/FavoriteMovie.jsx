// FavoriteMovie.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import config from "../../config";
import NavBar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FavoriteContext } from "../Auth/FavoriteContext";
import Spinner from "../../components/Spinner";
//Trang Phim Yêu Thích
const FavoriteMovie = () => {
  const { favorites, setFavorites, toggleFavorite } =
    useContext(FavoriteContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      //Hàm để lấy danh sách phim yêu thích từ server
      setLoading(true);
      try {
        const response = await axios.get(`${config.API_URL}/movies/favorites`, {
          withCredentials: true,
        });
        setFavorites(response.data.favorites);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []); // Chạy lại useEffect mỗi khi toggleFavorite thay đổi

  const handleRemoveFavorite = async (movieId) => {
    //Hàm thêm/xóa phim khỏi danh sách yêu thích
    await toggleFavorite(movieId);
  };

  if (loading) return <Spinner />;

  return (
    //Hien thi danh sach phim yêu thich
    <div className="bg-gray-900 text-white min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Phim yêu thích</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {favorites.map((movie) => (
            <div
              key={movie._id}
              className="bg-gray-800 rounded-lg overflow-hidden"
            >
              <Link to={`/detail/${movie.slug}`}>
                <img
                  src={movie.thumb_url}
                  alt={movie.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2">
                  <h2 className="font-semibold truncate">{movie.name}</h2>
                  <p className="text-sm text-gray-400">{movie.year}</p>
                </div>
              </Link>
              <button
                onClick={() => handleRemoveFavorite(movie._id)}
                className="w-full bg-red-600 text-white py-2 mt-2 hover:bg-red-700 transition duration-300"
              >
                Bỏ Yêu thích
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FavoriteMovie;
