import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";

function ContentListItem({ contentId, content }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!content.creationInProgress) {
      navigate(`/topic/${id}/content/${contentId}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer bg-white rounded-2xl shadow p-4 border border-gray-200 hover:shadow-md transition-shadow ${
        content.creationInProgress ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-500">Topic Name:</div>
        {content.creationInProgress && (
          <div className="flex items-center text-yellow-600 text-xs font-medium gap-1">
            <Loader className="w-4 h-4 animate-spin" />
            Generating...
          </div>
        )}
      </div>
      <div className="text-base font-semibold text-gray-900">
        {content.topicNames || "Untitled Topic"}
      </div>
    </div>
  );
}

export default ContentListItem;
