import { useState, useRef, useCallback } from 'react';

export function useCalendarDrag(
  selectedDates: string[],
  onDatesChange: (dates: string[]) => void,
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartDate, setDragStartDate] = useState<string | null>(null);
  const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');
  const [tempSelectedDates, setTempSelectedDates] = useState<string[]>([]);
  const [tempDeselectedDates, setTempDeselectedDates] = useState<string[]>([]);
  const [isClick, setIsClick] = useState(false);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getDateRange = useCallback((startIso: string, endIso: string) => {
    const start = new Date(startIso);
    const end = new Date(endIso);
    const range: string[] = [];
    const step = start < end ? 1 : -1;
    const current = new Date(start);
    while (step > 0 ? current <= end : current >= end) {
      range.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + step);
    }
    return range;
  }, []);

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
      event.preventDefault();
      setIsClick(true);
      setDragStartDate(isoDate);

      dragTimeoutRef.current = setTimeout(() => {
        setIsDragging(true);
        setIsClick(false);

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
      }, 150);
    },
    [selectedDates],
  );

  const handleMouseEnter = useCallback(
    (isoDate: string) => {
      if (isDragging && dragStartDate !== null) {
        const range = getDateRange(dragStartDate, isoDate);

        if (dragMode === 'select') {
          setTempSelectedDates(range);
          setTempDeselectedDates([]);
        } else {
          setTempSelectedDates([]);
          setTempDeselectedDates(range);
        }
      }
    },
    [isDragging, dragStartDate, dragMode, getDateRange],
  );

  const handleMouseUp = useCallback(() => {
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
