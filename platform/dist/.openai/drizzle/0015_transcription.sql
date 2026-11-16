CREATE TABLE transcription_config (id TEXT PRIMARY KEY,enabled INTEGER NOT NULL,model TEXT NOT NULL,cost INTEGER NOT NULL,min_plan TEXT NOT NULL);
INSERT INTO transcription_config VALUES('main',1,'openai/whisper-large-v3',5,'lite');
CREATE TABLE transcription_jobs (id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),request_key TEXT NOT NULL,fingerprint TEXT NOT NULL,status TEXT NOT NULL,cost INTEGER NOT NULL,result TEXT,created_at TEXT NOT NULL,UNIQUE(user_id,request_key));
