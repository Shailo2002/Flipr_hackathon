import { Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import AddShipmentModal, {
  type Shipment,
} from "../components/warehouse/AddShipmentModal";
import { Button } from "../ui/Button";
import WareHouseHeader from "../components/warehouse/WareHouseHeader";
import axios from "axios";
import { Backend_Url } from "../env";
import { useSelector } from "react-redux";
import { statusColor } from "../constants/Constants";
import toast from "react-hot-toast";

export default function WarehouseDashboard() {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  type LocalShipment = Shipment & {
    status?: string;
    utilization?: number;
    _id?: string;
  };
  const [shipments, setShipments] = useState<LocalShipment[]>([]);
  const [selectShipment, setSelectShipment] = useState<LocalShipment>();
  const { userData } = useSelector((state: any) => state.user);
  const [optimizedTrucks, setOptimizedTrucks] = useState([
  ]);
  const [optimizedShipment, setOptimizedShipment] = useState("");

  useEffect(() => {
    const getShipmentData = async () => {
      try {
        const response = await axios.get(
          `${Backend_Url}/api/warehouse/shipment`,
          { withCredentials: true }
        );

        console.log("response : ", response?.data?.data);
        setShipments(response?.data?.data);
      } catch (error) {
        console.log("error : ", error);
      }
    };
    getShipmentData();
  }, []);

  const handleEdit = (shipment: LocalShipment) => {
    setSelectShipment(shipment);
    setOpen(true);
    setIsEdit(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(`${Backend_Url}/api/warehouse/shipment/${id}`, {
        withCredentials: true,
      });
      setShipments((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.log("delete error", err);
    }
  };

  const handleAdd = () => {
    setIsEdit(false);
    setOpen(true);
  };

  const setInitialData = (value: {
    shipmentId: string;
    weight: number;
    volume: number;
    boxesCount: number;
    destination: string;
    deadline: string;
    status?: string;
  }) => {
    if (isEdit) {
      setShipments((prev) =>
        prev.map((item) =>
          item._id === value.shipmentId
            ? {
                ...item,
                weight: value.weight,
                volume: value.volume,
                boxesCount: value.boxesCount,
                destination: value.destination,
                deadline: new Date(value.deadline).toISOString(),
                status: value.status,
              }
            : item
        )
      );
    } else {
      setShipments((prev) => [value, ...prev]);
    }
  };

  const handleStatusChange = async (
    shipmentId?: string,
    status?:
      | "pending"
      | "optimized"
      | "booked"
      | "in_transit"
      | "delivered"
      | "cancelled"
  ) => {
    if (!shipmentId || !status) return;

    try {
      if (status === "optimized") {
        setOptimizedShipment(shipmentId);
      }
      const response = await axios.put(
        `${Backend_Url}/api/warehouse/shipment/status`,
        { shipmentId, status },
        { withCredentials: true }
      );

      if (response.data?.success) {
        setShipments((prev) =>
          prev.map((s) =>
            s._id === shipmentId ? { ...s, status: status as any } : s
          )
        );
        toast.success("Status updated");
      }
      if (response.data.data.optimizedTrucks) {
        console.log("truck list : ", response.data.data);
        setOptimizedTrucks(response.data.data.optimizedTrucks);
      }
    } catch (error: any) {
      console.log("status update error", error);
      const message =
        error?.response?.data?.message || "Failed to update status";
      toast.error(message);
    }
  };

  const handleBookTruck = async (params: {
    shipmentId?: string;
    truckId?: string;
    price: number;
    estimatedCO2Saved?: number;
  }) => {
    const { shipmentId, truckId, price, estimatedCO2Saved } = params;

    if (!shipmentId || !truckId) return;
    console.log({ shipmentId, truckId, price, estimatedCO2Saved });
    try {
      const response = await axios.post(
        `${Backend_Url}/api/booking/`,
        {
          shipmentId,
          truckId,
          price,
          estimatedCO2Saved,
        },
        { withCredentials: true }
      );

      if (response.data?.success) {
        // 1. Update shipment status locally
        setShipments((prev) =>
          prev.map((s) =>
            s._id === shipmentId
              ? { ...s, status: "booked", bookingId: response.data.data._id }
              : s
          )
        );

        // 2. Optional: remove truck from available list
        setOptimizedTrucks((prev) => prev.filter((t) => truckId !== truckId));

        toast.success("Truck booked successfully");
      }
    } catch (error: any) {
      console.log("booking error", error);
      toast.error(error?.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}

      <WareHouseHeader />

      <div className="p-6">
        <NameSection
          name={userData?.warehouse?.managerName as string}
          type="WAREHOUSE"
        />
        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Shipments"
            value={shipments.length.toString() || "0"}
          />
          <StatCard title="Avg Optimization" value="89%" />
          <StatCard title="CO₂ Saved" value="450 kg" />
        </div>

        {/* Shipments Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="font-semibold text-lg">Shipments Overview</h2>

            <Button text="+ Add Shipment" onClick={() => handleAdd()} />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left p-4">Shipment Details</th>
                  <th className="text-left p-4">Destination</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments?.map((s) => (
                  <React.Fragment key={s._id}>
                    <tr className="border-b last:border-none">
                      <td className="p-4">
                        <div className="font-medium">{s.weight} kg</div>
                        <div className="text-gray-400">{s.volume} cm³</div>
                      </td>
                      <td className="p-4">{s.destination}</td>
                      <td className="p-4">
                        <select
                          value={s.status}
                          onChange={(e) =>
                            handleStatusChange(s._id, e.target.value)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium border outline-none ${
                            statusColor[s.status ?? ""] || ""
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="optimized">Optimized</option>
                          <option value="waiting" disabled>
                            Waiting
                          </option>
                          <option value="booked" disabled>
                            Booked
                          </option>
                          <option value="in_transit" disabled>
                            In Transit
                          </option>
                          <option value="delivered" disabled>
                            Delivered
                          </option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleEdit(s)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Optimized truck list row */}
                    {optimizedShipment === s._id &&
                      optimizedTrucks?.length > 0 && (
                        <tr className="bg-gray-50 border-b">
                          <td colSpan={5} className="p-4">
                            <div className="space-y-3">
                              {optimizedTrucks?.map((t) => (
                                <div
                                  key={t.truckId}
                                  className="flex items-center justify-between bg-white p-3 px-6 rounded-lg border"
                                >
                                  <div className="flex items-center gap-4 md:gap-8 lg:gap-12 xl:gap-16 text-sm">
                                    <div>
                                      <div className="font-medium">Truck</div>
                                      <div
                                        className="text-gray-400"
                                        title={t.truckId}
                                      >
                                        #{t.truckId?.slice(-8)}
                                      </div>
                                    </div>

                                    <div className="min-w-24">
                                      {/* Container for Bar and Text */}
                                      <div>
                                        <div className="font-medium mb-1 ">
                                          Utilization
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                            <div
                                              className="h-2 bg-blue-600 rounded-full"
                                              style={{
                                                width: `${t.utilizationPercent.toFixed(
                                                  1
                                                )}%`,
                                              }}
                                            />
                                          </div>
                                          <div className="text-gray-600 text-sm whitespace-nowrap">
                                            {t.utilizationPercent.toFixed(1)}%
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <div className="font-medium">
                                        CO₂ Saved
                                      </div>
                                      <div className="text-gray-600">
                                        {t.estimatedCO2Saved} kg
                                      </div>
                                    </div>

                                    <div>
                                      <div className="font-medium">Score</div>
                                      <div className="text-gray-600">
                                        {t.score.toFixed(2)}
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() =>
                                      handleBookTruck({
                                        shipmentId: s._id,
                                        truckId: t.truckId,
                                        price: t.estimatedCost,
                                        estimatedCO2Saved: t.estimatedCO2Saved,
                                      })
                                    }
                                    className="px-4 py-1.5 rounded-full text-xs font-medium bg-blue-600 text-white hover:bg-blue-700"
                                  >
                                    Book
                                  </button>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <AddShipmentModal
          open={open}
          onClose={() => setOpen(false)}
          isEdit={isEdit}
          initialData={selectShipment}
          setInitialData={setInitialData}
        />
      </div>
    </div>
  );
}

export function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col">
      <div>
        <p className="text-xs text-gray-400">{title}</p>
        <h3 className="mt-2 text-xl font-semibold">{value}</h3>
      </div>
    </div>
  );
}

export function NameSection({
  name,
  type,
}: {
  name?: string;
  type: "WAREHOUSE" | "DEALER";
}) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-100  text-white flex items-center justify-between">
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Welcome, {name || "Manager"}</h1>
        <p className="text-sm opacity-90">
          {type === "DEALER"
            ? "Keep your dealer operations running smoothly."
            : "Driving efficiency across your warehouse operations."}
        </p>
      </div>
      <div className="hidden md:flex relative  flex justify-end items-center">
        <img src="Background_crop.svg" className="w-64 h-auto" />
      </div>
    </div>
  );
}
