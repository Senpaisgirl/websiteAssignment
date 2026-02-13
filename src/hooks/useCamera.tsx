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
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

    // Helper to stop tracks without resetting state (for switching)
    const stopTracks = (mediaStream: MediaStream | null) => {
        if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        }
    };

    // Start camera stream asynchronously
    const startCamera = useCallback(async (mode: 'user' | 'environment' = 'user') => {  
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } }
            });

            if (videoRef.current && videoRef.current.srcObject) {
                const oldStream = videoRef.current.srcObject as MediaStream;
                stopTracks(oldStream);
            }

            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
                videoRef.current.play();
            }
            setStream(newStream);
            setFacingMode(mode);
            setIsActive(true);
            setError(null);
        } catch (err : any) {
            setError(err.message || 'Failed to access camera');
            setIsActive(false);
        }
    }, []);

    //switching camera (facing mode)
    const switchCamera = useCallback(() => {
        const newMode = facingMode === 'user' ? 'environment' : 'user';
        startCamera(newMode);
    }, [facingMode, startCamera]);

    // Stop all tracks in the stream
    const stopCamera = useCallback(() => {
        if (stream) {
            stopTracks(stream);
            setStream(null);
            setIsActive(false);
        }
    }, [stream]);

    // Cleanup stream on unmount
    useEffect(() => {
        return () => stopTracks(stream);
    }, [stream]);

    return { videoRef, startCamera, stopCamera, switchCamera, isActive, error, facingMode };
};
