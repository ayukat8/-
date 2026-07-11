CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY NOT NULL,
  nickname TEXT NOT NULL,
  email TEXT NOT NULL,
  customer_type TEXT NOT NULL,
  service TEXT NOT NULL,
  fortune_type TEXT,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  alternate_date TEXT,
  alternate_time TEXT,
  payment_method TEXT NOT NULL,
  topic TEXT,
  amount INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'provisional',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  meeting_url TEXT,
  admin_note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS reservations_created_at_idx ON reservations (created_at);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS reservations_email_idx ON reservations (email);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS reservations_status_idx ON reservations (status);
