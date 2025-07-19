import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoModalProps {
  show: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ show, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="bg-black rounded-lg overflow-hidden w-full max-w-3xl aspect-video"
            onClick={e => e.stopPropagation()}
          >
            <video controls autoPlay muted className="w-full h-full object-cover">
              <source src="/video_pub.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la vidéo.
            </video>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;