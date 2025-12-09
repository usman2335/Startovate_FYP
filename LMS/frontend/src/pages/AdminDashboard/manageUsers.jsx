import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Select, Space } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const ManageUsers = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState([]);
  const [filteredRole, setFilteredRole] = useState("all");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BACKEND_BASE_URL}/api/users`);
      setUsers(response.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch users", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers =
    filteredRole === "all"
      ? users
      : users.filter((user) => user.role === filteredRole);
  console.log("Filtered Users:", filteredRole, filteredUsers);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Student", value: "student" },
        { text: "Teacher", value: "teacher" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => {
        let color = role === "student" ? "geekblue" : "green";
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (user) => {
    Swal.fire({
      title: "Edit User",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Name" value="${
          user.name || ""
        }" />
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${
          user.email || ""
        }" />
        <select id="swal-role" class="swal2-select">
          <option value="student" ${
            user.role === "student" ? "selected" : ""
          }>Student</option>
          <option value="teacher" ${
            user.role === "teacher" ? "selected" : ""
          }>Teacher</option>
          <option value="admin" ${
            user.role === "admin" ? "selected" : ""
          }>Admin</option>
        </select>
      `,
      confirmButtonText: "Update",
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById("swal-name").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const role = document.getElementById("swal-role").value;

        if (!name || !email || !role) {
          Swal.showValidationMessage("All fields are required");
          return false;
        }

        return { name, email, role };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedUser = result.value;

          const response = await axios.put(
            `${BACKEND_BASE_URL}/api/users/${user._id}`,
            updatedUser,
            { withCredentials: true } // ✅ ensure this if using cookies
          );

          Swal.fire("Updated!", "User updated successfully", "success");
          fetchUsers(); // Refresh user list
        } catch (error) {
          console.error("Error updating user:", error);
          Swal.fire(
            "Error",
            error.response?.data?.error || "Failed to update user",
            "error"
          );
        }
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_BASE_URL}/api/users/${id}`);
      Swal.fire("Deleted", "User has been deleted", "success");
      fetchUsers(); // Refresh list
    } catch (error) {
      Swal.fire("Error", "Failed to delete user", "error");
    }
  };

  const handleAddAdmin = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add Admin",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Name">
        <input id="swal-input2" class="swal2-input" placeholder="Email">
        <input id="swal-input3" class="swal2-input" placeholder="Password" type="password">`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const name = document.getElementById("swal-input1").value;
        const email = document.getElementById("swal-input2").value;
        const password = document.getElementById("swal-input3").value;

        if (!name || !email || !password) {
          Swal.showValidationMessage("All fields are required");
          return false;
        }

        return { name, email, password };
      },
    });

    if (formValues) {
      try {
        const response = await axios.post(
          `${BACKEND_BASE_URL}/api/users/createAdmin`,
          {
            ...formValues,
            role: "superadmin", // ensure the role is explicitly admin
          }
        );

        Swal.fire("Success", "Admin user added", "success");
        fetchUsers(); // Refresh the user list after addition
      } catch (error) {
        console.error("Add Admin Error:", error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to add admin",
          "error"
        );
      }
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2>Manage Users</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddAdmin}>
          Add Admin
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Select
          value={filteredRole}
          onChange={setFilteredRole}
          style={{ width: 200 }}
        >
          <Option value="all">All Roles</Option>
          <Option value="student">Student</Option>
          <Option value="teacher">Teacher</Option>
        </Select>
      </div>

      <Table columns={columns} dataSource={filteredUsers} rowKey="_id" />
    </div>
  );
};

export default ManageUsers;
