import axios from 'axios';
import { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RecordList = () => {

    const navigate = useNavigate();

    const [records, setRecords] = useState([]);

    useEffect(() => {

        axios.get('http://localhost:5000/records')
        .then(res => setRecords(res.data))
        .catch(err => console.error("Veri alınamadı:", err));

    }, []);

    return(

        <div className="record-list">
            <h2>Yüklenen Kayıtlar</h2>
            <ul>
                {records.map((record) => (
                    <div key={record._id} onClick={() => navigate(`/detail/${record._id}`)}>
                        <strong>{record.name || "İsimsiz Fider"}</strong> — {record._id}
                    </div>
                ))}
            </ul>
        </div>

    )

}

export default RecordList;