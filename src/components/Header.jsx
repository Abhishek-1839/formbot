import React, { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Dropdown from "./Dropdown";
import styles from "../pages/Dashboard.module.css";

const Header = ({ 
  workspaceName, 
  darkMode, 
  setDarkMode, 
  setIsShareModalOpen,
  navigate,
  shareEmail,
  setShareEmail,
  sharePermission,
  setSharePermission,
  handleShareInvite,
  isShareModalOpen 
}) => {
  const handleOptionChange = (value) => {
    if (value === 'settings') {
      navigate('/setting');
    } else if (value === 'logout') {
      navigate('/');
    }
  };

  return (
    <header className={styles.dashboardHeader}>
      <Dropdown 
        workspace={workspaceName} 
        handleOptionChange={handleOptionChange} 
      />
      <div className={styles.dashboardActions}>
        <div className={styles.themeToggle}>
          <span>Light</span>
          <label className={styles.change}>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className={styles.slider}></span>
          </label>
          <span>Dark</span>
        </div>
        <button 
          className={styles.shareButton} 
          onClick={() => setIsShareModalOpen(true)}
        >
          Share
        </button>
        {isShareModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.sharemodalContainer}>
                        <span className={styles.sharemodalCloseButton} onClick={() => setIsShareModalOpen(false)}>
                            <CloseOutlinedIcon />
                        </span>
                        <div className={styles.shareInputContainer}>
                            <div className={styles.shareselectContainer}>
                                <p className={styles.sharepopupText}>Invite by Email</p>
                                <select
                                    className={styles.sharedropdownSelect}
                                    onChange={(e) => setSharePermission(e.target.value)}
                                    value={sharePermission}
                                >
                                    <option value="edit">Edit</option>
                                    <option value="view">Vi.ew</option>
                                </select>
                                <ArrowDropDownIcon style={{position:"relative", left:"55%", pointerEvents:"none"}}/>
                            </div>
                            <input
                                type="text"
                                value={shareEmail}
                                onChange={(e) => setShareEmail(e.target.value)}
                                placeholder="Enter email id"
                                className={styles.shareInput}
                            />
                            <button
                                className={styles.sharecopyButton}
                                onClick={handleShareInvite}
                            >
                                Send Invite
                            </button>
                        </div>
                    </div>
                </div>
            )}
      </div>
    </header>
  );
};

export default Header;