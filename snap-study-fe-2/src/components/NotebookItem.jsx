import React from "react";
import { FileText, Zap, HelpCircle, BookOpen } from "lucide-react";

const NotebookItem = ({
  id,
  title,
  sources,
  flashcards,
  quizzes,
  caseStudies,
  onClick,
}) => {
  const handleClick = () => {
    onClick(id);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1"
    >
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#4CC490] transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Sources badge */}
        <div className="inline-flex items-center space-x-2 bg-[#4CC490]/10 text-[#4CC490] px-3 py-1.5 rounded-full text-sm font-medium">
          <FileText size={14} />
          <span>{sources} sources</span>
        </div>

        {/* Study materials */}
        <div className="flex flex-wrap gap-2">
          {flashcards > 0 && (
            <div className="inline-flex items-center space-x-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm">
              <Zap size={14} />
              <span>{flashcards} Flashcards</span>
            </div>
          )}

          {quizzes > 0 && (
            <div className="inline-flex items-center space-x-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm">
              <HelpCircle size={14} />
              <span>
                {quizzes} {quizzes === 1 ? "Quiz" : "Quizzes"}
              </span>
            </div>
          )}

          {caseStudies > 0 && (
            <div className="inline-flex items-center space-x-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm">
              <BookOpen size={14} />
              <span>
                {caseStudies} Case {caseStudies === 1 ? "Study" : "Studies"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotebookItem;
