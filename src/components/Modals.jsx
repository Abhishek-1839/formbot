import React from 'react';
import styles from '../pages/dashboard.module.css';

const Modals = ({
  isModalOpen,
  action,
  darkMode,
  inputValue,
  setInputValue,
  itemToDelete,
  handleCreateItem,
  handleDeleteConfirm,
  closeModal,
  currentWorkspace 
}) => {
  if (!isModalOpen) return null;

  const isCreateAction = action === "createFolder" || action === "createTypebot";
  const modalTitle = {
    createFolder: "Create New Folder",
    createTypebot: "Create New Typebot",
    deleteItem: `Delete ${itemToDelete?.type}`
  }[action];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCreateAction) {
      handleCreateItem();
    } else {
      handleDeleteConfirm();
    }
  };

//   const isSubmitDisabled = !currentWorkspace?._id || !inputValue.trim();

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContainer} ${darkMode ? styles.darkMode : styles.lightMode}`}>
        <h2>{modalTitle}</h2>
        <form onSubmit={handleSubmit}>
          {isCreateAction ? (
            <>
              <input
                type="text"
                placeholder={`Enter ${action === "createFolder" ? "folder" : "typebot"} name`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={styles.modalInput}
                autoFocus
              />
              <div className={styles.modalActions}>
                <button type="submit" 
                className={styles.modalButton}
                // disabled={isSubmitDisabled}
                >
                  Done
                </button>
                <img src="/linevert" className={styles.linevert} alt="Separator" />
                <button type="button" onClick={closeModal} className={styles.modalCancelButton}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className={styles.modalActions}>
              <button type="submit" className={styles.modalButton}>
                Yes
              </button>
              <button type="button" onClick={closeModal} className={styles.modalCancelButton}>
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Modals;