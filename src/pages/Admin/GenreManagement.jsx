import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Trang quản lý Thể Loại
const GenreManagement = () => {
  const [genres, setGenres] = useState([]);
  const [displayedGenres, setDisplayedGenres] = useState([]);
  const [newGenre, setNewGenre] = useState("");
  const [editingGenreId, setEditingGenreId] = useState(null);
  const [editingGenreName, setEditingGenreName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    handleSearchAndPagination(); //XỬ lý tìm kiếm và phân trang
  }, [searchTerm, page, genres]);

  const fetchGenres = async () => {
    //Lấy dữ liệu thể loại từ API
    try {
      const response = await axios.get(`${config.API_URL}/genres`);
      if (Array.isArray(response.data)) {
        setGenres(response.data);
      } else if (response.data.genres && Array.isArray(response.data.genres)) {
        setGenres(response.data.genres);
      } else {
        console.error("Unexpected API response format:", response.data);
        setGenres([]);
      }
    } catch (err) {
      console.error("Failed to fetch genres", err);
      setGenres([]);
    }
  };

  const handleSearchAndPagination = () => {
    //Hàm Xử lý tìm kiếm
    let filteredGenres = genres;
    if (searchTerm) {
      filteredGenres = genres.filter((genre) =>
        genre.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedGenres(filteredGenres.slice(startIndex, endIndex));
  };

  const addGenre = async () => {
    //Hàm thêm thể loại
    try {
      await axios.post(`${config.API_URL}/genres`, { name: newGenre });
      setNewGenre("");
      fetchGenres();
      toast.success("Thêm thể loại thành công!");
    } catch (err) {
      console.error("Failed to add genre", err);
      toast.error("Thêm thể loại thất bại.");
    }
  };

  const updateGenre = async (id) => {
    //Hàm cập nhật thể loại
    try {
      await axios.put(`${config.API_URL}/genres/${id}`, {
        name: editingGenreName,
      });
      setEditingGenreId(null);
      setEditingGenreName("");
      fetchGenres();
      toast.success("Cập nhật thể loại thành công!");
    } catch (err) {
      console.error("Failed to update genre", err);
      toast.error("Cập nhật thể loại thất bại.");
    }
  };

  const deleteGenre = async (id) => {
    //Hàm xóa thể loại
    try {
      await axios.delete(`${config.API_URL}/genres/${id}`);
      fetchGenres();
      toast.success("Xóa thể loại thành công!");
    } catch (err) {
      console.error("Failed to delete genre", err);
      toast.error("Xóa thể loại thất bại.");
    }
  };

  const handleSearch = (e) => {
    //Xử lý tìm kiếm
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(genres.length / itemsPerPage); //Tổng số trang

  return (
    //Giao diện trang quản lý thể loại
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Quản lý thể loại
      </h2>

      {/* Thêm thể loại mới */}
      <div className="mb-6 flex items-center">
        <input
          type="text"
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
          className="border border-gray-300 p-2 mr-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tên thể loại mới"
        />
        <button
          onClick={addGenre}
          className="bg-blue-500 text-white p-2 rounded-lg shadow-sm hover:bg-blue-600 transition duration-300"
        >
          Thêm thể loại
        </button>
      </div>

      {/* Tìm kiếm thể loại */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          placeholder="Tìm kiếm thể loại"
        />
      </div>

      {/* Danh sách thể loại */}
      <ul className="list-none">
        {displayedGenres.map((genre) => (
          <li
            key={genre._id}
            className="flex justify-between items-center mb-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition duration-300"
          >
            {editingGenreId === genre._id ? (
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={editingGenreName}
                  onChange={(e) => setEditingGenreName(e.target.value)}
                  className="border border-gray-300 p-2 mr-2 rounded-lg shadow-sm w-full"
                />
                <button
                  onClick={() => updateGenre(genre._id)}
                  className="bg-green-500 text-white p-2 rounded-lg shadow-sm hover:bg-green-600 transition duration-300 mr-2"
                >
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setEditingGenreId(null);
                    setEditingGenreName("");
                  }}
                  className="bg-gray-500 text-white p-2 rounded-lg shadow-sm hover:bg-gray-600 transition duration-300"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center w-full">
                <span>{genre.name}</span>
                <div>
                  <button
                    onClick={() => {
                      setEditingGenreId(genre._id);
                      setEditingGenreName(genre.name);
                    }}
                    className="bg-yellow-500 text-white p-2 rounded-lg shadow-sm hover:bg-yellow-600 transition duration-300 mr-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => deleteGenre(genre._id)}
                    className="bg-red-500 text-white p-2 rounded-lg shadow-sm hover:bg-red-600 transition duration-300"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-500 text-white p-2 rounded-lg shadow-sm hover:bg-gray-600 transition duration-300"
          disabled={page === 1}
        >
          Trang trước
        </button>
        <span className="text-gray-800">
          Trang {page} / {totalPages}
        </span>
        <button
          onClick={() =>
            setPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          className="bg-gray-500 text-white p-2 rounded-lg shadow-sm hover:bg-gray-600 transition duration-300"
          disabled={page === totalPages}
        >
          Trang sau
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default GenreManagement;
