import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
// quản lý trạng thái yêu thích trên toàn Web
export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    //Hàm để lấy danh sách phim yêu thích từ server
    try {
      const response = await axios.get(`${config.API_URL}/movies/favorites`, {
        withCredentials: true,
      });
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  const toggleFavorite = async (movieId) => {
    // Hàm để thêm/xóa phim khỏi danh sách yêu thích
    try {
      await axios.post(
        `${config.API_URL}/movies/favorite/${movieId}`,
        {},
        {
          withCredentials: true,
        }
      );
      // Update the favorite list
      await fetchFavorites();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };
  const clearFavorites = () => setFavorites([]); // Hàm để xóa tất cả phim yêu thích

  return (
    <FavoriteContext.Provider
      value={{ favorites, setFavorites, toggleFavorite, clearFavorites }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
