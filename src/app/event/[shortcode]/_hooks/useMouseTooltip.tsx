import { useEffect, useRef, useState } from 'react';

export const useMouseTooltip = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [content, setContent] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = (content: string, event: React.MouseEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setContent(content);
    setPosition({
      x: event.clientX + 10,
      y: event.clientY - 30,
    });
    setIsVisible(true);
  };

  const hideTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100); // Small delay to prevent flickering
  };

  const updatePosition = (event: React.MouseEvent) => {
    if (isVisible) {
      setPosition({
        x: event.clientX + 10,
        y: event.clientY - 30,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isVisible,
    position,
    content,
    showTooltip,
    hideTooltip,
    updatePosition,
  };
};
