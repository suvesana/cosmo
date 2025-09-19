'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getCameraStream() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Could not access the camera. Please check permissions and try again.');
      }
    }

    getCameraStream();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
        <h2 className="text-2xl font-headline font-bold text-center">Point at a Planet</h2>
        <p className="text-muted-foreground text-center">Center the planet image in the frame below.</p>
      <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden border-4 border-primary shadow-lg">
        {error ? (
          <div className="flex items-center justify-center h-full bg-muted">
            <p className="text-destructive text-center p-4">{error}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="flex gap-4 mt-4">
        <Button variant="outline" size="lg" onClick={onCancel}>
          <X className="mr-2 h-5 w-5" />
          Cancel
        </Button>
        <Button size="lg" onClick={handleCapture} disabled={!stream || !!error} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Camera className="mr-2 h-5 w-5" />
          Capture
        </Button>
      </div>
    </div>
  );
}
