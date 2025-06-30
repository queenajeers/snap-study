import React, { useState } from "react";
import { Eye, FileText, Pencil, Star, StarOff } from "lucide-react";

export default function StudyNoteItem({
  name,
  sourcesCount,
  lastVisited,
  starred,
}) {
  const [isStarred, setIsStarred] = useState(starred);

  return (
    <tr className="cursor-pointer transition-colors duration-150">
      <td className="py-3 px-4 font-medium flex items-center gap-4">
        {" "}
        <FileText size={18} className="text-gray-400" />
        {name}
      </td>
      <td className="py-3 px-4">{sourcesCount}</td>
      <td className="py-3 px-4">{lastVisited}</td>
      <td className="py-3 px-4">
        <button
          onClick={() => setIsStarred((prev) => !prev)}
          className="text-gray-500 hover:text-gray-600 transition"
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
