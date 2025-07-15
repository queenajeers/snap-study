import { useAuth } from "../contexts/AuthContext";
import { storage, database, push, ref, set } from "../../firebaseInit";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
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
  const fileName = file.name;
  const filePath = `users/${uid}/projects/${projectId}/${fileName}`;
  const _storageRef = storageRef(storage, filePath);
  const uploadStatusRef = ref(
    database,
    `users/${uid}/projects/${projectId}/upload_status`
  );

  // ✅ Check if the project exists before upload starts
  const projectRef = ref(database, `users/${uid}/projects/${projectId}`);
  const projectSnapshot = await get(projectRef);
  if (!projectSnapshot.exists()) {
    const error = new Error(
      `Project ${projectId} no longer exists. Upload aborted.`
    );
    console.warn(error.message);

    await set(uploadStatusRef, {
      status: "error",
      error: error.message,
      fileName,
      failedAt: Date.now(),
    });

    throw error;
  }

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(_storageRef, file);

    uploadTask.on(
      "state_changed",
      async (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        // ✅ Optional: recheck if the project still exists during upload
        const currentProjectSnapshot = await get(projectRef);
        if (!currentProjectSnapshot.exists()) {
          const cancelError = new Error(
            "Upload cancelled. Project was deleted mid-upload."
          );
          console.warn(cancelError.message);

          uploadTask.cancel(); // This will trigger error callback

          await set(uploadStatusRef, {
            status: "error",
            error: cancelError.message,
            fileName,
            failedAt: Date.now(),
          });

          return reject(cancelError);
        }

        await set(uploadStatusRef, {
          status: "uploading",
          progress: Math.round(progress),
          fileName,
          filePath,
          startedAt: Date.now(),
        });

        console.log(`Upload is ${Math.round(progress)}% done`);
      },
      async (error) => {
        // Upload failed
        console.error("Upload failed:", error);

        await set(uploadStatusRef, {
          status: "error",
          error: error.message,
          fileName,
          failedAt: Date.now(),
        });

        reject(error);
      },
      async () => {
        // Upload successful
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        await set(uploadStatusRef, {
          status: "completed",
          fileName,
          filePath,
          downloadURL,
          completedAt: Date.now(),
        });

        console.log("Upload successful:", downloadURL);
        resolve({ downloadURL, filePath });
      }
    );
  });
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
