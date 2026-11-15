-- Increase default per-request credit prices. Preserve deliberately customized prices.
UPDATE models SET cost=5 WHERE id='router-auto' AND cost=1;
--> statement-breakpoint
UPDATE models SET cost=8 WHERE id='router-gemma' AND cost=2;
--> statement-breakpoint
UPDATE models SET cost=12 WHERE id IN ('router-gpt-mini','router-gemini') AND cost=3;
--> statement-breakpoint
UPDATE models SET cost=25 WHERE id='router-gpt' AND cost=8;
--> statement-breakpoint
UPDATE models SET cost=35 WHERE id='router-claude' AND cost=12;
--> statement-breakpoint
INSERT OR IGNORE INTO audit (id,actor,action,entity,details,created_at) VALUES ('credit-prices-v2','system','models.default_prices','catalog','{"auto":5,"gemma":8,"gpt-mini":12,"gemini":12,"gpt":25,"claude":35}',strftime('%Y-%m-%dT%H:%M:%fZ','now'));
