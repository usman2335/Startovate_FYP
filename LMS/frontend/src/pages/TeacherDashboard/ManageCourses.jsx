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
  Select,
} from "antd";
import axios from "axios";
import { AuthContext } from "../../context/authContext.jsx";
import Swal from "sweetalert2";

const TeacherManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;
  const fetchCourses = async () => {
    const res = await axios.get(`${BACKEND_BASE_URL}/api/courses`, {
      withCredentials: true,
    });
    setCourses(res.data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const testApiCall = async () => {
    console.log("=== Testing API Call Directly ===");
    try {
      const testPayload = {
        title: "Test Course",
        description: "Test Description",
        price: 100,
        category: "Test",
        videos: [],
      };

      const response = await axios.put(
        `${BACKEND_BASE_URL}/api/courses/update/${editingCourse?._id}`,
        testPayload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Direct API call response:", response.data);
    } catch (error) {
      console.error("Direct API call error:", error);
    }
  };

  const handleSubmit = async (values) => {
    console.log("=== handleSubmit Function Called ===");
    console.log("Function called at:", new Date().toISOString());
    console.log("Values received:", values);
    console.log("Editing course:", editingCourse);
    if (submitting) {
      console.log("Already submitting, ignoring request");
      return;
    }

    setSubmitting(true);

    try {
      console.log("=== Frontend Update Course Debug ===");
      console.log("Editing course:", editingCourse);
      console.log("Form values:", values);

      // Transform videos data to match backend structure
      const transformedVideos =
        values.videos?.map((chapter) => ({
          chapterTitle: chapter.chapterTitle,
          lessons:
            chapter.lessons?.map((lesson) => ({
              title: lesson.title,
              type: lesson.type,
              url: lesson.url,
            })) || [],
        })) || [];

      const payload = {
        title: values.title,
        description: values.description,
        price: values.price,
        category: values.category,
        videos: transformedVideos,
      };

      console.log("Transformed payload:", payload);

      if (editingCourse) {
        console.log("Updating course with ID:", editingCourse._id);
        console.log(
          "Request URL:",
          `${BACKEND_BASE_URL}/api/courses/update/${editingCourse._id}`
        );

        const response = await axios.put(
          `${BACKEND_BASE_URL}/api/courses/update/${editingCourse._id}`,
          payload,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Update response:", response.data);

        if (response.data.success) {
          Swal.fire("Updated!", "The course has been edited.", "success");
          setModalVisible(false);
          form.resetFields();
          setEditingCourse(null);
          fetchCourses();
        } else {
          Swal.fire(
            "Error",
            response.data.error || "Failed to update course. Try again.",
            "error"
          );
        }
      } else {
        console.log("Creating new course");
        const response = await axios.post(
          `${BACKEND_BASE_URL}/api/courses`,
          {
            ...payload,
            instructor: user._id,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Create response:", response.data);

        if (response.data.success) {
          Swal.fire("Created!", "The course has been created.", "success");
          setModalVisible(false);
          form.resetFields();
          fetchCourses();
        } else {
          Swal.fire(
            "Error",
            response.data.message || "Failed to create course. Try again.",
            "error"
          );
        }
      }
    } catch (err) {
      console.error("Error saving course:", err);
      console.error("Error response:", err.response?.data);

      let errorMessage = "Failed to save course. Try again.";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = "Please log in again to save courses.";
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to modify this course.";
      } else if (err.response?.status === 404) {
        errorMessage = "Course not found.";
      } else if (err.code === "ERR_NETWORK") {
        errorMessage =
          "Unable to connect to the server. Please check your internet connection.";
      }

      Swal.fire("Error", errorMessage, "error");
    } finally {
      setSubmitting(false);
      console.log("=== handleSubmit Function Completed ===");
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
        console.log("=== Frontend Delete Course Debug ===");
        console.log("Deleting course with ID:", id);
        console.log("Request URL:", `${BACKEND_BASE_URL}/api/courses/${id}`);

        const response = await axios.delete(
          `${BACKEND_BASE_URL}/api/courses/${id}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Delete response:", response.data);

        if (response.data.success) {
          Swal.fire("Deleted!", "The course has been deleted.", "success");
          fetchCourses(); // Refresh the course list
        } else {
          Swal.fire(
            "Error",
            response.data.error || "Failed to delete course. Try again.",
            "error"
          );
        }
      }
    } catch (err) {
      console.error("Delete failed:", err);
      console.error("Error response:", err.response?.data);

      let errorMessage = "Failed to delete course. Try again.";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 401) {
        errorMessage = "Please log in again to delete courses.";
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to delete this course.";
      } else if (err.response?.status === 404) {
        errorMessage = "Course not found.";
      } else if (err.code === "ERR_NETWORK") {
        errorMessage =
          "Unable to connect to the server. Please check your internet connection.";
      }

      Swal.fire("Error", errorMessage, "error");
    }
  };
  const openEditModal = (course) => {
    console.log("=== Open Edit Modal Debug ===");
    console.log("Course data:", course);
    console.log("Course videos:", course.videos);

    setEditingCourse(course);

    // Transform videos data to match form structure
    const transformedVideos =
      course.videos?.map((chapter, chapterIndex) => ({
        chapterTitle: chapter.chapterTitle,
        lessons:
          chapter.lessons?.map((lesson, lessonIndex) => ({
            title: lesson.title,
            type: lesson.type,
            url: lesson.url,
            chapterIndex,
            lessonIndex,
          })) || [],
      })) || [];

    console.log("Transformed videos for form:", transformedVideos);

    // Set form values with proper data structure
    form.setFieldsValue({
      title: course.title,
      description: course.description,
      price: course.price,
      category: course.category,
      videos: transformedVideos,
    });

    setModalVisible(true);
  };

  const columns = [
    {
      title: "Course Title",
      dataIndex: "title",
      ellipsis: true,
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
      width: 250,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `PKR ${price}`,
      width: 100,
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "isApproved",
      render: (isApproved) => (
        <Tag color={isApproved ? "green" : "orange"}>
          {isApproved ? "✅ Approved" : "⏳ Pending"}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Content",
      render: (_, record) => {
        const totalLessons =
          record.videos?.reduce(
            (total, chapter) => total + (chapter.lessons?.length || 0),
            0
          ) || 0;
        return `${
          record.videos?.length || 0
        } chapters, ${totalLessons} lessons`;
      },
      width: 150,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => openEditModal(record)}
            icon="✏️"
          >
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record._id)} icon="🗑️">
            Delete
          </Button>
        </Space>
      ),
      width: 150,
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-[#fafafa] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-heading-2 text-[#1f1f1f] mb-2">
            📚 Your Courses
          </h1>
          <p className="text-body-sm text-[#535353]">
            Manage your course content, pricing, and settings
          </p>
        </div>
        <div className="text-right">
          <div className="text-heading-4 text-[#dc2626] font-bold">
            {courses.length} Course{courses.length !== 1 ? "s" : ""}
          </div>
          <div className="text-helper">
            {courses.filter((c) => c.isApproved).length} Approved
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-premium p-4 md:p-6">
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} courses`,
          }}
          scroll={{ x: 1000 }}
        />
      </div>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              {editingCourse ? "✏️ Edit Course" : "➕ Add New Course"}
            </span>
          </div>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingCourse(null);
        }}
        onOk={() => {
          console.log("=== Modal OK Button Clicked ===");
          console.log("Form instance:", form);
          console.log("Form fields:", form.getFieldsValue());
          console.log("Form validation:", form.validateFields());

          // Validate form before submitting
          form
            .validateFields()
            .then((values) => {
              console.log("Form validation passed, values:", values);
              form.submit();
            })
            .catch((errorInfo) => {
              console.log("Form validation failed:", errorInfo);
              console.log("Validation errors:", errorInfo.errorFields);
            });
        }}
        destroyOnClose
        width={800}
        style={{ top: 20 }}
        okText={editingCourse ? "Update Course" : "Create Course"}
        cancelText="Cancel"
        okButtonProps={{
          type: "primary",
          size: "large",
          loading: submitting,
          disabled: submitting,
        }}
        cancelButtonProps={{
          size: "large",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            console.log("=== Form onFinish Called ===");
            console.log("Form onFinish values:", values);
            handleSubmit(values);
          }}
        >
          {/* Test Button */}
          {editingCourse && (
            <div
              style={{
                marginBottom: "16px",
                padding: "8px",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
              }}
            >
              <Button
                type="dashed"
                onClick={testApiCall}
                style={{ marginBottom: "8px" }}
              >
                🧪 Test API Call Directly
              </Button>
              <div style={{ fontSize: "12px", color: "#666" }}>
                This button tests the API call directly without form validation
              </div>
            </div>
          )}
          <Form.Item
            name="title"
            label="Course Title"
            rules={[
              { required: true, message: "Please enter a course title!" },
            ]}
          >
            <Input placeholder="Enter course title" />
          </Form.Item>

          <Form.Item name="description" label="Course Description">
            <Input.TextArea
              rows={4}
              placeholder="Describe what students will learn in this course..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Course Price (PKR)"
            rules={[{ required: true, message: "Please enter a price!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter price in PKR"
              min={0}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Course Category"
            rules={[{ required: true, message: "Please enter a category!" }]}
          >
            <Input placeholder="e.g., Programming, Design, Business" />
          </Form.Item>

          {/* Enhanced Video Management */}
          <Form.List name="videos">
            {(fields, { add, remove }) => (
              <>
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: 16,
                    fontSize: "16px",
                    color: "#1890ff",
                  }}
                >
                  Course Content (Chapters & Lessons)
                </div>

                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      border: "1px solid #d9d9d9",
                      borderRadius: "6px",
                      padding: "16px",
                      marginBottom: "16px",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        marginBottom: "12px",
                        color: "#262626",
                      }}
                    >
                      Chapter {name + 1}
                    </div>

                    <Form.Item
                      {...restField}
                      name={[name, "chapterTitle"]}
                      label="Chapter Title"
                      rules={[
                        {
                          required: true,
                          message: "Please enter chapter title!",
                        },
                      ]}
                    >
                      <Input placeholder="e.g., Introduction to React" />
                    </Form.Item>

                    <Form.List name={[name, "lessons"]}>
                      {(
                        lessonFields,
                        { add: addLesson, remove: removeLesson }
                      ) => (
                        <>
                          <div
                            style={{
                              fontWeight: "500",
                              marginBottom: "8px",
                              color: "#595959",
                            }}
                          >
                            Lessons in this chapter:
                          </div>

                          {lessonFields.map(
                            ({
                              key: lessonKey,
                              name: lessonName,
                              ...lessonRestField
                            }) => (
                              <div
                                key={lessonKey}
                                style={{
                                  border: "1px solid #e8e8e8",
                                  borderRadius: "4px",
                                  padding: "12px",
                                  marginBottom: "8px",
                                  backgroundColor: "#fff",
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: "500",
                                    marginBottom: "8px",
                                    color: "#8c8c8c",
                                  }}
                                >
                                  Lesson {lessonName + 1}
                                </div>

                                <Space
                                  style={{ display: "flex", marginBottom: 8 }}
                                  align="baseline"
                                >
                                  <Form.Item
                                    {...lessonRestField}
                                    name={[lessonName, "title"]}
                                    label="Lesson Title"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please enter lesson title!",
                                      },
                                    ]}
                                    style={{ flex: 1 }}
                                  >
                                    <Input placeholder="Lesson title" />
                                  </Form.Item>

                                  <Form.Item
                                    {...lessonRestField}
                                    name={[lessonName, "type"]}
                                    label="Type"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please select type!",
                                      },
                                    ]}
                                    style={{ width: "120px" }}
                                  >
                                    <Select placeholder="Type">
                                      <Select.Option value="youtube">
                                        YouTube
                                      </Select.Option>
                                      <Select.Option value="drive">
                                        Google Drive
                                      </Select.Option>
                                    </Select>
                                  </Form.Item>

                                  <Button
                                    danger
                                    size="small"
                                    onClick={() => removeLesson(lessonName)}
                                    style={{ marginTop: "24px" }}
                                  >
                                    Remove Lesson
                                  </Button>
                                </Space>

                                <Form.Item
                                  {...lessonRestField}
                                  name={[lessonName, "url"]}
                                  label="Video URL"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter video URL!",
                                    },
                                    {
                                      type: "url",
                                      message: "Please enter a valid URL!",
                                    },
                                  ]}
                                >
                                  <Input placeholder="https://youtube.com/watch?v=..." />
                                </Form.Item>
                              </div>
                            )
                          )}

                          <Button
                            type="dashed"
                            onClick={() => addLesson()}
                            block
                            style={{ marginTop: "8px" }}
                          >
                            + Add Lesson to Chapter {name + 1}
                          </Button>
                        </>
                      )}
                    </Form.List>

                    <Button
                      danger
                      onClick={() => remove(name)}
                      style={{ marginTop: "12px" }}
                    >
                      Remove Chapter
                    </Button>
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  style={{ marginTop: "16px" }}
                >
                  + Add New Chapter
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
