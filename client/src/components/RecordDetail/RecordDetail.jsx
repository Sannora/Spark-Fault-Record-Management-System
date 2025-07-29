import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const RecordDetail = () => {
 
    const { id } = useParams();
    const navigate = useNavigate();
    const [record, setRecord] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/records/${id}`)
        .then((res) => setRecord(res.data))
        .catch((err) => console.error("Kayıt alınamadı:", err));
    }, [id]);

    // Kayıt silme fonksiyonu
    const handleDelete = async () => {
        const confirm = window.confirm("Bu kaydı silmek istediğinizden emin misiniz?");
        if(!confirm) return;

        try {
            await axios.delete(`http://localhost:5000/records/${id}`);
            alert("Kayıt silindi.");
            navigate('/record-list');
        } catch (error) {
            console.error(error);
            alert("Kayıt silinirken bir hata oluştu.");
        }
    }

    if (!record) return <p>Yükleniyor...</p>;

    return(
        <div>
            <h2>Fider Detayları</h2>
            <pre>{JSON.stringify(record, null, 2)}</pre>
            <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
                Sil
            </button>
        </div>
    )
}

export default RecordDetail;