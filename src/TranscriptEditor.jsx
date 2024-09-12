import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

import { useTimer } from "./hooks/use-timer";

import { formatTime } from "./utils";

import Modal from "./components/Modal";

import PlayIcon from "./assets/play.svg";
import PauseIcon from "./assets/pause.svg";
import RestartIcon from "./assets/restart.svg";

const TranscriptEditor = ({ initialTranscript }) => {
  const [transcript, setTranscript] = useState(initialTranscript);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState("");

  const { time, isPlaying, pauseTimer, startTimer, restartTimer } = useTimer();

  const { mm, ss, msms } = formatTime(time);
  const totlaTranscriptDuration =
    transcript.at(-1).start_time + transcript.at(-1).duration;

  const isTranscriptFinished = time >= totlaTranscriptDuration;

  useEffect(() => {
    if (isTranscriptFinished) {
      console.log(time);
      pauseTimer();
    }
  }, [pauseTimer, isTranscriptFinished]);

  const handleWordClick = (index) => {
    setCurrentWord(transcript[index].word);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  function handleClose() {
    setIsModalOpen(false);
    setCurrentWord("");
    setEditingIndex(null);
  }

  const handleReplace = (newWord, caseSensitive) => {
    setTranscript((prev) =>
      prev.map((item, index) =>
        index === editingIndex
          ? { ...item, word: newWord }
          : caseSensitive
          ? item
          : {
              ...item,
              word: item.word.replace(new RegExp(currentWord, "gi"), newWord),
            }
      )
    );
  };

  const handleReplaceAll = (newWord, caseSensitive) => {
    setTranscript((prev) =>
      prev.map((item) =>
        caseSensitive
          ? {
              ...item,
              word: item.word.replace(new RegExp(currentWord, "g"), newWord),
            }
          : {
              ...item,
              word: item.word.replace(new RegExp(currentWord, "gi"), newWord),
            }
      )
    );
  };

  return (
    <div className="flex-1 flex flex-col items-center gap-6 text-white p-4 text-pretty">
      <span className="text-gray-400 text-2xl self-start">
        {mm} : {ss} : {msms}
      </span>
      <div className="flex flex-wrap gap-2 text-[clamp(1rem,5vw,1.5rem)]">
        {transcript.map((word, index) => (
          <motion.span
            key={index}
            className={clsx(
              "cursor-pointer leading-snug",
              time >= word.start_time &&
                time < word.start_time + word.duration &&
                "text-red-500",
              editingIndex === index && "bg-yellow-500 text-black"
            )}
            onClick={() => handleWordClick(index)}
            animate={{
              scale:
                time >= word.start_time &&
                time < word.start_time + word.duration
                  ? 1.1
                  : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {word.word}
          </motion.span>
        ))}
      </div>
      <motion.div className="flex items-center gap-10" layout>
        {!isTranscriptFinished && (
          <button
            onClick={isPlaying ? pauseTimer : startTimer}
            className={clsx(
              "w-fit self-start bg-green-600 text-white flex items-center gap-2 px-3 py-2 rounded-lg",
              isPlaying && "bg-red-600"
            )}
          >
            <img src={isPlaying ? PlayIcon : PauseIcon} alt="" />
            {isPlaying ? "Pause" : "Play"}
          </button>
        )}
        {time > 0 && (
          <button
            onClick={restartTimer}
            className={clsx(
              "w-fit self-start bg-blue-600 text-white flex items-center gap-2 px-3 py-2 rounded-lg"
            )}
          >
            <img src={RestartIcon} alt="" />
            Restart
          </button>
        )}
      </motion.div>
      <AnimatePresence>
        {isModalOpen && (
          <Modal
            onClose={handleClose}
            onReplace={handleReplace}
            onReplaceAll={handleReplaceAll}
            word={currentWord}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TranscriptEditor;
