import React from "react";
import NotebookItem from "./NotebookItem";

const NotebookList = ({ notebooks, onNotebookClick }) => {
  if (notebooks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-lg mb-2">No notebooks yet</div>
        <div className="text-gray-500">
          Create your first notebook to get started
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notebooks.map((notebook) => (
        <NotebookItem
          key={notebook.id}
          id={notebook.id}
          title={notebook.title}
          sources={notebook.sources}
          flashcards={notebook.flashcards}
          quizzes={notebook.quizzes}
          caseStudies={notebook.caseStudies}
          onClick={onNotebookClick}
        />
      ))}
    </div>
  );
};

export default NotebookList;
