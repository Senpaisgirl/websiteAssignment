import React from "react";

interface SnapshotGalleryProps {
    snapshots: string[];
    onClear: () => void;
}

/**
 * Displays grid of captured snapshots (max 10).
 * Each supports individual download; global clear button.
 */
const SnapshotGallery : React.FC<SnapshotGalleryProps> = ({ snapshots, onClear }) => {
    const downloadSnapshot = (dataUrl : string, index : number) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `webcam-wizard-${index + 1}.png`;
        a.click();
    };

    return (
        <section className="snapshot-gallery">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Your Photos ({snapshots.length}/10)</h2>
                <button className="btn-clear" onClick={onClear}>Clear All</button>
            </div>
            <div className="gallery-grid">
                {snapshots.map((snapshot, index) => (
                    <div key={index} className="snapshot-item">
                        <img src={snapshot} alt={`Snapshot ${index + 1}`} />
                        <button
                            onClick={() => downloadSnapshot(snapshot, index)}
                            className="btn-download"
                        >
                            Download
                        </button>
                </div>
                ))}
            </div>
        </section>
    );
};

export default SnapshotGallery;