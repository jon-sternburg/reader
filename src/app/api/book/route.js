import dbConnect from "../../util/dbConnect";
import Books from "../../models/books";
import { NextResponse } from 'next/server'
import { createRouter } from "next-connect";
import User from '../../models/user';

const router = createRouter()

router.post(post_handler)
router.get(get_handler)


async function update_book(user_id, book_id, annotations) {


try {
    let u =  await User.findOneAndUpdate(
        {
          _id: user_id,
          books: { $elemMatch: { id: book_id } } }, // FILTER
        {
          $set: {
            "books.$.annotations": annotations, // UPDATE
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

        const req = await request.json()
        const book_id = req.id
        const annotations = req.annotations.map(x => x[1])
        const user_id = req.user_id
        const name = req.name

        console.log('userid = ', user_id)
        console.log('saving ', annotations.length, ' annotations for book id=', book_id)
        dbConnect()
console.log(annotations)

let test =  await update_book(user_id, book_id, annotations, name)
   
if (test !== null) { 
console.log('RETRIEVED FROM DB')
    return NextResponse.json(test);

} else {
    console.log('NONE IN DB - CREATING NEW BOOK')
    console.log(annotations)
    let new_book = new Books({
        name: name,
        id: book_id,
        annotations: annotations
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

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: e, success: false });
    }
};
async function get_handler(request) {
    try {
   
        const { searchParams } = new URL(request.url)
        const book_id = searchParams.get('book_id')
        const user_id = searchParams.get('user_id')
   
        dbConnect()

   let u = await User.findById(user_id)


let book_result = u.books.filter( x => x.id == book_id)

return NextResponse.json(book_result);


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