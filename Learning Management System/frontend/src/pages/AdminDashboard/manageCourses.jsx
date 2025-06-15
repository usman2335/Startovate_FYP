import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import axios from "axios";
import Swal from "sweetalert2";

const { Option } = Select;

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form] = Form.useForm();

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:5000/api/courses/all", {
      withCredentials: true,
    });
    console.log("course", res.data);
    //console.log("Courses fetched successfully");
    setCourses(res.data.courses);
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      const allUsers = res.data;

      if (Array.isArray(allUsers)) {
        const teacherUsers = allUsers.filter((user) => user.role === "teacher");
        setTeachers(teacherUsers);
        console.log("Teachers fetched successfully:", teacherUsers);
      } else {
        console.error("Expected an array of users, got:", allUsers);
      }
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const handleSubmit = async (values) => {
    const payload = {
      ...values, // ✅ rename before sending
    };

    try {
      if (editingCourse) {
        await axios.put(
          `http://localhost:5000/api/courses/${editingCourse._id}`,
          payload,
          { withCredentials: true }
        );
      } else {
        await axios.post("http://localhost:5000/api/courses", payload, {
          withCredentials: true,
        });
      }

      setModalVisible(false);
      form.resetFields();
      fetchCourses();
    } catch (err) {
      console.error("Course submission failed:", err);
      Swal.fire("Error", "Failed to submit course. Try again.", "error");
    }
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    form.setFieldsValue(course);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "This action will delete the course permanently.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirm.isConfirmed) {
        await axios.delete(`http://localhost:5000/api/courses/admin/${id}`, {
          withCredentials: true,
        });

        Swal.fire("Deleted!", "The course has been deleted.", "success");
        fetchCourses();
      }
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire("Error", "Failed to delete course. Try again.", "error");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Teacher",
      dataIndex: "instructorName",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button onClick={() => openEditModal(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Manage Courses</h2>
      </div>

      <Table columns={columns} dataSource={courses} rowKey="_id" />

      <Modal
        title={editingCourse ? "Edit Course" : "Add Course"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="teacherId"
            label="Assign Teacher"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select a teacher">
              {teachers.map((teacher) => (
                <Option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCourses;
