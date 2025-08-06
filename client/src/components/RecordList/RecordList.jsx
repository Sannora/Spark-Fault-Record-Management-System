import './RecordList.css'
import axios from 'axios';
import { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const RecordList = () => {

    const navigate = useNavigate();

    const [records, setRecords] = useState([]);

    useEffect(() => {

        axios.get('http://localhost:5000/records')
        .then(res => setRecords(res.data))
        .catch(err => console.error("Veri alınamadı:", err));

    }, []);

    return(

        <div className="record-list-component">
            <div className="list-container">
                <h2 className="record-list-heading">Yüklenen Kayıtlar</h2>
                <ul className="record-list">
                    {records.map((record) => (
                        <li className='record-item' key={record._id} onClick={() => navigate(`/detail/${record._id}`)}>
                            <p><strong>{record.originalFileName || "İsimsiz Fider"}</strong>-{record._id}</p>
                            <div className="record-item-utils">
                                <button className="details-button">İncele</button>
                                <FontAwesomeIcon className='delete-icon' icon={faTrash} />
                            </div>
                                
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    )

}

export default RecordList;