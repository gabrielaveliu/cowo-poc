import { pricingAPI } from '@/api-lib';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    if (!month) {
      const allPricing = pricingAPI.getAllPricing();
      return NextResponse.json(allPricing);
    }

    const pricing = pricingAPI.getMonthPricing(month);
    return NextResponse.json(pricing);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { month, pricing } = body;

    if (!month || !pricing) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    for (const [roomId, price] of Object.entries(pricing)) {
      pricingAPI.updateRoomPricing(roomId, month, price as number);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update pricing' },
      { status: 500 }
    );
  }
}
