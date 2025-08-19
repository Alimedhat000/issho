import { useCallback, useRef, useState } from 'react';

export function useCalendarDrag(
  selectedDates: string[],
  onDatesChange: (dates: string[]) => void,
  editable: boolean,
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartDate, setDragStartDate] = useState<string | null>(null);
  const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');
  const [tempSelectedDates, setTempSelectedDates] = useState<string[]>([]);
  const [tempDeselectedDates, setTempDeselectedDates] = useState<string[]>([]);
  const [isClick, setIsClick] = useState(false);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleDate = useCallback(
    (isoDate: string) => {
      const newDates = selectedDates.includes(isoDate)
        ? selectedDates.filter((d) => d !== isoDate)
        : [...selectedDates, isoDate];
      onDatesChange(newDates);
    },
    [selectedDates, onDatesChange],
  );

  const resetDragState = useCallback(() => {
    setIsDragging(false);
    setIsClick(false);
    setDragStartDate(null);
    setDragMode('select');
    setTempSelectedDates([]);
    setTempDeselectedDates([]);
  }, []);

  const handleMouseDown = useCallback(
    (isoDate: string, event: React.MouseEvent) => {
      if (!editable) return;
      event.preventDefault();
      setIsClick(true);
      setDragStartDate(isoDate);

      const isInitiallySelected = selectedDates.includes(isoDate);
      const mode = isInitiallySelected ? 'deselect' : 'select';
      setDragMode(mode);

      if (mode === 'select') {
        setTempSelectedDates([isoDate]);
        setTempDeselectedDates([]);
      } else {
        setTempSelectedDates([]);
        setTempDeselectedDates([isoDate]);
      }

      dragTimeoutRef.current = setTimeout(() => {
        setIsDragging(true);
        setIsClick(false);
      }, 30);
    },
    [selectedDates, editable],
  );

  const handleMouseEnter = useCallback(
    (isoDate: string) => {
      if (!editable) return;

      if (isDragging) {
        if (dragMode === 'select') {
          setTempSelectedDates((prev) =>
            prev.includes(isoDate) ? prev : [...prev, isoDate],
          );
        } else {
          setTempDeselectedDates((prev) =>
            prev.includes(isoDate) ? prev : [...prev, isoDate],
          );
        }
      }
    },
    [isDragging, dragMode, editable],
  );

  const handleMouseUp = useCallback(() => {
    if (!editable) return;

    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }

    if (isClick && dragStartDate !== null) {
      toggleDate(dragStartDate);
    } else if (isDragging) {
      let newSelection = [...selectedDates];

      if (dragMode === 'select') {
        tempSelectedDates.forEach((date) => {
          if (!newSelection.includes(date)) {
            newSelection.push(date);
          }
        });
      } else {
        newSelection = newSelection.filter(
          (date) => !tempDeselectedDates.includes(date),
        );
      }

      onDatesChange(
        newSelection.sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime(),
        ),
      );
    }

    resetDragState();
  }, [
    isClick,
    dragStartDate,
    isDragging,
    dragMode,
    tempSelectedDates,
    tempDeselectedDates,
    selectedDates,
    onDatesChange,
    toggleDate,
    resetDragState,
    editable,
  ]);

  return {
    isDragging,
    dragMode,
    tempSelectedDates,
    tempDeselectedDates,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    resetDragState,
  };
}
