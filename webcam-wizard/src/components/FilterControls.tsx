import React, { useCallback, useEffect, useRef, useState } from 'react';

interface FliterControlsProps {
    activeFilter: string;
    onFilterChange: (filter : string) => void;
}

const FilterControls : React.FC<FliterControlsProps> = ({
    activeFilter, onFilterChange
}) => {

    const [isMobile, setIsMobile] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const filters = [
        { id: 'none', label: 'Normal', value: 'none' },
        { id: 'grayscale', label: 'Black & White', value: 'grayscale(100%)' },
        { id: 'invert', label: 'Negativ', value: 'invert(1)' },
        { id: 'blur', label: 'Soft Focus', value: 'blur(5px)' },
        { id: 'sepia', label: 'Sepia', value: 'sepia(1) hue-rotate(20deg)' },
        { id: 'brightness', label: 'Super Bright', value: 'brightness(200%)' },
        { id: 'contrast', label: 'Rich in Contrast', value: 'contrast(200%)' },
        { id: 'saturate', label: 'Vivid Colors', value: 'saturate(200%)' },
        { id: 'hue-rotate-90', label: 'Green Tint', value: 'hue-rotate(90deg)' },
        { id: 'hue-rotate-180', label: 'Blue Tint', value: 'hue-rotate(180deg)' },
        { id: 'hue-rotate-270', label: 'Pink Tint', value: 'hue-rotate(270deg)' },
        { id: 'darkness', label: 'Dark Mode', value: 'brightness(40%) contrast(150%)' },
        { id: 'sharpen', label: 'Sharpened', value: 'filter: url(#sharpen)' }, 
        { id: 'vintage', label: 'Vintage', value: 'sepia(0.4) contrast(120%) saturate(110%)' },
    ];

    useEffect(() => {
        const ref = scrollRef.current;
        if (!ref) return;

        const handleWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
            e.preventDefault();
            ref.scrollLeft += e.deltaY * 1.5;
        };

        const checkScroll = () => { if(!scrollRef.current) return;
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

            const hasOverflow = scrollWidth > clientWidth + 20;
            setCanScrollLeft(hasOverflow && scrollLeft > 10);
            setCanScrollRight(hasOverflow && Math.abs(scrollLeft - (scrollWidth - clientWidth)) > 20);
        };

        ref.addEventListener('wheel', handleWheel, { passive: false });
        ref.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        const timeout = setTimeout(checkScroll, 100);

        return () => {
            ref.removeEventListener('wheel', handleWheel);
            ref.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
            clearTimeout(timeout);
        };
    }, []);


    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 480);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) {
        return (
            <div className='filter-dropdown'>
                <select
                    value={activeFilter}
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="filter-select"
                >
                    {filters.map(({ id, label, value }) => (
                        <option key={id} value={value}>{label}</option>
                    ))}
                </select>
            </div>
        );
    }
    return (
        <div className='filter-scroll-container'>
            <div 
                ref={scrollRef}
                className="filter-scrollview"
            >
                <button 
                    className={`scroll-arrow left ${canScrollLeft ? 'visible' : ''}`}
                    onClick={() => scrollRef.current?.scrollBy({ left: -150, behavior: 'smooth' })}
                >
                    ‹
                </button>
                {filters.map(({ id, label, value }) => (
                    <button
                        key={id}
                        className={activeFilter === value ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => onFilterChange(value)}
                    >
                        {label}
                    </button>
                ))}
                <button 
                    className={`scroll-arrow right ${canScrollRight ? 'visible' : ''}`}
                    onClick={() => scrollRef.current?.scrollBy({ left: 150, behavior: 'smooth' })}
                >
                    ›
                </button>
            </div>
        </div>
    );
};

export default FilterControls;