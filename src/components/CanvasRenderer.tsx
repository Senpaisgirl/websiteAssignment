import React, { useCallback, useEffect, useRef } from 'react';
import { LocationData } from '../hooks/useGeolocation';

interface CanvasRendererProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    activeFilter: string;
    filterIntensity: number;
    location?: LocationData | null;
    onSnapshot: (dataUrl: string) => void;
    onStop: () => void
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
    location,
    onSnapshot,
    onStop
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

    /**
     * Main render loop: 60fps video → canvas with filters + GPS overlays
     * - Applies CSS filter (grayscale/sepia/etc)
     * - Draws GPS accuracy circle + compass + coords + CITY NAME
     * - All overlays BAKED INTO SNAPSHOTS permanently
     */
    const renderFrame = useCallback(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        // Early exit if no video/canvas ready
        if (!canvas || !video || video.readyState !== video.HAVE_ENOUGH_DATA) {
            rafRef.current = requestAnimationFrame(renderFrame);
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            rafRef.current = requestAnimationFrame(renderFrame);
            return;
        }

        // Match canvas to video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Apply selected filter
        ctx.filter = parseAndApplyIntensity(activeFilter, filterIntensity);
        ctx.drawImage(video, 0, 0);

        // geolocation overlay
        if (location && ctx) {
            ctx.save(); // Isolate overlay layer
            
            const centerX = canvas.width / 2;
            
            /* 2. COMPASS NEEDLE (top center) */
            if (location.heading !== undefined) {
            ctx.save();
            ctx.translate(centerX, 130);
            ctx.rotate((location.heading * Math.PI) / 180);
            
            // Needle shaft (gradient)
            const gradient = ctx.createLinearGradient(0, 0, 0, -40);
            gradient.addColorStop(0, '#4ecdc4');
            gradient.addColorStop(1, '#45b7d1');
            ctx.fillStyle = gradient;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#4ecdc4';
            ctx.fillRect(-4, 0, 8, 45);
            
            ctx.restore();
            
            // Compass ring
            ctx.strokeStyle = 'rgba(255,255,255,0.7)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, 130, 50, 0, 2 * Math.PI);
            ctx.stroke();
            }
            
            /* 3. GPS COORDINATES (top-right) */
            ctx.fillStyle = 'rgba(255, 255, 255, 0.97)';
            ctx.font = 'bold 24px "Courier New", monospace';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 6;
            
            ctx.fillText(
            `${location.latitude.toFixed(4)}°N`, 
            canvas.width - 30, 50
            );
            ctx.fillText(
            `${location.longitude.toFixed(4)}°E`, 
            canvas.width - 30, 85
            );
            
            /* 4. CITY NAME (bottom-right - MAIN FEATURE) */
            if (location.cityName) {
            ctx.font = 'bold 36px -apple-system, sans-serif';
            ctx.shadowBlur = 12;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
            
            // Measure text width for perfect positioning
            ctx.fillText(
                location.cityName,
                canvas.width - 40,
                canvas.height - 45
            );
            }
            
            ctx.restore(); // End overlay layer
        }

        rafRef.current = requestAnimationFrame(renderFrame);
    }, [videoRef, activeFilter, filterIntensity, location]);

    useEffect(() => {
        renderFrame();
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [renderFrame]);

    const takeSnapshot = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            onSnapshot(url);
        }, 'image/png');
    }, [onSnapshot]);

    return (
        <div className='renderer'>
            <canvas ref={canvasRef} className='video-canvas' />
            <div className='camera-actions'>
                <button className='btn-snapshot' onClick={takeSnapshot}>
                    Take Photo
                </button>
                <button className="btn-stop" onClick={onStop}>
                    Stop Kamera
                </button>
            </div>
            
        </div>
    );
};

export default CanvasRenderer;