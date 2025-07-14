import React, { useState } from "react";
import Header from "../components/Header";
import CreateNewButton from "../components/CreateNewButton";
import NotebookList from "../components/NotebookList";
import { useAuth } from "../contexts/AuthContext";

const sampleNotebooks = [
  {
    id: "1",
    title: "Cellular Respiration",
    sources: 57,
    flashcards: 0,
    quizzes: 0,
    caseStudies: 0,
    lastOpened: "Jun 30, 2025",
  },
  {
    id: "2",
    title: "Machine Learning Fundamentals",
    sources: 12,
    flashcards: 18,
    quizzes: 2,
    caseStudies: 1,
    lastOpened: "Jul 1, 2025",
  },
  {
    id: "3",
    title: "Climate Change Impact Analysis",
    sources: 5,
    flashcards: 15,
    quizzes: 1,
    caseStudies: 3,
    lastOpened: "Jul 8, 2025",
  },
  {
    id: "4",
    title: "Sustainable Energy Solutions",
    sources: 8,
    flashcards: 12,
    quizzes: 2,
    caseStudies: 2,
    lastOpened: "Jul 9, 2025",
  },
  {
    id: "5",
    title: "Quantum Physics Principles",
    sources: 23,
    flashcards: 31,
    quizzes: 4,
    caseStudies: 1,
    lastOpened: "Jul 10, 2025",
  },
  {
    id: "6",
    title: "Digital Marketing Strategies",
    sources: 15,
    flashcards: 20,
    quizzes: 3,
    caseStudies: 4,
    lastOpened: "Jul 11, 2025",
  },
];

function AllStudyMaterials() {
  const { user } = useAuth();
  const [notebooks] = useState(sampleNotebooks);

  const handleNotebookClick = (id) => {
    console.log("Opening notebook:", id);
    // Handle notebook opening
  };

  const handleCreateNew = () => {
    console.log("Creating new notebook");
    // Handle create new notebook
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8">
            Welcome, {user.displayName}
          </h2>

          <CreateNewButton onClick={handleCreateNew} />
        </div>

        <NotebookList
          notebooks={notebooks}
          onNotebookClick={handleNotebookClick}
        />
      </main>
    </div>
  );
}

export default AllStudyMaterials;
