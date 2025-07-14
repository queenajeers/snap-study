import { useAuth } from "../contexts/AuthContext";
import { storage, database, push, ref, set } from "../../firebaseInit";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { get, remove } from "firebase/database";

export const getProjects = async (uid) => {
  const projectsRef = ref(database, `users/${uid}/projects`);
  console.log("Retriving projects");
  try {
    const snapshot = await get(projectsRef);
    const topics = [];
    if (!snapshot.exists()) {
      return topics; // Return empty if no projects found
    }
    const projectsData = snapshot.val();

    for (const projectID in projectsData) {
      const project = projectsData[projectID];
      const title = project.title || "Untitled";
      const sources = [];

      if (project.sources) {
        for (const sourceID in project.sources) {
          const sourceEntry = project.sources[sourceID];

          // Unwrap sourceData if it's stored under a 'sourceData' key
          const sourceData = sourceEntry.sourceData || sourceEntry;

          sources.push({
            ...sourceData,
          });
        }
      }

      const newTopic = {
        id: projectID,
        title,
        sources,
      };

      topics.push(newTopic);
    }

    return topics;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }

  // load to topics = [] ,
  //   const newTopic = {
  //     id: projectID,
  //     title,
  //     sources: [],
  //   };
  // and source structure is
  //   const sourceData = {
  //         downloadURL: downloadURL,
  //         projectID: projectID,
  //         filePath: filePath,
  //         uploadedAt: new Date(),
  //       };
};

export const createProject = async (uid, title) => {
  const projectsRef = ref(database, `users/${uid}/projects`);
  const newProjectRef = push(projectsRef);

  await set(newProjectRef, {
    title,
    createdAt: Date.now(),
  });

  return newProjectRef.key; // project ID (for storage later)
};

export const addSourceFileDataToProject = async (
  uid,
  projectID,
  sourceData
) => {
  // Construct the reference to the specific project document
  const sourcesRef = ref(
    database,
    `users/${uid}/projects/${projectID}/sources`
  );
  const newSourceRef = push(sourcesRef);
  try {
    // Use update() to add or modify only the 'sources' field
    await set(newSourceRef, {
      ...sourceData,
      id: newSourceRef.key,
    });

    console.log(`Source data added/updated for project ${projectID}`);
    return newSourceRef.key; // Or some other success indicator
  } catch (error) {
    console.error("Error adding source file data to project:", error);
    throw error;
  }
};

export const removeSourceFilesFromProject = async (
  uid,
  projectID,
  sourceIDs = []
) => {
  if (!Array.isArray(sourceIDs) || sourceIDs.length === 0) {
    console.warn("No source IDs provided for deletion.");
    return;
  }

  for (const sourceID of sourceIDs) {
    try {
      const sourceRef = ref(
        database,
        `users/${uid}/projects/${projectID}/sources/${sourceID}`
      );

      const snapshot = await get(sourceRef);

      if (!snapshot.exists()) {
        console.warn(`Source ${sourceID} not found for deletion.`);
        continue;
      }

      const sourceData = snapshot.val().sourceData || snapshot.val();
      const filePath = sourceData.filePath;

      if (filePath) {
        const fileRef = storageRef(storage, filePath);
        await deleteObject(fileRef);
        console.log(`File ${filePath} deleted from storage.`);
      } else {
        console.warn(
          `No file path found for source ${sourceID}. Skipping storage deletion.`
        );
      }

      await remove(sourceRef);
      console.log(`Source ${sourceID} removed from database.`);
    } catch (error) {
      console.error(`Error removing source ${sourceID}:`, error);
      // Continue loop even if one fails
    }
  }
};

export const uploadFileToProject = async (uid, file, projectId) => {
  const fileName = file.name; // Use the original file name, or generate a unique one

  // Construct the full path: uid/projects/project_id/filename
  const filePath = `users/${uid}/projects/${projectId}/${fileName}`;
  const _storageRef = storageRef(storage, filePath);

  try {
    // Upload the file
    const snapshot = await uploadBytes(_storageRef, file);
    console.log("Uploaded a blob or file!", snapshot);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("File available at:", downloadURL);

    return { downloadURL, filePath }; // Return the URL and path for your database
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteProjectAndFiles = async (uid, projectID) => {
  try {
    const projectRef = ref(database, `users/${uid}/projects/${projectID}`);
    const snapshot = await get(projectRef);

    if (!snapshot.exists()) {
      console.warn(`Project ${projectID} does not exist.`);
      return;
    }

    const projectData = snapshot.val();
    const sources = projectData.sources || {};

    // Delete each file from storage
    for (const sourceID in sources) {
      const sourceEntry = sources[sourceID];
      const sourceData = sourceEntry.sourceData || sourceEntry;
      const filePath = sourceData.filePath;

      if (filePath) {
        try {
          const fileRef = storageRef(storage, filePath);
          await deleteObject(fileRef);
          console.log(`Deleted file from storage: ${filePath}`);
        } catch (storageError) {
          console.warn(`Failed to delete file ${filePath}:`, storageError);
          // Continue even if individual file deletion fails
        }
      }
    }

    // Delete the entire project node from database
    await remove(projectRef);
    console.log(`Project ${projectID} and all associated data removed.`);
  } catch (error) {
    console.error(`Error deleting project ${projectID}:`, error);
    throw error;
  }
};
