import { X, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Props = {
  options: string[];
  array: string[];
  setArray: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder: string;
};

function SelectInputArray({ options, array, setArray, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleOption = (value: string) => {
    setArray((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [value, ...prev]
    );
  };

  const remove = (value: string) => {
    setArray((prev) => prev.filter((x) => x !== value));
  };

  return (
    <div className="relative" ref={ref}>
      {/* Clickable div */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 text-gray-900 text-sm rounded-lg min-h-12 p-2 cursor-pointer"
      >
        {array.length === 0 && (
          <span className="text-gray-400">{placeholder}</span>
        )}

        {array.map((item) => (
          <div
            key={item}
            className="border border-slate-100 shadow rounded-2xl px-2 py-0.5 flex items-center gap-1 text-sm hover:bg-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {item}
            <span onClick={() => remove(item)} className="cursor-pointer">
              <X className="text-blue-600" size={14} />
            </span>
          </div>
        ))}

        <ChevronDown className="ml-auto text-gray-400" size={16} />
      </div>

      {/* Options dropdown */}
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow max-h-48 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => toggleOption(opt)}
              className={` px-3 py-2 cursor-pointer hover:bg-slate-100 ${
                array.includes(opt)
                  ? "flex justify-between bg-slate-100 font-medium"
                  : ""
              }`}
            >
              {opt} {array.includes(opt) ? <Check size={16} className="text-blue-600" /> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectInputArray;
