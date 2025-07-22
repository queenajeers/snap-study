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

  const isDisabled = content.creationInProgress;

  return (
    <div
      onClick={handleClick}
      className={`relative rounded-xl bg-neutral-100 px-5 py-4 transition-colors ${
        isDisabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-neutral-500">Topic Name:</span>
        {isDisabled && (
          <div className="flex items-center text-neutral-600 text-xs gap-1">
            <Loader className="w-4 h-4 animate-spin" />
            Generating...
          </div>
        )}
      </div>

      <div className="text-base font-medium text-neutral-900">
        {content.topicNames || "Untitled Topic"}
      </div>
    </div>
  );
}

export default ContentListItem;
