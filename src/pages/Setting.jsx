import React, { useState } from 'react';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import styles from '../pages/Setting.module.css';

const Setting = () => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showEmail, setShowEmail] = useState(false);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Settings</h2>
            <form className={styles.form}>
                <input type="text" placeholder="Name" className={styles.input} />

                <div className={styles.inputWrapper}>
                    <input
                        type={showEmail ? 'text' : 'email'}
                        placeholder="Update Email"
                        className={styles.input}
                    />
                    <button
                        type="button"
                        className={styles.eyeButton}
                        onClick={() => setShowEmail((prev) => !prev)}
                    >
                        {showEmail ? <RemoveRedEyeOutlinedIcon /> : <RemoveRedEyeOutlinedIcon />}
                    </button>
                </div>

                <div className={styles.inputWrapper}>
                    <input
                        type={showOldPassword ? 'text' : 'password'}
                        placeholder="Old Password"
                        className={styles.input}
                    />
                    <button
                        type="button"
                        className={styles.eyeButton}
                        onClick={() => setShowOldPassword((prev) => !prev)}
                    >
                        {showOldPassword ? <RemoveRedEyeOutlinedIcon /> : <RemoveRedEyeOutlinedIcon />}
                    </button>
                </div>

                <div className={styles.inputWrapper}>
                    <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="New Password"
                        className={styles.input}
                    />
                    <button
                        type="button"
                        className={styles.eyeButton}
                        onClick={() => setShowNewPassword((prev) => !prev)}
                    >
                        {showNewPassword ? <RemoveRedEyeOutlinedIcon /> : <RemoveRedEyeOutlinedIcon />}
                    </button>
                </div>

                <button type="submit" className={styles.updateButton}>
                    Update
                </button>
            </form>
            <div className={styles.logoutContainer}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.016 7.38948V6.45648C15.016 4.42148 13.366 2.77148 11.331 2.77148H6.45597C4.42197 2.77148 2.77197 4.42148 2.77197 6.45648V17.5865C2.77197 19.6215 4.42197 21.2715 6.45597 21.2715H11.341C13.37 21.2715 15.016 19.6265 15.016 17.5975V16.6545" stroke="#CF3636" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M21.8096 12.0215H9.76855" stroke="#CF3636" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M18.8813 9.10547L21.8093 12.0205L18.8813 14.9365" stroke="#CF3636" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <button className={styles.logoutButton}>Log out</button>
            </div>
        </div>
    );
};

export default Setting;
