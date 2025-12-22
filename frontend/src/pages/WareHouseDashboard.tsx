import { Pencil, Trash2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import AddShipmentModal, {
  type Shipment,
} from "../components/warehouse/AddShipmentModal";
import { Button } from "../ui/Button";
import WareHouseHeader from "../components/warehouse/WareHouseHeader";
import axios from "axios";
import { Backend_Url } from "../env";
import { useSelector } from "react-redux";

//   {
//     id: 1,
//     weight: "2,300 kg",
//     volume: "10 m³",
//     destination: "New York",
//     status: "Pending",
//     utilization: 72,
//   },
//   {
//     id: 2,
//     weight: "1,750 kg",
//     volume: "8 m³",
//     destination: "San Francisco",
//     status: "Optimized",
//     utilization: 85,
//   },
//   {
//     id: 3,
//     weight: "3,200 kg",
//     volume: "15 m³",
//     destination: "Chicago",
//     status: "Booked",
//     utilization: 92,
//   },
//   {
//     id: 4,
//     weight: "1,000 kg",
//     volume: "5 m³",
//     destination: "Houston",
//     status: "In Transit",
//     utilization: 96,
//   },
// ];

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  optimized: "bg-green-100 text-green-700",
  booked: "bg-blue-100 text-blue-700",
  in_transit: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

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
                  <th className="text-left p-4">Capacity Utilization</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments?.map((s) => (
                  <tr key={s._id} className="border-b last:border-none">
                    <td className="p-4">
                      <div className="font-medium">{s.weight} kg</div>
                      <div className="text-gray-400">{s.volume} cm³</div>
                    </td>
                    <td className="p-4">{s.destination}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColor[s.status ?? ""] || ""
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-600 rounded-full"
                            style={{ width: `${s.utilization}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {s.utilization}%
                        </span>
                      </div>
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
