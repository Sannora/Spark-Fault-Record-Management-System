import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
  const [jsonData, setJsonData] = useState(null);

  const handleFileChange = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);  // doğru alan adı
  
    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      setJsonData(res.data);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {jsonData && (
        <pre>{JSON.stringify(jsonData, null, 2)}</pre>
      )}
    </div>
  );
}
