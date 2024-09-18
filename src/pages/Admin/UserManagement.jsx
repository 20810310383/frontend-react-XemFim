import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//Trang quản lý tài khoản
const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    //Lấy dữ liệu người dùng
    try {
      const response = await axios.get(`${config.API_URL}/users`);
      if (Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const deleteUser = async (id) => {
    //Xóa người dùng
    try {
      await axios.delete(`${config.API_URL}/users/${id}`);
      fetchUsers(); // Refresh the user list after deletion
      toast.success("Xóa Người Dùng thành công!");
    } catch (err) {
      console.error("Failed to delete user", err);
      toast.error("Xóa Người Dùng thất bại.");
    }
  };

  const toggleAdminStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`${config.API_URL}/users/${id}`, {
        isAdmin: !currentStatus,
      });
      fetchUsers();
      toast.success("Duyệt Role Thành Công!");
    } catch (err) {
      console.error("Failed to update user status", err);
      toast.error("Duyệt Role thất bại!.");
    }
  }; //Hàm Cấp quyền người dùng

  return (
    //Giao diện quản lý tài khoản
    <div>
      <h2 className="text-2xl font-bold mb-4">Quản lý tài khoản</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Tên người dùng</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Vai trò</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                {user.isAdmin ? "Admin" : "User"}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => toggleAdminStatus(user._id, user.isAdmin)}
                  className="bg-yellow-500 text-white p-1 rounded mr-2"
                >
                  {user.isAdmin ? "Hủy quyền Admin" : "Cấp quyền Admin"}
                </button>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
};

export default UserManagement;
