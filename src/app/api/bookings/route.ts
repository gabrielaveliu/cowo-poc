import { bookingAPI } from '@/api-lib';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let bookings;
    if (userId) {
      bookings = bookingAPI.getUserBookings(userId);
    } else {
      bookings = bookingAPI.getAllBookings();
    }

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, roomId, date, startTime, endTime } = body;

    if (!userId || !roomId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const booking = bookingAPI.createBooking(
      userId,
      roomId,
      date,
      startTime,
      endTime
    );

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
