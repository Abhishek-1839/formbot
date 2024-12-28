import React, { useEffect } from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import styles from "../pages/dashboard.module.css";
import { fetchWorkspaces} from "../redux/workspaceSlice";
import { useDispatch } from "react-redux";



const FolderList = ({ folders, openModal, setSelectedFolderId, loading }) => (
    <div className={styles.itemsContainer}>
         {loading ? (
      <div className={styles.skeleton}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className={styles.skeletonFolder}></div>
        ))}
      </div>
    ) : (
      folders?.map((folder) => (
        <div key={folder._id} className={styles.folder}>
          <span
            className={styles.folderName}
            onClick={() => {
              setSelectedFolderId(folder._id);
              openModal("createTypebot");
            }}
          >
            {folder.name}
          </span>
          <button
            className={styles.folderDeleteButton}
            onClick={() => openModal("deleteItem", { ...folder, type: "folder" })}
          >
            <DeleteForeverOutlinedIcon />
          </button>
        </div>
      ))
    )}
  </div>
);

export default FolderList;