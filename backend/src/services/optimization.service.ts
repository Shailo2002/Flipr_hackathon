import { Truck, Dealer } from "../models/dealer.model.js";
import { WareHouse } from "../models/warehouse.model.js";

/**
 * Run optimization for a shipment
 */
export const runShipmentOptimization = async (shipment: any) => {
  // 1. Get warehouse (pickup location)
  const warehouse = await WareHouse.findById(shipment.warehouseId).lean();
  if (!warehouse) {
    throw new Error("Warehouse not found");
  }

  const pickupLocation = warehouse.location;
  const destination = shipment.destination;
  const shipmentVolume = shipment.volume;

  // 2. Fetch available trucks
  const trucks = await Truck.find({
    status: "available",
    capacity: { $gte: shipmentVolume },
  }).lean();

  if (!trucks.length) {
    return [];
  }

  const pickupCity = warehouse.location;

  // STEP 1: city match
  const cityMatchedTrucks = await Truck.find({
    status: "available",
    location: pickupCity,
  }).lean();

  console.log("City matched trucks:", cityMatchedTrucks);

  const optimizedResults = [];

  // STEP 2: process ONLY city-matched trucks
  for (const truck of cityMatchedTrucks) {
    console.log("check 1 ", truck);
    const dealer = await Dealer.findOne({ _id: truck.dealerId }).lean();
    if (!dealer) continue;
    console.log("check 2");

    // TEMP: skip service area check for now
    // if (!dealer.serviceAreas.includes(destination)) continue;

    const utilizationPercent = (shipmentVolume / truck.capacity) * 100;

    const distanceKm = estimateDistance(pickupLocation, destination);
    const estimatedCost = distanceKm * 25;
    const estimatedCO2Saved = distanceKm * 0.9;
    console.log("check 3 ");

    const score =
      utilizationPercent * 0.5 +
      (10000 / estimatedCost) * 0.3 +
      estimatedCO2Saved * 0.2;
    console.log("check 4 ", score);

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
