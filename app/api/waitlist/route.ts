// app/api/waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { submitWaitlistEntry } from '@/lib/waitlist-service';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();

    // Validate the input
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email is valid format
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Submit the waitlist entry
    const { error } = await submitWaitlistEntry({
      name: body.name,
      email: body.email,
      company: body.company || null,
      interests: body.interests || [],
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to submit. Please try again.' },
        { status: 500 }
      );
    }

    // Return success
    return NextResponse.json(
      { success: true, message: 'Successfully joined waitlist' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in waitlist API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
