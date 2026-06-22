const FRAME_COUNT = 120;

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let frames: (ImageBitmap | null)[] = [];
let usedFrames = FRAME_COUNT;
let cw = 0;
let ch = 0;

function getFrameSrc(i: number) {
  const fileNum = i + 1;
  return `/frames/ezgif-frame-${String(fileNum).padStart(3, "0")}.webp`;
}

function drawImageFit(img: ImageBitmap, cw: number, ch: number, mode: 'cover' | 'contain' = 'cover') {
  if (!ctx) return;
  const iw = img.width;
  const ih = img.height;
  if (!iw || !ih) return;
  const ir = iw / ih;
  const cr = cw / ch;
  let dw: number, dh: number, ox: number, oy: number;
  
  if (mode === 'cover' ? ir > cr : ir < cr) {
    dh = ch;
    dw = dh * ir;
    ox = (cw - dw) / 2;
    oy = 0;
  } else {
    dw = cw;
    dh = dw / ir;
    ox = 0;
    oy = (ch - dh) / 2;
  }
  ctx.drawImage(img, ox, oy, dw, dh);
}

let lastProgress = 0;

function renderFrame(progress: number) {
  if (!ctx || !canvas) return;
  
  const max = usedFrames - 1;
  const floatIndex = progress * max;
  const idx = Math.min(max, Math.max(0, Math.round(floatIndex)));
  
  const img = frames[idx];
  if (img) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium";
    drawImageFit(img, cw, ch, 'cover');
  }
}

async function fetchFrames() {
  usedFrames = FRAME_COUNT;
  frames = new Array(usedFrames).fill(null);
  
  let loaded = 0;
  const batchSize = 3;
  
  for (let i = 0; i < usedFrames; i += batchSize) {
    const promises = [];
    
    for (let j = 0; j < batchSize && i + j < usedFrames; j++) {
      const index = i + j;
      const url = getFrameSrc(index);
      promises.push(
        fetch(url)
          .then(res => {
             if (!res.ok) throw new Error('Network err');
             return res.blob();
          })
          .then(blob => createImageBitmap(blob))
          .then(bitmap => {
            frames[index] = bitmap;
            loaded++;
            self.postMessage({ type: 'progress', loaded, total: usedFrames });
          })
          .catch(err => {
            loaded++; // prevent hanging
          })
      );
    }
    
    await Promise.all(promises);
    
    // Notify ready after the first batch loads so user can scroll!
    if (i === 0) {
      self.postMessage({ type: 'ready' });
      renderFrame(lastProgress); // draw the first frame
    }
    
    // Yield briefly
    await new Promise((r) => setTimeout(r, 30));
  }
}

self.onmessage = (e) => {
  const { type, payload } = e.data;
  
  if (type === 'init') {
    canvas = payload.canvas;
    ctx = canvas?.getContext('2d', { alpha: false }) as OffscreenCanvasRenderingContext2D | null;
    
    if (canvas) {
      cw = canvas.width;
      ch = canvas.height;
    }
    
    fetchFrames();
  } else if (type === 'resize') {
    cw = payload.width;
    ch = payload.height;
    if (canvas) {
      canvas.width = cw;
      canvas.height = ch;
      // Re-get context on resize if needed, though usually not needed if resizing canvas object properties.
      ctx = canvas.getContext('2d', { alpha: false }) as OffscreenCanvasRenderingContext2D | null;
    }
    renderFrame(lastProgress);
  } else if (type === 'scrub') {
    lastProgress = payload;
    renderFrame(payload);
  }
};

export {};
