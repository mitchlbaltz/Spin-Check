import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Camera, Upload, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface CameraViewProps {
  onPhotoCaptured: (base64Image: string) => void;
}

export default function CameraView({ onPhotoCaptured }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cameraState, setCameraState] = useState<"loading" | "active" | "denied" | "unsupported">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const startCamera = async () => {
    setCameraState("loading");
    setErrorMessage("");

    try {
      // Clean up previous stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraState("active");
    } catch (error: any) {
      console.warn("Camera access failed:", error);
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setCameraState("denied");
        setErrorMessage("Camera permission was denied. Please allow camera access in your browser settings, or upload a photo instead.");
      } else {
        setCameraState("unsupported");
        setErrorMessage("Camera stream is not supported or accessible on this browser/device. Please use the file upload option below.");
      }
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw the current video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL("image/jpeg", 0.85);
      
      // Stop the camera tracks to conserve power/battery
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      onPhotoCaptured(base64Image);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        onPhotoCaptured(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-md mx-auto px-4 pb-6">
      {/* Hidden file input for native capture fallback */}
      <input
        id="native-photo-capture"
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight font-display">
          Scan Political Communication
        </h2>
        <p className="text-xs text-slate-500 mt-1 px-4 leading-relaxed">
          Yard signs, flyers, news headlines, bumper stickers, social posts, or op-eds.
        </p>
      </div>

      {/* Main View Area */}
      <div className="relative flex-1 w-full min-h-[300px] bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-200/10 flex flex-col items-center justify-center">
        {cameraState === "loading" && (
          <div className="flex flex-col items-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
            <span className="text-xs">Initializing camera feed...</span>
          </div>
        )}

        {cameraState === "active" && (
          <>
            <video
              id="live-camera-video"
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Camera Overlay Guide */}
            <div className="absolute inset-4 border-2 border-dashed border-white/20 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="text-center text-[11px] text-white/50 bg-black/40 px-3 py-1.5 rounded-full font-mono">
                Align message inside frame
              </div>
            </div>
          </>
        )}

        {(cameraState === "denied" || cameraState === "unsupported") && (
          <div className="p-6 text-center max-w-sm flex flex-col items-center">
            <div className="bg-slate-800 p-3 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">Camera stream unavailable</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {errorMessage}
            </p>
            <button
              id="request-camera-retry-btn"
              onClick={startCamera}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition duration-150 mb-3"
            >
              Retry Camera Connection
            </button>
          </div>
        )}
      </div>

      {/* Action Tray */}
      <div className="mt-5 space-y-3">
        {cameraState === "active" ? (
          <div className="flex flex-col items-center space-y-4">
            <motion.button
              id="take-photo-btn"
              whileTap={{ scale: 0.95 }}
              onClick={capturePhoto}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-2xl shadow-md shadow-indigo-600/10 flex items-center justify-center space-x-2 text-base transition-colors"
            >
              <Camera className="w-5 h-5" />
              <span>Take Photo</span>
            </motion.button>

            <button
              id="upload-fallback-btn"
              onClick={triggerUpload}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center space-x-1.5 py-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload a photo instead</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <motion.button
              id="upload-photo-primary-btn"
              whileTap={{ scale: 0.95 }}
              onClick={triggerUpload}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-2xl shadow-md shadow-indigo-600/10 flex items-center justify-center space-x-2 text-base transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>Choose Photo or File</span>
            </motion.button>
            <span className="text-[10px] text-slate-400 mt-2">
              Supports photos, mailers, social screenshots
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
