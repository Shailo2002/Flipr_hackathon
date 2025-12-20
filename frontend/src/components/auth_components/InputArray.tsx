import { Plus, X } from "lucide-react";
import { Button } from "../../ui/Button";
import Input from "../../ui/Input";
import { useState } from "react";

type Props = {
  array: string[];
  setArray: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder: string;
};

function InputArray({ setArray, array,placeholder }: Props) {
  const [input, setInput] = useState("");

  const handleAddTruckType = (value: string) => {
    setArray((prev) => [value, ...prev]);
    setInput("");
  };

  const handleRemoveTruckType = (value: String) => {
    const filterTruckTypes = array.filter((x) => x !== value);
    setArray(filterTruckTypes);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAddTruckType(input);
          }
        }}
      />
      <Button
        variant="primary"
        size="sm"
        startIcon={<Plus />}
        text=""
        onClick={() => handleAddTruckType(input)}
        className="absolute top-1 right-1"
      />
      <div className="flex flex-wrap gap-2 bg-white border border-slate-200 text-gray-900 text-sm rounded-lg min-h-16 max-h-32 max-w-90 p-2 overflow-scroll">
        {array?.map((item) => (
          <div className="border border-slate-100 shadow rounded-2xl p-0.5 px-1 flex justify-center items-center gap-1 text-sm hover:bg-slate-100 max-h-7">
            {item}
            <span
              onClick={() => handleRemoveTruckType(item)}
              className="cursor-pointer"
            >
              <X className="text-blue-600" size={16} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InputArray;
