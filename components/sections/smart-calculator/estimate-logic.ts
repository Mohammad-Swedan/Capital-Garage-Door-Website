export interface CalculatorFormData {
  serviceType: string;
  problems: string[];
  doorType: string;
  doorSize: string;
  doorMaterial: string;
  urgency: string;
  suburb: string;
  photoName: string | null;
  photoUrl: string | null;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactMethod: string;
}

export interface EstimateBreakdown {
  label: string;
  min: number;
  max: number;
}

export interface EstimateResult {
  minPrice: number;
  maxPrice: number;
  confidence: "Low" | "Medium" | "High";
  likelyIssue: string;
  breakdown: EstimateBreakdown[];
}

export function calculateEstimate(formData: CalculatorFormData): EstimateResult {
  let minPrice = 0;
  let maxPrice = 0;
  let likelyIssue = "";
  const breakdown: EstimateBreakdown[] = [];

  // Determine base costs based on service type
  switch (formData.serviceType) {
    case "repair": {
      // Base: $180 - $420
      let calloutMin = 80;
      let calloutMax = 120;
      let labourMin = 80;
      let labourMax = 180;
      let partsMin = 20;
      let partsMax = 120;

      // Adjust based on specific repair issue
      if (formData.problems.includes("Broken spring")) {
        likelyIssue = "Broken torsion or extension spring";
        partsMin += 60;
        partsMax += 120;
        labourMin += 40;
        labourMax += 80;
      } else if (formData.problems.includes("Broken cable")) {
        likelyIssue = "Snapped/frayed cable or drum slip";
        partsMin += 30;
        partsMax += 70;
        labourMin += 30;
        labourMax += 60;
      } else if (formData.problems.includes("Door stuck halfway") || formData.problems.includes("Door came off track")) {
        likelyIssue = "Track misalignment or cable/roller slip";
        labourMin += 50;
        labourMax += 100;
      } else if (formData.problems.includes("Motor not working")) {
        likelyIssue = "Opener motor failure or logic board issue";
        partsMin += 100;
        partsMax += 250;
        labourMin += 40;
        labourMax += 80;
      } else if (formData.problems.includes("Door is noisy")) {
        likelyIssue = "Worn rollers, hinges, or dry components";
        partsMin += 10;
        partsMax += 40;
      } else if (formData.problems.includes("Remote not working")) {
        likelyIssue = "Remote control battery, code sync, or receiver issue";
        partsMin += 20;
        partsMax += 50;
      } else {
        likelyIssue = "Mechanical garage door fault";
      }

      breakdown.push({ label: "Service Call & Diagnostic", min: calloutMin, max: calloutMax });
      breakdown.push({ label: "Labour Cost", min: labourMin, max: labourMax });
      breakdown.push({ label: "Replacement Parts", min: partsMin, max: partsMax });
      break;
    }

    case "installation": {
      // Base: $1800 - $4500
      let doorMin = 1200;
      let doorMax = 3000;
      let labourMin = 400;
      let labourMax = 1000;
      let partsMin = 200;
      let partsMax = 500;

      likelyIssue = "New high-quality garage door installation";

      if (formData.problems.includes("Need old door removed")) {
        labourMin += 100;
        labourMax += 200;
      }
      if (formData.problems.includes("Insulated door")) {
        doorMin += 400;
        doorMax += 900;
      }

      breakdown.push({ label: "Garage Door Unit", min: doorMin, max: doorMax });
      breakdown.push({ label: "Professional Installation", min: labourMin, max: labourMax });
      breakdown.push({ label: "Hardware & Tracking", min: partsMin, max: partsMax });
      break;
    }

    case "opener": {
      // Base: $450 - $950
      let motorMin = 300;
      let motorMax = 650;
      let labourMin = 100;
      let labourMax = 200;
      let setupMin = 50;
      let setupMax = 100;

      likelyIssue = "Garage door opener/motor upgrade";

      if (formData.problems.includes("Smart/WiFi opener")) {
        motorMin += 100;
        motorMax += 200;
      }
      if (formData.problems.includes("Battery backup")) {
        motorMin += 80;
        motorMax += 150;
      }
      if (formData.problems.includes("Extra remotes")) {
        setupMin += 40;
        setupMax += 80;
      }

      breakdown.push({ label: "Opener/Motor Unit", min: motorMin, max: motorMax });
      breakdown.push({ label: "Installation & Fitment", min: labourMin, max: labourMax });
      breakdown.push({ label: "Setup & Remotes Programming", min: setupMin, max: setupMax });
      break;
    }

    case "maintenance": {
      // Base: $120 - $280
      let inspectionMin = 40;
      let inspectionMax = 80;
      let servicingMin = 50;
      let servicingMax = 120;
      let adjustMin = 30;
      let adjustMax = 80;

      likelyIssue = "Preventative service & safety inspection";

      if (formData.problems.includes("Two doors")) {
        servicingMin += 30;
        servicingMax += 70;
        adjustMin += 20;
        adjustMax += 50;
      } else if (formData.problems.includes("Commercial door")) {
        inspectionMin += 40;
        inspectionMax += 80;
        servicingMin += 50;
        servicingMax += 100;
      }

      breakdown.push({ label: "Safety & Alignment Inspection", min: inspectionMin, max: inspectionMax });
      breakdown.push({ label: "Lubrication & Spring Tensioning", min: servicingMin, max: servicingMax });
      breakdown.push({ label: "Minor Hardware Adjustments", min: adjustMin, max: adjustMax });
      break;
    }

    default: {
      // Not Sure / Help Me Choose
      likelyIssue = "General inspection & diagnostic";
      breakdown.push({ label: "Service Call & Assessment", min: 80, max: 120 });
      breakdown.push({ label: "Labour Cost", min: 70, max: 150 });
      breakdown.push({ label: "Estimated Parts Needed", min: 30, max: 120 });
      break;
    }
  }

  // Calculate Subtotal from Breakdown
  breakdown.forEach((item) => {
    minPrice += item.min;
    maxPrice += item.max;
  });

  // Apply general parameters (Door Size / Type / Material)
  if (formData.doorSize === "double") {
    minPrice += 100;
    maxPrice += 250;
    // Distribute double door cost to breakdown
    if (breakdown.length > 0) {
      if (formData.serviceType === "installation") {
        breakdown[0].min += 80; // Door unit
        breakdown[0].max += 200;
        breakdown[1].min += 20; // Labour
        breakdown[1].max += 50;
      } else {
        breakdown[breakdown.length - 1].min += 50;
        breakdown[breakdown.length - 1].max += 150;
      }
    }
  } else if (formData.doorSize === "custom") {
    minPrice += 150;
    maxPrice += 350;
    if (breakdown.length > 0) {
      breakdown[0].min += 100;
      breakdown[0].max += 250;
    }
  }

  if (formData.doorType === "commercial") {
    minPrice += 200;
    maxPrice += 500;
    if (breakdown.length > 0) {
      breakdown[0].min += 120;
      breakdown[0].max += 300;
      breakdown[1].min += 80;
      breakdown[1].max += 200;
    }
  }

  // Urgency Adders
  if (formData.urgency === "today") {
    minPrice += 80;
    maxPrice += 150;
    // Add to Labour or create a line item in breakdown if preferred, but adding to Labour works best.
    const labourIndex = breakdown.findIndex((item) => item.label.includes("Labour") || item.label.includes("Installation") || item.label.includes("Servicing"));
    if (labourIndex !== -1) {
      breakdown[labourIndex].min += 80;
      breakdown[labourIndex].max += 150;
      breakdown[labourIndex].label += " (Same-Day Emergency Priority)";
    } else {
      breakdown.push({ label: "Same-Day Dispatch Fee", min: 80, max: 150 });
    }
  }

  // Calculate Confidence Level
  // High: specific service selected, specific door size, specific door type, has photo
  // Medium: normal selections
  // Low: selected 'notsure' or has multiple 'notsure' options
  let notSureCount = 0;
  if (formData.serviceType === "notsure") notSureCount++;
  if (formData.doorType === "notsure") notSureCount++;
  if (formData.doorSize === "notsure") notSureCount++;
  if (formData.doorMaterial === "notsure") notSureCount++;

  let confidence: "Low" | "Medium" | "High" = "Medium";
  if (notSureCount >= 2) {
    confidence = "Low";
  } else if (notSureCount === 0 && formData.photoUrl !== null) {
    confidence = "High";
  } else if (formData.photoUrl !== null) {
    confidence = "Medium"; // photo helps offset 'notsure' counts
  }

  return {
    minPrice,
    maxPrice,
    confidence,
    likelyIssue,
    breakdown,
  };
}
