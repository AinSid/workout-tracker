import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, startOfWeek, addDays, subWeeks, addWeeks } from 'date-fns';

const PageContainer = styled.div`
  padding: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0;
`;

const WeekNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: #ff6b35;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.1rem;
  
  &:hover {
    opacity: 0.8;
  }
`;

const TrackerContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SecondRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DayBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-height: 270px;
`;

const DayTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 0.25rem;
`;

const DateSubheading = styled.p`
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 1.5rem;
`;

const AddButton = styled.button`
  width: 100%;
  padding: 0.35rem;
  background: none;
  border: 1px dashed #ddd;
  border-radius: 4px;
  color: #999;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
  text-align: left;
  padding-left: 0.75rem;

  &:hover {
    border-color: #ff6b35;
    color: #ff6b35;
  }
`;

const Exercise = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  color: #666;
  line-height: 1.2;
`;

const Checkbox = styled.input`
  margin-right: 0.75rem;
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  position: relative;

  &:checked {
    background-color: #ff6b35;
    border-color: #ff6b35;
    
    &:after {
      content: '';
      position: absolute;
      left: 4px;
      top: 1px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
`;

const ExerciseInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    border-color: #ff6b35;
  }
`;

const WeekHeader = styled.h1`
  font-size: 1rem;
  color: #666;
  font-weight: 400;
`;

interface Exercise {
  id: string;
  name: string;
  weight?: string;
  sets?: string;
  reps?: string;
  completed: boolean;
}

interface TrackerProps {
  onExerciseAdded: (date: string, exerciseData: Exercise) => void;
  savedExercises: { [key: string]: Exercise[] };
}

interface InputState {
  dayStr: string | null;
  field: 'name' | 'weight' | 'sets' | 'reps' | null;
  values: {
    name: string;
    weight: string;
    sets: string;
    reps: string;
  };
}

const Tracker: React.FC<TrackerProps> = ({ onExerciseAdded, savedExercises }) => {
  const [exercises, setExercises] = useState<{ [key: string]: Exercise[] }>(savedExercises || {});
  const [inputState, setInputState] = useState<InputState>({
    dayStr: null,
    field: null,
    values: { name: '', weight: '', sets: '', reps: '' }
  });
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekNumber = format(selectedWeek, 'w');
  const weekRange = `Week ${weekNumber} (${format(weekStart, 'MMM d')} — ${format(
    addDays(weekStart, 6),
    'MMM d'
  )})`;

  useEffect(() => {
    setExercises(savedExercises);
  }, [savedExercises]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedWeek(current => 
      direction === 'prev' ? subWeeks(current, 1) : addWeeks(current, 1)
    );
  };

  const handleAddExercise = (dayStr: string) => {
    setInputState({
      dayStr,
      field: 'name',
      values: { name: '', weight: '', sets: '', reps: '' }
    });
  };

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputState.dayStr && inputState.field) {
      const value = e.currentTarget.value.trim();
      if (!value && inputState.field !== 'weight' && inputState.field !== 'reps') return;

      const newValues = { ...inputState.values, [inputState.field]: value };
      
      if (inputState.field === 'name') {
        setInputState({ ...inputState, field: 'weight', values: newValues });
      } else if (inputState.field === 'weight') {
        setInputState({ ...inputState, field: 'sets', values: newValues });
      } else if (inputState.field === 'sets') {
        setInputState({ ...inputState, field: 'reps', values: newValues });
      } else if (inputState.field === 'reps') {
        const newExercise: Exercise = {
          id: Math.random().toString(36).substr(2, 9),
          name: newValues.name,
          weight: newValues.weight || undefined,
          sets: newValues.sets || undefined,
          reps: newValues.reps || undefined,
          completed: false,
        };

        setExercises((prev) => ({
          ...prev,
          [inputState.dayStr!]: [...(prev[inputState.dayStr!] || []), newExercise],
        }));
        onExerciseAdded(inputState.dayStr, newExercise);
        setInputState({ dayStr: null, field: null, values: { name: '', weight: '', sets: '', reps: '' } });
      }
    }
  };

  const getInputPlaceholder = (field: 'name' | 'weight' | 'sets' | 'reps') => {
    switch (field) {
      case 'name': return 'Type exercise name and press Enter';
      case 'weight': return 'Enter weight (or press Enter to skip)';
      case 'sets': return 'Enter number of sets and press Enter';
      case 'reps': return 'Enter number of reps and press Enter';
    }
  };

  const toggleExercise = (dayStr: string, exerciseId: string) => {
    const updatedExercises = {
      ...exercises,
      [dayStr]: exercises[dayStr].map((ex) =>
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      ),
    };
    setExercises(updatedExercises);
    
    // Pass the updated exercise to parent for saving
    const updatedExercise = updatedExercises[dayStr].find(ex => ex.id === exerciseId);
    if (updatedExercise) {
      onExerciseAdded(dayStr, updatedExercise);
    }
  };

  const formatExerciseDetails = (exercise: Exercise) => {
    const details = [];
    if (exercise.weight) details.push(`${exercise.weight} lbs`);
    if (exercise.sets && exercise.reps) details.push(`${exercise.sets} sets of ${exercise.reps} reps`);
    return `${exercise.name}${details.length ? ` — ${details.join(' — ')}` : ''}`;
  };

  const renderDayBox = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return (
      <DayBox key={dayStr}>
        <DayTitle>{format(day, 'EEEE')}</DayTitle>
        <DateSubheading>{format(day, 'MMM d, yyyy')}</DateSubheading>
        {exercises[dayStr]?.map((exercise) => (
          <Exercise key={exercise.id}>
            <Checkbox
              type="checkbox"
              checked={exercise.completed}
              onChange={() => toggleExercise(dayStr, exercise.id)}
            />
            {formatExerciseDetails(exercise)}
          </Exercise>
        ))}
        {inputState.dayStr === dayStr ? (
          <ExerciseInput
            autoFocus
            placeholder={getInputPlaceholder(inputState.field!)}
            value={inputState.values[inputState.field!]}
            onChange={(e) => setInputState({
              ...inputState,
              values: { ...inputState.values, [inputState.field!]: e.target.value }
            })}
            onKeyDown={handleInputSubmit}
            onBlur={() => setInputState({ dayStr: null, field: null, values: { name: '', weight: '', sets: '', reps: '' } })}
          />
        ) : (
          <AddButton onClick={() => handleAddExercise(dayStr)}>Add exercise</AddButton>
        )}
      </DayBox>
    );
  };

  return (
    <PageContainer>
      <Header>
        <WeekHeader>{weekRange}</WeekHeader>
        <WeekNavigation>
          <NavButton onClick={() => navigateWeek('prev')}>&larr;</NavButton>
          <NavButton onClick={() => navigateWeek('next')}>&rarr;</NavButton>
        </WeekNavigation>
      </Header>
      <TrackerContainer>
        {days.slice(0, 4).map(renderDayBox)}
      </TrackerContainer>
      <SecondRow>
        {days.slice(4, 7).map(renderDayBox)}
        <DayBox>
          <DayTitle>Notes</DayTitle>
          <DateSubheading>Weekly notes and reminders</DateSubheading>
          <AddButton>Add note</AddButton>
        </DayBox>
      </SecondRow>
    </PageContainer>
  );
};

export default Tracker; 
