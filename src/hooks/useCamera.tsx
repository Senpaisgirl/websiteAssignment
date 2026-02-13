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

    // Start camera stream asynchronously
    const startCamera = useCallback(async (mode: 'user' | 'environment' = 'user') => {
        // Stop any existing stream first
        if (stream) {
        stream.getTracks().forEach(track => track.stop());
        }
        
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
            }
            setStream(mediaStream);
            setFacingMode(mode);
            setIsActive(true);
            setError(null);
        } catch (err : any) {
            setError(err.message || 'Failed to access camera');
            setIsActive(false);
        }
    }, [stream]);

    //switching camera (facing mode)
    const switchCamera = useCallback( async () => {
        const newMode = facingMode === 'user' ? 'environment' : 'user';
        await startCamera(newMode);
    }, [facingMode, startCamera]);

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

    return { videoRef, startCamera, stopCamera, switchCamera, isActive, error, facingMode };
};
