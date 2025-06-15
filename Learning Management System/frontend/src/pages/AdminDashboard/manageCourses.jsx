import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import axios from "axios";

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
    console.log(res.data);
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
    if (editingCourse) {
      await axios.put(
        `http://localhost:5000/api/courses/${editingCourse._id}`,
        values
      );
    } else {
      await axios.post("http://localhost:5000/api/courses", values);
    }
    setModalVisible(false);
    form.resetFields();
    fetchCourses();
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    form.setFieldsValue(course);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/courses/${id}`);
    fetchCourses();
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
      dataIndex: ["teacherId", "name"],
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
        <Button
          type="primary"
          onClick={() => {
            setEditingCourse(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Add Course
        </Button>
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
