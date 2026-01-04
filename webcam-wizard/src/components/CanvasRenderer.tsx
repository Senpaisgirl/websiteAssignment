import React, { useCallback, useEffect, useRef } from 'react';
import { useCamera  } from '../hooks/useCamera';

interface CanvasRendererProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    activeFilter: string;
    onSnapshot: (dataUrl: string) => void;
}

const CanvasRenderer : React.FC<CanvasRendererProps> = ({
    videoRef, activeFilter, onSnapshot
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);

    const renderFrame = useCallback(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (!canvas || !video || video.readyState !== video.HAVE_ENOUGH_DATA) {
            rafRef.current = requestAnimationFrame(renderFrame);
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            rafRef.current = requestAnimationFrame(renderFrame);
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.filter = activeFilter;
        ctx.drawImage(video, 0, 0);

        rafRef.current = requestAnimationFrame(renderFrame);
    }, [videoRef, activeFilter]);

    useEffect(() => {
        renderFrame();
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [renderFrame]);

    const takeSnapshot = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.toBlob((blob) => {
                if (blob) onSnapshot(URL.createObjectURL(blob));
            });
        }
    }, [onSnapshot]);

    return (
        <div className='renderer'>
            <canvas ref={canvasRef} className='video-canvas' />
            <button className='btn-snapshot' onClick={takeSnapshot}>
                Take Photo
            </button>
        </div>
    );
};

export default CanvasRenderer;