function localizeField(vehicle, fieldName, language) {
    if (language === 'mn') {
        return vehicle[`${fieldName}Mn`] || vehicle[fieldName] || '';
    }

    return vehicle[fieldName] || '';
}

function VehicleTabs({ items, selectedId, onSelect, language }) {
    return (
        <section className="vehicle-tabs" aria-label="Vehicle Tabs">
            <ul className="vehicle-tabs-list">
                {items.map((vehicle) => (
                    <li key={vehicle.id} className="vehicle-tabs-item">
                        <button
                            type="button"
                            className={`vehicle-tabs-button ${vehicle.id === selectedId ? 'vehicle-tabs-active' : ''}`}
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

export default VehicleTabs;