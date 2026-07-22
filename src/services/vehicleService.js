import vehicles from '../assets/data/machineDatas.json';
import lc300Override from '../assets/data/lc300.json';

const mergedVehicles = vehicles.map((vehicle) => {
  if (vehicle.id !== 'lc300') {
    return vehicle;
  }

  return {
    ...vehicle,
    variants: vehicle.variants.map((variant) => {
      const overrideVariant = lc300Override.variants.find((item) => item.id === variant.id);
      return overrideVariant ? { ...variant, ...overrideVariant } : variant;
    })
  };
});

export function getVehicles() {
  return mergedVehicles;
}

export function getVehicleById(id) {
  if (!id) {
    return null;
  }

  const normalizedId = String(id).toLowerCase();
  return mergedVehicles.find((vehicle) => String(vehicle.id || vehicle.name || '').toLowerCase() === normalizedId) || null;
}
