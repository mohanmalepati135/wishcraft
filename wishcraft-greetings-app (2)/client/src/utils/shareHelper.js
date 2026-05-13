import axiosInstance from '../api/axiosInstance';

export async function shareImage(imageDataUrl, templateId, title = 'My WishCraft Greeting') {
  try {
    // Track share action
    if (templateId) {
      await axiosInstance.post('/templates/track', { templateId, action: 'share' });
    }

    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'wishcraft-greeting.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title,
        text: 'Check out this personalized greeting I made with WishCraft!',
        files: [file]
      });
      return { success: true, method: 'share' };
    } else {
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = 'wishcraft-greeting.png';
      link.click();
      return { success: true, method: 'download' };
    }
  } catch (error) {
    console.error('Share failed:', error);
    return { success: false, error: error.message };
  }
}

export async function downloadImage(imageDataUrl, templateId, fileName = 'wishcraft-greeting.png') {
  try {
    if (templateId) {
      await axiosInstance.post('/templates/track', { templateId, action: 'download' });
    }
    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = fileName;
    link.click();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
