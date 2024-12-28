import React, { useEffect, useState, useRef, useCallback } from "react";
import { Moon, Sun, Share, Save, X } from "lucide-react";
import {
  TextBubbleIcon,
  ImageBubbleIcon,
  VideoBubbleIcon,
  GifBubbleIcon,
  TextInputIcon,
  NumberInputIcon,
  EmailInputIcon,
  PhoneInputIcon,
  DateInputIcon,
  RatingInputIcon,
  ButtonInputIcon,
} from "./FormIcons";
import styles from "./FormBuilder.module.css";
import api from "../data/api";
const useClickOutside = (ref, callback, active) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (active && ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback, active]);
};

const bubbleElements = [
  {
    id: "text",
    label: "Text",
    icon: <TextBubbleIcon />,
    category: "Bubbles",
  },
  {
    id: "image",
    label: "Image",
    icon: <ImageBubbleIcon />,
    category: "Bubbles",
  },
  {
    id: "video",
    label: "Video",
    icon: <VideoBubbleIcon />,
    category: "Bubbles",
  },
  {
    id: "gif",
    label: "GIF",
    icon: <GifBubbleIcon />,
    category: "Bubbles",
  },
  {
    id: "input-text",
    label: "Text",
    icon: <TextInputIcon />,
    category: "Inputs",
  },
  {
    id: "input-number",
    label: "Number",
    icon: <NumberInputIcon />,
    category: "Inputs",
  },
  {
    id: "input-email",
    label: "Email",
    icon: <EmailInputIcon />,
    category: "Inputs",
  },
  {
    id: "input-phone",
    label: "Phone",
    icon: <PhoneInputIcon />,
    category: "Inputs",
  },
  {
    id: "input-date",
    label: "Date",
    icon: <DateInputIcon />,
    category: "Inputs",
  },
  {
    id: "input-rating",
    label: "Rating",
    icon: <RatingInputIcon />,
    category: "Inputs",
  },
  {
    id: "input-button",
    label: "Button",
    icon: <ButtonInputIcon />,
    category: "Inputs",
  },
];
// Create a separate FormElement component
const FormElement = ({
  element,
  selectedElementId,
  onSelect,
  onUpdate,
  isInput,
}) => {
  const elementRef = useRef(null);
  const editableRef = useRef(null);

  useClickOutside(
    elementRef,
    () => {
      onUpdate(element.id, { isEditing: false });
    },
    element.isEditing
  );

  const handleClick = (e) => {
    e.stopPropagation();
    onUpdate(element.id, { isEditing: true });
    onSelect(element.id);
    // Only focus editable content for bubble elements
    setTimeout(() => {
      editableRef.current?.focus();
    }, 0);
  };
  const handleLabelBlur = (e) => {
    const newLabel = e.target.textContent.trim();
    onUpdate(element.id, {
      label: newLabel || "Untitled Element",
      isEditing: false, // Close editing mode on blur
    });
  };
  const inputHints = {
    "input-text": "Hint: User will input text in this field.",
    "input-number": "Hint: User will input a number in this field.",
    "input-email": "Hint: User will input an email in this field.",
    "input-phone": "Hint: User will input a phone number in this field.",
    "input-date": "Hint: User will select a date in this field.",
    "input-rating": "Hint: User will give a rating in this field.",
    "input-button": "Hint: This will be a button for user interaction.",
  };
  const handleContentBlur = (e) => {
    const newContent = e.target.textContent.trim();
    onUpdate(element.id, {
      content: newContent, // Fallback if content is empty
      isEditing: false, // Exit editing mode
    });
    console.log(`Updated content: ${newContent}`);
  };
  const handleInput = (e) => {
    const content = e.target.textContent.trim();
    // if (content === "Click to add link") {
    //   e.target.textContent = ""; // Clear the placeholder on first input
    // }
    onUpdate(element.id, { content });
  };
  const elementData = bubbleElements.find((el) => el.id === element.type);

  return (
    <div
      ref={elementRef}
      className={`${styles["element-container"]} ${
        element.id === selectedElementId ? styles.selected : ""
      }`}
      onClick={handleClick}
    >
      <div className={styles["element-header"]}>
        <span
          className={`${styles["element-label"]} ${styles["editable-field"]}`}
          contentEditable={!element.isEditing}
          suppressContentEditableWarning
          onClick={(e) => e.stopPropagation()}
          onBlur={handleLabelBlur}
          data-placeholder="Enter label"
        >
          {element.label || elementData.label}
        </span>
      </div>

      <div
        className={`${styles["element-details"]} ${
          element.isEditing ? styles.editing : ""
        }`}
      >
        <div className={styles["element-icon-wrapper"]}>
          {elementData?.icon}
        </div>
        {isInput ? (
          <div className={styles["element-hint"]}>
            <span className={styles["hint-text"]}>
              {inputHints[element.type]}
            </span>
          </div>
        ) : (
          <div className={styles["element-message"]}>
            {element.isEditing ? (
              <input
                ref={editableRef}
                className={styles["editable-input"]}
                type="text"
                value={element.content || ""}
                onChange={(e) =>
                  onUpdate(element.id, { content: e.target.value })
                }
                onBlur={(e) => {
                  const newContent = e.target.value.trim();
                  onUpdate(element.id, {
                    content: newContent,
                    isEditing: false,
                  });
                }}
                autoFocus
              />
            ) : (
              <p
                ref={editableRef}
                className={styles["editable-field"]}
                contentEditable
                suppressContentEditableWarning
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(element.id, { isEditing: true });
                  setTimeout(() => editableRef.current?.focus(), 0);
                }}
                onInput={handleInput}
                onBlur={handleContentBlur}
              >
                {element.content}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FormBuilder = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formElements, setFormElements] = useState([]);
  const [formName, setFormName] = useState("");
  const [activeTab, setActiveTab] = useState("flow"); // New state for Flow/Response toggle
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [responses, setResponses] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const savedData = localStorage.getItem("form-data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormName(parsed.formName || "");
      setFormElements(parsed.elements || []);
      setResponses(parsed.responses || {});
    }
  }, []);


  const saveFormToDatabase = async () => {
    try {
      setIsLoading(true);
      const formData = {
        formName: formName.trim() || "Untitled Form",
        elements: formElements.map((el) => ({
          ...el,
          label: el.label.trim() || "Untitled Element",
          content: el.content?.trim() || "",
        })),
        responses,
      };
      const token = localStorage.getItem("token");
        console.log("Token:", token);
      const savedForm = await api.post("/forms/saveForm", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // alert("Form saved successfully!");
      return savedForm;
    } 
    catch (error) {
      setError("Failed to save form");
      console.error("Error saving form:", error);
      // alert("Failed to save the form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveFormToLocalStorage = useCallback((elements, name, responseData) => {
    const formData = {
      formName: name.trim() || "Untitled Form",
      elements: elements.map((el) => ({
        ...el,
        label: el.label.trim() || "Untitled Element",
        content: el.content?.trim() || "",
      })),
      responses: responseData,
    };

    if (elements.length === 0) return; // Remove alert to prevent disruption

    try {
      localStorage.setItem("form-data", JSON.stringify(formData));
    } catch (error) {
      console.error("Failed to save form data:", error);
      alert("Failed to save the form. Please try again.");
    }
  }, []); // No dependencies needed as this is a stable function

  const addElement = useCallback((elementType) => {
      const id = Date.now();
      const elementDefinition = bubbleElements.find(
        (el) => el.id === elementType
      );

      const newElement = {
        type: elementType,
        id,
        label: elementDefinition ? elementDefinition.label : "Add a label",
        content: elementType.startsWith("input-") ? "" : "Click to add link",
        isEditing: false,
      };
      setFormElements((prev) => {
        const updated = [...prev, newElement];
        // Save to localStorage whenever elements are updated
        saveFormToLocalStorage(updated, formName, responses);
        return updated;
      });
      setSelectedElementId(id);
    },
    [formName, responses, saveFormToLocalStorage]
  );

  const updateElement = (id, updates) => {
    setFormElements((prevElements) => {
      const updated = prevElements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      );
      // Save to localStorage whenever elements are updated
      saveFormToLocalStorage(updated, formName, responses);
      return updated;
    });
  };

  const handleResponseChange = (id, value) => {
    const element = formElements.find((el) => el.id === id);
    if (element && element.label) {
      const updatedResponses = {
        ...responses,
        [element.label]: value,
      };
      setResponses(updatedResponses);
      // Save to localStorage whenever responses are updated
      saveFormToLocalStorage(formElements, formName, updatedResponses);
    }
  };

  const handleManualSave = async () => {
    if (formElements.length === 0) {
      alert("Please add elements to your form before saving.");
      return;
    }
    saveFormToLocalStorage(formElements, formName, responses);
    await saveFormToDatabase();
    alert("Form saved successfully!");
  };

  useEffect(() => {
    if (formElements.length > 0) {
      saveFormToLocalStorage(formElements, formName, responses);
    }
  }, [formElements, formName, responses, saveFormToLocalStorage]);

  return (
    <div
      className={`${styles["app-container"]} ${
        isDarkMode ? styles["dark-mode"] : styles["light-mode"]
      }`}
    >
      <header className={styles.header}>
        <div className={styles["header-content"]}>
          <input
            type="text"
            placeholder="Enter Form Name"
            className={styles["form-name-input"]}
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          <div className={styles["toggle-container"]}>
            <button
              className={`${styles["toggle-btn"]} ${
                activeTab === "flow" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("flow")}
            >
              Flow
            </button>
            <button
              className={`${styles["toggle-btn"]} ${
                activeTab === "response" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("response")}
            >
              Response
            </button>
          </div>

          <div className={styles["header-buttons"]}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={styles["theme-toggle-btn"]}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className={styles["share-btn"]}>Share</button>
            <button className={styles["save-btn"]} onClick={handleManualSave}>
              Save
            </button>
            <button className={styles["close-btn"]}>
              <X size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className={styles["main-container"]}>
        {activeTab === "flow" && (
          <>
            <div className={styles.sidebar}>
              {["Bubbles", "Inputs"].map((category) => (
                <div key={category} className={styles["category-section"]}>
                  <h2 className={styles["category-title"]}>{category}</h2>
                  <div className={styles["elements-grid"]}>
                    {bubbleElements
                      .filter((element) => element.category === category)
                      .map((element) => (
                        <button
                          key={element.id}
                          onClick={() => addElement(element.id)}
                          className={styles["element-button"]}
                        >
                          <span className={styles["element-icon"]}>
                            {element.icon}
                          </span>
                          <span className={styles["element-label"]}>
                            {element.label}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles["content-area"]}>
              <div className={styles["start-block"]}>
                <div className={styles["start-text"]}>
                  <div className={styles["start-icon"]}>
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 0V21H2.625V0H0ZM5.25 0V10.5H10.5V13.125H21L15.75 7.95375L21 2.625H13.125V0L5.25 0Z"
                        fill={isDarkMode ? "#FFFFFF" : "#1A5fff"}
                      />
                    </svg>
                  </div>
                  <p className={styles.starttext}> Start</p>
                </div>
              </div>
              <div className={styles["form-elements"]}>
                {formElements.map((element) => (
                  <FormElement
                    key={element.id}
                    element={element}
                    selectedElementId={selectedElementId}
                    onSelect={setSelectedElementId}
                    onUpdate={updateElement}
                    isInput={element.type.startsWith("input-")}
                    onInputChange={handleResponseChange}
                  />
                ))}
              </div>
            </div>
          </>
        )}
        {activeTab === "response" && (
          <div className={styles["responses-view"]}>
            <h2>Collected Responses</h2>
            {Object.entries(responses).map(([key, value]) => (
              <div key={key} className={styles["response-item"]}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
