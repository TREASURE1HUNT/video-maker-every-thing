ALTER TABLE orders ADD COLUMN price_currency text NOT NULL DEFAULT 'usd';
--> statement-breakpoint
CREATE TABLE payment_config (id text PRIMARY KEY NOT NULL, secret text NOT NULL DEFAULT '', enabled integer NOT NULL DEFAULT 0, updated_at text NOT NULL);
--> statement-breakpoint
UPDATE plans SET price_minor=CASE id WHEN 'lite' THEN 79000 WHEN 'plus' THEN 169000 WHEN 'pro' THEN 349000 ELSE price_minor END;
