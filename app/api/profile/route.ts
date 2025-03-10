import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import UserProfile from '@/models/userprofile'

export async function GET() {
  try {
    await connectDB()
    // For now, we'll fetch a single user. In a real app, you'd get the current user's ID from the session
    const userProfile = await UserProfile.findOne()

    if (!userProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(userProfile)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB()
    const data = await request.json()

    // For now, we'll update a single user. In a real app, you'd get the current user's ID from the session
    const updatedProfile = await UserProfile.findOneAndUpdate(
      {},
      { ...data },
      { new: true, runValidators: true }
    )

    if (!updatedProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(updatedProfile)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
