import React, { useState } from "react";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import styles from "./Dropdown.module.css";

const Dropdown = ({ workspace, handleOptionChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("workspace"); // Default selected option

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleOptionClick = (value) => {
        setSelectedOption(value); // Update the selected option
        handleOptionChange(value); // Call the parent function to handle the selection
        setIsDropdownOpen(false); // Close the dropdown
    };

    const dropdownOptions = [
        { value: "workspace", label: workspace },
        { value: "settings", label: "Settings" },
        { value: "logout", label: "Log Out" },
    ];

    const displayedOption = dropdownOptions.find(
        (option) => option.value === selectedOption
    );

    const filteredOptions = dropdownOptions.filter(
        (option) => option.value !== selectedOption
    );

    return (
        <div className={styles.dropdownContainer}>
            <div className={styles.dropdown} onClick={toggleDropdown}>
                <span>{displayedOption?.label}</span>
                <span
                    className={`${styles.arrowIcon} ${isDropdownOpen ? styles.arrowIconOpen : ""
                        }`}
                >
                    <KeyboardArrowDownOutlinedIcon />
                </span>
            </div>
            {isDropdownOpen && (
                <ul className={styles.dropdownMenu}>
                    {filteredOptions.map((option) => (
                        <li
                            key={option.value}
                            className={`${styles.dropdownItem} ${option.value === "logout" ? styles.logoutItem : ""
                                }`}
                            onClick={() => handleOptionClick(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;

