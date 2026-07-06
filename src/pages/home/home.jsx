import { useState } from 'react';

import LogoGroup from '../../components/logoGroup';
import LanguageSwitcher from '../../components/languageSwitcher';
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

function Header() {
    return (
        <header className="home-header">
            <LogoGroup />
            <LanguageSwitcher />
        </header>
    );
}

function VehicleTabs({ items, selectedId, onSelect }) {
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
                            {vehicle.tabLabel || vehicle.name}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function HeroInfo({ vehicle }) {
    return (
        <section className="hero-info" aria-label="Hero Info">
            <h1 className="hero-title">{vehicle.name}</h1>
            <p className="hero-price">{vehicle.price}</p>
            <p className="hero-description">{vehicle.description}</p>
        </section>
    );
}

function VehicleViewer({ vehicle }) {
    return (
        <section className="vehicle-viewer" aria-label="Vehicle Viewer">
            <img className="vehicle-image" src={resolveVehicleImage(vehicle.primaryImage)} alt={vehicle.name} />
        </section>
    );
}

function NavigationArrows() {
    return (
        <section className="navigation-arrows" aria-label="Navigation Arrows">
            <button type="button" className="nav-arrow nav-arrow-prev">
                ◀
            </button>
            <button type="button" className="nav-arrow nav-arrow-next">
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
    const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
    const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId) || vehicles[0];

    return (
        <div className="home-page">
            <Header />
            <VehicleTabs items={vehicles} selectedId={selectedVehicle.id} onSelect={setSelectedVehicleId} />

            <section className="hero-section">
                <HeroInfo vehicle={selectedVehicle} />
                <VehicleViewer vehicle={selectedVehicle} />
                <NavigationArrows />
            </section>

            <ActionButtons />

            <ChatButton />
        </div>
    );
}