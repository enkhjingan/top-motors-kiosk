import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useLanguage } from "../../hooks/useLanguage";
import { getVehicles } from "../../services/vehicleService";
import "./home.css";

const vehicles = getVehicles();

const vehicleImageModules = import.meta.glob(
  "../../assets/images/vehicles/**/*.{jpg,jpeg,png}",
  {
    eager: true,
    import: "default",
  }
);

function resolveVehicleImage(assetPath) {
  if (!assetPath) return "";

  const modulePath = assetPath.replace(
    "/src/assets/images/",
    "../../assets/images/"
  );

  return vehicleImageModules[modulePath] || assetPath;
}

function localizeField(vehicle, fieldName, language) {
  if (!vehicle) return "";

  return language === "mn"
    ? vehicle[`${fieldName}Mn`] || vehicle[fieldName] || ""
    : vehicle[fieldName] || "";
}

function HeroInfo({ vehicle, language }) {
  if (!vehicle) return null;

  return (
    <section className="hero-info">
      <h1 className="hero-title">
        {localizeField(vehicle, "name", language)}
      </h1>

      <p className="hero-price">
        {localizeField(vehicle, "price", language)}
      </p>

      <p className="hero-description">
        {localizeField(vehicle, "description", language)}
      </p>

      <ActionButtons />
    </section>
  );
}

function VehicleViewer({ vehicle, language, onPrev, onNext }) {
  const touchStartX = useRef(null);

  if (!vehicle) return null;

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current == null) return;

    const delta = e.changedTouches[0].clientX - touchStartX.current;

    if (delta < -50) onNext();
    else if (delta > 50) onPrev();

    touchStartX.current = null;
  }

  return (
    <section
      className="vehicle-viewer"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        className="vehicle-image"
        src={resolveVehicleImage(vehicle.primaryImage)}
        alt={localizeField(vehicle, "name", language)}
      />
    </section>
  );
}

function NavigationArrows({ onPrev, onNext }) {
  return (
    <section className="navigation-arrows">
      <button
        type="button"
        className="nav-arrow nav-arrow-prev"
        onClick={onPrev}
      >
        ◀
      </button>

      <button
        type="button"
        className="nav-arrow nav-arrow-next"
        onClick={onNext}
      >
        ▶
      </button>
    </section>
  );
}

function ActionButtons() {
  return (
    <section className="action-buttons">
      <button className="action-button">Дэлгэрэнгүй</button>
      <button className="action-button">Лизинг</button>
    </section>
  );
}

function ChatButton() {
  return (
    <aside
      className="chat-button"
      data-position="bottom-right-fixed"
    >
      💬
    </aside>
  );
}

export default function Home() {
  const { language } = useLanguage();

  const [searchParams, setSearchParams] = useSearchParams();

  const initialVehicleId =
    searchParams.get("vehicle") || vehicles[0]?.id;

  const initialIndex = vehicles.findIndex(
    (v) => v.id === initialVehicleId
  );

  const [selectedIndex, setSelectedIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );

  const selectedVehicle = vehicles[selectedIndex];

  useEffect(() => {
    const vehicleId = searchParams.get("vehicle");

    if (!vehicleId) return;

    const index = vehicles.findIndex((v) => v.id === vehicleId);

    if (index >= 0 && index !== selectedIndex) {
      setSelectedIndex(index);
    }
  }, [searchParams, selectedIndex]);

  useEffect(() => {
    if (!selectedVehicle) return;

    const currentVehicle = searchParams.get("vehicle");

    if (currentVehicle !== selectedVehicle.id) {
      setSearchParams(
        { vehicle: selectedVehicle.id },
        { replace: true }
      );
    }
  }, [selectedVehicle?.id]);

  function goPrev() {
    setSelectedIndex((i) => (i - 1 + vehicles.length) % vehicles.length);
  }

  function goNext() {
    setSelectedIndex((i) => (i + 1) % vehicles.length);
  }

  if (!selectedVehicle) {
    return <div>No vehicles found.</div>;
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <HeroInfo
          vehicle={selectedVehicle}
          language={language}
        />

        <VehicleViewer
          vehicle={selectedVehicle}
          language={language}
          onPrev={goPrev}
          onNext={goNext}
        />

        <NavigationArrows
          onPrev={goPrev}
          onNext={goNext}
        />
      </section>

      <ChatButton />
    </div>
  );
}