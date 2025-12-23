import { useEffect, useState } from "react";
import WareHouseHeader from "../components/warehouse/WareHouseHeader";
import { NameSection, StatCard } from "./WareHouseDashboard";
import { useSelector } from "react-redux";
import AddTruckModal from "../components/dealer_components/AddTruckModal";
import axios from "axios";
import { Backend_Url } from "../env";
import { statusColor } from "../constants/Constants";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

export default function DealerDashboard() {
  interface Truck {
    _id: string;
    name?: string;
    capacity?: number;
    type?: string;
    location?: string;
    status?: string;
    utilization?: number;
  }

  const { userData } = useSelector((state: any) => state.user);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [bookings, setBookings] = useState([]);
  

  useEffect(() => {
    const getTruckData = async () => {
      try {
        const response = await axios.get(`${Backend_Url}/api/dealer/truck`, {
          withCredentials: true,
        });

        console.log("trucks : ", response?.data?.data);
        setTrucks(response?.data?.data);
      } catch (error) {
        console.log("error : ", error);
      }
    };

    const getDealerBookings = async () => {
      try {
        const response = await axios.get(`${Backend_Url}/api/dealer/bookings`, {
          withCredentials: true,
        });

        if (response.data?.success) {
          console.log("dealer bookings:", response.data.data);
          setBookings(response.data.data);
        }
      } catch (error) {
        console.log("get dealer bookings error", error);
      }
    };

    getDealerBookings();

    getTruckData();
  }, []);

  const handleEdit = (truck: Truck) => {
    setSelectedTruck(truck);
    setOpen(true);
    setIsEdit(true);
  };

  const handleDeleteTruck = async (truckId?: string) => {
    if (!truckId) return;

    try {
      await axios.delete(`${Backend_Url}/api/dealer/truck/${truckId}`, {
        withCredentials: true,
      });

      setTrucks((prev) => prev.filter((t) => t._id !== truckId));
    } catch (err: any) {
      console.log("delete truck error", err);
    }
  };

  const setInitialTruckData = (value: {
    _id?: string;
    capacity: number;
    type: string;
    location: string;
    status: "available" | "booked" | "in_transit" | "delivered" | "cancelled";
  }) => {
    if (isEdit) {
      setTrucks((prev) =>
        prev.map((item) =>
          item._id === value._id
            ? {
                ...item,
                capacity: value.capacity,
                type: value.type,
                location: value.location,
                status: value.status,
                _id: value._id,
              }
            : item
        )
      );
    } else {
      const newTruck: Truck = {
        _id: value._id!,
        capacity: value.capacity,
        type: value.type,
        location: value.location,
        status: value.status,
      };
      setTrucks((prev) => [newTruck, ...prev]);
    }
  };

  const handleStatusChange = async (
    id?: string,
    status?:
      string
  ) => {
    if (!id || !status) return;

    try {
      const response = await axios.patch(
        `${Backend_Url}/api/dealer/truck/status`,
        { truckId:id, status },
        { withCredentials: true }
      );

      if (response.data?.success) {
        setTrucks((prev) =>
          prev?.map((truck) =>
            truck._id === id ? { ...truck, status: status as any } : truck
          )
        );
        toast.success("Status updated");
      }
    } catch (error: any) {
      console.log("status update error", error);
      const message =
        error?.response?.data?.message || "Failed to update status";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <WareHouseHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main content */}
        <main className="">
          {/* Header / Hero */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <NameSection
              name={userData?.dealer?.dealerName as string}
              type="DEALER"
            />
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <StatCard
                title="Total Trucks"
                value={trucks.length.toString() || "100+"}
              />
              <StatCard title="Active Trips" value={`42 trips`} />
              <StatCard title="Avg Utilization" value={`50 %`} />
              <StatCard title="CO₂ Saved" value={`456 kg`} />
            </div>
          </div>

          <div className="mt-6 rounded-xl overflow-hidden bg-gradient-to-r from-slate-50 to-white p-6 flex gap-6 items-center">
            {/* Hero left */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Welcome, John Doe</h2>
              <p className="text-sm text-gray-500 mt-1">
                Keep your warehouse operations running smoothly by optimizing
                shipments efficiently.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
                  onClick={() => {
                    setSelectedTruck({
                      _id: "",
                      capacity: 0,
                      type: "",
                      location: "",
                      status: "available",
                    });
                    setIsEdit(false);
                    setOpen(true);
                  }}
                >
                  Add Truck
                </button>
                <button className="px-3 py-2 rounded-lg border text-sm">
                  Go to Requests
                </button>
              </div>
            </div>
          </div>

          <section className="bg-white rounded-2xl shadow-sm p-6">
            {/* Truck list */}{" "}
            <div className="mt-6">
              <ul className="space-y-3">
                {trucks.map((t) => (
                  <li
                    key={t._id}
                    className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center">
                        <img src="Background_crop.svg" />
                      </div>

                      <div>
                        <div className="text-sm font-medium">{t.type} </div>

                        <div className="text-xs text-gray-400">
                          #{t._id.slice(-8)}
                        </div>

                        <div className="text-xs text-gray-500">
                          location : {t.location}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Capacity:{" "}
                          <span className="font-semibold">{t.capacity} kg</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600">
                        Util:{" "}
                        <span className="font-semibold">
                          {t.utilization || "60"}%
                        </span>
                      </div>
                      <span>
                        <select
                          value={t.status}
                          onChange={(e) =>
                            handleStatusChange(t._id, e.target.value)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium border outline-none ${
                            statusColor[t.status ?? ""] || ""
                          }`}
                        >
                          <option value="available">available</option>
                          <option value="booked" disabled>
                            Booked
                          </option>
                          <option value="in_transit">In Transit</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled" disabled>
                            Cancelled
                          </option>
                        </select>
                      </span>
                      <div>
                        <button
                          className="px-2 py-2 rounded-md text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          onClick={() => handleEdit(t)}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTruck(t._id)}
                          className="px-2 py-2 rounded-md text-sm text-red-600 hover:text-red-800 hover:bg-red-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {trucks.length === 0 && (
                <div className="text-sm text-gray-400 mt-4">
                  No trucks found.
                </div>
              )}

              {/* pagination placeholder */}
              <div className="mt-4 flex items-center justify-end text-sm text-gray-500">
                <div>1 / 1</div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <AddTruckModal
        open={open}
        onClose={() => setOpen(false)}
        isEdit={isEdit}
        initialData={selectedTruck}
        setInitialData={setInitialTruckData}
      />
    </div>
  );
}

/* Helper UI components */

function StatusBadge({ status }: { status: string }) {
  const color =
    status === STATUS.AVAILABLE
      ? "bg-green-100 text-green-700"
      : status === STATUS.BOOKED
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-800";
  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${color}`}>
      {status}
    </span>
  );
}
