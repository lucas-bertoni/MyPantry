CREATE TABLE IF NOT EXISTS events (
  eventid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR,
  event_data JSON,
  event_timestamp TIMESTAMP DEFAULT NOW()
);