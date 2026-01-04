import { useCallback, useEffect, useRef, useState } from "react";

export const useCamera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
                setStream(mediaStream);
                setIsActive(true);
                setError(null);
            }
        } catch (err : any) {
            setError(err.message);
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsActive(false);
        }
    }, [stream]);

    useEffect(() => () => stopCamera(), [stopCamera]);

    return { videoRef, startCamera, stopCamera, isActive, error };
};
