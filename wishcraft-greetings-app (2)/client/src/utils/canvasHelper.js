// Convert relative backend URLs to absolute URLs
function getAbsoluteImageUrl(url) {
  if (!url) return url;
  
  // If it's already an absolute URL or data URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  
  // If it's a relative backend path (starts with /), convert to absolute backend URL
  if (url.startsWith('/')) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    // Remove /api from the end to get the server base URL
    const serverBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');
    return `${serverBaseUrl}${url}`;
  }
  
  return url;
}

export async function mergeCanvasLayers({ 
  backgroundImageUrl, 
  profileImageUrl, 
  userName, 
  ringColor = '#10B981',
  fontSize = 28 
}) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    const loadImage = (src, useCors = true) => new Promise((res, rej) => {
      // Validate URL
      if (!src) {
        return rej(new Error('Image URL is empty or invalid'));
      }
      
      // Add timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        rej(new Error(`Image loading timeout: ${src}`));
      }, 8000); // 8 second timeout
      
      const attemptLoad = (withCors, attempt = 1) => {
        const img = new Image();
        if (withCors) {
          img.crossOrigin = 'anonymous';
        }
        
        img.onload = () => {
          clearTimeout(timeoutId);
          res(img);
        };
        img.onerror = (e) => {
          // If CORS failed and we have more attempts, retry without CORS
          if (withCors && attempt === 1) {
            attemptLoad(false, 2);
          } else if (!withCors && useCors && attempt === 2) {
            // Last attempt: try with CORS again
            attemptLoad(true, 3);
          } else {
            clearTimeout(timeoutId);
            rej(new Error(`Failed to load image from: ${src}`));
          }
        };
        img.src = src;
      };
      
      // Start without CORS for same-origin URLs, with CORS for cross-origin
      const isSameOrigin = src.startsWith('/') || src.startsWith(window.location.origin);
      attemptLoad(!isSameOrigin, 1);
    });

    Promise.all([
      loadImage(getAbsoluteImageUrl(backgroundImageUrl)),
      profileImageUrl ? loadImage(getAbsoluteImageUrl(profileImageUrl)) : Promise.resolve(null)
    ]).then(([bgImg, profileImg]) => {
      // 1. Draw background (cover fit)
      const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
      const x = (canvas.width - bgImg.width * scale) / 2;
      const y = (canvas.height - bgImg.height * scale) / 2;
      ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);

      // 2. Draw dark semi-transparent top banner
      const bannerHeight = 100;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, canvas.width, bannerHeight);

      // 3. Draw userName text centered in banner
      ctx.font = `600 ${fontSize}px "Poppins", "Segoe UI", sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(userName || 'Your Name', canvas.width / 2, bannerHeight / 2);

      // 4. Draw circular clipped profile image with ring
      if (profileImg) {
        const cx = 70;
        const cy = bannerHeight / 2;
        const radius = 45;
        const ringWidth = 5;

        // Ring background
        ctx.beginPath();
        ctx.arc(cx, cy, radius + ringWidth, 0, Math.PI * 2);
        ctx.fillStyle = ringColor;
        ctx.fill();

        // Clip circle for profile image
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(profileImg, cx - radius, cy - radius, radius * 2, radius * 2);
        ctx.restore();
      }

      try {
        const dataUrl = canvas.toDataURL('image/png');
        resolve({ dataUrl, canvas });
      } catch (e) {
        // If canvas is tainted, return just the canvas element
        // The caller can use canvas.toBlob() or display the canvas directly
        resolve({ dataUrl: null, canvas, error: e.message });
      }
    }).catch(reject);
  });
}

// Render directly to a visible canvas element (avoids CORS issues for display)
export async function renderToCanvas(canvasElement, {
  backgroundImageUrl,
  profileImageUrl,
  userName,
  ringColor = '#10B981',
  fontSize = 28
}) {
  const ctx = canvasElement.getContext('2d');
  const w = 800;
  const h = 1000;
  canvasElement.width = w;
  canvasElement.height = h;

  const loadImage = (src) => new Promise((res, rej) => {
    // Validate URL
    if (!src) {
      return rej(new Error('Image URL is empty or invalid'));
    }
    
    // Add timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      rej(new Error(`Image loading timeout: ${src}`));
    }, 8000); // 8 second timeout
    
    const attemptLoad = (withCors, attempt = 1) => {
      const img = new Image();
      if (withCors) {
        img.crossOrigin = 'anonymous';
      }
      
      img.onload = () => {
        clearTimeout(timeoutId);
        res(img);
      };
      img.onerror = (e) => {
        // Try without CORS first, then with CORS
        if (!withCors && attempt === 1) {
          attemptLoad(true, 2);
        } else {
          clearTimeout(timeoutId);
          rej(new Error(`Failed to load image from: ${src}`));
        }
      };
      img.src = src;
    };
    
    // For same-origin URLs, try without CORS first
    const isSameOrigin = src.startsWith('/') || src.startsWith(window.location.origin);
    attemptLoad(!isSameOrigin, 1);
  });

  const [bgImg, profileImg] = await Promise.all([
    loadImage(getAbsoluteImageUrl(backgroundImageUrl)),
    profileImageUrl ? loadImage(getAbsoluteImageUrl(profileImageUrl)) : Promise.resolve(null)
  ]);

  // Background
  const scale = Math.max(w / bgImg.width, h / bgImg.height);
  const bx = (w - bgImg.width * scale) / 2;
  const by = (h - bgImg.height * scale) / 2;
  ctx.drawImage(bgImg, bx, by, bgImg.width * scale, bgImg.height * scale);

  // Banner
  const bannerHeight = 100;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, w, bannerHeight);

  // Name
  ctx.font = `600 ${fontSize}px "Poppins", "Segoe UI", sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(userName || 'Your Name', w / 2, bannerHeight / 2);

  // Profile
  if (profileImg) {
    const cx = 70, cy = bannerHeight / 2, radius = 45, ringWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + ringWidth, 0, Math.PI * 2);
    ctx.fillStyle = ringColor;
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(profileImg, cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();
  }

  return canvasElement;
}

export function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}
