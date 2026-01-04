import React from 'react';

interface FliterControlsProps {
    activeFilter: string;
    onFilterChange: (filter : string) => void;
}

const FilterControls : React.FC<FliterControlsProps> = ({
    activeFilter, onFilterChange
}) => {
    const filters = [
        { id: 'none', label: 'Normal', value: 'none' },
        { id: 'grayscale', label: 'black & white', value: 'grayscale(100%)' },
        { id: 'invert', label: 'negativ', value: 'invert(1)' },
        { id: 'blur', label: 'soft focus', value: 'blur(5px)' },
        { id: 'sepia', label: 'sepia', value: 'sepia(1) hue-rotate(20deg)' },
        { id: 'brightness', label: 'super bright', value: 'brightness(200%)' },
        { id: 'contrast', label: 'rich in contrast', value: 'contrast(200%)' }
    ];

    return (
        <div className='filter-controls'>
            {filters.map(({ id, label, value }) => (
            <button
                key={id}
                className={activeFilter === value ? 'filter-btn active' : 'filter-btn'}
                onClick={() => onFilterChange(value)}
            >
                {label}
            </button>
            ))}
        </div>
    );
};

export default FilterControls;