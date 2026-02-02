import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Custom hook for managing webcam access using getUserMedia.
 * Handles starting/stopping stream, video ref, active state, and errors.
 * Requests front-facing camera at 1280x720 ideal resolution.
 */
export const useCamera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Start camera stream asynchronously
    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
            }
            setStream(mediaStream);
            setIsActive(true);
            setError(null);
        } catch (err : any) {
            setError(err.message || 'Failed to access camera');
        }
    }, []);

    // Stop all tracks in the stream
    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsActive(false);
        }
    }, [stream]);

    // Cleanup stream on unmount
    useEffect(() => {
        return () => stopCamera()
    }, [stopCamera]);

    return { videoRef, startCamera, stopCamera, isActive, error };
};
