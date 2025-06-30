// components/EmptyState.jsx
import React from "react";
import { FilePlus } from "lucide-react";

export default function ZeroNotes() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FilePlus className="w-12 h-12 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold">Create your first StudyNotes</h2>
      <p className="text-gray-500 mt-2">
        Organize your study materials easily and track your progress.
      </p>
    </div>
  );
}
