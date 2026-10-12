import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useResume } from '../context/ResumeContext';

const CANVAS_SIZE = 200; // output resolution

export default function PhotoUpload() {
  const { t } = useTranslation();
  const { data, setData } = useResume();
  const fileRef = useRef<HTMLInputElement>(null);

  // Editor state
  const [showEditor, setShowEditor] = useState(false);
  const [rawSrc, setRawSrc] = useState<string>('');
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  // Drag state
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  const previewRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setImgSize({ w: img.width, h: img.height });
        // Fit image to canvas initially
        const fitScale = Math.max(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
        setScale(fitScale);
        setOffsetX(0);
        setOffsetY(0);
        setRawSrc(src);
        setShowEditor(true);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Draw preview
  const drawPreview = useCallback(() => {
    const canvas = previewRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const drawW = imgSize.w * scale;
    const drawH = imgSize.h * scale;
    const dx = (CANVAS_SIZE - drawW) / 2 + offsetX;
    const dy = (CANVAS_SIZE - drawH) / 2 + offsetY;
    ctx.drawImage(img, dx, dy, drawW, drawH);
    ctx.restore();
  }, [offsetX, offsetY, scale, imgSize]);

  useEffect(() => {
    if (showEditor) drawPreview();
  }, [showEditor, drawPreview]);

  // Mouse / touch handlers
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetStart.current = { x: offsetX, y: offsetY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffsetX(offsetStart.current.x + dx);
    setOffsetY(offsetStart.current.y + dy);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(prev => {
      const next = prev - e.deltaY * 0.002;
      return Math.max(0.1, Math.min(5, next));
    });
  };

  const handleConfirm = () => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, photo: dataUrl },
    }));
    setShowEditor(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleCancel = () => {
    setShowEditor(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleRemove = () => {
    setData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, photo: '' },
    }));
    if (fileRef.current) fileRef.current.value = '';
  };

  const photo = data.basicInfo.photo;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onClick={() => !photo && fileRef.current?.click()}
        className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer
                   flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        {photo ? (
          <img src={photo} alt="photo" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-400 text-xs px-2">
            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
            </svg>
            {t('form.uploadPhoto')}
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      {photo && (
        <div className="flex gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="text-xs text-accent hover:underline"
          >
            {t('form.replacePhoto')}
          </button>
          <button
            onClick={handleRemove}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            {t('form.removePhoto')}
          </button>
        </div>
      )}

      {/* Image Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[380px] space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 text-center">
              {t('form.adjustPhoto')}
            </h3>

            {/* Canvas preview */}
            <div className="flex justify-center">
              <div className="relative">
                <canvas
                  ref={previewRef}
                  width={CANVAS_SIZE}
                  height={CANVAS_SIZE}
                  className="rounded-full border-2 border-gray-200 cursor-grab active:cursor-grabbing"
                  style={{ width: 200, height: 200 }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerLeave={onPointerUp}
                  onWheel={onWheel}
                />
                {/* Crosshair guides */}
                <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300/40" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300/40" />
                </div>
              </div>
            </div>

            {/* Zoom slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>{t('form.zoom')}</span>
                <span>{Math.round(scale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.01"
                value={scale}
                onChange={e => setScale(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                           [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:bg-accent"
              />
            </div>

            <p className="text-xs text-gray-400 text-center">
              {t('form.dragHint')}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-2 text-sm rounded-lg border border-gray-300 text-gray-600
                           hover:bg-gray-50 transition-colors"
              >
                {t('form.cancel')}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2 text-sm rounded-lg bg-primary text-white
                           hover:bg-secondary transition-colors"
              >
                {t('form.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
