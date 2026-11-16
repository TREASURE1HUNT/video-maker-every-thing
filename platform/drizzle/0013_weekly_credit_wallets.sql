CREATE TABLE credit_wallets(user_id TEXT PRIMARY KEY REFERENCES users(id), cycle_key TEXT NOT NULL, included_remaining INTEGER NOT NULL DEFAULT 0, allowance INTEGER NOT NULL DEFAULT 0, next_refill_at TEXT);
--> statement-breakpoint
INSERT INTO credit_wallets(user_id,cycle_key,included_remaining,allowance,next_refill_at)
WITH configured AS (SELECT u.id,u.credits,u.status,s.starts_at,s.ends_at,s.plan,coalesce(p.credits,CASE s.plan WHEN 'lite' THEN 100 WHEN 'plus' THEN 350 WHEN 'pro' THEN 1000 ELSE 0 END) cap,max(0,cast((unixepoch('now')-unixepoch(s.starts_at))/604800 AS INTEGER)) cycle FROM users u LEFT JOIN subscriptions s ON s.user_id=u.id LEFT JOIN plans p ON p.id=s.plan), state AS (SELECT *,CASE WHEN status='active' AND plan IN ('lite','plus','pro') AND starts_at<=strftime('%Y-%m-%dT%H:%M:%fZ','now') AND ends_at>strftime('%Y-%m-%dT%H:%M:%fZ','now') THEN cap ELSE 0 END active_cap FROM configured)
SELECT id,CASE WHEN active_cap>0 THEN CASE WHEN credits=0 THEN 'initial' ELSE starts_at||':'||plan||':'||active_cap||':'||cycle END ELSE 'free' END,min(credits,active_cap),active_cap,CASE WHEN active_cap>0 THEN min(ends_at,strftime('%Y-%m-%dT%H:%M:%fZ',starts_at,'+'||((cycle+1)*604800)||' seconds')) ELSE NULL END FROM state;
--> statement-breakpoint
CREATE TABLE credit_allocations(ledger_id TEXT PRIMARY KEY REFERENCES ledger(id),user_id TEXT NOT NULL,cycle_key TEXT NOT NULL,included_used INTEGER NOT NULL);
--> statement-breakpoint
CREATE TRIGGER credit_debit_bucket AFTER INSERT ON ledger WHEN NEW.amount<0 AND NEW.reason NOT LIKE 'Недельные кредиты%' BEGIN
 INSERT INTO credit_allocations SELECT NEW.id,NEW.user_id,cycle_key,min(included_remaining,-NEW.amount) FROM credit_wallets WHERE user_id=NEW.user_id;
 UPDATE credit_wallets SET included_remaining=max(0,included_remaining+NEW.amount) WHERE user_id=NEW.user_id;
END;
--> statement-breakpoint
CREATE TRIGGER credit_refund_bucket AFTER INSERT ON ledger WHEN NEW.amount>0 AND NEW.id LIKE '%:refund' BEGIN
 UPDATE users SET credits=credits-coalesce((SELECT a.included_used FROM credit_allocations a JOIN credit_wallets w ON w.user_id=a.user_id WHERE a.ledger_id=substr(NEW.id,1,length(NEW.id)-7) AND a.user_id=NEW.user_id AND a.cycle_key<>w.cycle_key),0) WHERE id=NEW.user_id;
 UPDATE credit_wallets SET included_remaining=min(allowance,included_remaining+coalesce((SELECT included_used FROM credit_allocations WHERE ledger_id=substr(NEW.id,1,length(NEW.id)-7) AND user_id=NEW.user_id AND cycle_key=credit_wallets.cycle_key),0)) WHERE user_id=NEW.user_id;
END;
--> statement-breakpoint
CREATE TABLE credit_packs(id TEXT PRIMARY KEY,name TEXT NOT NULL,credits INTEGER NOT NULL,price_minor INTEGER NOT NULL,enabled INTEGER NOT NULL DEFAULT 1);
--> statement-breakpoint
INSERT INTO credit_packs VALUES('small','100 кредитов',100,14900,1),('medium','500 кредитов',500,59900,1),('large','1500 кредитов',1500,149000,1);
--> statement-breakpoint
ALTER TABLE orders ADD COLUMN kind TEXT NOT NULL DEFAULT 'subscription';
--> statement-breakpoint
ALTER TABLE orders ADD COLUMN pack_id TEXT;
