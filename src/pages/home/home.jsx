import { useRef, useState } from 'react';

import LogoGroup from '../../components/logoGroup';
import LanguageSwitcher from '../../components/languageSwitcher';
import VehicleTabs from '../../components/vehicleTabs';
import { useLanguage } from '../../hooks/useLanguage';
import { getVehicles } from '../../services/vehicleService';
import './home.css';

const vehicles = getVehicles();
const vehicleImageModules = import.meta.glob('../../assets/images/vehicles/**/*.{jpg,jpeg,png}', {
    eager: true,
    import: 'default'
});

const FEATURED_VEHICLE_ID = 'lc250';

const trimOptions = [
    { id: 'standard', label: { eng: 'Standard', mn: 'Standard' } },
    { id: 'premium', label: { eng: 'Premium', mn: 'Premium' } },
    { id: 'adventure', label: { eng: 'Adventure', mn: 'Adventure' } }
];

const specMap = {
    lc250: {
        standard: {
            eng: [
                { label: 'Engine', value: '2.4L Turbo gasoline' },
                { label: 'Transmission', value: '8AT automatic' },
                { label: 'Drive', value: 'Full-time 4WD' },
                { label: 'Seats', value: '7' },
                { label: 'Wheel', value: '18”' },
                { label: 'Interior', value: 'Black fabric cabin' },
                { label: 'LED', value: 'Standard LED lights' }
            ],
            mn: [
                { label: 'Хөдөлгүүр', value: '2.4L Turbo бензин' },
                { label: 'Transmission', value: '8AT автомат' },
                { label: 'Drive', value: 'Full-time 4WD' },
                { label: 'Суудал', value: '7' },
                { label: 'Дугуй', value: '18”' },
                { label: 'Дотор', value: 'Хар даавуун салон' },
                { label: 'LED', value: 'Энгийн LED гэрэл' }
            ]
        },
        premium: {
            eng: [
                { label: 'Engine', value: '2.4L Turbo gasoline' },
                { label: 'Transmission', value: '8AT automatic' },
                { label: 'Drive', value: 'Full-time 4WD' },
                { label: 'Seats', value: '7' },
                { label: 'Interior', value: 'Leather cabin' },
                { label: 'Monitor', value: 'Panoramic monitor' },
                { label: 'Audio', value: 'JBL Audio' },
                { label: 'Wheels', value: '20” alloy wheels' },
                { label: 'Tailgate', value: 'Powered tailgate' }
            ],
            mn: [
                { label: 'Хөдөлгүүр', value: '2.4L Turbo бензин' },
                { label: 'Transmission', value: '8AT автомат' },
                { label: 'Drive', value: 'Full-time 4WD' },
                { label: 'Суудал', value: '7' },
                { label: 'Дотор', value: 'Leather салон' },
                { label: 'Monitor', value: 'Panoramic monitor' },
                { label: 'Audio', value: 'JBL Audio' },
                { label: 'Дугуй', value: '20” alloy wheels' },
                { label: 'Tailgate', value: 'Powered tailgate' }
            ]
        },
        adventure: {
            eng: [
                { label: 'Engine', value: '2.4L Turbo gasoline' },
                { label: 'Drive', value: 'Full-time 4WD' },
                { label: 'Terrain', value: 'Multi-Terrain Select' },
                { label: 'Control', value: 'Crawl Control' },
                { label: 'Lock', value: 'Rear Differential Lock' },
                { label: 'Rails', value: 'Roof rails' },
                { label: 'Bumper', value: 'Off-road bumper' },
                { label: 'Tyres', value: 'All Terrain tires' }
            ],
            mn: [
                { label: 'Хөдөлгүүр', value: '2.4L Turbo бензин' },
                { label: 'Drive', value: 'Full-time 4WD' },
                { label: 'Terrain', value: 'Multi-Terrain Select' },
                { label: 'Control', value: 'Crawl Control' },
                { label: 'Lock', value: 'Rear Differential Lock' },
                { label: 'Rails', value: 'Roof rails' },
                { label: 'Bumper', value: 'Off-road bumper' },
                { label: 'Дугуй', value: 'All Terrain tires' }
            ]
        }
    }
};

const featuredLabelMap = {
    lc250: {
        eng: { category: 'SUV', title: 'LAND CRUISER 250', priceLabel: 'Starting from', price: '₮199,900,000', cta: 'Leasing calculator' },
        mn: { category: 'SUV', title: 'LAND CRUISER 250', priceLabel: 'Эхлэх үнэ', price: '₮199,900,000', cta: 'Лизинг тооцоолох' }
    },
    lc300: {
        eng: { category: 'SUV', title: 'LAND CRUISER 300', priceLabel: 'Starting from', price: '₮485,000,000', cta: 'Leasing calculator' },
        mn: { category: 'SUV', title: 'LAND CRUISER 300', priceLabel: 'Эхлэх үнэ', price: '₮485,000,000', cta: 'Лизинг тооцоолох' }
    }
};

const heroLabelByVehicle = {
    lc250: 'LAND CRUISER 250',
    lc300: 'LAND CRUISER 300',
    rav4: 'RAV4',
    hilux: 'HILUX',
    lc70: 'LC70',
    hiace: 'HIACE',
    alphard: 'ALPHARD',
    granvia: 'GRANVIA'
};

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

function Header({ items, selectedId, onSelect, language }) {
    return (
        <header className="home-header">
            <LogoGroup />
            <VehicleTabs items={items} selectedId={selectedId} onSelect={onSelect} language={language} />
            <LanguageSwitcher />
        </header>
    );
}

function HeroInfo({ vehicle, language }) {
    const meta = featuredLabelMap[vehicle.id]?.[language] || {
        category: 'SUV',
        title: heroLabelByVehicle[vehicle.id] || localizeField(vehicle, 'name', language),
        priceLabel: language === 'mn' ? 'Эхлэх үнэ' : 'Starting from',
        price: localizeField(vehicle, 'price', language),
        cta: language === 'mn' ? 'Лизинг тооцоолох' : 'Leasing calculator'
    };

    return (
        <section className="hero-info" aria-label="Hero Info">
            <p className="hero-category">{meta.category}</p>
            <h1 className="hero-title">{meta.title}</h1>
            <div className="hero-price-block">
                <p className="hero-price-label">{meta.priceLabel}</p>
                <p className="hero-price">{meta.price}</p>
            </div>
            <button type="button" className="hero-cta">
                {meta.cta}
            </button>
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

    const colorOptions = ['#f6f6f6', '#9b1414', '#c4bfb7'];

    return (
        <section className="vehicle-viewer" aria-label="Vehicle Viewer" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className="vehicle-frame">
                <img className="vehicle-image" src={resolveVehicleImage(vehicle.primaryImage)} alt={localizeField(vehicle, 'name', language)} />
            </div>
            <div className="vehicle-swatches" aria-label="Vehicle colors">
                {colorOptions.map((color, index) => (
                    <button key={color} type="button" className={`vehicle-swatch ${index === 1 ? 'is-active' : ''}`} style={{ '--swatch-color': color }} aria-label={`Color ${index + 1}`} />
                ))}
            </div>
        </section>
    );
}

function TrimSelector({ language, selectedTrim, onSelectTrim }) {

    return (
        <section className="trim-selector" aria-label="Trim selector">
            {trimOptions.map((trim) => (
                <button
                    key={trim.id}
                    type="button"
                    className={`trim-button ${selectedTrim === trim.id ? 'is-active' : ''}`}
                    onClick={() => onSelectTrim(trim.id)}
                >
                    {trim.label[language]}
                </button>
            ))}
        </section>
    );
}

function SpecsStrip({ vehicle, language, selectedTrim }) {
    const vehicleSpecs = specMap[vehicle.id]?.[selectedTrim] || specMap[vehicle.id];
    const specs = vehicleSpecs?.[language] || [
        { label: language === 'mn' ? 'Хөдөлгүүр' : 'Engine', value: localizeField(vehicle, 'description', language) },
        { label: language === 'mn' ? 'Үнэ' : 'Price', value: localizeField(vehicle, 'price', language) }
    ];

    return (
        <section className="specs-strip" aria-label="Vehicle specifications">
            {specs.map((spec) => (
                <div key={spec.label} className="spec-item">
                    <p className="spec-label">{spec.label}</p>
                    {spec.value ? <p className="spec-value">{spec.value}</p> : null}
                </div>
            ))}
        </section>
    );
}

function ChatButton() {
    return (
        <aside className="chat-button" aria-label="Toyota Assistant" data-position="bottom-right-fixed">
            Toyota Assistant
        </aside>
    );
}

export default function Home() {
    const { language } = useLanguage();
    const initialIndex = Math.max(0, vehicles.findIndex((vehicle) => vehicle.id === FEATURED_VEHICLE_ID));
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);
    const [selectedTrim, setSelectedTrim] = useState('standard');
    const selectedVehicle = vehicles[selectedIndex];

    function goPrev() {
        setSelectedIndex((i) => (i - 1 + vehicles.length) % vehicles.length);
    }

    function goNext() {
        setSelectedIndex((i) => (i + 1) % vehicles.length);
    }

    function handleSelectVehicle(id) {
        const nextIndex = vehicles.findIndex((vehicle) => vehicle.id === id);
        if (nextIndex >= 0) {
            setSelectedIndex(nextIndex);
        }
        setSelectedTrim('standard');
    }

    return (
        <div className="home-page">
            <Header
                items={vehicles}
                selectedId={selectedVehicle.id}
                onSelect={handleSelectVehicle}
                language={language}
            />
            <section className="hero-section">
                <HeroInfo vehicle={selectedVehicle} language={language} />

                <div className="hero-media">
                    <VehicleViewer vehicle={selectedVehicle} language={language} onPrev={goPrev} onNext={goNext} />
                    <TrimSelector language={language} selectedTrim={selectedTrim} onSelectTrim={setSelectedTrim} />
                </div>
            </section>

            <SpecsStrip vehicle={selectedVehicle} language={language} selectedTrim={selectedTrim} />

            <ChatButton />
        </div>
    );
}