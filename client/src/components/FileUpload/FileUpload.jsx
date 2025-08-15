import './FileUpload.css'
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function UploadForm() {

  const navigate = useNavigate();

  const [fileQueue, setFileQueue] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Dosya inputunu tetikle
  const handleClick = () => {
    fileInputRef.current.click();
  };

  // Drag & Drop eventleri
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setFileQueue(prev => [...prev, ...files]);
  };

  // Seçili dosyaları kuyruğa ekle
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileQueue(prev => [...prev, ...files]);
    e.target.value = '';
  };

  // Kuyruktan bir dosyayı indeksine göre kaldır
  const handleRemoveFile = (idx) => {
    setFileQueue(prev => prev.filter((_, i) => i !== idx));
  };

  // Kuyruktaki tüm dosyaları yükle
  const handleConfirmUpload = async () => {
    if (fileQueue.length === 0) return;
    const formData = new FormData();
    fileQueue.forEach(file => formData.append('file', file));
    try {
      await axios.post('http://localhost:5000/upload', formData);
      setFileQueue([]); // Yükleme sonrası kuyruğu temizle
      navigate('/record-list');
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  // Tüm kuyruğu temizle
  const handleClearQueue = () => {
    setFileQueue([]);
  };

  return (
    <div className="file-upload-component">
      <div className="file-upload-card">
        <h2 className="file-upload-header">Dosya Yükle</h2>
        <div
          className={`file-input-container drop-zone${isDragging ? ' dragging' : ''}`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragging ? '2px dashed #007bff' : '2px dashed #ccc',
            padding: '24px',
            borderRadius: '8px',
            cursor: 'pointer',
            background: isDragging ? '#f0f8ff' : '#fff',
            transition: 'background 0.2s, border 0.2s'
          }}
        >
          <input
            className='file-input'
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div className='file-input-area'>
            <FontAwesomeIcon icon={faCloudArrowUp} className="upload-icon" />
            {isDragging
              ? <span>Dosyanı buraya bırak...</span>
              : <span>Dosyanı buraya bırak veya <span>dosya seç</span></span>
            }
          </div>
        </div>
        <div className="upload-queue">
          {fileQueue && fileQueue.length > 0 && (
            <>
              <ul className="upload-queue-list">
                {fileQueue.map((file, idx) => (
                  <li key={idx} className="upload-queue-item">
                    {file.name}
                    <button
                      className="delete-queue-item-btn"
                      onClick={() => handleRemoveFile(idx)}
                    >
                      <FontAwesomeIcon icon={faTrash} className='delete-icon' />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="upload-queue-actions">
                <button className="clear-queue-btn" onClick={handleClearQueue}>
                  Kuyruğu Temizle
                </button>
                <button className="confirm-upload-btn" onClick={handleConfirmUpload}>
                  Yüklemeyi Onayla
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
