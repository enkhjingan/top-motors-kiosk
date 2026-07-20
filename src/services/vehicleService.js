import vehicles from '../assets/data/machineDatas.json';

export function getVehicles() {
  return vehicles;
}

export function getVehicleById(id) {
  if (!id) {
    return null;
  }

  const normalizedId = String(id).toLowerCase();
  return vehicles.find((vehicle) => String(vehicle.id || vehicle.name || '').toLowerCase() === normalizedId) || null;
}
