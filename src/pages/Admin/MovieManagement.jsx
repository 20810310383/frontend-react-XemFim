import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;
//Trang quản lý Phim
const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [currentMovies, setCurrentMovies] = useState([]); // Phim của trang hiện tại
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 12; // Số phim mỗi trang
  const [editingMovie, setEditingMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newEpisode, setNewEpisode] = useState({
    name: "",
    slug: "",
    filename: "",
  });
  const [selectedMovieForEpisode, setSelectedMovieForEpisode] = useState(null);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [newMovie, setNewMovie] = useState({
    name: "",
    origin_name: "",
    content: "",
    type: "",
    status: "",
    thumb_url: "",
    poster_url: "",
    time: "",
    episode_total: "",
    episode_current: "",
    quality: "HD",
    lang: "Vietsub",
    year: "",
    slug: "",
    actor: [],
    director: [],
    category: [],
    country: [],
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);

  const fetchMovies = async () => {
    // Lấy dữ liệu phim từ API
    try {
      const response = await axios.get(`${config.API_URL}/movies`, {
        params: { searchTerm },
      });
      console.log("Movies data:", response.data.movies); // Kiểm tra dữ liệu
      response.data.movies.forEach((movie) => {});
      setMovies(response.data.movies);
    } catch (error) {
      console.error("Failed to fetch movies", error);
    }
  };
  const fetchGenres = async () => {
    //Lấy dữ liệu thể loại từ API
    try {
      const response = await axios.get(`${config.API_URL}/genres`);
      setGenres(
        response.data.genres.map((genre) => ({
          _id: genre._id || genre.id,
          id: genre.id || genre._id,
          name: genre.name,
          slug: genre.slug,
        }))
      );
      console.log("Fetched genres:", response.data.genres);
    } catch (err) {
      console.error("Failed to fetch genres", err);
    }
  };
  const fetchCountries = async () => {
    //Lấy dữ liệu quốc gia từ API
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
      console.error("Failed to fetch countries", error);
      setCountries([]);
    }
  };

  // Fetch phim khi trang hiện tại hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    fetchMovies();
    fetchGenres();
    fetchCountries();
  }, [searchTerm]);

  // Phân trang và lọc phim khi danh sách phim hoặc trang hiện tại thay đổi
  useEffect(() => {
    handleSearchAndPagination();
  }, [movies, currentPage]);

  const handleAddMovie = async (e) => {
    // Them phim vào cơ sở dữ liệu
    e.preventDefault();
    try {
      const response = await axios.post(`${config.API_URL}/movies`, newMovie, {
        withCredentials: true,
      });
      console.log("API Response:", response); // Kiểm tra phản hồi từ API
      if (response.status === 201) {
        // Kiểm tra mã trạng thái HTTP
        toast.success("Thêm phim thành công!");
        fetchMovies(); // Cập nhật danh sách phim
        setNewMovie({
          name: "",
          origin_name: "",
          content: "",
          thumb_url: "",
          poster_url: "",
          type: "",
          time: "",
          year: "",
          episode_total: "",
          episode_current: "",
          slug: "",
          quality: "HD",
          lang: "Vietsub",
          actor: [],
          director: [],
          category: [],
          country: [],
        });
        setShowAddForm(false);
      } else {
        toast.error(
          "Thêm phim thất bại: " +
            (response.data.msg || "Không có thông báo lỗi")
        );
      }
    } catch (error) {
      console.error("Failed to add movie:", error); // Hiển thị lỗi chi tiết
      toast.error("Thêm phim thất bại.");
    }
  };

  const handleAddEpisode = async (movieId) => {
    // Them tập phim
    try {
      const response = await axios.post(
        `${config.API_URL}/movies/${movieId}/episodes`,
        {
          episode: newEpisode,
        }
      );
      if (response.data.status) {
        toast.success("Thêm tập phim thành công!");
        setNewEpisode({ name: "", slug: "", filename: "" });
        setSelectedMovieForEpisode(null);
        fetchMovies(); // Cập nhật danh sách phim
      } else {
        toast.error("Thêm tập phim thất bại: " + response.data.msg);
      }
    } catch (error) {
      console.error("Failed to add episode", error);
      toast.error("Thêm tập phim thất bại.");
    }
  };
  //Cập nhật tập phim
  const handleUpdateEpisode = async (movieId, episodeId, updatedEpisode) => {
    try {
      const episodeData = {
        name: updatedEpisode.name,
        slug: updatedEpisode.slug,
        filename: updatedEpisode.filename,
        link_embed: updatedEpisode.link_embed,
        link_m3u8: updatedEpisode.link_m3u8,
      };

      const response = await axios.put(
        `${config.API_URL}/movies/${movieId}/episodes/${episodeId}`,
        {
          episode: episodeData,
        }
      );

      if (response.data.status) {
        toast.success("Cập nhật tập phim thành công!");
        fetchMovies(); // Cập nhật danh sách phim
      } else {
        toast.error("Cập nhật tập phim thất bại: " + response.data.msg);
      }
    } catch (error) {
      console.error("Failed to update episode", error);
      toast.error("Cập nhật tập phim thất bại.");
    }
  };
  //Xóa tập phim
  const handleDeleteEpisode = async (movieId, episodeId) => {
    try {
      const response = await axios.delete(
        `${config.API_URL}/movies/${movieId}/episodes/${episodeId}`
      );
      if (response.data.status) {
        toast.success("Xóa tập phim thành công!");
        fetchMovies(); // Cập nhật danh sách phim
      } else {
        toast.error("Xóa tập phim thất bại: " + response.data.msg);
      }
    } catch (error) {
      console.error("Failed to delete episode", error);
      toast.error("Xóa tập phim thất bại.");
    }
  };
  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }; //Xóa dấu để tìm kiếm

  const handleSearchAndPagination = () => {
    // Tìm kiếm phim theo từ khóa
    let filteredMovies = movies;
    if (searchTerm) {
      const normalizedSearchTerm = removeAccents(searchTerm);

      filteredMovies = movies.filter((movie) => {
        const normalizedTitle = movie.title ? removeAccents(movie.title) : "";
        const normalizedName = movie.name ? removeAccents(movie.name) : "";

        return (
          (movie.title &&
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (movie.name &&
            movie.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          normalizedTitle.includes(normalizedSearchTerm) ||
          normalizedName.includes(normalizedSearchTerm)
        );
      });
    }

    // Phân trang phim đã lọc
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentMovies(filteredMovies.slice(startIndex, endIndex));

    // Cập nhật số trang
    setTotalPages(Math.ceil(filteredMovies.length / itemsPerPage));
  }; //Tìm kiếm

  const deleteMovie = async (movieId) => {
    try {
      await axios.delete(`${config.API_URL}/movies/${movieId}`);
      fetchMovies(); // Cập nhật danh sách phim sau khi xóa
      toast.success("Xóa phim thành công!");
    } catch (error) {
      console.error("Failed to delete movie", error);
      toast.error("Xóa phim thất bại.");
    }
  }; //Xóa phim

  const fetchNewMovies = async () => {
    //Thêm Phim mới từ API
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.API_URL}/movies/fetch-movies`);
      if (response.data.status) {
        alert(response.data.msg);
        fetchMovies(); // Cập nhật danh sách phim sau khi thêm mới
        toast.success("Thêm phim thành công!");
      } else {
        alert("Không thể thêm phim mới: " + response.data.msg);
        toast.error("Thêm phim thất bại.");
      }
    } catch (error) {
      console.error("Failed to fetch new movies", error);
      toast.error("Thêm phim thất bại.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleEdit = (movie) => {
    console.log("Editing movie:", movie);
    setEditingMovie({
      ...movie,
      id: movie._id || movie.id,
      category: Array.isArray(movie.category) ? movie.category : [],
      country:
        movie.country && movie.country.length > 0 ? movie.country[0] : null,
      episode_current: movie.episode_current || "",
    });
    setIsEditing(true);
  }; //Hàm Chỉnh sửa phim

  const handleGenreChange = (genreId, genreName, genreSlug) => {
    if (!editingMovie) return;

    setEditingMovie((prevMovie) => {
      const updatedCategory = prevMovie.category
        ? prevMovie.category.some((c) => c.id === genreId)
          ? prevMovie.category.filter((c) => c.id !== genreId)
          : [
              ...prevMovie.category,
              { id: genreId, name: genreName, slug: genreSlug },
            ]
        : [{ id: genreId, name: genreName, slug: genreSlug }];
      return { ...prevMovie, category: updatedCategory };
    });
  }; //Hàm xử lý khi thay đổi thể loại
  const handleCountryChange = (e) => {
    const countrySlug = e.target.value;
    const selectedCountry = countries.find(
      (country) => country.slug === countrySlug
    );
    setEditingMovie({ ...editingMovie, country: selectedCountry });
  }; //Hàm xử lý khi thay đổi quốc gia
  const handleUpdate = async () => {
    if (!editingMovie || !editingMovie.id) return;

    try {
      const updatedMovie = {
        ...editingMovie,
        category: editingMovie.category.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        })),
        country: editingMovie.country ? [editingMovie.country] : [],
        episode_current: editingMovie.episode_current,
      };

      console.log("Updating movie with data:", updatedMovie);
      const response = await axios.put(
        `${config.API_URL}/movies/${editingMovie.id}`,
        updatedMovie
      );
      console.log("Server response:", response.data); // Kiểm tra phản hồi từ server

      // Kiểm tra trường `status` trong phản hồi
      if (response.data.status) {
        toast.success("Cập nhật phim thành công!");
        setEditingMovie(null);
        setIsEditing(false);
        fetchMovies();
      } else {
        // Nếu phản hồi không có trường `status`, sử dụng `response.data.msg`
        toast.error(
          "Cập nhật phim thất bại: " +
            (response.data.msg || "Lỗi không xác định")
        );
      }
    } catch (error) {
      console.error(
        "Failed to update movie:",
        error.response?.data || error.message || "Unknown error"
      );

      // Kiểm tra nhiều trường hợp lỗi
      const errorMessage =
        error.response?.data?.error || error.message || "Lỗi không xác định";
      toast.error("Cập nhật phim thất bại: " + errorMessage);
    }
  }; //Hàm cập nhật phim
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingMovie({ ...editingMovie, [name]: value });
  }; //Hàm xử lý khi thay đổi phim

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset trang về 1 khi tìm kiếm
  }; //Hàm xử lý tìm kiếm

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }; //Hàm xử lý trang trước

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }; //Hàm xử lý trang sau

  return (
    //Giao diện quản lý Phim
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Quản lý phim</h2>

      <div className="mb-6 text-center">
        <button
          onClick={fetchNewMovies}
          className={`bg-green-600 text-white px-4 py-2 rounded shadow ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Đang thêm phim..." : "Thêm phim mới từ API"}
        </button>
      </div>

      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-lg">Đang thêm phim mới, vui lòng đợi...</p>
          </div>
        </div>
      )}

      <div className="mb-6 text-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 w-full max-w-md mx-auto"
          placeholder="Tìm kiếm phim"
        />
      </div>
      {/* Thêm nút và form ở đây */}
      <div className="mb-6 text-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          {showAddForm ? "Ẩn form thêm phim" : "Thêm phim mới"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddMovie} className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={newMovie.name}
              onChange={(e) =>
                setNewMovie({ ...newMovie, name: e.target.value })
              }
              placeholder="Tên phim"
              className="border p-2"
            />
            <input
              type="text"
              value={newMovie.slug}
              onChange={(e) =>
                setNewMovie({ ...newMovie, slug: e.target.value })
              }
              placeholder="Slug"
              className="border p-2"
            />
            <input
              type="text"
              value={newMovie.origin_name}
              onChange={(e) =>
                setNewMovie({ ...newMovie, origin_name: e.target.value })
              }
              placeholder="Tên gốc"
              className="border p-2"
            />
            <textarea
              value={newMovie.content}
              onChange={(e) =>
                setNewMovie({ ...newMovie, content: e.target.value })
              }
              placeholder="Nội dung"
              className="border p-2 col-span-2"
            />
            <input
              type="text"
              value={newMovie.thumb_url}
              onChange={(e) =>
                setNewMovie({ ...newMovie, thumb_url: e.target.value })
              }
              placeholder="URL hình thu nhỏ"
              className="border p-2"
            />
            <input
              type="text"
              value={newMovie.poster_url}
              onChange={(e) =>
                setNewMovie({ ...newMovie, poster_url: e.target.value })
              }
              placeholder="URL poster"
              className="border p-2"
            />

            <input
              type="text"
              value={newMovie.time}
              onChange={(e) =>
                setNewMovie({ ...newMovie, time: e.target.value })
              }
              placeholder="Thời lượng"
              className="border p-2"
            />
            <input
              type="number"
              value={newMovie.year}
              onChange={(e) =>
                setNewMovie({ ...newMovie, year: e.target.value })
              }
              placeholder="Năm sản xuất"
              className="border p-2"
            />
            <input
              type="text"
              placeholder="Diễn viên"
              value={newMovie.actor.join(", ")}
              onChange={(e) =>
                setNewMovie({
                  ...newMovie,
                  actor: e.target.value.split(",").map((actor) => actor.trim()),
                })
              }
            />
            <input
              type="text"
              placeholder="Đạo diễn"
              value={newMovie.director.join(", ")}
              onChange={(e) =>
                setNewMovie({
                  ...newMovie,
                  director: e.target.value
                    .split(",")
                    .map((director) => director.trim()),
                })
              }
            />

            <input
              type="text"
              value={newMovie.episode_total}
              onChange={(e) =>
                setNewMovie({ ...newMovie, episode_total: e.target.value })
              }
              placeholder="Số tập"
              className="border p-2"
            />
            <input
              type="text"
              placeholder="Trạng thái Tập hiện tại"
              value={newMovie.episode_current}
              onChange={(e) =>
                setNewMovie({ ...newMovie, episode_current: e.target.value })
              }
            />
            <input
              type="text"
              value={newMovie.quality}
              onChange={(e) =>
                setNewMovie({ ...newMovie, quality: e.target.value })
              }
              placeholder="Chất Lượng"
              className="border p-2"
            />
            <input
              type="text"
              value={newMovie.lang}
              onChange={(e) =>
                setNewMovie({ ...newMovie, lang: e.target.value })
              }
              placeholder="Ngôn Ngữ"
              className="border p-2"
            />

            <select
              value={newMovie.type}
              onChange={(e) =>
                setNewMovie({ ...newMovie, type: e.target.value })
              }
              className="border p-2 "
            >
              <option value="">Chọn loại phim</option>
              <option value="single">Phim lẻ</option>
              <option value="series">Phim bộ</option>
            </select>
            <div className="form-group">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thể loại:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {genres.map((genre) => (
                    <label
                      key={genre._id || genre.id}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        value={genre.id || genre._id}
                        checked={newMovie.category.some(
                          (c) => c.id === genre.id || c._id === genre._id
                        )}
                        onChange={() => {
                          const isChecked = newMovie.category.some(
                            (c) => c.id === genre.id || c._id === genre._id
                          );
                          const updatedCategories = isChecked
                            ? newMovie.category.filter(
                                (c) => c.id !== genre.id && c._id !== genre._id
                              )
                            : [
                                ...newMovie.category,
                                {
                                  id: genre.id || genre._id,
                                  name: genre.name,
                                  slug: genre.slug,
                                },
                              ];
                          setNewMovie({
                            ...newMovie,
                            category: updatedCategories,
                          });
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span>{genre.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Quốc gia:</label>
              <select
                value={newMovie.country[0] ? newMovie.country[0].slug : ""}
                onChange={(e) => {
                  const selectedCountry = countries.find(
                    (country) => country.slug === e.target.value
                  );
                  setNewMovie({
                    ...newMovie,
                    country: selectedCountry ? [selectedCountry] : [],
                  });
                }}
              >
                <option value="">Chọn quốc gia</option>
                {countries.map((country) => (
                  <option key={country._id || country.id} value={country.slug}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded shadow"
          >
            Thêm phim
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <div
              key={movie._id}
              className="bg-white shadow rounded p-4 flex flex-col justify-between"
            >
              <div className="flex items-center mb-4">
                {movie.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title || movie.name}
                    className="w-20 h-30 object-cover mr-4"
                  />
                ) : (
                  <div className="w-20 h-30 bg-gray-200 mr-4"></div>
                )}
                <div>
                  <h3 className="font-bold">{movie.title || movie.name}</h3>
                  <p className="text-gray-600">
                    {movie.releaseYear || movie.year}
                  </p>
                  <p className="text-sm text-gray-600">
                    Thể loại:{" "}
                    {movie.genre &&
                    Array.isArray(movie.genre) &&
                    movie.genre.length > 0
                      ? movie.genre.map((g) => g.name || g).join(", ")
                      : movie.category &&
                        Array.isArray(movie.category) &&
                        movie.category.length > 0
                      ? movie.category.map((c) => c.name || c).join(", ")
                      : "Không có thông tin"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quốc gia:{" "}
                    {movie.country &&
                    Array.isArray(movie.country) &&
                    movie.country.length > 0
                      ? movie.country[0].name
                      : "Không có thông tin"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteMovie(movie._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Xóa
              </button>
              <button
                onClick={() => handleEdit(movie)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Sửa
              </button>
              <button
                onClick={() => setSelectedMovieForEpisode(movie._id)}
                className="bg-green-700 text-white p-2 rounded mt-2"
              >
                Thêm tập
              </button>
              <button
                onClick={() =>
                  setShowEpisodes((prev) => ({
                    ...prev,
                    [movie._id]: !prev[movie._id],
                  }))
                }
                className="bg-yellow-700 text-white p-2 rounded"
              >
                {showEpisodes[movie._id]
                  ? "Ẩn danh sách tập"
                  : "Xem danh sách tập"}
              </button>
              {showEpisodes[movie._id] &&
                movie.episodes &&
                movie.episodes.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-bold">Danh sách tập:</h4>
                    <ul className="mt-2 max-h-40 overflow-y-auto">
                      {movie.episodes[0].server_data.map((episode, index) => (
                        <li
                          key={index}
                          className="text-sm mb-4 p-2 flex justify-between items-center font-medium tracking-wide text-gray-800 bg-white rounded-lg shadow-md hover:text-gray-600 transition duration-300"
                        >
                          <span>
                            Tập {episode.name}: {episode.filename}
                          </span>
                          <div>
                            <button
                              onClick={() => {
                                setEditingEpisode({
                                  _id: episode._id,
                                  movieId: movie._id,
                                  name: episode.name,
                                  slug: episode.slug,
                                  filename: episode.filename,
                                  link_embed: episode.link_embed,
                                  link_m3u8: episode.link_m3u8,
                                });
                              }}
                              className="bg-blue-500 text-white p-1 rounded mr-1"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteEpisode(movie._id, episode._id)
                              }
                              className="bg-red-500 text-white p-1 rounded"
                            >
                              Xóa
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 col-span-1 md:col-span-2 lg:col-span-3 text-center">
            Không Tìm Thấy Phim
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="bg-gray-300 p-2 rounded mr-2"
        >
          Trang đầu
        </button>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-gray-300 p-2 rounded mr-2"
        >
          Trang trước
        </button>
        <div className="flex items-center">
          <span className="mr-2">Trang</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
              }
            }}
            className="border p-1 w-16 text-center"
          />
          <span className="ml-2">/ {totalPages}</span>
        </div>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-300 p-2 rounded ml-2"
        >
          Trang sau
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 p-2 rounded ml-2"
        >
          Trang cuối
        </button>
      </div>
      {isEditing && editingMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg w-full max-w-xl">
            <h3 className="text-xl font-bold mb-4">Chỉnh sửa phim</h3>
            <a className="font-bold mb-2">Tên Phim:</a>
            <input
              type="text"
              name="name"
              value={editingMovie.name}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded"
              placeholder="Tên phim"
            />
            <a className="font-bold mb-2">Tên Gốc:</a>
            <input
              type="text"
              name="origin_name"
              value={editingMovie.origin_name}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded"
              placeholder="Tên gốc"
            />
            <a className="font-bold mb-2">Số Tập:</a>
            <input
              type="text"
              name="episode_current"
              value={editingMovie.episode_current}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Số tập hiện tại"
            />
            <a className="font-bold mb-2">Nội Dung:</a>
            <textarea
              name="content"
              value={editingMovie.content}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded"
              placeholder="Nội dung"
            ></textarea>
            <a className="font-bold mb-2">Năm:</a>
            <input
              type="number"
              name="year"
              value={editingMovie.year}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded"
              placeholder="Năm sản xuất"
            />
            <a className="font-bold mb-2">Ảnh:</a>
            <input
              type="text"
              name="content"
              placeholder="URL ảnh thu nhỏ"
              value={editingMovie.thumb_url}
              onChange={(e) =>
                setEditingMovie({ ...editingMovie, thumb_url: e.target.value })
              }
            />

            <div className="mb-4">
              <h4 className="font-bold mb-2">Thể loại:</h4>
              <div className="grid grid-cols-3 gap-2">
                {genres.map((genre) => {
                  const isChecked =
                    editingMovie && editingMovie.category
                      ? editingMovie.category.some((c) => c.id === genre._id)
                      : false;
                  return (
                    <label
                      key={`genre-${genre._id}`}
                      className="flex items-center"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          handleGenreChange(genre._id, genre.name, genre.slug)
                        }
                        className="mr-2"
                      />
                      {genre.name}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-bold mb-2">Quốc gia:</h4>
              <select
                value={editingMovie.country ? editingMovie.country.slug : ""}
                onChange={handleCountryChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Chọn quốc gia</option>
                {countries.map((country) => (
                  <option key={country._id} value={country.slug}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setEditingMovie(null);
                  setIsEditing(false);
                }}
                className="bg-gray-300 text-black p-2 rounded mr-2"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedMovieForEpisode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Thêm tập phim mới</h3>
            <input
              type="text"
              value={newEpisode.name}
              onChange={(e) =>
                setNewEpisode({ ...newEpisode, name: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded"
              placeholder="Số tập (vd: 1)"
            />
            <input
              type="text"
              value={newEpisode.slug}
              onChange={(e) =>
                setNewEpisode({ ...newEpisode, slug: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded"
              placeholder="Slug (vd: 1)"
            />
            <input
              type="text"
              value={newEpisode.filename}
              onChange={(e) =>
                setNewEpisode({ ...newEpisode, filename: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded"
              placeholder="Tên file (vd: Nhật Ký Của Triệu Tiểu Thư - Tập 1)"
            />
            <input
              type="text"
              value={newEpisode.link_embed}
              onChange={(e) =>
                setNewEpisode({ ...newEpisode, link_embed: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded"
              placeholder="Link embed"
            />
            <input
              type="text"
              value={newEpisode.link_m3u8}
              onChange={(e) =>
                setNewEpisode({ ...newEpisode, link_m3u8: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded"
              placeholder="Link m3u8"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedMovieForEpisode(null)}
                className="bg-gray-300 text-black p-2 rounded mr-2"
              >
                Hủy
              </button>
              <button
                onClick={() => handleAddEpisode(selectedMovieForEpisode)}
                className="bg-blue-700 text-white p-2 rounded"
              >
                Thêm tập
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Form cập nhật tập phim */}
      {editingEpisode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Cập nhật tập phim</h3>
            <input
              type="text"
              value={editingEpisode.name}
              onChange={(e) =>
                setEditingEpisode({ ...editingEpisode, name: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded"
              placeholder="Số tập (vd: 1)"
            />
            <input
              type="text"
              value={editingEpisode.slug}
              onChange={(e) =>
                setEditingEpisode({ ...editingEpisode, slug: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded"
              placeholder="Slug (vd: tap-1)"
            />
            <input
              type="text"
              value={editingEpisode.filename}
              onChange={(e) =>
                setEditingEpisode({
                  ...editingEpisode,
                  filename: e.target.value,
                })
              }
              className="w-full p-2 mb-2 border rounded"
              placeholder="Tên file (vd: Nhật Ký Của Triệu Tiểu Thư - Tập 1)"
            />
            <input
              type="text"
              value={editingEpisode.link_embed}
              onChange={(e) =>
                setEditingEpisode({
                  ...editingEpisode,
                  link_embed: e.target.value,
                })
              }
              className="w-full p-2 mb-2 border rounded"
              placeholder="Link embed"
            />
            <input
              type="text"
              value={editingEpisode.link_m3u8}
              onChange={(e) =>
                setEditingEpisode({
                  ...editingEpisode,
                  link_m3u8: e.target.value,
                })
              }
              className="w-full p-2 mb-2 border rounded"
              placeholder="Link m3u8"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setEditingEpisode(null)}
                className="bg-gray-300 text-black p-2 rounded mr-2"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  handleUpdateEpisode(
                    editingEpisode.movieId,
                    editingEpisode._id,
                    editingEpisode
                  );
                  setEditingEpisode(null);
                }}
                className="bg-blue-700 text-white p-2 rounded"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default MovieManagement;
