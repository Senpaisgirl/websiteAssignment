import React, { useCallback, useEffect, useRef } from 'react';

interface CanvasRendererProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    activeFilter: string;
    filterIntensity: number;
    onSnapshot: (dataUrl: string) => void;
}

/**
 * Renders live video to canvas with real-time CSS filter effects.
 * Uses requestAnimationFrame for smooth 60fps rendering.
 * Supports intensity scaling for each filter type.
 */
const CanvasRenderer : React.FC<CanvasRendererProps> = ({
    videoRef,
    activeFilter,
    filterIntensity,
    onSnapshot
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);

    // Parse filter name and apply intensity scaling (0-2 range)
    const parseAndApplyIntensity = (baseFilter: string, intensity: number): string => {
        if (baseFilter === 'none') return 'none';
        const i = Math.max(0, Math.min(2, intensity));
        switch (baseFilter) {
            case 'grayscale':
            return `grayscale(${Math.min(100, i * 100)}%)`;
            case 'invert':
            return `invert(${Math.min(1, i)})`;
            case 'blur':
            return `blur(${Math.min(20, i * 5)}px)`;
            case 'sepia':
            return `sepia(${Math.min(1, i)}) hue-rotate(${i * 20}deg)`;
            case 'brightness':
            return `brightness(${100 + (i - 1) * 100}%)`;
            case 'contrast':
            return `contrast(${100 + (i - 1) * 100}%)`;
            case 'saturate':
            return `saturate(${100 + (i - 1) * 100}%)`;
            case 'hue-rotate-90':
            return `hue-rotate(${i * 90}deg)`;
            case 'hue-rotate-180':
            return `hue-rotate(${i * 180}deg)`;
            case 'hue-rotate-270':
            return `hue-rotate(${i * 270}deg)`;
            case 'darkness':
            return `brightness(${60 - i * 20}%) contrast(${120 + i * 30}%)`;
            case 'sharpen':
            return 'url(#sharpen)';
            case 'vintage':
            return `sepia(${0.4 * i}) contrast(${100 + i * 20}%) saturate(${100 + i * 10}%)`;
            default:
            return baseFilter;
        }
    };

    // Continuous render loop
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

        ctx.filter = parseAndApplyIntensity(activeFilter, filterIntensity);
        ctx.drawImage(video, 0, 0);

        rafRef.current = requestAnimationFrame(renderFrame);
    }, [videoRef, activeFilter, filterIntensity]);

    useEffect(() => {
        renderFrame();
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [renderFrame]);

    // Capture canvas as data URL for snapshot
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