import React from "react";
import ContentListItem from "./ContentListItem"; // adjust path as needed

function ContentList({ contents }) {
  if (!contents || Object.keys(contents).length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-gray-400 text-4xl">📄</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No content available
        </h3>
        <p className="text-gray-500">Generate content to see it listed here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(contents).map(([contentId, content]) => (
        <ContentListItem
          key={contentId}
          contentId={contentId}
          content={content}
        />
      ))}
    </div>
  );
}

export default ContentList;
