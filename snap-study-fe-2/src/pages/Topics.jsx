import React, { useState, useEffect } from "react";
import { Plus, BookOpen, FileText } from "lucide-react";
import { TopicCard } from "../components/TopicCard";
import { AddTopicModal } from "../components/AddTopicModal";
import {
  addSourceFileDataToProject,
  createProject,
  deleteProjectAndFiles,
  getProjects,
  removeSourceFilesFromProject,
  uploadFileToProject,
} from "../services/projectService";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

function Topics() {
  const [topics, setTopics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const savedTopics = await getProjects(user.uid);
        if (savedTopics) {
          setTopics(savedTopics);
        }
      } catch (error) {
        console.error("Error loading topics:", error);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    localStorage.setItem("studyTopics", JSON.stringify(topics));
  }, [topics]);

  const startProcessSource = async (uid, project_id, source_id, filePath) => {
    const data = {
      uid: uid,
      project_id: project_id,
      source_id: source_id,
      filePath: filePath,
    };
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/process_source",
        data
      );
      console.log("✅ Server response:", response.data);
    } catch (error) {
      console.error(
        "❌ Request failed:",
        error.response?.data || error.message
      );
    }
  };

  const handleAddTopic = async (title, files) => {
    const projectID = await createProject(user.uid, title);

    const newTopic = {
      id: projectID,
      title,
      sources: [],
      isLoading: true,
    };
    setTopics((prev) => [...prev, newTopic]);

    const sourcePromises = files.map(async (file) => {
      const { downloadURL, filePath } = await uploadFileToProject(
        user.uid,
        file,
        projectID
      );
      let sourceData = {
        name: file.name,
        downloadURL: downloadURL,
        projectID: projectID,
        filePath: filePath,
        uploadedAt: new Date(),
      };
      const sourceID = await addSourceFileDataToProject(
        user.uid,
        projectID,
        sourceData
      );
      sourceData = { ...sourceData, id: sourceID };

      return sourceData;
    });

    const sources = await Promise.all(sourcePromises);
    for (let index = 0; index < sources.length; index++) {
      const source = sources[index];
      await startProcessSource(user.uid, projectID, source.id, source.filePath);
    }

    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === projectID ? { ...topic, sources, isLoading: false } : topic
      )
    );
  };

  const handleEditTitle = (id, newTitle) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === id ? { ...topic, title: newTitle } : topic
      )
    );
  };

  const handleDeleteTopic = async (id) => {
    if (window.confirm("Are you sure you want to delete this topic?")) {
      await deleteProjectAndFiles(user.uid, id);
      setTopics((prev) => prev.filter((topic) => topic.id !== id));
    }
  };

  const handleAddSources = async (id, files) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === id
          ? {
              ...topic,
              isLoading: true,
            }
          : topic
      )
    );
    const sourcePromises = files.map(async (file) => {
      const { downloadURL, filePath } = await uploadFileToProject(
        user.uid,
        file,
        id
      );
      let sourceData = {
        name: file.name,
        downloadURL: downloadURL,
        projectID: id,
        filePath: filePath,
        uploadedAt: new Date(),
      };
      const sourceID = await addSourceFileDataToProject(
        user.uid,
        id,
        sourceData
      );
      sourceData = { ...sourceData, id: sourceID };
      return sourceData;
    });

    const sources = await Promise.all(sourcePromises);

    for (let index = 0; index < sources.length; index++) {
      const source = sources[index];
      await startProcessSource(user.uid, id, source.id, source.filePath);
    }

    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === id
          ? {
              ...topic,
              isLoading: false,
              sources: [...topic.sources, sources],
            }
          : topic
      )
    );
  };

  const handleDeleteSources = async (id, sourceIds) => {
    await removeSourceFilesFromProject(user.uid, id, sourceIds);
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === id
          ? {
              ...topic,
              sources: topic.sources.filter(
                (source) => !sourceIds.includes(source.id)
              ),
            }
          : topic
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Study Topics</h1>
          </div>
          <p className="text-gray-600">
            Organize your study materials by topic
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Topic
          </button>
        </div>

        {topics.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No topics added yet
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first study topic
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onEditTitle={handleEditTitle}
                onDeleteTopic={handleDeleteTopic}
                onAddSources={handleAddSources}
                onDeleteSources={handleDeleteSources}
              />
            ))}
          </div>
        )}
      </div>

      <AddTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTopic={handleAddTopic}
      />
    </div>
  );
}

export default Topics;
