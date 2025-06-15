import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Breadcrumb } from "antd";
import axios from "axios";
import YouTube from "react-youtube";

const StudentCoursePage = () => {
  const { id } = useParams(); // course ID
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
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
          setCurrentVideo(res.data.course.videos[0]); // default to first video
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
    if (!currentVideo) return null;

    const videoId = getYouTubeVideoId(currentVideo.url);

    const onPlayerReady = (event) => {
      const duration = event.target.getDuration();
      const player = event.target;

      let lastPercent = watchProgress[videoId] || 0;

      const interval = setInterval(() => {
        if (player.getPlayerState() !== 1) return; // Only track if playing

        const currentTime = player.getCurrentTime();
        const percent = Math.min((currentTime / duration) * 100, 100).toFixed(
          0
        );

        // Only update if progress increases
        if (percent > lastPercent) {
          lastPercent = percent;

          setWatchProgress((prev) => ({
            ...prev,
            [videoId]: parseInt(percent),
          }));
        }

        // Stop interval if video completed
        if (percent >= 100) {
          clearInterval(interval);
        }
      }, 1000);

      // Clear interval on component unmount or video change
      return () => clearInterval(interval);
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
  };

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
          <p className="text-gray-600 mb-4">
            Instructor: {course.instructorName || "Unknown"}
          </p>

          <div className="mb-6">{renderVideo()}</div>
        </div>

        {/* Playlist */}
        <div className="col-span-1">
          <h2 className="text-xl font-semibold mb-4">Course Playlist</h2>
          <div className="space-y-2">
            {course.videos.map((video, index) => {
              const videoId = getYouTubeVideoId(video.url);
              const isActive = currentVideo?.url === video.url;
              const progress = watchProgress[videoId] || 0;

              return (
                <div
                  key={index}
                  onClick={() => setCurrentVideo(video)}
                  className={`cursor-pointer p-3 rounded-lg border flex justify-between items-center ${
                    isActive
                      ? "bg-blue-50 border-blue-400"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-800">{video.title}</p>
                    <p className="text-xs text-gray-500">
                      {video.type.toUpperCase()}
                    </p>
                  </div>

                  <div className="text-sm text-blue-600 font-semibold">
                    {typeof progress === "number" && progress > 0
                      ? `${progress}%`
                      : "Not started"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCoursePage;
