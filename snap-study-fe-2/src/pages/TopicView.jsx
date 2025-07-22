import React, { useEffect, useState } from "react";
import { Plus, FileText, Loader } from "lucide-react";
import { TopicSelectionScreen } from "./TopicSelectionScreen";
import { useParams } from "react-router-dom";
import { ref, onValue, off } from "firebase/database";
import { database } from "../../firebaseInit";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import ContentList from "../components/ContentList";

function TopicView() {
  const [topic, setTopic] = useState(null);
  const [contents, setContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();

  if (!user) return;

  useEffect(() => {
    const topicRef = ref(database, `users/${user.uid}/projects/${id}`);

    const unsubscribe = onValue(topicRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTopic(data);
        if (data.contents) {
          setContent(data.contents);
        }
      } else {
        setTopic(null);
        setContent(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user.uid, id]);

  const createContent = async (contentType, filePath, selectedTopics) => {
    const data = {
      uid: user.uid,
      project_id: id,
      content_type: contentType,
      filePath: filePath,
      selected_topics: selectedTopics,
    };
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/create_content",
        data
      );
      console.log("✅ Server response:", response.data);
    } catch (error) {
      console.error(
        "❌ Request failed:",
        error.response?.data || error.message
      );
    }
  };

  const isProcessing =
    topic?.sources &&
    Object.values(topic.sources).some(
      (source) => source.processingFinished === false
    );

  return (
    <div
      className={`min-h-screen bg-neutral-50 ${
        isProcessing ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-2">
            {topic?.title || "Untitled Topic"}
          </h1>

          {/* Source Info */}
          <div className="flex flex-wrap gap-2 text-sm text-neutral-700">
            {/* Source Count */}
            <div className="flex items-center gap-2 bg-neutral-200 text-neutral-800 px-3 py-1 rounded-full">
              <FileText className="w-4 h-4" />
              {topic?.sources ? Object.keys(topic.sources).length : 0} source
              {topic?.sources && Object.keys(topic.sources).length !== 1 && "s"}
            </div>

            {/* Loading Badges */}
            {topic?.sources &&
              Object.entries(topic.sources)
                .filter(([_, source]) => source.processingFinished === false)
                .map(([key, source]) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 bg-neutral-300 text-neutral-700 px-3 py-1 rounded-full"
                  >
                    <Loader className="w-4 h-4 animate-spin" />
                    {source.name || "Unnamed"}
                  </div>
                ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end mb-10">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl disabled:opacity-30 disabled:pointer-events-none"
          >
            <Plus className="w-5 h-5" />
            Generate
          </button>
        </div>

        {/* Content */}
        {!contents ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-medium text-neutral-900 mb-2">
              No items generated yet
            </h3>
            <p className="text-neutral-500">
              Get started by generating your first knowledge item
            </p>
          </div>
        ) : (
          <ContentList contents={contents} />
        )}
      </div>

      {/* Modal */}
      <TopicSelectionScreen
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={createContent}
        topic={topic}
      />
    </div>
  );
}

export default TopicView;
