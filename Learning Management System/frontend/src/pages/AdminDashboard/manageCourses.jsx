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
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchCourses = async () => {
    const res = await axios.get(`${BACKEND_BASE_URL}/api/courses/all`, {
      withCredentials: true,
    });
    console.log("course", res.data);
    //console.log("Courses fetched successfully");
    setCourses(res.data.courses);
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${BACKEND_BASE_URL}/api/users`);
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
          `${BACKEND_BASE_URL}/api/courses/${editingCourse._id}`,
          payload,
          { withCredentials: true }
        );
      } else {
        await axios.post(`${BACKEND_BASE_URL}/api/courses`, payload, {
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
        await axios.delete(`${BACKEND_BASE_URL}/api/courses/admin/${id}`, {
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
    <div className="p-4 md:p-6 bg-[#fafafa] min-h-screen">
      <h2 className="text-heading-2 text-[#1f1f1f] mb-6">Manage Courses</h2>
      <div className="bg-white rounded-xl shadow-premium p-4 md:p-6">
        <Table columns={columns} dataSource={courses} rowKey="_id" />
      </div>

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
