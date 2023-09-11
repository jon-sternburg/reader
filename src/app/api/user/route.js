import dbConnect from "../../util/dbConnect";
import { NextResponse } from 'next/server'
import { createRouter } from "next-connect";
import User from '../../models/user';

const router = createRouter()

router.get(get_handler)


async function get_handler(request) {
    try {
   
        const { searchParams } = new URL(request.url)
        const user_id = searchParams.get('user_id')

        dbConnect()

   let u = await User.findById(user_id)

return NextResponse.json(u );


    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: e, success: false });
    }
};

export async function POST(request, ctx) {
    return router.run(request, ctx);
  }
  export async function GET(request, ctx) {
    return router.run(request, ctx);
  }

//export { handler as GET, handler as POST };