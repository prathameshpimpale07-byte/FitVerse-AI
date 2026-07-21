import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ExerciseLibrary from './components/ExerciseLibrary';
import ExerciseDetails from './components/ExerciseDetails';

const WorkoutPage = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleSelectAlternative = (altEx) => {
    setSelectedExercise(altEx);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Exercise Details Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <ExerciseDetails
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
            onSelectAlternative={handleSelectAlternative}
          />
        )}
      </AnimatePresence>

      {/* Main Exercise Library Grid */}
      <ExerciseLibrary
        category={null}
        onBack={null}
        onSelectExercise={(ex) => setSelectedExercise(ex)}
      />
    </div>
  );
};

export default WorkoutPage;
