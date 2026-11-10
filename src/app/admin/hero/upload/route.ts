import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { readSetting, UPLOADS_DIR, writeSetting } from "@/lib/db";
import { HERO_SETTING, HERO_TAG, parseHeroMedia, type HeroMedia } from "@/lib/hero";

const MB = 1024 * 1024;
const MAX_IMAGE_BYTES = 8 * MB;
const MAX_VIDEO_BYTES = 60 * MB;

type Format = { extension: string; kind: HeroMedia["kind"] };

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((byte, index) => bytes[offset + index] === byte);

/** Decides the format from the file's first bytes, not from its name or declared type. */
const detectFormat = (bytes: Uint8Array): Format | null => {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { extension: "jpg", kind: "image" };
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47])) return { extension: "png", kind: "image" };
  if (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)) {
    return { extension: "webp", kind: "image" };
  }
  if (startsWith(bytes, [0x66, 0x74, 0x79, 0x70], 4)) return { extension: "mp4", kind: "video" };
  if (startsWith(bytes, [0x1a, 0x45, 0xdf, 0xa3])) return { extension: "webm", kind: "video" };
  return null;
};

const fail = (error: string, status: number) => Response.json({ error }, { status });

const isSameOrigin = (request: Request) => {
  const origin = request.headers.get("origin");
  return origin !== null && new URL(origin).host === request.headers.get("host");
};

const removeCurrentFile = async () => {
  const current = parseHeroMedia(readSetting(HERO_SETTING));
  if (!current) return;
  // The name was validated against HERO_FILE_PATTERN, so it cannot point outside the uploads folder.
  await unlink(path.join(UPLOADS_DIR, current.file)).catch(() => undefined);
};

const guard = async (request: Request) => {
  if (!isSameOrigin(request)) return fail("forbidden", 403);
  if (!(await isAdmin())) return fail("unauthorized", 401);
  return null;
};

export async function POST(request: Request) {
  const blocked = await guard(request);
  if (blocked) return blocked;

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_VIDEO_BYTES + MB) return fail("tooLarge", 413);

  const upload = (await request.formData().catch(() => null))?.get("file");
  if (!(upload instanceof File) || upload.size === 0) return fail("missing", 400);
  if (upload.size > MAX_VIDEO_BYTES) return fail("tooLarge", 413);

  const bytes = new Uint8Array(await upload.arrayBuffer());
  const format = detectFormat(bytes);
  if (!format) return fail("badType", 415);
  if (format.kind === "image" && bytes.length > MAX_IMAGE_BYTES) return fail("tooLarge", 413);

  const file = `hero-${Date.now()}.${format.extension}`;
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, file), bytes);

  await removeCurrentFile();
  writeSetting(HERO_SETTING, JSON.stringify({ file, kind: format.kind } satisfies HeroMedia));
  revalidateTag(HERO_TAG, { expire: 0 });

  return Response.json({ file, kind: format.kind });
}

export async function DELETE(request: Request) {
  const blocked = await guard(request);
  if (blocked) return blocked;

  await removeCurrentFile();
  writeSetting(HERO_SETTING, null);
  revalidateTag(HERO_TAG, { expire: 0 });

  return Response.json({ ok: true });
}
