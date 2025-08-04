import React from "react";

const DigitalTimeline = ({ digitalKeys, binaryData }) => {
  if (!binaryData || digitalKeys.length === 0) return <p>Veri yok.</p>;

  // Zamanlar (indexler)
  const times = Object.keys(binaryData[digitalKeys[0]] || {}).map(Number);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dijital Durum Zaman Çizelgesi</h2>
      <div className="space-y-4 overflow-x-auto">
        {digitalKeys.map((key) => (
          <div key={key}>
            <div className="text-sm font-medium mb-1">{key}</div>
            <div className="flex">
              {times.map((t) => {
                const value = binaryData[key]?.[t];
                return (
                  <div
                    key={t}
                    title={`t=${t} → ${value}`}
                    className={`w-4 h-4 ${
                      value ? "bg-blue-500" : "bg-gray-300"
                    } border border-white`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalTimeline;
