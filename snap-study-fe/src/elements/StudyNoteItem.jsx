import React, { useState } from "react";
import { FileText, Star } from "lucide-react";

export default function StudyNoteItem({
  name,
  sourcesCount,
  lastVisited,
  starred,
}) {
  const [isStarred, setIsStarred] = useState(starred);

  return (
    <tr className="cursor-pointer transition duration-150 group">
      <td className="py-3 px-4 font-medium flex items-center gap-3">
        <FileText
          size={18}
          className="text-gray-400 transition-transform duration-200 group-hover:scale-105"
        />
        <span className="transition-transform duration-200 group-hover:scale-105">
          {name}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="transition-transform duration-200 group-hover:scale-105 inline-block">
          {sourcesCount}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="transition-transform duration-200 group-hover:scale-105 inline-block">
          {lastVisited}
        </span>
      </td>
      <td className="py-3 px-4">
        <button
          onClick={() => setIsStarred((prev) => !prev)}
          className="text-gray-500 transition-transform duration-200 hover:scale-110"
        >
          {isStarred ? (
            <Star size={18} fill="white" stroke="white" />
          ) : (
            <Star size={18} />
          )}
        </button>
      </td>
    </tr>
  );
}
