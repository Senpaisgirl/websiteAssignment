import React, { useEffect, useRef, useState } from 'react';

interface FilterControlsProps {
    activeFilter: string;
    onFilterChange: (filter : string) => void;
    filterIntensity: number;
    onIntensityChange: (intensity: number) => void;
}

/**
 * Horizontal scrollable filter buttons with arrow navigation and wheel support.
 * Mobile fallback to dropdown. Includes intensity slider for active filters.
 * Filters: none, grayscale, invert, blur, sepia, brightness, contrast, saturate,
 * hue rotations, darkness, sharpen (SVG), vintage.
 */
const FilterControls : React.FC<FilterControlsProps> = ({
    activeFilter,
    onFilterChange,
    filterIntensity,
    onIntensityChange
}) => {

    const [isMobile, setIsMobile] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const filters = [
        { id: 'none', label: 'Normal' },
        { id: 'grayscale', label: 'Black & White' },
        { id: 'invert', label: 'Negativ' },
        { id: 'blur', label: 'Soft Focus' },
        { id: 'sepia', label: 'Sepia' },
        { id: 'brightness', label: 'Super Bright' },
        { id: 'contrast', label: 'Rich in Contrast' },
        { id: 'saturate', label: 'Vivid Colors' },
        { id: 'hue-rotate-90', label: 'Green Tint' },
        { id: 'hue-rotate-180', label: 'Blue Tint' },
        { id: 'hue-rotate-270', label: 'Pink Tint' },
        { id: 'darkness', label: 'Dark Mode' },
        { id: 'sharpen', label: 'Sharpened' },
        { id: 'vintage', label: 'Vintage' },
    ];

    const checkScroll = () => {
        const ref = scrollRef.current;
        if (!ref) return;
        const { scrollLeft, scrollWidth, clientWidth } = ref;
        const hasOverflow = scrollWidth > clientWidth + 20;
        setCanScrollLeft(hasOverflow && scrollLeft > 10);
        setCanScrollRight(hasOverflow && Math.abs(scrollLeft - (scrollWidth - clientWidth)) > 20);
    };

    const checkMobile = () => setIsMobile(window.innerWidth < 480);

    const handleWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        e.preventDefault();
        
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.scrollLeft += e.deltaY * 1.5;
        }
    };

    useEffect(() => {
        const ref = scrollRef.current;
        if (!ref) return;

        ref.addEventListener('wheel', handleWheel, { passive: false });
        ref.addEventListener('scroll', checkScroll);
        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
            checkMobile();
            checkScroll();
            }, 100);
        };

        window.addEventListener('resize', handleResize);
        setTimeout(() => {
            checkMobile();
            checkScroll();
        }, 50);

        return () => {
            ref.removeEventListener('wheel', handleWheel);
            ref.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    }, []);

    return (
        <div>
        {/* MOBILE: Dropdown View */}
        {isMobile ? (
            <div className="filter-dropdown">
            <select
                value={activeFilter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="filter-select"
            >
                {filters.map(({ id, label }) => (
                <option key={id} value={id}>
                    {label}
                </option>
                ))}
            </select>
            </div>
        ) : (
            /* DESKTOP: Scroll View */
            <div className="filter-scroll-container">
            <button
                className={`scroll-arrow left ${canScrollLeft ? 'visible' : ''}`}
                onClick={() => scrollRef.current?.scrollBy({ left: -150, behavior: 'smooth' })}
            >
                &lt;
            </button>

            <div ref={scrollRef} className="filter-scrollview">
                {filters.map(({ id, label }) => (
                <button
                    key={id}
                    className={activeFilter === id ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => onFilterChange(id)}
                >
                    {label}
                </button>
                ))}
            </div>

            <button
                className={`scroll-arrow right ${canScrollRight ? 'visible' : ''}`}
                onClick={() => scrollRef.current?.scrollBy({ left: 150, behavior: 'smooth' })}
            >
                &gt;
            </button>
            </div>
        )}

        {/* SHARED: Intensity Slider (Shows for both Mobile & Desktop if filter active) */}
        {activeFilter !== 'none' && (
            <div className="filter-intensity">
            <label>Preview Intensity: {Math.round(filterIntensity * 100)}%</label>
            <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={filterIntensity}
                onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
                className="intensity-slider"
            />
            </div>
        )}
        </div>
    );
};

export default FilterControls;