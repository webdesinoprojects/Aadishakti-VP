import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';

const ImageUploader = ({ 
  currentImage, 
  onUpload, 
  onRemove, 
  accept = 'image/*',
  maxSizeMB = 5,
  circular = false 
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { success, error } = useToast();

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      error(`File too large. Maximum ${maxSizeMB}MB allowed.`);
      return;
    }

    // Validate file type
    if (accept === 'image/*' && !file.type.startsWith('image/')) {
      error('Please select an image file.');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadAPI.single(file);
      onUpload(response.data.url);
      success('Image uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      error(err.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  if (currentImage) {
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src={currentImage}
          alt="Preview"
          style={{
            width: circular ? '120px' : '200px',
            height: circular ? '120px' : '150px',
            objectFit: 'cover',
            borderRadius: circular ? '50%' : '6px',
            border: '1px solid var(--admin-border)',
          }}
        />
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Change Image
          </button>
          {onRemove && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onRemove}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              <X size={14} /> Remove
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files[0])}
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
      style={{
        border: `2px dashed ${dragOver ? 'var(--admin-red)' : 'var(--admin-border-mid)'}`,
        borderRadius: '6px',
        padding: '32px',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragOver ? 'var(--admin-red-light)' : 'var(--admin-bg)',
        transition: 'all 0.2s ease',
      }}
    >
      {uploading ? (
        <div>
          <div style={{ marginBottom: '8px', color: 'var(--admin-text-muted)' }}>
            Uploading...
          </div>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: 'var(--admin-border)', 
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              background: 'var(--admin-red)',
              animation: 'progress 1s ease-in-out infinite'
            }} />
          </div>
        </div>
      ) : (
        <>
          <ImageIcon size={32} style={{ color: 'var(--admin-text-muted)', marginBottom: '12px' }} />
          <div style={{ fontSize: '14px', color: 'var(--admin-text)', marginBottom: '4px' }}>
            Drop image here or click to browse
          </div>
          <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
            Accepts: JPG, PNG, WEBP · Max {maxSizeMB}MB
          </div>
        </>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files[0])}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUploader;
