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
const QUICK_SPEC_LABELS = ['Engine', 'Power', 'Drive', 'Transmission', 'Seats', 'Fuel Tank', 'Top Speed', 'Acceleration'];

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

function formatHeroPrice(trim, language) {
    const rawPrice = language === 'mn' ? trim?.priceMn || trim?.price : trim?.price;
    if (!rawPrice) {
        return '';
    }

    return String(rawPrice)
        .replace(/^\s*Starting from\s*/i, '')
        .replace(/^\s*Эхлэх үнэ\s*/i, '')
        .trim();
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

function buildTrimOptions(variants, includeVariantPrefix) {
    return variants.flatMap((variant) =>
        (variant?.trims || []).map((trim) => {
            const optionId = `${variant.id}::${trim.id}`;
            const prefixedName = includeVariantPrefix ? `${variant.name} · ${trim.name}` : trim.name;
            const prefixedNameMn = includeVariantPrefix
                ? `${variant.nameMn || variant.name} · ${trim.nameMn || trim.name}`
                : trim.nameMn || trim.name;

            return {
                id: optionId,
                name: prefixedName,
                nameMn: prefixedNameMn,
                variantId: variant.id,
                trimId: trim.id
            };
        })
    );
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
                <p className="hero-price">{formatHeroPrice(trim, language)}</p>
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

    const trimOptions = useMemo(() => buildTrimOptions(variants, variants.length > 1), [variants]);
    const selectedTrimOptionId = `${selectedVariant?.id || ''}::${selectedTrim?.id || ''}`;

    const colorOptions = useMemo(() => getColorOptions(selectedVehicle, selectedVariant, selectedTrim), [selectedVehicle, selectedVariant, selectedTrim]);

    const selectedColor = useMemo(() => {
        if (!colorOptions.length) {
            return null;
        }

        return colorOptions.find((color) => color.name === selectedColorName) || colorOptions[0];
    }, [colorOptions, selectedColorName]);

    const quickSpecs = useMemo(() => {
        const sourceSpecs = selectedTrim?.specs || [];
        return QUICK_SPEC_LABELS.map((label) => sourceSpecs.find((spec) => spec.label === label)).filter(Boolean);
    }, [selectedTrim]);

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

    function handleSelectVehicle(id) {
        const nextIndex = vehicles.findIndex((vehicle) => vehicle.id === id);
        if (nextIndex >= 0) {
            setSelectedIndex(nextIndex);
        }
    }

    function handleSelectTrimOption(optionId) {
        const selectedOption = trimOptions.find((option) => option.id === optionId);
        if (!selectedOption) {
            return;
        }

        setSelectedVariantId(selectedOption.variantId);
        setSelectedTrimId(selectedOption.trimId);
        setActiveGalleryIndex(0);
        setIsGalleryMode(false);
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
                
                <TrimSelector
                    trims={trimOptions}
                    selectedTrimId={selectedTrimOptionId}
                    onSelectTrim={handleSelectTrimOption}
                    language={language}
                />

            <main className="home-content">

                    
                <section className="hero-section">
                    <div className="hero-info-column">

                        <HeroInfo vehicle={selectedVehicle} variant={selectedVariant} trim={selectedTrim} language={language} />
                    </div>

                    <div className="hero-media">
                        <VehicleGallery
                            vehicleName={localizeVehicleField(selectedVehicle, 'name', language)}
                            mainImage={mainImage}
                            onPrev={showPrevImage}
                            onNext={showNextImage}
                            onSwipeLeft={showNextImage}
                            onSwipeRight={showPrevImage}
                        />
                    </div>
                </section>

                <section className="color-section" aria-label="Color selector section">
                    <ColorSelector
                        colors={colorOptions}
                        selectedColorName={selectedColor?.name || ''}
                        onSelectColor={handleSelectColor}
                    />
                </section>

                <Specifications specs={quickSpecs} language={language} />
            </main>

            <ChatButton />
        </div>
    );
}
