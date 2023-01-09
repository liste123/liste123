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