import { useEffect, useMemo, useState } from 'react';

import ColorSelector from '../../components/ColorSelector';
import LanguageSwitcher from '../../components/languageSwitcher';
import LogoGroup from '../../components/logoGroup';
import Specifications from '../../components/Specifications';
import TrimSelector from '../../components/TrimSelector';
import VehicleGallery from '../../components/VehicleGallery';
import VehicleTabs from '../../components/vehicleTabs';
import { useLanguage } from '../../hooks/useLanguage';
import { getVehicles } from '../../services/vehicleService';
import './home.css';

const vehicles = getVehicles();

const vehicleImageModules = import.meta.glob('../../assets/images/vehicles/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
    eager: true,
    import: 'default'
});

const FEATURED_VEHICLE_ID = 'lc300';

function resolveVehicleImage(assetPath) {
    if (!assetPath) {
        return '';
    }

    const modulePath = assetPath.replace('/src/assets/images/', '../../assets/images/');
    return vehicleImageModules[modulePath] || assetPath;
}

function localizeVehicleField(vehicle, fieldName, language) {
    if (language === 'mn') {
        return vehicle[`${fieldName}Mn`] || vehicle[fieldName] || '';
    }

    return vehicle[fieldName] || '';
}

function getFirstTrim(vehicle) {
    return vehicle?.trims?.[0] || null;
}

function getVariants(vehicle) {
    if (vehicle?.variants?.length) {
        return vehicle.variants;
    }

    return vehicle?.trims?.length
        ? [{ id: 'default', name: vehicle.name, nameMn: vehicle.nameMn || vehicle.name, trims: vehicle.trims }]
        : [];
}

function getFirstVariant(vehicle) {
    return getVariants(vehicle)[0] || null;
}

function getFirstTrimInVariant(variant) {
    return variant?.trims?.[0] || null;
}

function getColorOptions(vehicle, variant, trim) {
    if (vehicle?.colors?.length) {
        return vehicle.colors;
    }

    if (variant?.colors?.length) {
        return variant.colors;
    }

    return trim?.colors || [];
}

function getFirstColor(colors) {
    return colors?.[0] || null;
}

function buildFrameSequence(heroImage) {
    if (!heroImage) {
        return [];
    }

    const match = heroImage.match(/^(.*?)(\d+)(\.[^.]+)$/);
    if (!match) {
        return [heroImage];
    }

    const [ , prefix, frameNumber, extension ] = match;
    if (frameNumber !== '1') {
        return [heroImage];
    }

    return Array.from({ length: 16 }, (_, index) => `${prefix}${index + 1}${extension}`);
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

function HeroInfo({ vehicle, variant, trim, language }) {
    const variantName = language === 'mn' ? variant?.nameMn || variant?.name : variant?.name;
    const trimName = language === 'mn' ? trim?.nameMn || trim?.name : trim?.name;
    const displayName = trimName && variantName && trimName !== variantName ? `${variantName} · ${trimName}` : variantName || trimName;

    return (
        <section className="hero-info" aria-label="Hero Info">
            <p className="hero-category">{localizeVehicleField(vehicle, 'category', language)}</p>
            <h1 className="hero-title">{localizeVehicleField(vehicle, 'name', language)}</h1>
            <p className="hero-trim-name">{displayName}</p>
            <div className="hero-price-block">
                <p className="hero-price-label">{language === 'mn' ? 'Эхлэх үнэ' : 'Starting from'}</p>
                <p className="hero-price">{language === 'mn' ? trim?.priceMn || trim?.price : trim?.price}</p>
            </div>
            <button type="button" className="hero-cta">
                {language === 'mn' ? 'Лизинг тооцоолох' : 'Leasing Calculator'}
            </button>
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

    const selectedVehicle = vehicles[selectedIndex] || vehicles[0];
    const firstVariant = getFirstVariant(selectedVehicle);
    const firstTrim = getFirstTrimInVariant(firstVariant);

    const [selectedVariantId, setSelectedVariantId] = useState(firstVariant?.id || '');
    const [selectedTrimId, setSelectedTrimId] = useState(firstTrim?.id || '');
    const [selectedColorName, setSelectedColorName] = useState(getFirstColor(firstTrim)?.name || '');
    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
    const [isGalleryMode, setIsGalleryMode] = useState(false);

    const variants = useMemo(() => getVariants(selectedVehicle), [selectedVehicle]);

    const selectedVariant = useMemo(() => {
        if (!variants.length) {
            return null;
        }

        return variants.find((variant) => variant.id === selectedVariantId) || variants[0];
    }, [variants, selectedVariantId]);

    const selectedTrim = useMemo(() => {
        if (!selectedVariant?.trims?.length) {
            return null;
        }

        return selectedVariant.trims.find((trim) => trim.id === selectedTrimId) || selectedVariant.trims[0];
    }, [selectedVariant, selectedTrimId]);

    const colorOptions = useMemo(() => getColorOptions(selectedVehicle, selectedVariant, selectedTrim), [selectedVehicle, selectedVariant, selectedTrim]);

    const selectedColor = useMemo(() => {
        if (!colorOptions.length) {
            return null;
        }

        return colorOptions.find((color) => color.name === selectedColorName) || colorOptions[0];
    }, [colorOptions, selectedColorName]);

    const selectedColorFrames = useMemo(
        () => buildFrameSequence(selectedColor?.heroImage ? resolveVehicleImage(selectedColor.heroImage) : ''),
        [selectedColor]
    );

    const galleryImages = useMemo(
        () => {
            if (selectedColorFrames.length > 1) {
                return selectedColorFrames.map((image) => resolveVehicleImage(image));
            }

            return (selectedTrim?.gallery?.length ? selectedTrim.gallery : selectedVariant?.gallery || selectedVehicle?.gallery || []).map((image) => resolveVehicleImage(image));
        },
        [selectedColorFrames, selectedTrim, selectedVariant, selectedVehicle]
    );

    useEffect(() => {
        const variant = getFirstVariant(selectedVehicle);
        const trim = getFirstTrimInVariant(variant);
        const colors = getColorOptions(selectedVehicle, variant, trim);
        const color = getFirstColor(colors);

        setSelectedVariantId(variant?.id || '');
        setSelectedTrimId(trim?.id || '');
        setSelectedColorName(color?.name || '');
        setActiveGalleryIndex(0);
        setIsGalleryMode(false);
    }, [selectedVehicle]);

    useEffect(() => {
        const color = getFirstColor(colorOptions);
        setSelectedColorName(color?.name || '');
        setIsGalleryMode(false);
    }, [selectedTrimId, colorOptions]);

    useEffect(() => {
        const trim = getFirstTrimInVariant(selectedVariant);
        const colors = getColorOptions(selectedVehicle, selectedVariant, trim);
        const color = getFirstColor(colors);

        setSelectedTrimId(trim?.id || '');
        setSelectedColorName(color?.name || '');
        setActiveGalleryIndex(0);
        setIsGalleryMode(false);
    }, [selectedVariantId]);

    function handleSelectVehicle(id) {
        const nextIndex = vehicles.findIndex((vehicle) => vehicle.id === id);
        if (nextIndex >= 0) {
            setSelectedIndex(nextIndex);
        }
    }

    function handleSelectVariant(id) {
        setSelectedVariantId(id);
    }

    function showPrevImage() {
        if (!galleryImages.length) {
            return;
        }

        setIsGalleryMode(true);
        setActiveGalleryIndex((index) => (index - 1 + galleryImages.length) % galleryImages.length);
    }

    function showNextImage() {
        if (!galleryImages.length) {
            return;
        }

        setIsGalleryMode(true);
        setActiveGalleryIndex((index) => (index + 1) % galleryImages.length);
    }

    function handleSelectColor(colorName) {
        setSelectedColorName(colorName);
        setIsGalleryMode(false);
    }

    const heroImage = resolveVehicleImage(selectedColor?.heroImage || selectedTrim?.gallery?.[0] || selectedVariant?.gallery?.[0] || selectedVehicle?.gallery?.[0] || '');
    const mainImage = isGalleryMode ? galleryImages[activeGalleryIndex] || heroImage : heroImage;

    return (
        <div className="home-page">
            <Header items={vehicles} selectedId={selectedVehicle.id} onSelect={handleSelectVehicle} language={language} />

            <section className="hero-section">
                <HeroInfo vehicle={selectedVehicle} variant={selectedVariant} trim={selectedTrim} language={language} />

                <div className="hero-media">
                    <VehicleGallery
                        vehicleName={localizeVehicleField(selectedVehicle, 'name', language)}
                        mainImage={mainImage}
                        onPrev={showPrevImage}
                        onNext={showNextImage}
                        onSwipeLeft={showNextImage}
                        onSwipeRight={showPrevImage}
                    />
                    <ColorSelector
                        colors={colorOptions}
                        selectedColorName={selectedColor?.name || ''}
                        onSelectColor={handleSelectColor}
                    />
                </div>
            </section>

            {variants.length > 1 ? (
                <TrimSelector
                    trims={variants}
                    selectedTrimId={selectedVariant?.id || ''}
                    onSelectTrim={handleSelectVariant}
                    language={language}
                />
            ) : null}

            <TrimSelector
                trims={selectedVariant?.trims || selectedVehicle.trims || []}
                selectedTrimId={selectedTrim?.id || ''}
                onSelectTrim={setSelectedTrimId}
                language={language}
            />

            <Specifications specs={selectedTrim?.specs || []} language={language} />

            {selectedTrim?.overview?.length ? <Specifications specs={selectedTrim.overview} language={language} /> : null}

            <ChatButton />
        </div>
    );
}
