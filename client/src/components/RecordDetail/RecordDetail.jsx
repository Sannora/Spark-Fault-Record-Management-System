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
} from "recharts";
import DigitalTimeline from "../DigitalTimeline/DigitalTimeline";

const RecordDetail = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalog, setShowAnalog] = useState(false);
  const [showDigital, setShowDigital] = useState(false);

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
  const analogKeys = ["IL1", "IL2", "IL3", "U1", "U2", "U3"];
  const binaryKeys = [
    "KESICI ACIK",
    "KESICI KAPALI",
    "67-1 (faz asiri akim) TRIP",
    "67-2 (faz kisa devre) TRIP",
    "67-N1 (toprak yonlu koruma) TRIP",
    "67-N2 (toprak kisa devre) TRIP",
  ];

  const chartData = jsonData.map((item, index) => {
    const analogData = {};
    analogKeys.forEach((key) => {
      analogData[key] = parseFloat(item[key]);
    });
    return { index, ...analogData };
  });

  const rawBinaryData = jsonData.map((item, index) => {
    const bin = {};
    binaryKeys.forEach((key) => {
      bin[key] = parseInt(item[key]);
    });
    return { index, ...bin };
  });

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
      <p><strong>Dosya:</strong> {record.originalFileName}</p>
      <p><strong>Yükleme Tarihi:</strong> {new Date(record.uploadedAt).toLocaleString()}</p>
      <p><strong>Toplam Kayıt:</strong> {jsonData.length}</p>

      {/* ANALOG DEĞERLER */}
      <h3 style={{ cursor: "pointer", color: "#007bff" }} onClick={() => setShowAnalog(!showAnalog)}>
        {showAnalog ? "▼" : "▶"} Analog Değerler
      </h3>
      {showAnalog && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
            overflowX: "auto",
            padding: "10px 0",
          }}
        >
          {analogKeys.map((key, idx) => (
            <div key={key} style={{ overflowX: "auto" }}>
              <h4 style={{ textAlign: "center" }}>{key}</h4>
              <LineChart width={600} height={250} data={chartData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={key}
                  stroke={`hsl(${idx * 60}, 70%, 50%)`}
                  dot={false}
                />
              </LineChart>
            </div>
          ))}
        </div>
      )}

      {/* DİJİTAL DURUMLAR */}
      <h3 style={{ cursor: "pointer", color: "#007bff", marginTop: "30px" }} onClick={() => setShowDigital(!showDigital)}>
        {showDigital ? "▼" : "▶"} Dijital Durumlar
      </h3>
      {showDigital && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
            overflowX: "auto",
            padding: "10px 0",
          }}
        >
          {binaryKeys.map((key, idx) => (
            <div key={key} style={{ overflowX: "auto" }}>
              <h4 style={{ textAlign: "center" }}>{key}</h4>
              <LineChart width={600} height={200} data={rawBinaryData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="index" />
                <YAxis domain={[-0.2, 1.2]} ticks={[0, 1]} />
                <Tooltip />
                <Line
                  type="stepAfter"
                  dataKey={key}
                  stroke={`hsl(${idx * 60}, 70%, 50%)`}
                  dot={false}
                />
              </LineChart>
            </div>
          ))}
        </div>
      )}

      {/* DİJİTAL ZAMAN ÇİZELGESİ */}
      <h3 style={{ marginTop: "30px" }}>Dijital Zaman Çizelgesi</h3>
      {binaryDataForTimeline.length === 0 ? (
        <p>Veri yok</p>
      ) : (
        <DigitalTimeline data={binaryDataForTimeline} digitalKeys={binaryKeys} />
      )}

      {/* ANALİZ */}
      <h3 style={{ marginTop: "30px" }}>Otomatik Analiz</h3>
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
