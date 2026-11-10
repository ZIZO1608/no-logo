import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { UPLOADS_DIR } from "@/lib/db";
import { HERO_FILE_PATTERN } from "@/lib/hero";

const contentTypes: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  mp4: "video/mp4",
  webm: "video/webm",
};

const notFound = () => new Response("Not found", { status: 404 });

/** Serves uploaded hero media. Supports byte ranges, which phones need to play video. */
export async function GET(request: Request, { params }: RouteContext<"/media/[file]">) {
  const { file } = await params;
  if (!HERO_FILE_PATTERN.test(file)) return notFound();

  const filePath = path.join(UPLOADS_DIR, file);
  const size = await stat(filePath).then(
    (info) => info.size,
    () => null,
  );
  if (size === null) return notFound();

  const baseHeaders = {
    "Content-Type": contentTypes[path.extname(file).slice(1)],
    "Accept-Ranges": "bytes",
    // File names are unique per upload, so browsers can keep them forever.
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("range") ?? "");
  if (!range || (range[1] === "" && range[2] === "")) {
    const body = Readable.toWeb(createReadStream(filePath)) as ReadableStream;
    return new Response(body, { headers: { ...baseHeaders, "Content-Length": String(size) } });
  }

  // "bytes=-500" means the last 500 bytes.
  const start = range[1] === "" ? Math.max(size - Number(range[2]), 0) : Number(range[1]);
  const end = range[1] === "" || range[2] === "" ? size - 1 : Math.min(Number(range[2]), size - 1);
  if (start > end || start >= size) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }

  const body = Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream;
  return new Response(body, {
    status: 206,
    headers: {
      ...baseHeaders,
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Content-Length": String(end - start + 1),
    },
  });
}
