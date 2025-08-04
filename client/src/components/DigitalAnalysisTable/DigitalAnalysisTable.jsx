import React from 'react';

const DigitalAnalysisTable = ({ analysisResults }) => {
  return (
    <div className="p-4 border rounded-md shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4">Dijital Sinyal Analizi</h2>
      <table className="min-w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Sinyal Adı</th>
            <th className="border p-2">İlk Değer</th>
            <th className="border p-2">Son Değer</th>
            <th className="border p-2">Değişim Sayısı</th>
            <th className="border p-2">0 Süresi (ms)</th>
            <th className="border p-2">1 Süresi (ms)</th>
          </tr>
        </thead>
        <tbody>
          {analysisResults.map((result, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">{result.signalName}</td>
              <td className="border p-2">{result.firstValue}</td>
              <td className="border p-2">{result.lastValue}</td>
              <td className="border p-2">{result.changeCount}</td>
              <td className="border p-2">{result.durations['0']}</td>
              <td className="border p-2">{result.durations['1']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DigitalAnalysisTable;
