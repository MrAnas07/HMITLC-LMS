import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, RotateCw, ZoomIn, ZoomOut, Check } from "lucide-react";

const CropModal = ({ imageSrc, onCrop, onCancel }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setImageLoaded(true);
      const container = containerRef.current;
      if (container) {
        const containerSize = 280;
        const imgRatio = img.width / img.height;
        let initialScale;
        if (imgRatio > 1) {
          initialScale = containerSize / img.height;
        } else {
          initialScale = containerSize / img.width;
        }
        setScale(initialScale * 0.8);
        setPosition({ x: 0, y: 0 });
      }
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    if (!imageLoaded || !imgRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;
    const containerSize = 280;
    const outputSize = 400;

    canvas.width = outputSize;
    canvas.height = outputSize;

    ctx.clearRect(0, 0, outputSize, outputSize);

    const drawX = (outputSize / 2) + position.x;
    const drawY = (outputSize / 2) + position.y;
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    ctx.save();
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      img,
      drawX - drawWidth / 2,
      drawY - drawHeight / 2,
      drawWidth,
      drawHeight
    );

    ctx.restore();
  }, [scale, position, imageLoaded]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleCrop = () => {
    if (!canvasRef.current) return;
    const croppedDataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9);
    onCrop(croppedDataUrl);
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-white/95 p-5 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h3 className="text-lg font-black text-slate-950 dark:text-white">
              Crop Profile Picture
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Drag to adjust position
            </p>
          </div>
          <button
            onClick={onCancel}
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:text-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        {/* Crop Area */}
        <div className="flex flex-col items-center gap-5 p-6">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="relative flex items-center justify-center rounded-full border-4 border-dashed border-[#1045b8] bg-slate-100 dark:bg-slate-800"
            style={{ width: 280, height: 280, cursor: isDragging ? "grabbing" : "grab" }}
          >
            {imageLoaded ? (
              <div className="pointer-events-none overflow-hidden rounded-full">
                <canvas
                  ref={canvasRef}
                  width={280}
                  height={280}
                  className="h-[280px] w-[280px] rounded-full"
                />
              </div>
            ) : (
              <div className="text-sm text-slate-400">Loading...</div>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScale((s) => Math.max(0.2, s - 0.1))}
              className="btn-press grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-[#1045b8] hover:text-[#1045b8] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              type="button"
            >
              <ZoomOut size={16} />
            </button>
            <span className="min-w-[60px] text-center text-sm font-bold text-slate-600 dark:text-slate-300">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(3, s + 0.1))}
              className="btn-press grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-[#1045b8] hover:text-[#1045b8] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              type="button"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => setPosition({ x: 0, y: 0 })}
              className="btn-press grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-[#1045b8] hover:text-[#1045b8] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              type="button"
            >
              <RotateCw size={16} />
            </button>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Pinch to zoom, drag to reposition
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <button
            onClick={onCancel}
            className="btn-press flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="btn-press flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1045b8] to-[#0d3b8e] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-900/20"
            type="button"
          >
            <Check size={16} /> Apply Crop
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CropModal;
