import React, { useContext } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Space,
  Divider,
  Typography,
  Row,
  Col,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/authContext";

const { Title } = Typography;
const { Option } = Select;

const AddCoursePage = ({ onCourseAdded }) => {
  const [form] = Form.useForm();
  const { user } = useContext(AuthContext);

  const handleFinish = async (values) => {
    try {
      const payload = {
        ...values,
        instructor: user._id,
      };

      await axios.post("http://localhost:5000/api/courses", payload, {
        withCredentials: true,
      });

      Swal.fire("Added!", "Course added successfully", "success");
      form.resetFields();
      if (onCourseAdded) onCourseAdded();
    } catch (err) {
      console.error("Error creating course:", err);
      Swal.fire("Error", "Failed to add course", "error");
    }
  };

  return (
    <div style={{ padding: "24px 48px", maxWidth: 1000, margin: "auto" }}>
      <Title level={2}>Add New Course</Title>
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          videos: [
            {
              chapterTitle: "",
              lessons: [{ title: "", type: "youtube", url: "" }],
            },
          ],
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Course Title"
              rules={[
                { required: true, message: "Please enter a course title" },
              ]}
            >
              <Input placeholder="e.g. React Fundamentals" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="price"
              label="Price (USD)"
              rules={[{ required: true, message: "Please enter the price" }]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Brief description about the course" />
        </Form.Item>

        <Form.Item name="category" label="Category">
          <Input placeholder="e.g. Web Development, Design..." />
        </Form.Item>

        <Divider orientation="left">Chapters & Videos</Divider>

        <Form.List name="videos">
          {(chapterFields, { add: addChapter, remove: removeChapter }) => (
            <>
              {chapterFields.map(({ key: chapterKey, name: chapterName }) => (
                <div
                  key={chapterKey}
                  style={{
                    marginBottom: 24,
                    border: "1px solid #ccc",
                    padding: 16,
                    borderRadius: 8,
                  }}
                >
                  <Form.Item
                    name={[chapterName, "chapterTitle"]}
                    label="Chapter Title"
                    rules={[
                      { required: true, message: "Please enter chapter title" },
                    ]}
                  >
                    <Input placeholder="e.g. Introduction to React" />
                  </Form.Item>

                  <Form.List name={[chapterName, "lessons"]}>
                    {(videoFields, { add: addVideo, remove: removeVideo }) => (
                      <>
                        {videoFields.map(
                          ({ key: videoKey, name: videoName }) => (
                            <Space
                              key={videoKey}
                              align="baseline"
                              style={{
                                display: "flex",
                                marginBottom: 8,
                                flexWrap: "wrap",
                              }}
                            >
                              <Form.Item
                                name={[videoName, "title"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Enter video title",
                                  },
                                ]}
                              >
                                <Input placeholder="Video Title" />
                              </Form.Item>
                              <Form.Item
                                name={[videoName, "type"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Select video type",
                                  },
                                ]}
                              >
                                <Select style={{ width: 120 }}>
                                  <Option value="youtube">YouTube</Option>
                                  <Option value="drive">Drive</Option>
                                </Select>
                              </Form.Item>
                              <Form.Item
                                name={[videoName, "url"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Enter video URL",
                                  },
                                ]}
                              >
                                <Input placeholder="https://..." />
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() => removeVideo(videoName)}
                              />
                            </Space>
                          )
                        )}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => addVideo()}
                            icon={<PlusOutlined />}
                          >
                            Add Lesson
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Button
                    type="link"
                    danger
                    onClick={() => removeChapter(chapterName)}
                  >
                    Remove Chapter
                  </Button>
                </div>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => addChapter()}
                  icon={<PlusOutlined />}
                  block
                >
                  Add Chapter
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Course
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCoursePage;
