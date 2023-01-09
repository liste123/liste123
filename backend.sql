-- Get a single project by id
CREATE OR REPLACE FUNCTION "public"."beta_get_project"(
  "uuid" VARCHAR(20)
)
RETURNS SETOF "public"."beta_projects_index" AS $$
#variable_conflict use_variable
BEGIN
  RETURN QUERY 
  SELECT
    "p"."uuid",
    "p"."title",
    "p"."updated_at",
    COALESCE("a"."data" ->> 'uname', CONCAT(LEFT("a"."uuid", 3), RIGHT("a"."uuid", 3)))::text AS "uname"
  FROM "beta_projects" AS "p"
  LEFT JOIN "beta_accounts" AS "a"
  ON "a"."uuid" = "p"."account_uuid"
  WHERE "p"."uuid" = "uuid"
  LIMIT 1;
END; $$
LANGUAGE plpgsql IMMUTABLE STRICT;





DROP FUNCTION "public"."beta_project_import";
CREATE OR REPLACE FUNCTION "public"."beta_project_import"(
  "accountID" VARCHAR(20),
  "projectID" VARCHAR(20)
)
RETURNS SETOF "public"."beta_interface_json" AS $$
#variable_conflict use_variable
DECLARE
  VAR_r RECORD;
  VAR_p JSON = '{}';
BEGIN

  -- Check user exists
  SELECT "uuid" INTO VAR_r FROM "public"."beta_accounts" WHERE "uuid" = "accountID";
  IF VAR_r IS NULL THEN
  	RETURN QUERY 
    SELECT NOW(), json_build_object(
  	  'success', false,
  	  'error', json_build_object(
  	    'code', 'AccountNotFound',
  	    'message', 'Account not found'
  	  )
  	);
  	RETURN;
  END IF;
  
  -- Check project exists
  SELECT "uuid" INTO VAR_r FROM "public"."beta_projects" WHERE "uuid" = "projectID";
  IF VAR_r IS NULL THEN
  	RETURN QUERY 
    SELECT NOW(), json_build_object(
  	  'success', false,
  	  'error', json_build_object(
  	    'code', 'ProjectNotFound',
  	    'message', 'Project not found'
  	  )
  	);
  	RETURN;
  END IF;

  -- TODO: check if project is already in the list
  --       (make this function isomorphic)
  
  -- Update Account with shared project
  RETURN QUERY
  WITH "updated_rows" AS (
    UPDATE "public"."beta_accounts"
       SET "shared_projects" = jsonb_insert("shared_projects", '{999999}', CONCAT('"', "projectID", '"')::jsonb, true)
     WHERE "uuid" = "accountID"
    RETURNING *
  )
  SELECT
  NOW(),
    json_build_object(
      'success', true,
      'data', row_to_json(t)
    )
  FROM (SELECT * FROM "updated_rows") t;
END; $$
LANGUAGE plpgsql VOLATILE;

--select * from "public"."beta_project_import"('-NL7HSPnxqvjcXqdHYX0', '-NL6at4ofuO8MYEkCEo9');














DROP FUNCTION "public"."beta_project_remove_shared";
CREATE OR REPLACE FUNCTION "public"."beta_project_remove_shared"(
  "accountID" VARCHAR(20),
  "projectID" VARCHAR(20)
)
RETURNS SETOF "public"."beta_interface_json" AS $$
#variable_conflict use_variable
DECLARE
  VAR_r RECORD;
  VAR_p JSON = '{}';
BEGIN

  -- Check user exists
  SELECT "uuid" INTO VAR_r FROM "public"."beta_accounts" WHERE "uuid" = "accountID";
  IF VAR_r IS NULL THEN
  	RETURN QUERY 
    SELECT NOW(), json_build_object(
  	  'success', false,
  	  'error', json_build_object(
  	    'code', 'AccountNotFound',
  	    'message', 'Account not found'
  	  )
  	);
  	RETURN;
  END IF;
  
  
  -- Update Account with shared project
  RETURN QUERY
  WITH "updated_rows" AS (
    UPDATE "public"."beta_accounts"
       SET "shared_projects" = "shared_projects"::jsonb - "projectID"
     WHERE "uuid" = "accountID"
    RETURNING *
  )
  SELECT
  NOW(),
    json_build_object(
      'success', true,
      'data', row_to_json(t)
    )
  FROM (SELECT * FROM "updated_rows") t;
END; $$
LANGUAGE plpgsql VOLATILE;

-- select * from "public"."beta_project_remove_shared"('-NL7HSPnxqvjcXqdHYX0', 'b');













DROP FUNCTION "public"."beta_project_remove_own";
CREATE OR REPLACE FUNCTION "public"."beta_project_remove_own"(
  "accountID" VARCHAR(20),
  "projectID" VARCHAR(20)
)
RETURNS SETOF "public"."beta_interface_json" AS $$
#variable_conflict use_variable
DECLARE
  VAR_r RECORD;
  VAR_p JSON = '{}';
BEGIN

  -- Check user exists
  SELECT "uuid" INTO VAR_r FROM "public"."beta_accounts" WHERE "uuid" = "accountID";
  IF VAR_r IS NULL THEN
  	RETURN QUERY 
    SELECT NOW(), json_build_object(
  	  'success', false,
  	  'error', json_build_object(
  	    'code', 'AccountNotFound',
  	    'message', 'Account not found'
  	  )
  	);
  	RETURN;
  END IF;

  -- Flag as deleted only in conjunction with the account
  UPDATE "public"."beta_projects"
    SET "deleted" = NOW()
  WHERE "uuid" = "projectID" 
    AND "account_uuid" = "accountID";
  
  -- Update Account with shared project
  RETURN QUERY
  WITH "updated_rows" AS (
    UPDATE "public"."beta_accounts"
       SET "own_projects" = "own_projects"::jsonb - "projectID"
     WHERE "uuid" = "accountID"
    RETURNING *
  )
  SELECT
  NOW(),
    json_build_object(
      'success', true,
      'data', row_to_json(t)
    )
  FROM (SELECT * FROM "updated_rows") t;
END; $$
LANGUAGE plpgsql VOLATILE;

-- select * from "public"."beta_project_remove_shared"('-NL7HSPnxqvjcXqdHYX0', 'b');














DROP FUNCTION "public"."beta_get_account";
CREATE OR REPLACE FUNCTION "public"."beta_get_account"(
  "accountID" VARCHAR(20)
)
RETURNS SETOF "public"."beta_interface_json" AS $$
#variable_conflict use_variable
BEGIN
  RETURN QUERY 
  WITH
  "account" AS (
    SELECT * FROM "public"."beta_accounts"
    WHERE "uuid" = "accountID"
  ),
  "own_projects" AS (
    SELECT
      "p"."uuid",
      "p"."title",
      "p"."updated_at"
    FROM (SELECT jsonb_array_elements_text("own_projects")::text AS "uuid"FROM "account") AS "a"
    LEFT JOIN LATERAL (
      SELECT * FROM "public"."beta_projects"
      WHERE "uuid" = "a"."uuid"
        AND "deleted" IS NULL
    ) "p" ON true
  ),
  "shared_projects" AS (
    SELECT
      "a"."uuid",
      "p"."account_uuid",
      "p"."title",
      "p"."updated_at"
    FROM (SELECT jsonb_array_elements_text("shared_projects")::text AS "uuid"FROM "account") AS "a"
    LEFT JOIN LATERAL (
      SELECT * FROM "public"."beta_projects"
      WHERE "uuid" = "a"."uuid"
        AND "deleted" IS NULL
    ) "p" ON true
  ),
  "shared_projects1" AS (
    SELECT
      "p".*,
      COALESCE("a".data->>'uname', 'John Doe') AS "uname"
    FROM "shared_projects" AS "p"
    LEFT JOIN LATERAL (
      SELECT * FROM "public"."beta_accounts"
      WHERE "uuid" = "p"."account_uuid"
    ) "a" ON TRUE
  ),
  "shared_projects_json" AS (
    select jsonb_agg(shared_projects1) as "value" from shared_projects1
  ),
  "own_projects_json" AS (
    select jsonb_agg(own_projects) as "value" from own_projects
  ),
  "full_account_lines" AS (
  select
    "a"."uuid",
    "a"."updated_at",
    "a"."updated_at",
    COALESCE("a"."data"->>'uname', 'John Doe') AS "uname",
    COALESCE((select * from "own_projects_json"), '[]') as "own_projects",
    COALESCE((select * from "shared_projects_json"), '[]') as "shared_projects"
    FROM "account" AS "a"
  ),
  "full_account_json" AS (
    SELECT jsonb_agg("full_account_lines")->0 as "value" 
    FROM "full_account_lines"
  )
  SELECT 
    NOW(), 
    json_build_object(
      'success', ((SELECT * FROM "full_account_json") IS NOT NULL),
      'data', (SELECT * FROM "full_account_json")
    );
END; $$
LANGUAGE plpgsql IMMUTABLE STRICT;