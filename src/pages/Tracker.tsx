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
  
  @media (max-width: 768px) {
    flex-direction: row;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
  }
`;

const WeekNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: #ff6b35;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
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
    gap: 0.5rem;
    margin-bottom: 0.5rem;
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
    gap: 0.5rem;
    
    > :last-child {
      display: none;
    }
  }
`;

const DayBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-height: 260px;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    min-height: ${props => props.isOpen ? '140px' : 'auto'};
    padding: ${props => props.isOpen ? '1rem' : '0.75rem'};
  }
`;

const DayHeader = styled.div`
  @media (max-width: 768px) {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

const DayTitle = styled.h2`
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 0;
  }
`;

const DateSubheading = styled.p`
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 0;
  }
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

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
    height: 28px;
    margin-bottom: 0.75rem;
  }
`;

const Exercise = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  color: #666;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
  }
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

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    
    &:checked:after {
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
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
    border-color: #ff6b35;  // Desktop orange focus
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.5rem;
    height: 32px;
    margin-bottom: 1rem;
    
    &::placeholder {
      font-size: 0.8rem;
    }

    &:focus {
      outline: none;
      border-color: #ddd !important;  // Force grey border on mobile
    }
  }
`;

const WeekHeader = styled.h1`
  font-size: 1rem;
  color: #666;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin: 0;
  }
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  color: #ff6b35;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.1rem;
  
  &:hover {
    opacity: 0.8;
  }
  
  svg {
    width: 24px;
    height: 24px;
    stroke-width: 3;
    color: #ff6b35;
  }
`;

const CollapsedDayBox = styled(DayBox)`
  @media (max-width: 768px) {
    min-height: auto;
    padding: 0.75rem;
    cursor: pointer;
    
    ${DayHeader} {
      margin-bottom: 0;
    }
    
    // Hide everything except the header when collapsed
    > *:not(${DayHeader}) {
      display: none;
    }
  }
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
  const [openDayStr, setOpenDayStr] = useState<string | null>(() => {
    // Set Monday as default open day on mobile
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    return format(monday, 'yyyy-MM-dd');
  });
  
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
    const isMobile = window.innerWidth <= 768;
    const enterKey = isMobile ? 'return' : 'Enter';
    
    switch (field) {
      case 'name': return `Type exercise name and press ${enterKey}`;
      case 'weight': return `Enter weight (or press ${enterKey} to skip)`;
      case 'sets': return `Enter number of sets and press ${enterKey}`;
      case 'reps': return `Enter number of reps and press ${enterKey}`;
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
    const isMobile = window.innerWidth <= 768;
    const isOpen = dayStr === openDayStr;
    
    const BoxComponent = isMobile && !isOpen ? CollapsedDayBox : DayBox;
    
    return (
      <BoxComponent 
        key={dayStr}
        onClick={() => {
          if (isMobile) {
            setOpenDayStr(isOpen ? null : dayStr);
          }
        }}
      >
        <DayHeader>
          <DayTitle>{format(day, 'EEEE')}</DayTitle>
          <DateSubheading>
            {isMobile ? format(day, 'M/d') : format(day, 'MMM d, yyyy')}
          </DateSubheading>
        </DayHeader>
        {(!isMobile || isOpen) && (
          <>
            {exercises[dayStr]?.map((exercise) => (
              <Exercise 
                key={exercise.id}
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  type="checkbox"
                  checked={exercise.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleExercise(dayStr, exercise.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
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
              <AddButton onClick={(e) => {
                e.stopPropagation();  // Prevent box from collapsing when clicking Add
                handleAddExercise(dayStr);
              }}>
                Add exercise
              </AddButton>
            )}
          </>
        )}
      </BoxComponent>
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
          <DayHeader>
            <DayTitle>Notes</DayTitle>
          </DayHeader>
          <DateSubheading>Weekly notes and reminders</DateSubheading>
          <AddButton>Add note</AddButton>
        </DayBox>
      </SecondRow>
    </PageContainer>
  );
};

export default Tracker; 
