import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Breadcrumb, Progress, Modal, Button, notification } from "antd";
import { FastForwardOutlined } from "@ant-design/icons";
import axios from "axios";
import YouTube from "react-youtube";

const StudentCoursePage = () => {
  const { id } = useParams(); // course ID
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [watchProgress, setWatchProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [showNextVideoModal, setShowNextVideoModal] = useState(false);
  const [nextVideoCountdown, setNextVideoCountdown] = useState(5);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setCourse(res.data.course);
          const firstLesson = res.data.course.videos?.[0]?.lessons?.[0];
          if (firstLesson) {
            setCurrentLesson(firstLesson);
            setCurrentChapterIndex(0);
            setCurrentLessonIndex(0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Auto-play next video countdown
  useEffect(() => {
    let countdownInterval;
    if (showNextVideoModal && nextVideoCountdown > 0) {
      countdownInterval = setInterval(() => {
        setNextVideoCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showNextVideoModal && nextVideoCountdown === 0) {
      playNextVideo();
      setShowNextVideoModal(false);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [showNextVideoModal, nextVideoCountdown]);

  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([^&?/]+)/);
    return match ? match[1] : null;
  };

  const getNextVideo = () => {
    if (!course?.videos) return null;

    const totalLessons = course.videos.reduce(
      (sum, chapter) => sum + chapter.lessons.length,
      0
    );
    const currentPosition =
      course.videos
        .slice(0, currentChapterIndex)
        .reduce((sum, chapter) => sum + chapter.lessons.length, 0) +
      currentLessonIndex;

    if (currentPosition >= totalLessons - 1) return null; // Last video

    let nextChapterIndex = currentChapterIndex;
    let nextLessonIndex = currentLessonIndex + 1;

    if (nextLessonIndex >= course.videos[currentChapterIndex].lessons.length) {
      nextChapterIndex = currentChapterIndex + 1;
      nextLessonIndex = 0;
    }

    return {
      lesson: course.videos[nextChapterIndex]?.lessons?.[nextLessonIndex],
      chapterIndex: nextChapterIndex,
      lessonIndex: nextLessonIndex,
      chapterTitle: course.videos[nextChapterIndex]?.chapterTitle,
    };
  };

  const playNextVideo = () => {
    const nextVideo = getNextVideo();
    if (nextVideo?.lesson) {
      setCurrentLesson(nextVideo.lesson);
      setCurrentChapterIndex(nextVideo.chapterIndex);
      setCurrentLessonIndex(nextVideo.lessonIndex);
    }
  };

  const renderVideo = () => {
    if (!currentLesson) return null;

    if (currentLesson.type === "youtube") {
      const videoId = getYouTubeVideoId(currentLesson.url);

      const onPlayerReady = (event) => {
        const duration = event.target.getDuration();
        const player = event.target;
        let lastPercent = watchProgress[videoId] || 0;

        const interval = setInterval(() => {
          if (player.getPlayerState() !== 1) return;

          const currentTime = player.getCurrentTime();
          const rawPercent = (currentTime / duration) * 100;
          const percent = Math.min(rawPercent, 100).toFixed(0);

          if (percent > lastPercent) {
            lastPercent = percent;

            setWatchProgress((prev) => ({
              ...prev,
              [videoId]: parseInt(percent),
            }));
            console.log("percent", percent);
            // 🔥 Save progress in backend
            axios.put(
              `http://localhost:5000/api/courses/progress`,
              {
                courseId: course._id,
                progress: calculateOverallProgress({
                  ...watchProgress,
                  [videoId]: parseInt(percent),
                }),
              },
              { withCredentials: true }
            );
          }

          if (percent >= 100) {
            clearInterval(interval);
            // Trigger auto-play next video
            handleVideoEnd();
          }
        }, 1000);
      };

      const handleVideoEnd = () => {
        const nextVideo = getNextVideo();
        if (nextVideo && autoplayEnabled) {
          setShowNextVideoModal(true);
          setNextVideoCountdown(5);
        } else if (!nextVideo) {
          notification.success({
            message: "Course Completed! 🎉",
            description: "Congratulations! You have completed this course.",
            duration: 5,
          });
        }
      };

      return (
        <YouTube
          videoId={videoId}
          opts={{
            height: "400",
            width: "100%",
            playerVars: {
              autoplay: 1,
            },
          }}
          onReady={onPlayerReady}
        />
      );
    }

    // Google Drive Support
    if (currentLesson.type === "drive") {
      const match = currentLesson.url.match(/\/file\/d\/(.*?)\//);
      const fileId = match ? match[1] : null;

      if (fileId) {
        return (
          <iframe
            src={`https://drive.google.com/file/d/${fileId}/preview`}
            width="100%"
            height="400"
            allow="autoplay"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        );
      } else {
        return (
          <p className="text-red-500 text-center">Invalid Google Drive link.</p>
        );
      }
    }

    return <p className="text-red-500 text-center">Unsupported video type.</p>;
  };

  const calculateOverallProgress = (progressObj) => {
    const totalLessons =
      course?.videos?.reduce(
        (sum, chapter) => sum + chapter.lessons.length,
        0
      ) || 0;
    const completedLessons = Object.values(progressObj).filter(
      (v) => v >= 90
    ).length;

    return totalLessons
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;
  };

  const totalLessons =
    course?.videos?.reduce((sum, chapter) => sum + chapter.lessons.length, 0) ||
    0;
  const completedLessons = Object.values(watchProgress).filter(
    (v) => v >= 90
  ).length;
  const overallProgress = calculateOverallProgress(watchProgress);

  if (loading) return <Spin className="mt-10 block mx-auto" size="large" />;
  if (!course)
    return <p className="text-center text-red-500">Course not found.</p>;

  return (
    <div className="px-8 py-6">
      {/* Breadcrumb and Back */}
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb
          items={[
            { title: "Dashboard" },
            { title: "My Courses" },
            { title: course.title },
          ]}
        />
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Video & Info */}
        <div className="md:col-span-3">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-600 mb-2">
            Instructor: {course.instructorName || "Unknown"}
          </p>
          <Progress
            percent={overallProgress}
            status="active"
            className="mb-4"
          />

          {/* Auto-play Controls */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoplayEnabled}
                  onChange={(e) => setAutoplayEnabled(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">
                  Auto-play next video
                </span>
              </label>
            </div>
            {getNextVideo() && (
              <Button
                type="primary"
                icon={<FastForwardOutlined />}
                onClick={playNextVideo}
                size="small"
              >
                Next Video →
              </Button>
            )}
          </div>

          <div className="mb-6">{renderVideo()}</div>
        </div>

        {/* Playlist */}
        <div className="col-span-1">
          <h2 className="text-xl font-semibold mb-4">Course Playlist</h2>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {course.videos.map((chapter, chapterIndex) => (
              <div key={chapterIndex}>
                <h3 className="font-semibold text-blue-700 mb-2">
                  {chapter.chapterTitle}
                </h3>
                {chapter.lessons.map((lesson, lessonIndex) => {
                  const videoId = getYouTubeVideoId(lesson.url) || lesson.url;
                  const isActive = currentLesson?.url === lesson.url;
                  const progress = watchProgress[videoId] || 0;

                  return (
                    <div
                      key={lessonIndex}
                      onClick={() => {
                        setCurrentLesson(lesson);
                        setCurrentChapterIndex(chapterIndex);
                        setCurrentLessonIndex(lessonIndex);
                      }}
                      className={`cursor-pointer p-3 rounded-lg border flex justify-between items-center ${
                        isActive
                          ? "bg-blue-50 border-blue-400"
                          : "hover:bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {lesson.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {lesson.type.toUpperCase()}
                        </p>
                      </div>

                      <div className="text-sm text-blue-600 font-semibold">
                        {progress > 0 ? `${progress}%` : "Not started"}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Video Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <FastForwardOutlined className="text-blue-600" />
            <span>Next Video Starting Soon</span>
          </div>
        }
        open={showNextVideoModal}
        onCancel={() => setShowNextVideoModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowNextVideoModal(false)}>
            Cancel
          </Button>,
          <Button key="skip" type="primary" onClick={playNextVideo}>
            Skip Countdown
          </Button>,
        ]}
        centered
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">
              {nextVideoCountdown}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {getNextVideo()?.lesson?.title}
          </h3>
          <p className="text-gray-600">
            Next video will start automatically in {nextVideoCountdown} seconds
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default StudentCoursePage;
