import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../ui/Button";
import toast from "react-hot-toast";
import axios from "axios";
import { Backend_Url } from "../../env";
import { useSelector } from "react-redux";
import Input from "../../ui/Input";
import { TruckSchema } from "../../schemas/DealerSchema";

export type Truck = {
  _id?: string;
  capacity: number;
  type: string;
  location: string;
  status: "available" | "booked" | "in_transit" | "delivered" | "cancelled";
};

type Props = {
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
  initialData?: Truck | null;
  setInitialData?: (value: Truck) => void;
};

export default function AddTruckModal({
  open,
  onClose,
  isEdit,
  initialData,
  setInitialData,
}: Props) {
  const [capacity, setCapacity] = useState(0);
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<
    "available" | "booked" | "in_transit" | "delivered" | "cancelled"
  >("available");

  const [truckId, setTruckId] = useState("");
  const [pageLoading, setPageLoading] = useState(false);

  const { userData } = useSelector((state: any) => state.user);

  const handleAddTruck = async () => {
    if (pageLoading) return;
    setPageLoading(true);

    const payload = {
      dealerId: userData.dealer._id,
      capacity,
      type,
      location,
      status,
    };

    try {
      const validateData = TruckSchema.safeParse(payload);

      if (!validateData.success) {
        validateData.error.issues.forEach((e) => toast.error(e.message));
        return;
      }
      const response = await axios.post(
        `${Backend_Url}/api/dealer/truck`,
        payload,
        { withCredentials: true }
      );

      if (response.data?.success) {
        console.log("response : ", response);
        setInitialData?.(response.data.data);
        toast.success("Truck added successfully");
        onClose();
        resetForm();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error while adding truck");
    } finally {
      setPageLoading(false);
    }
  };

  const handleEditTruck = async () => {
    if (pageLoading) return;
    setPageLoading(true);

    const payload = {
      truckId,
      capacity,
      type,
      location,
      status,
    };

    try {
      const validateData = TruckSchema.safeParse(payload);

      if (!validateData.success) {
        validateData.error.issues.forEach((e) => toast.error(e.message));
        return;
      }
      const response = await axios.put(
        `${Backend_Url}/api/dealer/truck`,
        payload,
        { withCredentials: true }
      );

      if (response.data?.success) {
        setInitialData?.(response.data.data);
        toast.success("Truck updated successfully");
        onClose();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Error while updating truck"
      );
    } finally {
      setPageLoading(false);
    }
  };

  const resetForm = () => {
    setCapacity(0);
    setType("");
    setLocation("");
    setStatus("available");
    setTruckId("");
  };

  useEffect(() => {
    console.log("truck model initital data :  ", initialData);
    if (initialData) {
      setCapacity(initialData.capacity);
      setType(initialData.type);
      setLocation(initialData.location);
      setStatus(initialData.status);
      setTruckId(initialData._id ?? "");
    }
  }, [isEdit, initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">
              {isEdit ? "Edit Truck" : "Add Truck"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEdit
                ? "Update truck details and status."
                : "Add a new truck to start receiving shipments."}
            </p>
          </div>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Capacity (kg)</label>
            <Input
              type="number"
              placeholder="Truck capacity"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />

            <label className="text-sm text-gray-600">Truck Type</label>
            <Input
              type="string"
              placeholder="e.g. 14-ft, Mini Truck"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Location</label>
            <Input
              type="string"
              placeholder="Current city / hub"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <label className="text-sm text-gray-600">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full m-2 ml-0 rounded-lg border border-slate-100 p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between border-t pt-4">
          <Button variant="outline" text="Cancel" onClick={onClose} />
          {isEdit ? (
            <Button
              text="Edit Truck"
              onClick={handleEditTruck}
              loading={pageLoading}
              disabled={pageLoading}
            />
          ) : (
            <Button
              text="Add Truck"
              onClick={handleAddTruck}
              loading={pageLoading}
              disabled={pageLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
