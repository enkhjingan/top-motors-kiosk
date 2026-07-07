import { useState, useRef } from 'react';

import LogoGroup from '../../components/logoGroup';
import LanguageSwitcher from '../../components/languageSwitcher';
import { useLanguage } from '../../hooks/useLanguage';
import { getVehicles } from '../../services/vehicleService';
import './home.css';

const vehicles = getVehicles();
const vehicleImageModules = import.meta.glob('../../assets/images/vehicles/**/*.{jpg,jpeg,png}', {
    eager: true,
    import: 'default'
});

function resolveVehicleImage(assetPath) {
    if (!assetPath) {
        return '';
    }

    const modulePath = assetPath.replace('/src/assets/images/', '../../assets/images/');
    return vehicleImageModules[modulePath] || assetPath;
}

function localizeField(vehicle, fieldName, language) {
    if (language === 'mn') {
        return vehicle[`${fieldName}Mn`] || vehicle[fieldName] || '';
    }

    return vehicle[fieldName] || '';
}

function Header() {
    return (
        <header className="home-header">
            <LogoGroup />
            <LanguageSwitcher />
        </header>
    );
}

function VehicleTabs({ items, selectedId, onSelect, language }) {
    return (
        <section className="vehicle-tabs" aria-label="Vehicle Tabs">
            <ul className="vehicle-tabs-list">
                {items.map((vehicle) => (
                    <li key={vehicle.id} className="vehicle-tabs-item">
                        <button
                            type="button"
                            className="vehicle-tabs-button"
                            aria-selected={vehicle.id === selectedId}
                            onClick={() => onSelect(vehicle.id)}
                        >
                            {localizeField(vehicle, 'tabLabel', language) || localizeField(vehicle, 'name', language)}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function HeroInfo({ vehicle, language }) {
    return (
        <section className="hero-info" aria-label="Hero Info">
            <h1 className="hero-title">{localizeField(vehicle, 'name', language)}</h1>
            <p className="hero-price">{localizeField(vehicle, 'price', language)}</p>
            <p className="hero-description">{localizeField(vehicle, 'description', language)}</p>
            <ActionButtons />
        </section>
    );
}

function VehicleViewer({ vehicle, language, onPrev, onNext }) {
    const touchStartX = useRef(null);

    function handleTouchStart(e) {
        touchStartX.current = e.touches[0].clientX;
    }

    function handleTouchEnd(e) {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (delta < -50) onNext();
        else if (delta > 50) onPrev();
        touchStartX.current = null;
    }

    return (
        <section
            className="vehicle-viewer"
            aria-label="Vehicle Viewer"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <img
                className="vehicle-image"
                src={resolveVehicleImage(vehicle.primaryImage)}
                alt={localizeField(vehicle, 'name', language)}
            />
        </section>
    );
}

function NavigationArrows({ onPrev, onNext }) {
    return (
        <section className="navigation-arrows" aria-label="Navigation Arrows">
            <button type="button" className="nav-arrow nav-arrow-prev" onClick={onPrev}>
                ◀
            </button>
            <button type="button" className="nav-arrow nav-arrow-next" onClick={onNext}>
                ▶
            </button>
        </section>
    );
}

function ActionButtons() {
    return (
        <section className="action-buttons" aria-label="Action Buttons">
            <button type="button" className="action-button">
                Дэлгэрэнгүй
            </button>
            <button type="button" className="action-button">
                Лизинг
            </button>
        </section>
    );
}

function ChatButton() {
    return (
        <aside className="chat-button" aria-label="Floating Chat Button" data-position="bottom-right-fixed">
            💬
        </aside>
    );
}

export default function Home() {
    const { language } = useLanguage();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedVehicle = vehicles[selectedIndex];

    function goPrev() {
        setSelectedIndex((i) => (i - 1 + vehicles.length) % vehicles.length);
    }

    function goNext() {
        setSelectedIndex((i) => (i + 1) % vehicles.length);
    }

    return (
        <div className="home-page">
            <Header />
            <VehicleTabs
                items={vehicles}
                selectedId={selectedVehicle.id}
                onSelect={(id) => setSelectedIndex(vehicles.findIndex((v) => v.id === id))}
                language={language}
            />

            <section className="hero-section">
                <HeroInfo vehicle={selectedVehicle} language={language} />
                <VehicleViewer vehicle={selectedVehicle} language={language} onPrev={goPrev} onNext={goNext} />
                <NavigationArrows onPrev={goPrev} onNext={goNext} />
            </section>

            <ChatButton />
        </div>
    );
}