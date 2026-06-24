-- Revoke public RPC access so clicks/rankings cannot bypass Next.js API routes.
-- After this, log_click / log_equipment_only / update_weighted_rankings are
-- callable only with the service role key (server-side routes).
--
-- Run once in Supabase SQL Editor.

REVOKE EXECUTE ON FUNCTION log_click(INTEGER, TEXT, TEXT, INTEGER) FROM anon;
REVOKE EXECUTE ON FUNCTION log_click(INTEGER, TEXT, TEXT, INTEGER) FROM authenticated;
REVOKE EXECUTE ON FUNCTION log_equipment_only(TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION log_equipment_only(TEXT) FROM authenticated;
REVOKE EXECUTE ON FUNCTION update_weighted_rankings() FROM anon;
REVOKE EXECUTE ON FUNCTION update_weighted_rankings() FROM authenticated;

-- Ensure service role retains access
GRANT EXECUTE ON FUNCTION log_click(INTEGER, TEXT, TEXT, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION log_equipment_only(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION update_weighted_rankings() TO service_role;

SELECT 'anon RPC grants revoked ✅' AS status;
