const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

const SERVICES = {
  fortune: {
    duration: 20,
    student: 1500,
    working: 2500,
  },
  career: {
    duration: 50,
    student: 3000,
    working: 4000,
  },
};

const ALLOWED_TIMES = new Set(["10:00", "13:00", "15:00", "18:00", "20:00"]);
const ALLOWED_FORTUNES = new Set(["iching", "korean", "constellation"]);
const ALLOWED_STATUSES = new Set([
  "provisional",
  "awaiting_payment",
  "paid",
  "confirmed",
  "completed",
  "cancelled",
]);
const ALLOWED_PAYMENT_STATUSES = new Set(["pending", "confirmed", "refunded"]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function text(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 160;
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00+09:00`);
  if (!Number.isFinite(timestamp)) return false;
  const today = new Date();
  const tokyoToday = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  tokyoToday.setHours(0, 0, 0, 0);
  const latest = new Date(tokyoToday);
  latest.setDate(latest.getDate() + 120);
  return timestamp >= tokyoToday.getTime() && timestamp <= latest.getTime();
}

function sameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

function constantTimeEqual(left, right) {
  if (!left || !right || left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

function isAdmin(request, env) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return constantTimeEqual(token, env.ADMIN_TOKEN || "");
}

async function readJson(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) throw new Error("invalid_content_type");
  return request.json();
}

async function ensureSchema(env) {
  if (!env.DB) throw new Error("database_unavailable");
  await env.DB.batch([
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY NOT NULL,
        nickname TEXT NOT NULL,
        email TEXT NOT NULL,
        customer_type TEXT NOT NULL,
        service TEXT NOT NULL,
        fortune_type TEXT,
        preferred_date TEXT NOT NULL,
        preferred_time TEXT NOT NULL,
        alternate_date TEXT,
        alternate_time TEXT,
        payment_method TEXT NOT NULL,
        topic TEXT,
        amount INTEGER NOT NULL,
        duration INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'provisional',
        payment_status TEXT NOT NULL DEFAULT 'pending',
        meeting_url TEXT,
        admin_note TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS reservations_created_at_idx ON reservations (created_at)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS reservations_email_idx ON reservations (email)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS reservations_status_idx ON reservations (status)"),
  ]);
}

function makeReservationId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (byte) => byte.toString(36).padStart(2, "0")).join("").slice(0, 6).toUpperCase();
  return `HC-${date}-${suffix}`;
}

function publicReservation(row) {
  return {
    id: row.id,
    nickname: row.nickname,
    customerType: row.customer_type,
    service: row.service,
    fortuneType: row.fortune_type,
    preferredDate: row.preferred_date,
    preferredTime: row.preferred_time,
    alternateDate: row.alternate_date,
    alternateTime: row.alternate_time,
    paymentMethod: row.payment_method,
    amount: row.amount,
    duration: row.duration,
    status: row.status,
    paymentStatus: row.payment_status,
    meetingUrl: row.status === "confirmed" ? row.meeting_url : null,
    updatedAt: row.updated_at,
  };
}

async function createReservation(request, env) {
  if (!sameOrigin(request)) return json({ error: "送信元を確認できませんでした。" }, 403);
  const body = await readJson(request);
  if (text(body.website, 200)) return json({ ok: true }, 202);

  const nickname = text(body.nickname, 40);
  const email = text(body.email, 160).toLowerCase();
  const customerType = text(body.customerType, 20);
  const service = text(body.service, 20);
  const fortuneType = text(body.fortuneType, 30);
  const preferredDate = text(body.preferredDate, 10);
  const preferredTime = text(body.preferredTime, 5);
  const alternateDate = text(body.alternateDate, 10);
  const alternateTime = text(body.alternateTime, 5);
  const paymentMethod = text(body.paymentMethod, 20);
  const topic = text(body.topic, 600);

  const errors = [];
  if (nickname.length < 1) errors.push("ニックネーム");
  if (!validEmail(email)) errors.push("メールアドレス");
  if (!["student", "working"].includes(customerType)) errors.push("区分");
  if (!SERVICES[service]) errors.push("メニュー");
  if (service === "fortune" && !ALLOWED_FORTUNES.has(fortuneType)) errors.push("占いの種類");
  if (!validDate(preferredDate)) errors.push("第1希望日");
  if (!ALLOWED_TIMES.has(preferredTime)) errors.push("第1希望時間");
  if (alternateDate && !validDate(alternateDate)) errors.push("第2希望日");
  if (alternateTime && !ALLOWED_TIMES.has(alternateTime)) errors.push("第2希望時間");
  if ((alternateDate && !alternateTime) || (!alternateDate && alternateTime)) errors.push("第2希望");
  if (!["bank", "paypay"].includes(paymentMethod)) errors.push("支払い方法");
  if (body.agree !== true) errors.push("同意");
  if (errors.length) return json({ error: `入力内容をご確認ください：${errors.join("、")}` }, 400);

  await ensureSchema(env);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM reservations WHERE email = ? AND created_at >= ?"
  ).bind(email, oneHourAgo).first();
  if (Number(recent?.count || 0) >= 5) {
    return json({ error: "短時間に複数のお申し込みを受け付けています。少し時間を空けてお試しください。" }, 429);
  }

  const plan = SERVICES[service];
  const id = makeReservationId();
  const now = new Date().toISOString();
  const amount = plan[customerType];
  await env.DB.prepare(`
    INSERT INTO reservations (
      id, nickname, email, customer_type, service, fortune_type,
      preferred_date, preferred_time, alternate_date, alternate_time,
      payment_method, topic, amount, duration, status, payment_status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'provisional', 'pending', ?, ?)
  `).bind(
    id,
    nickname,
    email,
    customerType,
    service,
    service === "fortune" ? fortuneType : null,
    preferredDate,
    preferredTime,
    alternateDate || null,
    alternateTime || null,
    paymentMethod,
    topic || null,
    amount,
    plan.duration,
    now,
    now,
  ).run();

  return json({
    reservation: {
      id,
      nickname,
      service,
      preferredDate,
      preferredTime,
      amount,
      duration: plan.duration,
      status: "provisional",
    },
    message: "仮予約を受け付けました。受付番号を保存してください。",
  }, 201);
}

async function lookupReservation(request, env) {
  if (!sameOrigin(request)) return json({ error: "送信元を確認できませんでした。" }, 403);
  const body = await readJson(request);
  const id = text(body.id, 40).toUpperCase();
  const email = text(body.email, 160).toLowerCase();
  if (!/^HC-\d{8}-[A-Z0-9]{6}$/.test(id) || !validEmail(email)) {
    return json({ error: "受付番号とメールアドレスをご確認ください。" }, 400);
  }
  await ensureSchema(env);
  const row = await env.DB.prepare(
    "SELECT * FROM reservations WHERE id = ? AND email = ? LIMIT 1"
  ).bind(id, email).first();
  if (!row) return json({ error: "一致する予約が見つかりませんでした。" }, 404);
  return json({ reservation: publicReservation(row) });
}

async function listReservations(request, env) {
  if (!isAdmin(request, env)) return json({ error: "管理者認証が必要です。" }, 401);
  await ensureSchema(env);
  const url = new URL(request.url);
  const status = text(url.searchParams.get("status"), 30);
  const statement = status && ALLOWED_STATUSES.has(status)
    ? env.DB.prepare("SELECT * FROM reservations WHERE status = ? ORDER BY created_at DESC LIMIT 100").bind(status)
    : env.DB.prepare("SELECT * FROM reservations ORDER BY created_at DESC LIMIT 100");
  const result = await statement.all();
  return json({ reservations: result.results || [] });
}

async function updateReservation(request, env, id) {
  if (!isAdmin(request, env)) return json({ error: "管理者認証が必要です。" }, 401);
  const body = await readJson(request);
  const status = text(body.status, 30);
  const paymentStatus = text(body.paymentStatus, 30);
  const meetingUrl = text(body.meetingUrl, 500);
  const adminNote = text(body.adminNote, 1000);
  if (!ALLOWED_STATUSES.has(status) || !ALLOWED_PAYMENT_STATUSES.has(paymentStatus)) {
    return json({ error: "更新内容をご確認ください。" }, 400);
  }
  if (meetingUrl && !/^https:\/\//.test(meetingUrl)) {
    return json({ error: "通話URLは https:// から入力してください。" }, 400);
  }
  await ensureSchema(env);
  const now = new Date().toISOString();
  const result = await env.DB.prepare(`
    UPDATE reservations
    SET status = ?, payment_status = ?, meeting_url = ?, admin_note = ?, updated_at = ?
    WHERE id = ?
  `).bind(status, paymentStatus, meetingUrl || null, adminNote || null, now, id).run();
  if (!result.meta?.changes) return json({ error: "予約が見つかりませんでした。" }, 404);
  const row = await env.DB.prepare("SELECT * FROM reservations WHERE id = ? LIMIT 1").bind(id).first();
  return json({ reservation: row });
}

async function handleApi(request, env, url) {
  try {
    if (url.pathname === "/api/reservations" && request.method === "POST") {
      return await createReservation(request, env);
    }
    if (url.pathname === "/api/reservations/lookup" && request.method === "POST") {
      return await lookupReservation(request, env);
    }
    if (url.pathname === "/api/admin/reservations" && request.method === "GET") {
      return await listReservations(request, env);
    }
    const adminMatch = url.pathname.match(/^\/api\/admin\/reservations\/([^/]+)$/);
    if (adminMatch && request.method === "PATCH") {
      return await updateReservation(request, env, decodeURIComponent(adminMatch[1]));
    }
    return json({ error: "見つかりませんでした。" }, 404);
  } catch (error) {
    if (error?.message === "database_unavailable") {
      return json({ error: "予約データベースの準備中です。しばらくしてからお試しください。" }, 503);
    }
    if (error?.message === "invalid_content_type") {
      return json({ error: "送信形式をご確認ください。" }, 415);
    }
    console.error("reservation_api_error", error);
    return json({ error: "処理中に問題が発生しました。時間を空けてお試しください。" }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return handleApi(request, env, url);
    if (url.pathname === "/") {
      return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
    }
    if (url.pathname === "/admin") {
      return env.ASSETS.fetch(new Request(new URL("/admin.html", request.url), request));
    }
    return env.ASSETS.fetch(request);
  },
};
