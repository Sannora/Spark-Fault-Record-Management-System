import './RecordDetail.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight, faCircleChevronDown } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from 'react-markdown';

const RecordDetail = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [showAnalog, setShowAnalog] = useState(false);
  const [showDigital, setShowDigital] = useState(false);

  // Eski analiz için state'ler
  const [analysisSummary, setAnalysisSummary] = useState("");
  const [analysisDetails, setAnalysisDetails] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Yeni API analizi için state'ler
  const [apiAnalysisSummary, setApiAnalysisSummary] = useState("");
  const [apiAnalysisDetails, setApiAnalysisDetails] = useState("");
  const [showApiDetails, setShowApiDetails] = useState(false);
  const [showApiAnalysis, setShowApiAnalysis] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/records/${id}`)
      .then((res) => setRecord(res.data))
      .catch((err) => console.error("Kayıt alınamadı:", err));
  }, [id]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bu kaydı silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/records/${id}`);
      alert("Kayıt başarıyla silindi.");
      navigate('/record-list');
    } catch (error) {
      console.error("Kayıt silinirken hata:", error);
      alert("Kayıt silinemedi.");
    }
  };

  // Eski analiz (analyses klasöründen)
  const handleAnalyze = async () => {
    try {
      const response = await fetch(`/analyses/${record._id}.txt`);

      if (!response.ok) {
        setAnalysisSummary("Analiz bulunamadı.");
        setAnalysisDetails("");
        setShowAnalysis(false);
        return;
      }

      const text = await response.text();

      const marker = "🔧 Arıza Senaryoları";
      const index = text.indexOf(marker);

      if (index !== -1) {
        setAnalysisSummary(text.slice(index).trim());
        setAnalysisDetails(text.slice(0, index).trim());
      } else {
        setAnalysisSummary(text);
        setAnalysisDetails("");
      }

      setShowDetails(false);
      setShowAnalysis(true);

      // Yeni API analizi açık ise kapat
      setShowApiAnalysis(false);
      setApiAnalysisSummary("");
      setApiAnalysisDetails("");
      setShowApiDetails(false);

    } catch (error) {
      console.error("Analiz yüklenemedi:", error);
      setAnalysisSummary("Analiz bulunamadı.");
      setAnalysisDetails("");
      setShowAnalysis(false);
    }
  };

  // Yeni API analiz (analyses2 klasöründen)
  const handleApiAnalyze = async () => {
    try {
      const response = await fetch(`/analyses2/${record._id}.txt`);

      if (!response.ok) {
        setApiAnalysisSummary("Analiz bulunamadı.");
        setApiAnalysisDetails("");
        setShowApiAnalysis(false);
        return;
      }

      const text = await response.text();

      const marker = "🔧 Arıza Senaryoları";
      const index = text.indexOf(marker);

      if (index !== -1) {
        setApiAnalysisSummary(text.slice(index).trim());
        setApiAnalysisDetails(text.slice(0, index).trim());
      } else {
        setApiAnalysisSummary(text);
        setApiAnalysisDetails("");
      }

      setShowApiDetails(false);
      setShowApiAnalysis(true);

      // Eski analiz açık ise kapat
      setShowAnalysis(false);
      setAnalysisSummary("");
      setAnalysisDetails("");
      setShowDetails(false);

    } catch (error) {
      console.error("API Analiz yüklenemedi:", error);
      setApiAnalysisSummary("Analiz bulunamadı.");
      setApiAnalysisDetails("");
      setShowApiAnalysis(false);
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

  const rawBinaryData = jsonData.map((item) => {
    const bin = {};
    binaryKeys.forEach((key) => {
      bin[key] = parseInt(item[key]);
    });
    return bin;
  });

  return (
    <div className="record-detail-component">
      <div className="record-detail-container">
        <p className="record-file-name"><strong>Dosya:</strong> {record.originalFileName}</p>
        <p className="record-file-date"><strong>Yükleme Tarihi:</strong> {new Date(record.uploadedAt).toLocaleString()}</p>
        <p className="record-count"><strong>Toplam Kayıt:</strong> {jsonData.length}</p>

        {/* ANALOG DEĞERLER */}
        <h3 className="analog-values-heading" onClick={() => setShowAnalog(!showAnalog)}>
          {showAnalog
            ? <FontAwesomeIcon className='icon-chevron' icon={faCircleChevronDown} />
            : <FontAwesomeIcon className='icon-chevron' icon={faCircleChevronRight} />} Analog Değerler
        </h3>
        {showAnalog && (
          <div className="analog-values-container">
            {analogKeys.map((key, idx) => (
              <div className='analog-value' key={key}>
                <h4 className='analog-value-heading'>{key}</h4>
                <LineChart width={350} height={200} data={chartData}>
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
        <h3 className="digital-status-heading" onClick={() => setShowDigital(!showDigital)}>
          {showDigital
            ? <FontAwesomeIcon className='icon-chevron' icon={faCircleChevronDown} />
            : <FontAwesomeIcon className='icon-chevron' icon={faCircleChevronRight} />} Dijital Durumlar
        </h3>
        {showDigital && (
          <div className="digital-status-container">
            {binaryKeys.map((key, idx) => (
              <div className='digital-status' key={key}>
                <h4 className='digital-status-header'>{key}</h4>
                <LineChart width={350} height={200} data={rawBinaryData.map((d, i) => ({ index: i, ...d }))}>
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

        {/* ANALİZ BUTONLARI */}
        <h3 className='analyze-heading'>Yapay Zeka Destekli Analiz</h3>
        <div className="analyze-utils">
          <button className="analyze-button" onClick={handleAnalyze}>Analiz Et</button>
          <button className="analyze-button" onClick={handleApiAnalyze}>API ile Analiz Et</button>
          <button className="delete-button" onClick={() => handleDelete(record._id)}>Kaydı Sil</button>
        </div>

        {/* ESKİ ANALİZ SONUÇLARI */}
        {analysisSummary && (
          <div className="analysis-result-container">
            <h3
              className="analysis-summary-heading"
              onClick={() => setShowAnalysis(prev => !prev)}
              style={{ cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", gap: "8px" }}
            >
              {showAnalysis
                ? <FontAwesomeIcon icon={faCircleChevronDown} />
                : <FontAwesomeIcon icon={faCircleChevronRight} />}
              Analiz Sonucu
            </h3>

            {showAnalysis && (
              <div className="analyze-results">
                <div className="markdown-body">
                  <ReactMarkdown>{analysisSummary}</ReactMarkdown>
                </div>

                {analysisDetails && (
                  <>
                    <button
                      onClick={() => setShowDetails(prev => !prev)}
                      className="details-button"
                    >
                      {showDetails ? "Detayları Gizle" : "Detaylar"}
                    </button>
                    {showDetails && (
                      <div className="markdown-body details-text">
                        <ReactMarkdown>{analysisDetails}</ReactMarkdown>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* YENİ API ANALİZ SONUÇLARI */}
        {apiAnalysisSummary && (
          <div className="analysis-result-container">
            <h3
              className="analysis-summary-heading"
              onClick={() => setShowApiAnalysis(prev => !prev)}
              style={{ cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", gap: "8px" }}
            >
              {showApiAnalysis
                ? <FontAwesomeIcon icon={faCircleChevronDown} />
                : <FontAwesomeIcon icon={faCircleChevronRight} />}
              API Analiz Sonucu
            </h3>

            {showApiAnalysis && (
              <div className="analyze-results">
                <div className="markdown-body">
                  <ReactMarkdown>{apiAnalysisSummary}</ReactMarkdown>
                </div>

                {apiAnalysisDetails && (
                  <>
                    <button
                      onClick={() => setShowApiDetails(prev => !prev)}
                      className="details-button"
                    >
                      {showApiDetails ? "Detayları Gizle" : "Detaylar"}
                    </button>
                    {showApiDetails && (
                      <div className="markdown-body details-text">
                        <ReactMarkdown>{apiAnalysisDetails}</ReactMarkdown>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default RecordDetail;
