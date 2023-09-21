import dbConnect from "../../util/dbConnect";
import Books from "../../models/books";
import { NextResponse } from 'next/server'
import { createRouter } from "next-connect";
import User from '../../models/user';
import { getServerSession } from "next-auth/next"
import auth_options from '../../auth_options'
const router = createRouter()

router.post(post_handler)
router.get(get_handler)


async function update_book(user_id, book_id, annotations, user_categories) {


try {
    let u =  await User.findOneAndUpdate(
        {
          _id: user_id,
          books: { $elemMatch: { id: book_id } } }, // FILTER
        {
          $set: {
            "books.$.annotations": annotations, // UPDATE
            "books.$.user_categories": user_categories // UPDATE
          },
        },
        { new: true, safe: true, upsert: true })

        return u
    } catch {

return null

    }

}



async function post_handler(request) {
    try {
      const session = await getServerSession(auth_options)
      if (session) { 
        const req = await request.json()
        const book_id = req.id
        //const annotations = req.edit ? req.annotations : req.annotations.map(x => x[1])
        const annotations = req.annotations 
        const user_categories = req.user_categories
        const user_id = req.user_id
        const name = req.name
        console.log(typeof req.edit, '   ', req.edit)
        console.log('userid = ', user_id)
        console.log('saving ', annotations.length, ' annotations for book id=', book_id)
        dbConnect()


let test =  await update_book(user_id, book_id, annotations, user_categories)
   
if (test !== null) { 
console.log('SAVED TO EXISTING BOOK IN DB')
    return NextResponse.json(test);

} else {
    console.log('NONE IN DB - CREATING NEW BOOK')
    console.log(annotations)
    let new_book = new Books({
        name: name,
        id: book_id,
        annotations: annotations,
        user_categories: user_categories
    })


    let u =  await User.findOneAndUpdate(
        {
          _id: user_id, }, // FILTER
        {
          $push: {
            "books": new_book, // UPDATE
          },
        },
        { new: true, safe: true, upsert: true })

    return NextResponse.json(u);



}
      }  else {

        return NextResponse.json({ message: 'User not logged in', success: false });
       }
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: e, success: false });
    }
};
async function get_handler(request) {
    try {
      const session = await getServerSession(auth_options)
      if (session) { 
        const { searchParams } = new URL(request.url)
        const book_id = searchParams.get('book_id')
        const user_id = searchParams.get('user_id')
   
        dbConnect()

   let u = await User.findById(user_id)


let book_result = u.books.filter( x => x.id == book_id)

return NextResponse.json(book_result);
 } else {

  return NextResponse.json({ message: 'User not logged in', success: false });
 }

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