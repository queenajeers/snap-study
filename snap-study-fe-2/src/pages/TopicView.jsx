import React, { useEffect, useState } from "react";
import { Plus, FileText, Loader } from "lucide-react";
import { TopicSelectionScreen } from "./TopicSelectionScreen";
import { useParams } from "react-router-dom";
import { ref, onValue, off } from "firebase/database";
import { database } from "../../firebaseInit";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

function TopicView() {
  const [topic, setTopic] = useState(null);
  const [content, setContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();

  if (!user) return;

  useEffect(() => {
    const topicRef = ref(database, `users/${user.uid}/projects/${id}`);

    const unsubscribe = onValue(topicRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log(data);
        setTopic(data);
      } else {
        setTopic(null);
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
      console.log("Sending:");
      console.log(data);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {topic?.title || "Untitled Topic"}
            </h1>
          </div>

          {/* Sources count */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Total Sources Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <FileText className="w-4 h-4" />
              {topic?.sources ? Object.keys(topic.sources).length : 0} source
              {topic?.sources && Object.keys(topic.sources).length !== 1 && "s"}
            </div>

            {/* Processing Docs Badges */}
            {topic?.sources &&
              Object.entries(topic.sources)
                .filter(([_, source]) => source.processingFinished === false)
                .map(([key, source]) => (
                  <div
                    key={key}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                  >
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>{source.name || "Unnamed"}</span>
                  </div>
                ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Generate
          </button>
        </div>

        {/* No Topics Message */}
        {topic && topic.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No items generated yet
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by generating your first knowledge item
            </p>
          </div>
        ) : (
          // Topic Cards Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
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
