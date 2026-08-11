const apiUrl = process.env.QW_API_URL;
if (!apiUrl) throw new Error('Required QoderWake API secret is missing');

const context = parseJson(process.env.QW_CONTEXT_JSON || '{}', 'QW_CONTEXT_JSON');
const eventType = required('QW_EVENT_TYPE');
const role = required('QW_ROLE');
const repository = required('GITHUB_REPOSITORY');
const entity = process.env.QW_SESSION_ENTITY || `${eventType}:${process.env.GITHUB_RUN_ID}`;

const payload = {
  wakeSessionUniqueId: `github:${repository}:${role}:${entity}`,
  eventType,
  role,
  repository,
  runId: process.env.GITHUB_RUN_ID,
  deliveryId: `${process.env.GITHUB_RUN_ID}:${process.env.GITHUB_RUN_ATTEMPT || '1'}:${role}`,
  context,
};

const response = await fetch(apiUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

const responseText = await response.text();
if (!response.ok) {
  throw new Error(`QoderWake rejected ${role} event: HTTP ${response.status} ${responseText.slice(0, 240)}`);
}

let result = {};
try { result = JSON.parse(responseText); } catch {}
const invocationId = result.invocation_id || result.invocationId || result.data?.invocationId || 'accepted';
process.stdout.write(`QoderWake ${role} event accepted (${invocationId}).\n`);

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function parseJson(value, name) {
  try { return JSON.parse(value); }
  catch { throw new Error(`${name} must contain valid JSON`); }
}
