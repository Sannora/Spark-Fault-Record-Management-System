import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import DigitalTimeline from "../DigitalTimeline/DigitalTimeline";

const RecordDetail = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/records/${id}`)
      .then((res) => setRecord(res.data))
      .catch((err) => console.error("Kayıt alınamadı:", err));
  }, [id]);

  const handleAnalyze = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/analyze/digital/${id}`);
      setAnalysisResult(res.data);
    } catch (error) {
      console.error("Analiz sırasında hata:", error);
      alert("Analiz yapılamadı.");
    }
  };

  if (!record) return <p>Yükleniyor...</p>;

  const jsonData = record.jsonData;

  // Analog key'ler
  const analogKeys = ["IL1", "IL2", "IL3", "U1", "U2", "U3"];

  // Dijital key'ler
  const binaryKeys = [
    "KESICI ACIK",
    "KESICI KAPALI",
    "67-1 (faz asiri akim) TRIP",
    "67-2 (faz kisa devre) TRIP",
    "67-N1 (toprak yonlu koruma) TRIP",
    "67-N2 (toprak kisa devre) TRIP",
  ];

  // Analog grafik datası
  const chartData = jsonData.map((item, index) => {
    const analogData = {};
    analogKeys.forEach((key) => {
      analogData[key] = parseFloat(item[key]);
    });
    return { index, ...analogData };
  });

  // Dijital veri (binary)
  const rawBinaryData = jsonData.map((item, index) => {
    const bin = {};
    binaryKeys.forEach((key) => {
      bin[key] = parseInt(item[key]);
    });
    return { index, ...bin };
  });

  // DigitalTimeline için formatlama
  const binaryDataForTimeline = rawBinaryData.map((item) => {
    const entry = {};
    binaryKeys.forEach((key) => {
      entry[key] = item[key];
    });
    return entry;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Fider Raporu</h2>
      <p>
        <strong>Dosya:</strong> {record.originalFileName}
      </p>
      <p>
        <strong>Yükleme Tarihi:</strong>{" "}
        {new Date(record.uploadedAt).toLocaleString()}
      </p>
      <p>
        <strong>Toplam Kayıt:</strong> {jsonData.length}
      </p>

      {/* ANALOG GRAFİK */}
      <h3>Analog Değerler</h3>
      <LineChart width={900} height={300} data={chartData}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="index" />
        <YAxis />
        <Tooltip />
        <Legend />
        {analogKeys.map((key, idx) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={`hsl(${idx * 60},70%,50%)`}
            dot={false}
          />
        ))}
      </LineChart>

      {/* DİJİTAL ZAMAN ÇİZELGESİ */}
      <h3>Dijital Zaman Çizelgesi</h3>
      <DigitalTimeline data={binaryDataForTimeline} digitalKeys={binaryKeys} />

      {/* DİJİTAL GRAFİK */}
      <h3>Dijital Durumlar</h3>
      <LineChart width={900} height={300} data={rawBinaryData}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="index" />
        <YAxis domain={[-0.2, 1.2]} ticks={[0, 1]} />
        <Tooltip />
        <Legend />
        {binaryKeys.map((key, idx) => (
          <Line
            key={key}
            type="stepAfter"
            dataKey={key}
            stroke={`hsl(${idx * 60},70%,50%)`}
            dot={false}
          />
        ))}
      </LineChart>

      {/* OTOMATİK ANALİZ */}
      <h3>Otomatik Analiz</h3>
      <button onClick={handleAnalyze}>Analiz Et</button>
      {analysisResult && (
        <div style={{ marginTop: "1rem" }}>
          {Object.entries(analysisResult).map(([key, result]) => (
            <div
              key={key}
              style={{
                background: "#f5f5f5",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h4>{key}</h4>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecordDetail;