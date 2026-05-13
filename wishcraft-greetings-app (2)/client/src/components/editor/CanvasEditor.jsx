import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { mergeCanvasLayers, renderToCanvas } from '../../utils/canvasHelper';
import { shareImage, downloadImage } from '../../utils/shareHelper';
import axiosInstance from '../../api/axiosInstance';
import './CanvasEditor.css';

const CanvasEditor = ({ template, user, onUpdate }) => {
  const canvasRef = useRef(null);
  const [name, setName] = useState(user?.name || '');
  const [fontSize, setFontSize] = useState(28);
  const [ringColor, setRingColor] = useState('#10B981');
  const [profilePic, setProfilePic] = useState(user?.profilePicture || '');
  const [mergedImage, setMergedImage] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [renderError, setRenderError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const ringColors = [
    { label: 'Emerald', value: '#10B981' },
    { label: 'Violet', value: '#7C3AED' },
    { label: 'Rose', value: '#EC4899' },
    { label: 'Blue', value: '#3B82F6' }
  ];

  // Direct canvas render (avoids CORS tainting for display)
  const renderPreview = useCallback(async () => {
    if (!template?.backgroundImage || !canvasRef.current) return;
    
    // Validate background image URL
    if (!template.backgroundImage.trim()) {
      setRenderError('Template background image is missing');
      return;
    }
    
    setGenerating(true);
    setRenderError(null);
    
    // Render timeout - prevent infinite rendering state
    const renderTimeoutId = setTimeout(() => {
      setGenerating(false);
      setRenderError('Image loading took too long. Try refreshing the page or using a different template.');
      toast.error('Rendering timeout - images failed to load');
    }, 12000); // 12 second timeout for entire render process
    
    try {
      await renderToCanvas(canvasRef.current, {
        backgroundImageUrl: template.backgroundImage,
        profileImageUrl: profilePic || '',
        userName: name,
        ringColor,
        fontSize
      });
      // Also generate merged image for share/download
      const result = await mergeCanvasLayers({
        backgroundImageUrl: template.backgroundImage,
        profileImageUrl: profilePic || '',
        userName: name,
        ringColor,
        fontSize
      });
      if (result.dataUrl) {
        setMergedImage(result.dataUrl);
      } else if (result.canvas) {
        // Fallback: convert canvas to blob then to dataURL
        const blob = await new Promise(res => result.canvas.toBlob(res, 'image/png'));
        const reader = new FileReader();
        reader.onloadend = () => setMergedImage(reader.result);
        reader.readAsDataURL(blob);
      }
    } catch (err) {
      console.error('Canvas render error:', err);
      const errorMsg = err?.message || 'Failed to render preview';
      setRenderError(errorMsg);
      toast.error(`Preview error: ${errorMsg}`);
    } finally {
      clearTimeout(renderTimeoutId);
      setGenerating(false);
    }
  }, [template, profilePic, name, ringColor, fontSize]);

  useEffect(() => {
    const timer = setTimeout(renderPreview, 300);
    return () => clearTimeout(timer);
  }, [renderPreview]);

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      // Upload to server
      const { data } = await axiosInstance.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update localStorage and local state with fresh user data
      localStorage.setItem('user', JSON.stringify(data));
      setProfilePic(data.profilePicture);
      onUpdate?.(data);
      toast.success('Profile picture updated!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload profile picture');
    }
  };

  const handleShare = async () => {
    if (!mergedImage) {
      toast.error('Please wait for preview to load');
      return;
    }
    setGenerating(true);
    const result = await shareImage(mergedImage, template?._id, `${name}'s WishCraft Greeting`);
    setGenerating(false);
    if (result.success) {
      toast.success(result.method === 'share' ? 'Shared successfully!' : 'Downloaded!');
    } else {
      toast.error('Share failed');
    }
  };

  const handleDownload = async () => {
    if (!mergedImage) {
      toast.error('Please wait for preview to load');
      return;
    }
    const result = await downloadImage(mergedImage, template?._id, `wishcraft-${name.replace(/\s+/g, '-').toLowerCase()}.png`);
    if (result.success) {
      toast.success('Image downloaded!');
    }
  };

  return (
    <div className="canvas-editor">
      <div className="canvas-editor__left">
        <div className="canvas-editor__template-info">
          <span className="canvas-editor__category">{template?.category}</span>
          <h2 className="canvas-editor__title">{template?.title}</h2>
          <p className="canvas-editor__quote">{template?.quoteText}</p>
        </div>
      </div>

      <div className="canvas-editor__center">
        <motion.div className="canvas-editor__canvas-wrapper" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          {renderError && (
            <div className="canvas-editor__error">
              <span>⚠️</span>
              <p>{renderError}</p>
              <small>Try using a different image URL  or upload from your device.</small>
            </div>
          )}
          <canvas ref={canvasRef} className="canvas-editor__canvas" style={{ display: renderError ? 'none' : 'block' }} />
          {generating && !renderError && (
            <div className="canvas-editor__overlay">
              <div className="canvas-editor__spinner" />
              <span>Rendering...</span>
            </div>
          )}
        </motion.div>
      </div>

      <div className="canvas-editor__right">
        <h3 className="canvas-editor__panel-title">Customize</h3>

        <div className="canvas-editor__control">
          <label className="canvas-editor__label">Your Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="canvas-editor__input" placeholder="Enter your name" />
        </div>

        <div className="canvas-editor__control">
          <label className="canvas-editor__label">Profile Picture</label>
          <div className="canvas-editor__upload">
            {profilePic && <img src={profilePic} alt="" className="canvas-editor__upload-preview" />}
            <label className="canvas-editor__upload-btn">
              <input type="file" accept="image/*" onChange={handleProfileUpload} hidden />
              {profilePic ? 'Change Photo' : 'Upload Photo'}
            </label>
          </div>
        </div>

        <div className="canvas-editor__control">
          <label className="canvas-editor__label">Name Size: {fontSize}px</label>
          <input type="range" min="16" max="48" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="canvas-editor__slider" />
        </div>

        <div className="canvas-editor__control">
          <label className="canvas-editor__label">Ring Color</label>
          <div className="canvas-editor__colors">
            {ringColors.map((c) => (
              <button key={c.value} className={`canvas-editor__color ${ringColor === c.value ? 'canvas-editor__color--active' : ''}`} style={{ background: c.value }} onClick={() => setRingColor(c.value)} title={c.label} />
            ))}
          </div>
        </div>

        <div className="canvas-editor__actions">
          <motion.button className="canvas-editor__btn canvas-editor__btn--share" onClick={handleShare} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={!mergedImage || generating}>
            <span>🔗</span> Share
          </motion.button>
          <motion.button className="canvas-editor__btn canvas-editor__btn--download" onClick={handleDownload} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={!mergedImage || generating}>
            <span>⬇️</span> Download
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
