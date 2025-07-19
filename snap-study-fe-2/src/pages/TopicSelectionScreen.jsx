import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import { BookText, Layers3, Brain } from "lucide-react"; // New icons

const CONTENT_TYPES = [
  { label: "Summary", icon: BookText },
  { label: "Flashcards", icon: Layers3 },
  { label: "Mnemonics", icon: Brain },
];

export const TopicSelectionScreen = ({ isOpen, onClose, onCreate, topic }) => {
  const [selectedType, setSelectedType] = useState("Quiz");
  const [selectedSourceKey, setSelectedSourceKey] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [creating, setCreating] = useState(false);
  const [sources, setSources] = useState([]);

  useEffect(() => {
    if (topic) {
      const processedSources = Object.entries(topic.sources).filter(
        ([_, source]) => source.processingFinished
      );
      setSources(processedSources);
    }
  }, [topic]);

  const toggleTopic = (topic, minPage, maxPage) => {
    setSelectedTopics((prev) => {
      const exists = prev.some(
        (t) =>
          t.topic === topic && t.minPage === minPage && t.maxPage === maxPage
      );

      if (exists) {
        return prev.filter(
          (t) =>
            !(
              t.topic === topic &&
              t.minPage === minPage &&
              t.maxPage === maxPage
            )
        );
      } else if (prev.length < 5) {
        return [...prev, { topic, minPage, maxPage }];
      }

      return prev;
    });
  };

  const handleCreate = async () => {
    if (!selectedTopics.length) return;
    try {
      setCreating(true);
      const targetSourceEntry = sources.find(
        ([key, _]) => key === selectedSourceKey
      );
      const [_, targetSource] = targetSourceEntry;
      if (targetSource) {
        await onCreate(selectedType, targetSource.filePath, selectedTopics);
        onClose();
        setSelectedTopics([]);
      } else {
        onClose();
        setSelectedTopics([]);
      }
    } catch (error) {
      console.error("Error creating content:", error);
      // optionally show an error message to the user
    } finally {
      setCreating(false);
    }
  };

  const giveTopicGroup = () => {
    const target = sources.find(([key]) => key === selectedSourceKey);
    if (!target) return [];

    const [, source] = target;
    const rawTopics = source?.topics;

    // Normalize to array
    const topicGroups = Array.isArray(rawTopics) ? rawTopics : [rawTopics];

    return topicGroups.map((group) => ({
      minPage: group?.pageRange?.[0] ?? 0,
      maxPage: group?.pageRange?.[1] ?? 0,
      label: `Page ${group?.pageRange?.[0] ?? 0}-${group?.pageRange?.[1] ?? 0}`,
      topics: Array.isArray(group?.topics) ? group.topics : [],
    }));
  };

  const topicGroups = giveTopicGroup();
  console.log("Topic Group Is:");
  console.log(topicGroups[0]?.topics);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white flex flex-col p-6 sm:p-8 z-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Generate Content
        </h1>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content Type */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 mb-1 block">Content Type</label>
        <div className="flex gap-2">
          {CONTENT_TYPES.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setSelectedType(label)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
                selectedType === label
                  ? "bg-black text-white"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Source Selector */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 mb-1 block">Source</label>
        <div className="relative">
          <select
            className="appearance-none w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-black pr-10"
            value={selectedSourceKey}
            onChange={(e) => {
              setSelectedSourceKey(e.target.value);
              setSelectedTopics([]);
            }}
          >
            <option value="">Select source</option>
            {sources.map(([key, source]) => (
              <option key={key} value={key}>
                {source.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Topic Selection - Now Scrollable */}
      {selectedSourceKey && (
        <div className="flex-1 mb-6 flex flex-col min-h-0">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Topics</span>
            <span className="text-xs text-gray-400">
              {selectedTopics.length}/5
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            {topicGroups.map((group, index) => (
              <div key={index} className="mb-3">
                <div className="text-xs text-gray-400 mb-1">{group.label}</div>
                <div className="flex flex-wrap gap-2">
                  {group.topics.map((topic) => {
                    const isSelected = selectedTopics.some(
                      (t) => t.topic === topic
                    );
                    const isDisabled =
                      !isSelected && selectedTopics.length >= 5;
                    return (
                      <button
                        key={topic}
                        onClick={() =>
                          toggleTopic(topic, group.minPage, group.maxPage)
                        }
                        disabled={isDisabled}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          isSelected
                            ? "bg-black text-white"
                            : isDisabled
                            ? "border-gray-200 text-gray-300 cursor-not-allowed"
                            : "border-gray-300 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {selectedTopics.length === 0 && (
        <p className="text-xs text-red-500 mb-2">
          Select at least one topic to proceed
        </p>
      )}
      {selectedTopics.length >= 5 && (
        <p className="text-xs text-amber-600 mb-2">
          Maximum of 5 topics can be selected
        </p>
      )}

      {/* Create Button */}
      <button
        onClick={handleCreate}
        disabled={!selectedTopics.length || creating}
        className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
          !selectedTopics.length || creating
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {creating ? "Creating..." : `Create ${selectedType}`}
      </button>

      {/* Spinner Overlay */}
      {creating && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">
              Generating {selectedType}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
