import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { location, soilType, temperature, rainfall, farmingGoal } = body;

    if (!location || !soilType || !temperature || !rainfall || !farmingGoal) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mock recommendation data
    const recommendations = [
      {
        name: "Maize",
        suitability: 90,
        plantingTime: "March - May",
        harvestTime: "July - September",
        waterNeeds: "Medium",
        tempRange: "20°C - 30°C",
        soilType: "Loamy",
        pHRange: "5.5 - 7.0",
        growthDuration: 100,
        profitabilityIndex: 4.7,
        additionalTips: "Use nitrogen-rich fertilizer for better yield.",
      },
      {
        name: "Cassava",
        suitability: 85,
        plantingTime: "April - June",
        harvestTime: "October - December",
        waterNeeds: "Low",
        tempRange: "22°C - 35°C",
        soilType: "Sandy Loam",
        pHRange: "5.0 - 6.5",
        growthDuration: 180,
        profitabilityIndex: 4.5,
        additionalTips: "Ideal for food security and industrial use.",
      },
    ];

    return NextResponse.json({ recommendations }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
