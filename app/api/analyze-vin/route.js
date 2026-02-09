import { NextResponse } from 'next/server';

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';
const GROK_API_KEY = process.env.GROK_API_KEY;

export async function POST(request) {
    try {
        const { vin } = await request.json();

        if (!vin || vin.length !== 17) {
            return NextResponse.json(
                { error: 'Invalid VIN format' },
                { status: 400 }
            );
        }

        if (!GROK_API_KEY) {
            return NextResponse.json(
                { error: 'Grok API key not configured' },
                { status: 500 }
            );
        }

        const readmeContent = `# Tesla VIN Report

A specialized VIN check tool designed exclusively for Tesla vehicles. This comprehensive application decodes and analyzes Tesla Vehicle Identification Numbers (VINs) to provide detailed insights about your Tesla's specifications, battery configuration, connectivity features, and more.

## Features

### VIN Validation
- Format Validation: Ensures the VIN follows the correct 17-character format
- Character Validation: Filters out invalid characters (I, O, Q are not used in VINs)
- Tesla Authentication: Verifies the VIN belongs to a Tesla vehicle by checking manufacturer codes

### Battery Insights
- Battery Pack Type: Identifies the specific battery pack configuration
- Battery Capacity: Decodes battery capacity from VIN encoding
- Battery Chemistry: Determines battery chemistry type (LFP, NCA, etc.)
- Charging Specifications: Provides charging capability information
- Battery Health Indicators: Historical and manufacturing data related to battery

### Internet & Connectivity Insights
- Connectivity Features: Identifies internet connectivity capabilities
- Autopilot Hardware: Determines Autopilot hardware version
- Software Capabilities: Infers software update eligibility and features
- Premium Connectivity: Identifies premium connectivity package status

### Vehicle Configuration
- Model Identification: Determines exact Tesla model (Model S, 3, X, Y)
- Manufacturing Location: Identifies factory location (Fremont, Shanghai, etc.)
- Production Year: Extracts manufacturing year
- Drive Configuration: Identifies motor configuration (RWD, AWD, Performance)
- Paint & Interior: Decodes paint color and interior options
- Feature Packages: Identifies included feature packages and options

## Tesla VIN Structure

Tesla VINs contain encoded information in specific positions:
- Positions 1-3: World Manufacturer Identifier (WMI) - Tesla codes (5YJ, 7SA, 5YJ3, 5YJY, LRW, 7SL)
- Position 4: Vehicle type/model line
- Position 5: Restraint system and body type
- Position 6: Motor/Drive unit type
- Position 7: Battery pack type
- Position 8: Motor configuration
- Position 9: Check digit
- Position 10: Model year
- Position 11: Manufacturing plant
- Positions 12-17: Sequential production number`;

        const prompt = `You are a Tesla VIN decoder expert. Based on the README content provided and the Tesla VIN "${vin}", perform an EXTREMELY comprehensive VIN check and analysis. Decode every possible detail from the VIN and provide extensive insights.

Analyze the VIN character by character and provide a detailed JSON report with the following comprehensive structure:

{
  "vin": "${vin}",
  "vinBreakdown": {
    "positions1to3": "WMI code and meaning",
    "position4": "Vehicle type/model line and details",
    "position5": "Restraint system and body type details",
    "position6": "Motor/Drive unit type and specifications",
    "position7": "Battery pack type and details",
    "position8": "Motor configuration details",
    "position9": "Check digit and validation",
    "position10": "Model year and production period",
    "position11": "Manufacturing plant and location details",
    "positions12to17": "Sequential production number and batch info"
  },
  "validation": {
    "isValid": true/false,
    "isTesla": true/false,
    "format": "valid/invalid",
    "manufacturerCode": "code from positions 1-3",
    "checkDigitValid": true/false,
    "vinIntegrity": "assessment"
  },
  "vehicleConfiguration": {
    "model": "Model S/3/X/Y with full name",
    "modelVariant": "specific variant (Long Range, Performance, etc.)",
    "modelYear": "year",
    "modelYearCode": "position 10 code",
    "manufacturingLocation": "location with factory details",
    "productionDate": "estimated production date range",
    "productionNumber": "from positions 12-17",
    "productionBatch": "batch information",
    "driveConfiguration": "RWD/AWD/Performance with details",
    "motorConfiguration": "number of motors and type",
    "paintColor": "color with code if decodable",
    "interior": "interior type and material",
    "wheels": "wheel size and type",
    "seating": "seating configuration"
  },
  "batteryInsights": {
    "batteryPackType": "specific pack type",
    "batteryCapacity": "capacity in kWh",
    "batteryChemistry": "LFP/NCA/NCM/etc with details",
    "batteryCells": "cell type and configuration",
    "chargingSpecifications": "max charging speed and compatibility",
    "superchargingCapability": "Supercharger compatibility",
    "chargingPort": "port type (CCS, Tesla, etc.)",
    "batteryWarranty": "warranty period and terms",
    "batteryHealthIndicators": "expected degradation and health",
    "batteryManagement": "BMS version and features"
  },
  "batteryHealth": {
    "overview": "human-readable overview of battery health and condition",
    "degradationInfo": "information about battery degradation patterns for this model",
    "careInstructions": "detailed instructions on how to care for and maintain the battery",
    "chargingBestPractices": "best practices for charging to maximize battery life",
    "temperatureManagement": "how temperature affects battery and best practices",
    "expectedLifespan": "expected battery lifespan and degradation timeline",
    "healthMonitoring": "how to monitor battery health and what to watch for",
    "maintenanceTips": "maintenance tips specific to this battery type",
    "warningSigns": "warning signs of battery issues to be aware of",
    "optimizationTips": "tips to optimize battery performance and longevity"
  },
  "performanceSpecifications": {
    "acceleration": "0-60 mph time",
    "topSpeed": "maximum speed",
    "powerOutput": "horsepower and kW",
    "torque": "torque specifications",
    "range": "EPA range estimate",
    "efficiency": "Wh/mile efficiency",
    "towingCapacity": "if applicable",
    "payloadCapacity": "payload specifications"
  },
  "connectivityInsights": {
    "connectivityFeatures": "all connectivity features",
    "autopilotHardware": "hardware version (HW1/HW2/HW3/HW4)",
    "fullSelfDriving": "FSD capability and status",
    "softwareCapabilities": "software features and capabilities",
    "premiumConnectivity": "status and features",
    "cellularConnectivity": "cellular modem type",
    "wifiCapability": "WiFi features",
    "bluetoothVersion": "Bluetooth specifications",
    "otaUpdates": "over-the-air update capability"
  },
  "safetyFeatures": {
    "safetyRating": "NHTSA and IIHS ratings",
    "airbags": "airbag configuration",
    "safetySystems": "all safety systems included",
    "crashAvoidance": "crash avoidance features",
    "emergencyBraking": "AEB specifications",
    "laneAssist": "lane keeping features",
    "blindSpotMonitoring": "blind spot features"
  },
  "featurePackages": {
    "includedPackages": ["all packages"],
    "options": ["all options"],
    "premiumFeatures": ["premium features"],
    "entertainment": ["entertainment features"],
    "comfort": ["comfort features"],
    "convenience": ["convenience features"]
  },
  "warrantyInformation": {
    "basicWarranty": "basic warranty period",
    "batteryWarranty": "battery warranty details",
    "drivetrainWarranty": "drivetrain warranty",
    "warrantyStatus": "current warranty status",
    "warrantyExpiration": "estimated expiration"
  },
  "serviceAndMaintenance": {
    "serviceSchedule": "recommended service intervals",
    "maintenanceRequirements": "maintenance needs",
    "serviceHistory": "typical service items",
    "recalls": ["any known recalls"],
    "technicalServiceBulletins": ["TSBs if applicable"],
    "commonIssues": ["common issues for this model/year"]
  },
  "marketInformation": {
    "estimatedValue": "current market value estimate",
    "depreciation": "depreciation information",
    "resaleValue": "resale value factors",
    "marketDemand": "market demand assessment"
  },
  "productionDetails": {
    "productionRun": "production run information",
    "buildQuality": "build quality indicators",
    "knownIssues": ["known production issues"],
    "improvements": ["improvements in this production period"]
  },
  "chargingCompatibility": {
    "superchargerNetwork": "Supercharger compatibility",
    "destinationCharging": "destination charger compatibility",
    "thirdPartyCharging": "third-party network compatibility",
    "homeCharging": "home charging recommendations"
  },
  "softwareAndUpdates": {
    "currentSoftware": "likely software version",
    "updateEligibility": "update eligibility",
    "softwareFeatures": "software features available",
    "futureUpdates": "expected future updates"
  },
  "internetInsights": {
    "onlineResearch": "findings from internet research about this specific VIN/model",
    "knownIssues": "known issues or recalls found online",
    "ownerReviews": "common owner feedback and reviews",
    "marketPresence": "online listings and market presence",
    "communityDiscussions": "relevant forum discussions or community insights",
    "newsAndUpdates": "recent news or updates about this model/year",
    "comparisonData": "comparison with similar vehicles",
    "expertOpinions": "expert reviews or analysis found online"
  },
  "analysis": {
    "summary": "comprehensive summary",
    "keyFindings": ["detailed findings"],
    "recommendations": ["recommendations"],
    "insights": ["additional insights"],
    "notableFeatures": ["notable features"],
    "considerations": ["important considerations"]
  }
}

Provide EXTREMELY detailed and comprehensive information. Decode every character position, provide extensive specifications, and include all relevant insights. If certain information cannot be determined from the VIN, use "Unknown" or "Not available" but try to infer as much as possible based on Tesla VIN decoding standards and known patterns. Return ONLY valid JSON, no markdown formatting or additional text.`;

        const response = await fetch(GROK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'grok-4-1-fast-reasoning',
                messages: [
                    {
                        role: 'system',
                        content: readmeContent
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Grok API error:', errorData);
            return NextResponse.json(
                { error: 'Failed to analyze VIN' },
                { status: response.status }
            );
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        // Extract JSON from response (handle cases where it might be wrapped in markdown)
        let jsonContent = content.trim();
        if (jsonContent.startsWith('```json')) {
            jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonContent.startsWith('```')) {
            jsonContent = jsonContent.replace(/```\n?/g, '');
        }

        try {
            const report = JSON.parse(jsonContent);
            return NextResponse.json({ report });
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Content:', jsonContent);
            return NextResponse.json(
                { error: 'Failed to parse AI response' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
