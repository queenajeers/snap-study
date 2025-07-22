import React, { useState, useEffect, useRef } from "react";
import { MoreHorizontal, FileText } from "lucide-react";
import { TopicActions } from "./TopicActions";
import { off, onValue, ref } from "firebase/database";
import { database } from "../../firebaseInit";
import { useNavigate } from "react-router-dom";

export const TopicCard = ({
  topic,
  onEditTitle,
  onDeleteTopic,
  onAddSources,
  onDeleteSources,
  uid,
}) => {
  const [showActions, setShowActions] = useState(false);
  const menuRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const uploadStatusRef = useRef(null);
  const navigate = useNavigate();

  const onCardClicked = () => {
    if (!topic.isLoading) {
      navigate(`topic/${topic.id}/`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActions]);

  useEffect(() => {
    if (!uid || !topic.id) return;

    const uploadStatusPath = `users/${uid}/projects/${topic.id}/upload_status`;
    uploadStatusRef.current = ref(database, uploadStatusPath);

    const unsubscribe = onValue(uploadStatusRef.current, (snapshot) => {
      const upload_status = snapshot.val();
      setUploadStatus(upload_status?.progress || 0);
    });

    return () => {
      if (uploadStatusRef.current) {
        off(uploadStatusRef.current);
      }
    };
  }, [uid, topic.id]);

  return (
    <div
      onClick={onCardClicked}
      className={`bg-neutral-100 rounded-2xl p-6 relative cursor-pointer transition-colors duration-200 ${
        topic.isLoading ? "pointer-events-none opacity-70" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-medium text-neutral-900 mb-1">
            {topic.title}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-neutral-500">
            <FileText className="w-4 h-4" />
            <span>{topic.sources.length} sources</span>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-1 rounded-md"
          >
            <MoreHorizontal className="w-5 h-5 text-neutral-500" />
          </button>
          {showActions && (
            <div onClick={(e) => e.stopPropagation()}>
              <TopicActions
                topic={topic}
                onEditTitle={onEditTitle}
                onDeleteTopic={onDeleteTopic}
                onAddSources={onAddSources}
                onDeleteSources={onDeleteSources}
                onClose={() => setShowActions(false)}
              />
            </div>
          )}
        </div>
      </div>

      {topic.isLoading && (
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className="bg-neutral-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${uploadStatus}%` }}
          />
        </div>
      )}
    </div>
  );
};
