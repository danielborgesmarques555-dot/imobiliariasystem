const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || "imobiliariasystem-500804";
const firestoreDatabase = process.env.FIRESTORE_DATABASE || "(default)";
const firestoreRoot = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabase}/documents`;
const syncedCollections = ["properties", "clients", "owners", "contracts", "team", "appointments", "invoices", "trash"];
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 30 * 1024 * 1024) {
        request.destroy();
        reject(new Error("Payload muito grande"));
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

async function googleAccessToken() {
  if (process.env.GOOGLE_OAUTH_ACCESS_TOKEN) return process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
  const response = await fetch("http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token", {
    headers: { "Metadata-Flavor": "Google" },
  });
  if (!response.ok) throw new Error(`Metadata token indisponivel: ${response.status}`);
  const data = await response.json();
  return data.access_token;
}

async function firestoreRequest(pathname, options = {}) {
  const token = await googleAccessToken();
  const response = await fetch(`${firestoreRoot}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (response.status === 404) return null;
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.error?.message || `Firestore ${response.status}`);
  return data;
}

function documentPayload(document) {
  const raw = document?.fields?.payload?.stringValue;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function readCollection(collection) {
  const data = await firestoreRequest(`/regis/${collection}/${collection}`);
  const documents = data?.documents || [];
  return documents.map(documentPayload).filter(Boolean);
}

async function readCompany() {
  const data = await firestoreRequest("/regis/company");
  return documentPayload(data);
}

async function writeCollection(collection, items) {
  const current = await readCollection(collection);
  const nextItems = Array.isArray(items) ? items : [];
  const nextIds = new Set(nextItems.map((item) => String(item.id || item.name || Date.now())));
  const writes = [
    ...nextItems.map((item, index) => {
      const id = String(item.id || item.name || `${collection}-${index}`);
      return {
        update: {
          name: `projects/${projectId}/databases/${firestoreDatabase}/documents/regis/${collection}/${collection}/${encodeURIComponent(id)}`,
          fields: {
            payload: { stringValue: JSON.stringify({ ...item, id }) },
            updatedAt: { timestampValue: new Date().toISOString() },
          },
        },
      };
    }),
    ...current
      .filter((item) => item.id && !nextIds.has(String(item.id)))
      .map((item) => ({
        delete: `projects/${projectId}/databases/${firestoreDatabase}/documents/regis/${collection}/${collection}/${encodeURIComponent(String(item.id))}`,
      })),
  ];

  for (let index = 0; index < writes.length; index += 450) {
    await firestoreRequest(":batchWrite", {
      method: "POST",
      body: JSON.stringify({ writes: writes.slice(index, index + 450) }),
    });
  }
}

async function writeCompany(company) {
  await firestoreRequest("/regis/company?updateMask.fieldPaths=payload&updateMask.fieldPaths=updatedAt", {
    method: "PATCH",
    body: JSON.stringify({
      fields: {
        payload: { stringValue: JSON.stringify(company || {}) },
        updatedAt: { timestampValue: new Date().toISOString() },
      },
    }),
  });
}

async function readCloudState() {
  const entries = await Promise.all(syncedCollections.map(async (collection) => [collection, await readCollection(collection)]));
  const data = Object.fromEntries(entries);
  data.company = await readCompany();
  const empty = syncedCollections.every((collection) => !data[collection]?.length) && !data.company;
  return { empty, data };
}

async function writeCloudState(data) {
  await Promise.all(syncedCollections.map((collection) => writeCollection(collection, data[collection] || [])));
  await writeCompany(data.company || {});
}

http
  .createServer(async (request, response) => {
    const requestUrl = new URL(request.url, `http://${host}:${port}`);
    if (requestUrl.pathname === "/api/health") {
      sendJson(response, 200, { ok: true, projectId });
      return;
    }

    if (requestUrl.pathname === "/api/state") {
      try {
        if (request.method === "GET") {
          sendJson(response, 200, await readCloudState());
          return;
        }
        if (request.method === "POST") {
          await writeCloudState(await readJson(request));
          sendJson(response, 200, { ok: true, syncedAt: new Date().toISOString() });
          return;
        }
        sendJson(response, 405, { error: "Metodo nao permitido" });
      } catch (error) {
        console.error(error);
        sendJson(response, 503, { error: "Banco de dados indisponivel", detail: error.message });
      }
      return;
    }

    const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
    const file = path.resolve(root, `.${decodeURIComponent(pathname)}`);
    const relativePath = path.relative(root, file);

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(file, (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      response.writeHead(200, {
        "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream",
      });
      response.end(data);
    });
  })
  .listen(port, host, () => {
    console.log(`Regis Imobiliaria online em http://${host}:${port}`);
  });
