import './RecordList.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const SkeletonBar = () => (
    <li className="record-item skeleton-bar">
        <div className="skeleton-title"></div>
        <div className="record-item-utils">
            <div className="skeleton-btn"></div>
            <div className="skeleton-icon"></div>
        </div>
    </li>
);

const RecordList = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecords = async () => {
        try {
            const res = await axios.get('http://localhost:5000/records');
            setRecords(res.data);
        } catch (err) {
            console.error("Veri alınamadı:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Bu kaydı silmek istediğinize emin misiniz?");
        if (!confirmDelete) return;
        try {
            await axios.delete(`http://localhost:5000/records/${id}`);
            alert("Kayıt başarıyla silindi.");
            setRecords((prev) => prev.filter((record) => record._id !== id));
        } catch (error) {
            console.error("Kayıt silinirken hata:", error);
            alert("Kayıt silinemedi.");
        }
    };

    return (
        <div className="record-list-component">
            <div className="list-container">
                <h2 className="record-list-heading">Yüklenen Kayıtlar</h2>
                <ul className="record-list">
                    {loading
                        ? Array.from({ length: 5 }).map((_, i) => <SkeletonBar key={i} />)
                        : records.map((record) => (
                                <li className='record-item' key={record._id}>
                                    <p>
                                        <strong>{record.originalFileName || "İsimsiz Fider"}</strong> - {record._id}
                                    </p>
                                    <div className="record-item-utils">
                                        <button
                                            className="details-button"
                                            onClick={() => navigate(`/detail/${record._id}`)}
                                        >
                                            İncele
                                        </button>
                                        <FontAwesomeIcon
                                            onClick={() => handleDelete(record._id)}
                                            className='delete-icon'
                                            icon={faTrash}
                                        />
                                    </div>
                                </li>
                            ))}
                </ul>
            </div>
        </div>
    );
};

export default RecordList;
