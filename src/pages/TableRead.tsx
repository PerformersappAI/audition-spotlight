import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Headphones, Upload, Users, Wand2, Play, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import ScriptUploader from "@/components/tableread/ScriptUploader";
import CastVoiceAssigner from "@/components/tableread/CastVoiceAssigner";
import GenerationProgress from "@/components/tableread/GenerationProgress";
import AudioPlayer from "@/components/tableread/AudioPlayer";
import type { ParsedTableRead } from "@/lib/tableread/parseScript";

const STEPS = [
  { id: 1, name: "Upload", icon: Upload },
  { id: 2, name: "Cast", icon: Users },
  { id: 3, name: "Generate", icon: Wand2 },
  { id: 4, name: "Player", icon: Play },
];

export default function TableRead() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [parsed, setParsed] = useState<ParsedTableRead | null>(null);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ id: string; audioUrl: string; mp3Blob: Blob } | null>(null);

  const reset = () => {
    setStep(1);
    setParsed(null);
    setAssignments({});
    setResult(null);
  };

  const handleParsed = (p: ParsedTableRead) => {
    setParsed(p);
    setAssignments({});
    setStep(2);
  };

  const renderStep = () => {
    if (!user) {
      return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
          <Headphones className="w-12 h-12 mx-auto text-pink-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Sign in to create a table read</h3>
          <p className="text-gray-400 mb-6">You need an account to save your generated audiobooks.</p>
          <Button onClick={() => navigate("/auth")} className="bg-pink-500 hover:bg-pink-600 text-white">
            Sign In / Sign Up
          </Button>
        </div>
      );
    }
    switch (step) {
      case 1:
        return <ScriptUploader onParsed={handleParsed} />;
      case 2:
        return parsed ? (
          <CastVoiceAssigner
            parsed={parsed}
            assignments={assignments}
            onAssignmentsChange={setAssignments}
            onContinue={() => setStep(3)}
          />
        ) : null;
      case 3:
        return parsed ? (
          <GenerationProgress
            parsed={parsed}
            assignments={assignments}
            onComplete={(r) => { setResult(r); setStep(4); }}
            onCancel={() => setStep(2)}
          />
        ) : null;
      case 4:
        return result && parsed ? (
          <AudioPlayer
            id={result.id}
            audioUrl={result.audioUrl}
            mp3Blob={result.mp3Blob}
            initialTitle={parsed.title}
            onStartOver={reset}
          />
        ) : null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/toolbox">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <Headphones className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Table Read</h1>
                <p className="text-sm text-gray-400">Turn your screenplay into a voiced audiobook — runs entirely in your browser.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const completed = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      completed ? "bg-pink-500 text-white" : active ? "bg-pink-500/20 border-2 border-pink-500 text-pink-400" : "bg-gray-800 text-gray-500"
                    }`}>
                      {completed ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${active ? "text-pink-400" : completed ? "text-white" : "text-gray-500"}`}>
                      {s.name}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-12 sm:w-20 h-0.5 mx-2 ${step > s.id ? "bg-pink-500" : "bg-gray-800"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">{renderStep()}</div>
      </div>
    </div>
  );
}
