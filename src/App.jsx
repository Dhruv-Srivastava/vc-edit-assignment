import { initialTranscript } from "./data";
import TranscriptEditor from "./TranscriptEditor";

import ScribblePencilLogo from "./components/PencilScribble";

export default function App() {
  return (
    <div className="container mx-auto px-[10px] flex flex-col min-h-screen items-center gap-10 lg:gap-20">
      <div className="mt-10 flex flex-col items-center gap-4 md:flex-row">
        <h1 className="text-[1.6rem] text-white">Viralcut - Transcript Editor</h1>
        <ScribblePencilLogo />
    </div>
      <TranscriptEditor initialTranscript={initialTranscript} />
    </div>
  );
}
