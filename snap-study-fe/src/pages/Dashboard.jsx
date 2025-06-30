import React from "react";
import ZeroNotes from "./ZeroNotes";
import StudyNoteItem from "../elements/StudyNoteItem";
import { Plus } from "lucide-react";

const notes = [
  {
    id: 1,
    name: "Biology - Cell Structure",
    sources: ["chapter1.pdf", "lecture-notes.docx"],
    lastVisited: "1 days ago",
    starred: false,
  },
  {
    id: 2,
    name: "World History - WW2",
    sources: ["timeline.png", "primary-sources.pdf", "notes.txt"],
    lastVisited: "4 days ago",
    starred: false,
  },
  {
    id: 3,
    name: "Calculus - Derivatives",
    sources: [],
    lastVisited: "7 days ago",
    starred: false,
  },
  {
    id: 3,
    name: "Calculus - Derivatives",
    sources: [],
    lastVisited: "7 days ago",
    starred: false,
  },
  {
    id: 3,
    name: "Calculus - Derivatives",
    sources: [],
    lastVisited: "7 days ago",
    starred: false,
  },
  {
    id: 3,
    name: "Calculus - Derivatives",
    sources: [],
    lastVisited: "7 days ago",
    starred: false,
  },
  {
    id: 3,
    name: "Calculus - Derivatives",
    sources: [],
    lastVisited: "7 days ago",
    starred: false,
  },
  {
    id: 3,
    name: "Calculus - Derivatives",
    sources: [],
    lastVisited: "7 days ago",
    starred: false,
  },
  {
    id: 3,
    name: "Calculus - Derivatives",
    sources: [],
    lastVisited: "7 days ago",
    starred: false,
  },
  {
    id: 3,
    name: "Calculus - Derivatives",
    sources: [],
    lastVisited: "7 days ago",
    starred: false,
  },
  {
    id: 3,
    name: "Calculus - Derivatives",
    sources: [],
    lastVisited: "7 days ago",
    starred: false,
  },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto pt-14 px-4 text-white">
      <p className="text-5xl font-bold mb-10 ">Welcome to Snap Study!</p>
      <button className="group relative inline-flex items-center gap-2 text-sm bg-white text-black py-2 px-5 rounded-full overflow-hidden border border-white shadow-md transition-all duration-300 hover:bg-black hover:text-white active:scale-95">
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shine" />
        <Plus width={18} />
        <span className="relative z-10">Add StudyNote</span>
      </button>

      {notes.length === 0 ? (
        <ZeroNotes />
      ) : (
        <div className="mt-10 max-h-[400px] overflow-y-auto rounded-lg border border-gray-700">
          <table className="min-w-full table-fixed text-sm text-left text-white">
            <thead className="bg-gray-900 sticky top-0 z-10">
              <tr className="text-gray-400">
                <th className="py-3 px-4 w-1/3">Topic</th>
                <th className="py-3 px-4 w-1/6">Sources</th>
                <th className="py-3 px-4 w-1/4">Last Visited</th>
                <th className="py-3 px-4 w-1/6">Star</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {notes.map((note, idx) => (
                <StudyNoteItem
                  key={idx}
                  name={note.name}
                  sourcesCount={note.sources.length}
                  lastVisited={note.lastVisited}
                  starred={note.starred}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
