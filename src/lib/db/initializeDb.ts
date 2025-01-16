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
	  workout_plan_id integer NOT NULL,
	  FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON UPDATE no action ON DELETE cascade
  );
  `)
