import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Select, Space } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredRole, setFilteredRole] = useState("all");

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
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

  const columns = [
    {
      title: "name",
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
    Swal.fire("Edit User", `Edit functionality for ${user.name}`, "info");
    // You can show a modal here for editing
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      Swal.fire("Deleted", "User has been deleted", "success");
      fetchUsers(); // Refresh list
    } catch (error) {
      Swal.fire("Error", "Failed to delete user", "error");
    }
  };

  const handleAddAdmin = () => {
    Swal.fire("Add Admin", "Open modal for creating a new admin", "info");
    // Open your modal or redirect to form page
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
          <Option value="admin">Teacher</Option>
        </Select>
      </div>

      <Table columns={columns} dataSource={filteredUsers} rowKey="_id" />
    </div>
  );
};

export default ManageUsers;
