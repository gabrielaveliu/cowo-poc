import { bookingAPI } from '@/api-lib';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const roomId = searchParams.get('roomId');
    const date = searchParams.get('date');

    let bookings = bookingAPI.getAllBookings();
    if (userId) {
      bookings = bookings.filter((b) => b.userId === userId);
    }
    if (roomId) {
      bookings = bookings.filter((b) => b.roomId === roomId);
    }
    if (date) {
      bookings = bookings.filter((b) => b.date === date);
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
