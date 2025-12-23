import { Truck, Dealer } from "../models/dealer.model.js";
import { WareHouse } from "../models/warehouse.model.js";


export const runShipmentOptimization = async (shipment: any) => {
  const warehouse = await WareHouse.findById(shipment.warehouseId).lean();
  if (!warehouse) {
    throw new Error("Warehouse not found");
  }

  const pickupLocation = warehouse.location;
  const destination = shipment.destination;
  const shipmentVolume = shipment.volume;

      console.log("shipmentVoluem : ", shipmentVolume);

  const trucks = await Truck.find({
    status: "available",
    capacity: { $gte: shipmentVolume },
  }).lean();

  if (!trucks.length) {
    return [];
  }

  const pickupCity = warehouse.location;

  const cityMatchedTrucks = await Truck.find({
    status: "available",
    location: pickupCity,
  }).lean();


  const optimizedResults = [];

  // STEP 2: process ONLY city-matched trucks
  for (const truck of cityMatchedTrucks) {
    const dealer = await Dealer.findOne({ _id: truck.dealerId }).lean();
    if (!dealer) continue;

    // TEMP: skip service area check for now
    // if (!dealer.serviceAreas.includes(destination)) continue;

    const utilizationPercent = (shipmentVolume / truck.capacity) * 100;

    const distanceKm = estimateDistance(pickupLocation, destination);
    const estimatedCost = distanceKm * 25;
    const estimatedCO2Saved = distanceKm * 0.9;

    const score =
      utilizationPercent * 0.5 +
      (10000 / estimatedCost) * 0.3 +
      estimatedCO2Saved * 0.2;

    optimizedResults.push({
      truckId: truck._id,
      dealerId: dealer._id,
      utilizationPercent,
      estimatedCost,
      estimatedCO2Saved,
      score,
    });
  }

  console.log("optimisation truck list:", optimizedResults);

  // 4. Sort by best score
  optimizedResults.sort((a, b) => b.score - a.score);

  // 5. Return top matches
  return optimizedResults.slice(0, 10);
};

/**
 * Mock distance calculation (hackathon-safe)
 */
const estimateDistance = (from: string, to: string): number => {
  if (from === to) return 50;
  return 300; // fixed mock distance
};
