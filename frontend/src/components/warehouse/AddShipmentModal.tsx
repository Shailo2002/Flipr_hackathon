import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Input from "../../ui/Input";
import { Button } from "../../ui/Button";
import { ShipmentSchema } from "../../schemas/WareHouseSchema";
import toast from "react-hot-toast";
import axios from "axios";
import { Backend_Url } from "../../env";
import { useSelector } from "react-redux";
import { MAJOR_CITIES } from "../../constants/Constants";
import type { Shipment } from "../../pages/WareHouseDashboard";

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: Shipment;
  isEdit: boolean;
  setInitialData?: (value: Shipment) => void;
};

export default function AddShipmentModal({
  open,
  onClose,
  isEdit,
  initialData,
  setInitialData,
}: Props) {
  const [weight, setWeight] = useState(0);
  const [volume, setVolume] = useState(0);
  const [boxes, setBoxes] = useState(0);
  const [destination, setDestination] = useState("San Francisco");
  const [deadline, setDeadline] = useState("");
  const [pageloading, setPageLoading] = useState(false);
  const { userData } = useSelector((state: any) => state.user);
  const [shipmentId, setShipmentId] = useState("");

  const handleAddShipment = async () => {
    if (pageloading) return;

    const payload = {
      warehouseId: userData.warehouse._id,
      weight,
      volume,
      boxesCount: boxes,
      destination,
      deadline: deadline,
    };

    const validateData = ShipmentSchema.safeParse(payload);

    if (!validateData.success) {
      const messages = validateData.error.issues.map((e) => e.message);
      messages.forEach((m) => toast.error(m));
      setPageLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${Backend_Url}/api/warehouse/shipment`,
        payload,
        { withCredentials: true }
      );

      if (response.data?.success) {
        console.log("response : ", response?.data);
        setInitialData?.({
          weight,
          volume,
          boxesCount: boxes,
          destination,
          deadline: deadline,
          _id: response?.data?.data?._id,
          status: response?.data?.data?.status,
        });

        setWeight(0);
        setVolume(0);

        toast.success("Shipment Added");
        onClose();
      }
    } catch (error: any) {
      console.log("error: ", error);

      const message =
        error?.response?.data?.message || "Error while signing up";

      toast.error(message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleEditShipment = async () => {
    if (pageloading) return;

    const payload = {
      weight,
      volume,
      boxesCount: boxes,
      destination,
      deadline: deadline,
      shipmentId,
    };

    const validateData = ShipmentSchema.safeParse(payload);

    if (!validateData.success) {
      const messages = validateData.error.issues.map((e) => e.message);
      messages.forEach((m) => toast.error(m));
      setPageLoading(false);
      return;
    }
    try {
      const response = await axios.put(
        `${Backend_Url}/api/warehouse/shipment`,
        payload,
        { withCredentials: true }
      );

      setInitialData?.({
        weight,
        volume,
        boxesCount: boxes,
        destination,
        deadline: deadline,
        _id: response?.data?.data?._id,
        status: response?.data?.data?.status,
      });
      if (response.data?.success) {
        setWeight(0);
        setVolume(0);

        toast.success("Shipment Updated");
        onClose();
      }
    } catch (error: any) {
      console.log("error: ", error);

      const message =
        error?.response?.data?.message || "Error while signing up";

      toast.error(message);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit && initialData) {
      setWeight(initialData.weight);
      setVolume(initialData.volume);
      setBoxes(initialData.boxesCount);
      setDestination(initialData.destination);
      setDeadline(initialData.deadline?.slice(0, 10));
      setShipmentId(initialData._id ?? "");
    }
  }, [isEdit, initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">
              {isEdit ? "Edit Shipment" : "Add Shipment"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEdit
                ? "Update shipment details to modify the assigned load and optimization."
                : "Enter shipment details to find the best truck for your load."}
            </p>
          </div>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div>
            <label className="text-sm text-gray-600">Weight (kg)</label>
            <Input
              type="number"
              placeholder="Weight"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />

            <label className="text-sm text-gray-600">Number of Boxes</label>
            <Input
              type="number"
              placeholder="Boxes"
              value={boxes}
              onChange={(e) => setBoxes(Number(e.target.value))}
            />

            <label className="text-sm text-gray-600">Deadline</label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="select Deadline"
            />
          </div>

          {/* Right */}
          <div>
            <label className="text-sm text-gray-600">Volume (m³)</label>
            <Input
              type="number"
              placeholder="Volume"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />

            <label className="text-sm text-gray-600">Destination Address</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full m-2 ml-0 rounded-lg border border-slate-100 p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Select city
              </option>
              {MAJOR_CITIES.map((city) => (
                <option>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between border-t pt-4">
          <Button variant="outline" text="Cancel" onClick={() => onClose()} />
          {isEdit ? (
            <Button
              text="Edit Shipment"
              onClick={() => handleEditShipment()}
              disabled={pageloading}
              loading={pageloading}
            />
          ) : (
            <Button
              text="Add Shipment"
              onClick={() => handleAddShipment()}
              disabled={pageloading}
              loading={pageloading}
            />
          )}{" "}
        </div>
      </div>
    </div>
  );
}
