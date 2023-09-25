import { NextResponse } from "next/server";
import { createRouter } from "next-connect";
const router = createRouter();
const fsp = require("fs").promises;
const path = require("path");

router.post(post_handler);

async function post_handler(request) {
  try {
    const req = await request.json();
    const quote_data = req.quote_data;
    const book_id = req.book_id;
    let f = path.join(process.cwd(), "complete_book_data", `${book_id}.json`);
    await fsp.writeFile(f, JSON.stringify(quote_data));

    console.log("done! wrote ", book_id, " => ", quote_data.length);
    return NextResponse.json({ message: "wrote book", success: true });
  } catch (e) {
    console.error("route error =>>>>>>>>>", e);
    return NextResponse.json({ message: e, success: false });
  }
}

export async function POST(request, ctx) {
  return router.run(request, ctx);
}

//export { handler as GET, handler as POST };
