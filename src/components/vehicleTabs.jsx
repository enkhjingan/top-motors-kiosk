import { useLocation, useNavigate } from 'react-router-dom';

import { useLanguage } from '../hooks/useLanguage';
import { getVehicles } from '../services/vehicleService';

const vehicles = getVehicles();

function localizeField(vehicle, fieldName, language) {
    if (language === 'mn') {
        return vehicle[`${fieldName}Mn`] || vehicle[fieldName] || '';
    }

    return vehicle[fieldName] || '';
}

function VehicleTabs() {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const selectedVehicleId = params.get('vehicle') || vehicles[0]?.id;

    return (
        <section className="vehicle-tabs" aria-label="Vehicle Tabs">
            <ul className="vehicle-tabs-list">
                {vehicles.map((vehicle) => (
                    <li key={vehicle.id} className="vehicle-tabs-item">
                        <button
                            type="button"
                            className="vehicle-tabs-button"
                            aria-selected={vehicle.id === selectedVehicleId}
                            onClick={() => navigate(`/home?vehicle=${vehicle.id}`)}
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