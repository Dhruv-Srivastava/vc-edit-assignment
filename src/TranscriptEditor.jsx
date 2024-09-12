import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

import { useTimer } from "./hooks/use-timer";

import { formatTime } from "./utils";

import Modal from "./components/Modal";

import PlayIcon from "./assets/play.svg";
import PauseIcon from "./assets/pause.svg";
import RestartIcon from "./assets/restart.svg";
import Checkmark from "./components/AnimatedSVGs/Finished";
import LoadingSpinner from "./components/AnimatedSVGs/Loading";

const TranscriptEditor = ({ initialTranscript }) => {
  const [transcript, setTranscript] = useState(initialTranscript);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [recentlyEditedWords, setRecentlyEditedWords] = useState([]);

  const { time, isPlaying, pauseTimer, startTimer, restartTimer } = useTimer();
  const {
    time: recentEditedTimeElapsed,
    isPlaying: isRecentTimeElapsedPlaying,
    startTimer: startRecentEditedTimeElapsed,
    restartTimer: restartRecentEditedTimeElapsed,
  } = useTimer();

  const { mm, ss, msms } = formatTime(time);
  const totlaTranscriptDuration =
    transcript.at(-1).start_time + transcript.at(-1).duration;

  const isTranscriptFinished = time >= totlaTranscriptDuration;

  useEffect(
    function checkTranscriptFinish() {
      if (isTranscriptFinished) {
        pauseTimer();
      }
    },
    [pauseTimer, isTranscriptFinished]
  );

  useEffect(
    function checkRecentEdited() {
      if (recentEditedTimeElapsed >= 800) {
        setRecentlyEditedWords([]);
        restartRecentEditedTimeElapsed();
      }
    },
    [
      recentEditedTimeElapsed,
      isRecentTimeElapsedPlaying,
      startRecentEditedTimeElapsed,
      restartRecentEditedTimeElapsed,
    ]
  );

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

  const handleReplace = (newWord) => {
    setTranscript((prev) =>
      prev.map((item, index) => {
        return index === editingIndex
          ? { ...item, word: newWord }
          : { ...item };
      })
    );
    setRecentlyEditedWords([editingIndex]);
    startRecentEditedTimeElapsed();
  };

  const handleReplaceAll = (newWord, caseSensitive) => {
    const indexEdited = [];
    setTranscript((prev) => {
      return prev.map((item, index) => {
        let isMatch;
        if (caseSensitive) isMatch = prev[editingIndex].word === item.word;
        else
          isMatch =
            prev[editingIndex].word.toLowerCase() === item.word.toLowerCase();

        if (isMatch) indexEdited.push(index);
        return isMatch ? { ...item, word: newWord } : { ...item };
      });
    });
    setRecentlyEditedWords(indexEdited);
    startRecentEditedTimeElapsed();
  };

  return (
    <div className="flex-1 flex flex-col items-center gap-6 text-white p-4 text-pretty">
      <div className="self-start flex items-center gap-6">
        <span className=" text-gray-400 text-2xl font-mono">
          {mm} : {ss} : {msms}
        </span>
        {time > 0 &&
          (isTranscriptFinished ? <Checkmark /> : <LoadingSpinner />)}
      </div>
      <div className="flex flex-wrap gap-2 text-[clamp(1rem,5vw,1.5rem)]">
        {transcript.map((word, index) => (
          <motion.span
            key={index}
            className={clsx(
              "cursor-pointer leading-snug transition-colors duration-300",
              time >= word.start_time &&
                time < word.start_time + word.duration &&
                "text-red-500",
              isTranscriptFinished &&
                index === transcript.length - 1 &&
                "text-red-500",
              recentlyEditedWords.includes(index) &&
                "bg-yellow-500 text-black "
            )}
            onClick={() => {
              restartRecentEditedTimeElapsed();
              handleWordClick(index);
            }}
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
