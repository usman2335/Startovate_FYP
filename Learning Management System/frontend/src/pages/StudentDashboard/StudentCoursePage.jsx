import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Breadcrumb, Progress } from "antd";
import axios from "axios";
import YouTube from "react-youtube";

const StudentCoursePage = () => {
  const { id } = useParams(); // course ID
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [watchProgress, setWatchProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setCourse(res.data.course);
          const firstLesson = res.data.course.videos?.[0]?.lessons?.[0];
          if (firstLesson) setCurrentLesson(firstLesson);
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([^&?/]+)/);
    return match ? match[1] : null;
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
          }
        }, 1000);
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
                      onClick={() => setCurrentLesson(lesson)}
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
    </div>
  );
};

export default StudentCoursePage;
