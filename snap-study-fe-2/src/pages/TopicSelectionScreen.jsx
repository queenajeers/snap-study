import React, { useEffect, useState } from "react";
import { X, BookText, Layers3, Brain } from "lucide-react";
import { useParams } from "react-router-dom";

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
      const [_, source] = sources.find(([key]) => key === selectedSourceKey);
      if (source) {
        await onCreate(selectedType, source.filePath, selectedTopics);
      }
      onClose();
      setSelectedTopics([]);
    } catch (error) {
      console.error("Error creating content:", error);
    } finally {
      setCreating(false);
    }
  };

  const topicGroups = (() => {
    const target = sources.find(([key]) => key === selectedSourceKey);
    if (!target) return [];
    const [, source] = target;
    const rawTopics = source?.topics;
    const normalized = Array.isArray(rawTopics) ? rawTopics : [rawTopics];
    return normalized.map((group) => ({
      minPage: group?.pageRange?.[0] ?? 0,
      maxPage: group?.pageRange?.[1] ?? 0,
      label: `Page ${group?.pageRange?.[0] ?? 0}-${group?.pageRange?.[1] ?? 0}`,
      topics: Array.isArray(group?.topics) ? group.topics : [],
    }));
  })();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white flex flex-col p-6 sm:p-8 z-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Generate Content
        </h1>
        <button onClick={onClose} className="text-neutral-400">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content Type */}
      <div className="mb-4">
        <label className="text-sm text-neutral-600 mb-1 block">
          Content Type
        </label>
        <div className="flex gap-2">
          {CONTENT_TYPES.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setSelectedType(label)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full ${
                selectedType === label
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600"
              }`}
              disabled={creating}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Source Selection */}
      <div className="mb-4">
        <label className="text-sm text-neutral-600 mb-1 block">Source</label>
        <select
          className="w-full rounded-lg px-4 py-2 text-sm bg-neutral-100 text-neutral-800 focus:outline-none"
          value={selectedSourceKey}
          onChange={(e) => {
            setSelectedSourceKey(e.target.value);
            setSelectedTopics([]);
          }}
          disabled={creating}
        >
          <option value="">Select source</option>
          {sources.map(([key, source]) => (
            <option key={key} value={key}>
              {source.name}
            </option>
          ))}
        </select>
      </div>

      {/* Topics */}
      {selectedSourceKey && (
        <div className="flex-1 mb-6 min-h-0 overflow-y-auto pr-1">
          <div className="flex justify-between text-sm text-neutral-600 mb-2">
            <span>Topics</span>
            <span className="text-xs text-neutral-400">
              {selectedTopics.length}/5
            </span>
          </div>

          {topicGroups.map((group, index) => (
            <div key={index} className="mb-3">
              <div className="text-xs text-neutral-400 mb-1">{group.label}</div>
              <div className="flex flex-wrap gap-2">
                {group.topics.map((topic) => {
                  const isSelected = selectedTopics.some(
                    (t) => t.topic === topic
                  );
                  const isDisabled = !isSelected && selectedTopics.length >= 5;
                  return (
                    <button
                      key={topic}
                      onClick={() =>
                        toggleTopic(topic, group.minPage, group.maxPage)
                      }
                      disabled={isDisabled || creating}
                      className={`px-3 py-1 text-sm rounded-full ${
                        isSelected
                          ? "bg-neutral-900 text-white"
                          : isDisabled
                          ? "text-neutral-300 bg-neutral-100 cursor-not-allowed"
                          : "bg-neutral-100 text-neutral-700"
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
      )}

      {/* Feedback */}
      {selectedTopics.length === 0 && (
        <p className="text-xs text-red-500 mb-2">
          Select at least one topic to proceed
        </p>
      )}
      {selectedTopics.length >= 5 && (
        <p className="text-xs text-yellow-600 mb-2">
          Maximum of 5 topics can be selected
        </p>
      )}

      {/* Create Button */}
      <button
        onClick={handleCreate}
        disabled={!selectedTopics.length || creating}
        className={`w-full py-3 rounded-lg text-sm font-medium ${
          !selectedTopics.length || creating
            ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            : "bg-neutral-900 text-white"
        }`}
      >
        {creating ? "Creating..." : `Create ${selectedType}`}
      </button>

      {/* Overlay during generation */}
      {creating && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-neutral-600">
              Generating {selectedType}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
