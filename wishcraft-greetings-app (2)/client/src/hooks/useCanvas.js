import { useState, useCallback } from 'react';
import { mergeCanvasLayers } from '../utils/canvasHelper';

export const useCanvas = (initialState = {}) => {
  const [canvasData, setCanvasData] = useState({
    userName: initialState.userName || '',
    profileImageUrl: initialState.profileImageUrl || '',
    backgroundImageUrl: initialState.backgroundImageUrl || '',
    ringColor: initialState.ringColor || '#10B981',
    fontSize: initialState.fontSize || 28,
    mergedImage: null,
    loading: false
  });

  const updateField = useCallback((field, value) => {
    setCanvasData(prev => ({ ...prev, [field]: value }));
  }, []);

  const generatePreview = useCallback(async () => {
    if (!canvasData.backgroundImageUrl) return;
    setCanvasData(prev => ({ ...prev, loading: true }));
    try {
      const merged = await mergeCanvasLayers({
        backgroundImageUrl: canvasData.backgroundImageUrl,
        profileImageUrl: canvasData.profileImageUrl,
        userName: canvasData.userName,
        ringColor: canvasData.ringColor,
        fontSize: canvasData.fontSize
      });
      setCanvasData(prev => ({ ...prev, mergedImage: merged, loading: false }));
      return merged;
    } catch (error) {
      setCanvasData(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, [canvasData]);

  return { canvasData, updateField, generatePreview };
};
