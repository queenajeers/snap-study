import React from "react";
import { Brain, FilePlus, Lightbulb, Upload, Users } from "lucide-react";

export default function ZeroNotes() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
      <div className="relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-purple-500/30 p-8 rounded-3xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-3xl opacity-0 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Smart Ingestion
          </h3>
          <p className="text-gray-300 leading-relaxed">
            Create your StudyNote and instantly upload your materials. StudyNote
            understands your content and gets you ready to learn.
          </p>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-blue-900/50 to-teal-900/50 backdrop-blur-xl border border-blue-500/30 p-8 rounded-3xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-teal-600/10 rounded-3xl opacity-0 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Quiz Generator</h3>
          <p className="text-gray-300 leading-relaxed">
            StudyNote generates quizzes from your notes. Practice with questions
            tailored to your study material.
          </p>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-xl border border-green-500/30 p-8 rounded-3xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 rounded-3xl opacity-0 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Mnemonic Magic</h3>
          <p className="text-gray-300 leading-relaxed">
            StudyNote suggests mnemonics based on your notes, making it easier
            to remember key concepts.
          </p>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border border-orange-500/30 p-8 rounded-3xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-red-600/10 rounded-3xl opacity-0 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Case Simulations
          </h3>
          <p className="text-gray-300 leading-relaxed">
            Have smart conversations with StudyNote. Simulate real-world cases
            and discuss them directly with your notes.
          </p>
        </div>
      </div>
    </div>
  );
}
