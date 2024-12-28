import React from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import styles from "../pages/dashboard.module.css";

const TypebotList = ({ forms, folders, openModal, loading }) => (
    <div className={styles.itemsContainer}>
       {loading ? (
      <div className={styles.skeleton}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className={styles.skeletonTypebot}></div>
        ))}
      </div>
    ) : (
      <>
        <div className={styles.typebotCard} onClick={() => openModal("createTypebot")}>
          <div className={styles.plusIcon}>+</div>
          <div>Create a typebot</div>
        </div>
        {forms?.map((form) => {
          const folderId = folders?.find((folder) => folder.forms.includes(form._id))?._id;
          return (
            <div key={form._id} className={styles.typebot}>
              <div className={styles.typebotName}>{form.title}</div>
              <button
                className={styles.typebotDeleteButton}
                onClick={() =>
                  openModal("deleteItem", { ...form, type: "typebot", folderId })
                }
              >
                <DeleteForeverOutlinedIcon />
              </button>
            </div>
          );
        })}
      </>
    )}
  </div>
);

export default TypebotList;