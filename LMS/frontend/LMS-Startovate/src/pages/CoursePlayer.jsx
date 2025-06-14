import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import courses from "../data/CourseData";
import "../CSS/CoursePlayer.css"; //  Make sure this file exists and contains your provided CSS

const CoursePlayer = () => {
  const { courseId } = useParams();
  const course = courses.find(c => c.id === courseId);

  const [videos, setVideos] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState("");

  useEffect(() => {
    if (!course || !course.playlistId) return;

    const playlistId = course.playlistId;
    const API_KEY = "AIzaSyBXuYAPF5Lfz5ae_ECzWcaUTksqF5cUErE";

    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=${API_KEY}`;

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        if (!data.items) {
          console.error("YouTube API Error:", data);
          return;
        }

        const vids = data.items.map(item => ({
          videoId: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.default.url,
        }));

        setVideos(vids);
        if (vids[0]) setCurrentVideoId(vids[0].videoId);
      })
      .catch(err => console.error("Fetch error:", err));
  }, [course]);

  if (!course) return <p>Course not found.</p>;
  if (!course.playlistId) return <p>⚠️ This course has no playlist ID configured.</p>;

  return (
    <div className="course-player">
        <div className="vector-bg-circle"></div>
      <div className="vector-bg-rotated"></div>
      <div className="vector-bg-blob"></div>
      <h2>{course.title}</h2>

      <div>
        {currentVideoId && (
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${currentVideoId}`}
            title="Course Player"
            allowFullScreen
          />
        )}
      </div>

      <div className="playlist-ui">
        <ul className="playlist-list">
          {videos.map(video => (
            <li
              key={video.videoId}
              onClick={() => setCurrentVideoId(video.videoId)}
              className={`playlist-item ${
                video.videoId === currentVideoId ? "active" : ""
              }`}
            >
              <img src={video.thumbnail} alt={video.title} />
              <div>
                <p style={{ fontSize: "0.9rem", margin: 0 }}>{video.title}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CoursePlayer;
