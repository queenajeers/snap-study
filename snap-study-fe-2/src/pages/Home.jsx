import React from "react";
import { FolderPlus, FileUp, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen px-4 py-16 flex items-center justify-center">
      <div className="max-w-5xl w-full text-center space-y-12">
        <div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            SnapStudy
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            A simple study tool that helps you convert your PDFs into clean,
            focused flashcards. No clutter. No distractions. Just smarter
            studying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <FolderPlus className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Step 1: Create a Topic
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Start by organizing your study material under a topic. Each topic
              can hold multiple sources.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <FileUp className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Step 2: Upload PDFs
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Add PDF files to your topic. Our AI instantly turns them into
              flashcards for review and practice.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Step 3: Practice
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Study your flashcards right away or test yourself to reinforce
              knowledge — all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
