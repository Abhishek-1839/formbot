import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styles from "../pages/DashBoard.module.css";
import {
  fetchWorkspaces,
  createFolder,
  deleteFolder,
  createTypebot,
  deleteTypebot,
  shareWorkspace,
  selectWorkspaces,
  selectCurrentWorkspace,
  selectWorkspaceLoading,
  selectWorkspaceError,
  setCurrentWorkspace,
  addFolderOptimistic,
  addTypebotOptimistic,
  revertOptimisticUpdate,
} from "../redux/workspaceSlice";
import Header from "../components/Header";
import WorkspaceActions from "../components/WorkspaceActions";
import FolderList from "../components/FolderList";
import TypebotList from "../components/TypebotList";

const Modals = React.lazy(() => import("../components/Modals"));

const DashBoard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState("");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState("edit");
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);
  const [workspaceError, setWorkspaceError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const workspaces = useSelector(selectWorkspaces);
  const currentWorkspace = useSelector(selectCurrentWorkspace);
  const loading = useSelector(selectWorkspaceLoading);
  const error = useSelector(selectWorkspaceError);
  const { name } = useSelector((state) => state.auth);

  const workspaceName = currentWorkspace?.name || `${name}'s workspace`;

  useEffect(() => {
    const initializeWorkspace = async () => {
      setLoadingWorkspace(true);
      try {
        // Get workspaces from localStorage first
        const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
        
        // Fetch workspaces from the server
        const workspacesResult = await dispatch(fetchWorkspaces()).unwrap();
        
        if (workspacesResult?.length > 0) {
          let workspaceToSet;
          
          if (savedWorkspaceId) {
            // If we have a saved workspace ID, try to find it in the results
            workspaceToSet = workspacesResult.find(w => w._id === savedWorkspaceId);
          }
          
          // If we couldn't find the saved workspace or didn't have one, use the first workspace
          if (!workspaceToSet) {
            workspaceToSet = workspacesResult[0];
          }
          
          dispatch(setCurrentWorkspace(workspaceToSet));
          localStorage.setItem('currentWorkspaceId', workspaceToSet._id);
        }
      } catch (err) {
        setWorkspaceError("Failed to load workspace. Please try again.");
        console.error("Workspace initialization error:", err);
      } finally {
        setLoadingWorkspace(false);
      }
    };

    initializeWorkspace();
  }, [dispatch]);

  useEffect(() => {
    if (currentWorkspace?._id) {
      localStorage.setItem('currentWorkspaceId', currentWorkspace._id);
    }
  }, [currentWorkspace]);
  

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const handleCreateItem = async () => {
    if (!inputValue.trim()) {
      setWorkspaceError("Please enter a name");
      return;
    }

    if (!currentWorkspace?._id) {
      setWorkspaceError("No workspace selected. Please refresh the page.");
      return;
    }

    setLoadingWorkspace(true);
    try {
    if (action === "createFolder") {
      // Create optimistic folder
      const optimisticFolder = {
        _id: `temp-${Date.now()}`,
        name: inputValue,
        forms: []
      };
      
      // Add optimistic update
      dispatch(addFolderOptimistic({
        workspaceId: currentWorkspace._id,
        folder: optimisticFolder
      }));

      // Make API call
      const result = await dispatch(
        createFolder({
          workspaceId: currentWorkspace._id,
          name: inputValue,
        })
      ).unwrap();

      // Real update will happen through the reducer
    } else if (action === "createTypebot") {
      if (!selectedFolderId) {
        setWorkspaceError("Please select a folder first");
        return;
      }

      // Create optimistic typebot
      const optimisticTypebot = {
        _id: `temp-${Date.now()}`,
        title: inputValue,
        fields: []
      };

      // Add optimistic update
      dispatch(addTypebotOptimistic({
        workspaceId: currentWorkspace._id,
        folderId: selectedFolderId,
        typebot: optimisticTypebot
      }));

      // Make API call
      const result = await dispatch(
        createTypebot({
          workspaceId: currentWorkspace._id,
          folderId: selectedFolderId,
          title: inputValue,
        })
      ).unwrap();

      // Real update will happen through the reducer
    }
    setIsModalOpen(false);
    setInputValue("");
    setWorkspaceError(null);
  } catch (error) {
    // Revert optimistic update on error
    dispatch(revertOptimisticUpdate({
      workspaceId: currentWorkspace._id,
      type: action === "createFolder" ? "folder" : "typebot",
      itemId: `temp-${Date.now()}`
    }));
    setWorkspaceError(error.message || "Failed to create item");
    console.error("Error creating item:", error);
  } finally {
    setLoadingWorkspace(false);
  }
};


  const handleDeleteConfirm = async () => {
    try {
      if (itemToDelete.type === "folder") {
        dispatch(
          deleteFolder({
            workspaceId: currentWorkspace._id,
            folderId: itemToDelete._id,
          })
        );
      } else if (itemToDelete.type === "typebot") {
        dispatch(
          deleteTypebot({
            workspaceId: currentWorkspace._id,
            folderId: itemToDelete.folderId,
            formId: itemToDelete._id,
          })
        );
      }
      setIsModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleShareInvite = async () => {
    try {
     dispatch(
        shareWorkspace({
          workspaceId: currentWorkspace._id,
          email: shareEmail,
          permission: sharePermission,
        })
      );
      setIsShareModalOpen(false);
      setShareEmail("");
    } catch (error) {
      console.error("Error sharing workspace:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const closeModal = () => {
    setIsModalOpen(false);
    setInputValue("");
    setItemToDelete(null);
  };

  const openModal = (actionType, item = null) => {
    setAction(actionType);
    setItemToDelete(item);
    setIsModalOpen(true);
  };
  
  if (loadingWorkspace) {
    return <div className={styles.loading}>Loading workspace...</div>;
  }

  if (workspaceError) {
    return <div className={styles.error}>{workspaceError}</div>;
  }

  if (!currentWorkspace) {
    return <div className={styles.error}>No workspace found. Please refresh the page.</div>;
  }


  return (
    <div className={styles.dashboardContainer}>
      <Header
        workspaceName={workspaceName}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setIsShareModalOpen={setIsShareModalOpen}
        navigate={navigate}
        shareEmail={shareEmail}
        setShareEmail={setShareEmail}
        sharePermission={sharePermission}
        setSharePermission={setSharePermission}
        handleShareInvite={handleShareInvite}
        isShareModalOpen={isShareModalOpen}
      />
      <main className={styles.dashboardContent}>
        <WorkspaceActions openModal={openModal} />
        <FolderList
          folders={currentWorkspace?.folders}
          openModal={openModal}
          setSelectedFolderId={setSelectedFolderId}
        />
        <TypebotList
          forms={currentWorkspace?.forms}
          folders={currentWorkspace?.folders}
          openModal={openModal}
        />
      </main>
      <Suspense fallback={<div>Loading...</div>}>
      <Modals
        isModalOpen={isModalOpen}
        action={action}
        darkMode={darkMode}
        inputValue={inputValue}
        setInputValue={setInputValue}
        itemToDelete={itemToDelete}
        handleCreateItem={handleCreateItem}
        handleDeleteConfirm={handleDeleteConfirm}
        closeModal={closeModal}
        currentWorkspace={currentWorkspace}
      />
      </Suspense>
    </div>
  );
};

export default DashBoard;


















