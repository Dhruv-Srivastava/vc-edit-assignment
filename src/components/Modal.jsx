import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import EditIcon from "../assets/edit-icon.svg";
import CloseIcon from "../assets/close-icon.svg";

const Modal = ({ isOpen, onClose, onReplace, onReplaceAll, word }) => {
  const [inputValue, setInputValue] = useState(word);
  const [caseSensitive, setCaseSensitive] = useState(true);

  useEffect(function preLoadIcons() {
    const image = new Image();
    image.src = EditIcon;
    image.src = CloseIcon;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.1 }}
        className="bg-white text-black p-6 rounded-xl flex flex-col gap-4"
      >
        <div className="flex justify-between items-center">
          <img src={EditIcon} alt="Edit Icon" />
          <button onClick={onClose}>
            <img src={CloseIcon} alt="Cancel Button" />
          </button>
        </div>
        <p className="text-base">Edit {`"${word}"`}</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          autoFocus
        />
        <label className="flex gap-3">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={() => setCaseSensitive((prev) => !prev)}
            className="accent-[#039855]"
          />
          Match with case?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              onReplaceAll(inputValue, caseSensitive);
              onClose();
            }}
            className="bg-transparent border border-[#D0D5DD] text-[#344054] text-sm px-3 py-2 rounded-lg lg:text-base"
          >
            Replace All
          </button>
          <button
            onClick={() => {
              onReplace(inputValue, caseSensitive);
              onClose();
            }}
            className="bg-[#7F56D9] text-sm text-white px-3 py-2 rounded-lg lg:text-base"
          >
            Replace
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
