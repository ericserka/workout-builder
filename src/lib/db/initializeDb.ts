import { SQLiteDatabase } from "expo-sqlite"

export const initializeDb = async (database: SQLiteDatabase) =>
  await database.execAsync(`
  CREATE TABLE IF NOT EXISTS exercises (
	  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	  name text NOT NULL,
	  muscle_group text NOT NULL,
	  description text
  );

  CREATE TABLE IF NOT EXISTS workout_exercises (
	  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	  sets integer NOT NULL,
	  reps integer NOT NULL,
	  weight real,
	  notes text,
    sequence integer,
	  exercise_id integer NOT NULL,
	  workout_id integer NOT NULL,
	  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON UPDATE no action ON DELETE cascade,
	  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON UPDATE no action ON DELETE cascade
  );

  CREATE TABLE IF NOT EXISTS workout_plans (
	  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	  name text NOT NULL,
	  description text,
	  is_active integer DEFAULT 1 NOT NULL
  );

  CREATE TABLE IF NOT EXISTS workouts (
	  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	  name text NOT NULL,
    sequence integer,
	  workout_plan_id integer NOT NULL,
	  FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON UPDATE no action ON DELETE cascade
  );

  CREATE INDEX IF NOT EXISTS idx_workout_exercises_sequence on workout_exercises (sequence);
  CREATE INDEX IF NOT EXISTS idx_workouts_sequence on workouts (sequence);
  
  CREATE TRIGGER IF NOT EXISTS trg_after_insert_workout_exercises AFTER INSERT ON workout_exercises
  FOR EACH ROW WHEN NEW.sequence IS NULL BEGIN
    UPDATE workout_exercises SET sequence = 
    (SELECT (COALESCE(MAX(sequence), 0) + 1) FROM workout_exercises WHERE workout_id = NEW.workout_id)
    WHERE id = NEW.id;
  END;
  
  CREATE TRIGGER IF NOT EXISTS trg_after_insert_workouts AFTER INSERT ON workouts
  FOR EACH ROW WHEN NEW.sequence IS NULL BEGIN
    UPDATE workouts SET sequence = 
    (SELECT (COALESCE(MAX(sequence), 0) + 1) FROM workouts WHERE workout_plan_id = NEW.workout_plan_id)
    WHERE id = NEW.id;
  END;

  CREATE TRIGGER IF NOT EXISTS trg_after_update_sequence_workout_exercises AFTER UPDATE OF sequence ON workout_exercises
  FOR EACH ROW BEGIN
    UPDATE workout_exercises SET sequence = sequence + 1
    WHERE sequence >= NEW.sequence
    AND sequence < OLD.sequence
    AND workout_id = NEW.workout_id
    AND id != NEW.id;
  END;

  CREATE TRIGGER IF NOT EXISTS trg_after_update_sequence_workouts AFTER UPDATE OF sequence ON workouts
  FOR EACH ROW BEGIN
    UPDATE workouts SET sequence = sequence + 1
    WHERE sequence >= NEW.sequence
    AND sequence < OLD.sequence
    AND workout_plan_id = NEW.workout_plan_id
    AND id != NEW.id;
  END;

  CREATE TRIGGER IF NOT EXISTS trg_after_delete_workout_exercises AFTER DELETE ON workout_exercises
  FOR EACH ROW BEGIN
    UPDATE workout_exercises SET sequence = sequence - 1 WHERE sequence > OLD.sequence AND workout_id = OLD.workout_id;
  END;

  CREATE TRIGGER IF NOT EXISTS trg_after_delete_workouts AFTER DELETE ON workouts
  FOR EACH ROW BEGIN
    UPDATE workouts SET sequence = sequence - 1 WHERE sequence > OLD.sequence AND workout_plan_id = OLD.workout_plan_id;
  END;
  `)
