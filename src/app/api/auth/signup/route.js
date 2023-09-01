import User from '../../../models/user';
import dbConnect from '../../../util/dbConnect';
import { createRouter } from "next-connect";
import { NextResponse } from "next/server";

const router = createRouter()


router.post(createUser)

async function createUser(request, res) {
  const req = await request.json()


  dbConnect();
  try {
    let user = await User.create(req)
    return NextResponse.status(201).json({ message: 'Created user!' })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'ERROR' })

  }
  



}

export async function POST(request, ctx) {
  return router.run(request, ctx);
}

