CREATE TABLE enhancement_config (id text PRIMARY KEY,endpoint text NOT NULL DEFAULT '',secret text NOT NULL DEFAULT '',enabled integer NOT NULL DEFAULT 0,image_cost integer NOT NULL DEFAULT 3,video_cost integer NOT NULL DEFAULT 10,min_plan text NOT NULL DEFAULT 'lite',verified_at text,updated_at text NOT NULL);
--> statement-breakpoint
CREATE TABLE enhancement_jobs (id text PRIMARY KEY,user_id text NOT NULL REFERENCES users(id),request_key text NOT NULL,worker_id text NOT NULL DEFAULT '',endpoint text NOT NULL,secret text NOT NULL,kind text NOT NULL,cost integer NOT NULL,status text NOT NULL,progress integer NOT NULL DEFAULT 0,output text NOT NULL DEFAULT '{}',error text NOT NULL DEFAULT '',delivered integer NOT NULL DEFAULT 0,created_at text NOT NULL,updated_at text NOT NULL,UNIQUE(user_id,request_key));
--> statement-breakpoint
CREATE INDEX enhancement_jobs_owner ON enhancement_jobs(user_id,status);
