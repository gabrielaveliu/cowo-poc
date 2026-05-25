import { billingAPI } from '@/api-lib';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    if (!month) {
      return NextResponse.json(
        { error: 'Month parameter is required' },
        { status: 400 }
      );
    }

    const report = billingAPI.generateMonthlyReport(month);
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate billing report' },
      { status: 500 }
    );
  }
}
