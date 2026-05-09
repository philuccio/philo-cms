import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const body = (await request.json()) as { path?: string }

  if (!body.path) {
    return NextResponse.json({ message: 'Missing path' }, { status: 400 })
  }

  revalidatePath(body.path)

  return NextResponse.json({ revalidated: true, path: body.path })
}
