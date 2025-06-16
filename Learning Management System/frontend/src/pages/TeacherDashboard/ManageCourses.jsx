import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tag,
  InputNumber,
  Space,
} from "antd";
import axios from "axios";
import { AuthContext } from "../../context/authContext.jsx";
import Swal from "sweetalert2";

const TeacherManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState();
  const [form] = Form.useForm();
  const { user } = useContext(AuthContext);

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:5000/api/courses", {
      withCredentials: true,
    });
    setCourses(res.data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editingCourse) {
        console.log(editingCourse._id);
        await axios.put(
          `http://localhost:5000/api/courses/update/${editingCourse._id}`,
          values,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/courses",
          {
            ...values,
            instructor: user._id,
          },
          { withCredentials: true }
        );
      }

      setModalVisible(false);
      form.resetFields();
      setEditingCourse(null);
      Swal.fire("Updated!", "The course has been edited.", "success");
      fetchCourses();
    } catch (err) {
      console.error("Error saving course:", err);
    }
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
        await axios.delete(`http://localhost:5000/api/courses/${id}`, {
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
  const openEditModal = (course) => {
    setEditingCourse(course);
    // Flatten videos for form if needed
    form.setFieldsValue({
      title: course.title,
      description: course.description,
      price: course.price,
      category: course.category,
      videos: course.videos || [],
    });
    setModalVisible(true);
  };

  const columns = [
    { title: "Title", dataIndex: "title" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Status",
      dataIndex: "isApproved",
      render: (isApproved) => (
        <Tag color={isApproved ? "green" : "orange"}>
          {isApproved ? "Approved" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Enrolled Students",
      render: (_, record) => record.students?.length || 0,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openEditModal(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Your Courses</h1>
        {/* <Button
          type="primary"
          onClick={() => {
            setEditingCourse(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Add Course
        </Button> */}
      </div>

      <Table columns={columns} dataSource={courses} rowKey="_id" />

      <Modal
        title={editingCourse ? "Edit Course" : "Add Course"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingCourse(null);
        }}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Input />
          </Form.Item>

          {/* Video Handling - Just text for now */}
          <Form.List name="videos">
            {(fields, { add, remove }) => (
              <>
                <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                  Videos
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "title"]}
                      rules={[{ required: true }]}
                      style={{ width: "30%" }}
                    >
                      <Input placeholder="Title" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "type"]}
                      rules={[{ required: true }]}
                      style={{ width: "20%" }}
                    >
                      <Input placeholder="Type (youtube/drive)" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "url"]}
                      rules={[{ required: true }]}
                      style={{ width: "40%" }}
                    >
                      <Input placeholder="URL" />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>
                      Remove
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Add Video
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherManageCourses;
