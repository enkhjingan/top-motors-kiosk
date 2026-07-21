import { useRef } from 'react';

function VehicleGallery({
    vehicleName,
    mainImage,
    onPrev,
    onNext,
    onSwipeLeft,
    onSwipeRight
}) {
    const touchStartX = useRef(null);
    const pointerStartX = useRef(null);
    const isPointerDown = useRef(false);

    function handleDragAdvance(currentX) {
        if (pointerStartX.current === null) {
            pointerStartX.current = currentX;
            return;
        }

        const delta = currentX - pointerStartX.current;
        if (Math.abs(delta) < 8) {
            return;
        }

        if (delta < 0) {
            onSwipeLeft();
        } else {
            onSwipeRight();
        }

        pointerStartX.current = currentX;
    }

    function handleTouchStart(event) {
        touchStartX.current = event.touches[0].clientX;
    }

    function handleTouchMove(event) {
        if (touchStartX.current === null) {
            return;
        }

        handleDragAdvance(event.touches[0].clientX);
    }

    function handleTouchEnd(event) {
        if (touchStartX.current === null) {
            return;
        }

        const delta = event.changedTouches[0].clientX - touchStartX.current;
        if (delta < -50) {
            onSwipeLeft();
        } else if (delta > 50) {
            onSwipeRight();
        }

        touchStartX.current = null;
    }

    function handlePointerDown(event) {
        event.preventDefault();
        isPointerDown.current = true;
        pointerStartX.current = event.clientX;
        event.currentTarget.setPointerCapture?.(event.pointerId);
    }

    function handlePointerMove(event) {
        if (!isPointerDown.current || pointerStartX.current === null) {
            return;
        }

        handleDragAdvance(event.clientX);
    }

    function handlePointerUp(event) {
        isPointerDown.current = false;
        pointerStartX.current = null;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
    }

    function handleWheel(event) {
        if (Math.abs(event.deltaX) < 1 && Math.abs(event.deltaY) < 1) {
            return;
        }

        event.preventDefault();
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        if (delta > 0) {
            onNext();
        } else {
            onPrev();
        }
    }

    return (
        <section className="vehicle-viewer" aria-label="Vehicle Viewer">
            <div
                className="vehicle-frame"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onWheel={handleWheel}
            >
                <img
                    className="vehicle-image"
                    src={mainImage}
                    alt={vehicleName}
                    draggable={false}
                    onDragStart={(event) => event.preventDefault()}
                />
            </div>

            <div className="rotate-controls" aria-label="Rotate controls">
                <button type="button" className="rotate-arrow rotate-arrow-left" aria-label="Previous frame" onClick={onPrev}>
                    &lt;
                </button>
                <p className="vehicle-rotate-hint">Drag or scroll to rotate</p>
                <button type="button" className="rotate-arrow rotate-arrow-right" aria-label="Next frame" onClick={onNext}>
                    &gt;
                </button>
            </div>
        </section>
    );
}

export default VehicleGallery;
