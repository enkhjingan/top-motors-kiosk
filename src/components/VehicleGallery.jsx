import { useEffect, useRef, useState } from 'react';

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
    const [displayImage, setDisplayImage] = useState(mainImage);
    const [isLoaded, setIsLoaded] = useState(true);

    useEffect(() => {
        setIsLoaded(false);
        setDisplayImage(mainImage);
    }, [mainImage]);

    function handleImageLoad() {
        setIsLoaded(true);
    }

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
                <button type="button" className="image-arrow image-arrow-left" aria-label="Previous image" onClick={onPrev}>
                    &lt;
                </button>
                <img
                    key={displayImage}
                    className={`vehicle-image ${isLoaded ? 'is-loaded' : 'is-loading'}`}
                    src={displayImage}
                    alt={vehicleName}
                    onLoad={handleImageLoad}
                />
                <button type="button" className="image-arrow image-arrow-right" aria-label="Next image" onClick={onNext}>
                    &gt;
                </button>
            </div>

            <p className="vehicle-rotate-hint">Drag or scroll to rotate</p>
        </section>
    );
}

export default VehicleGallery;
