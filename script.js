// ======= Guidance Data =======
const GUIDANCE = {
  UNDERWEIGHT: [
    "Eat regular, balanced meals",
    "Add one extra healthy meal or snack per day",
    "Start light strength or muscle-building exercises",
    "If possible, consult a nutritionist for a proper meal plan"
  ],
  HEALTHY: [
    "Continue eating balanced meals",
    "Exercise regularly to maintain your weight",
    "Get enough rest and proper sleep"
  ],
  OVERWEIGHT: [
    "Exercise regularly to reach a healthy weight for your height",
    "Reduce high-carb foods (like sugary and refined foods)",
    "Limit foods high in cholesterol and unhealthy fats",
    "Maintain proper sleep and rest"
  ],
  OBESE: [
    "Be mindful and careful about food portions",
    "Gradually reduce high-carb and high-cholesterol foods",
    "Replace them with protein- and fiber-rich foods",
    "Start with light exercise and increase gradually",
    "Consult a doctor for medical advice",
    "Get a safe and suitable exercise plan before starting intense workouts"
  ]
};

// ======= DOM =======
const elName = document.getElementById("name");
const elHeight = document.getElementById("height");
const elWeight = document.getElementById("weight");

const elBtnCalc = document.getElementById("btnCalc");
const elBtnReset = document.getElementById("btnReset");
const elError = document.getElementById("error");

const elResultArea = document.getElementById("resultArea");
const elUserName = document.getElementById("userName");
const elUserHeight = document.getElementById("userHeight");
const elUserWeight = document.getElementById("userWeight");

const elBmiValue = document.getElementById("bmiValue");
const elBmiCategory = document.getElementById("bmiCategory");
const elBmiRange = document.getElementById("bmiRange");
const elGuidanceList = document.getElementById("guidanceList");

const elBtnPrint = document.getElementById("btnPrint");
const elBtnEdit = document.getElementById("btnEdit");

// Footer image element (so we can swap to campaign.png only for PDF)
const footerImg = document.getElementById("footerImg");
const SCREEN_FOOTER_SRC = "campaign.jpg";
const PRINT_FOOTER_SRC = "campaign.png";

// ======= Helpers =======
function showError(msg) {
  elError.textContent = msg;
  elError.style.display = "block";
}

function clearError() {
  elError.textContent = "";
  elError.style.display = "none";
}

function round1(num) {
  return Math.round(num * 10) / 10;
}

function calculateBMI(heightCm, weightKg) {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/**
 * Ranges (as requested):
 * Under Weight = Below 18.5
 * Healthy Weight = 18.5 - 24.9
 * Overweight = 25 - 29.5
 *
 * Obesity:
 * Class 01 = 30 - 35
 * Class 02 = 35 - 40
 * Class 03 = Above 40
 *
 * Implementation:
 *  bmi < 18.5 => Underweight
 *  18.5 <= bmi < 25 => Healthy
 *  25 <= bmi <= 29.5 => Overweight
 *  29.5 < bmi < 35 => Obesity (Class 01)
 *  35 <= bmi < 40 => Obesity (Class 02)
 *  bmi >= 40 => Obesity (Class 03)
 */
function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return { key: "UNDERWEIGHT", label: "Underweight", rangeText: "Below 18.5" };
  }

  if (bmi < 25) {
    return { key: "HEALTHY", label: "Healthy Weight", rangeText: "18.5 - 24.9" };
  }

  if (bmi <= 29.5) {
    return { key: "OVERWEIGHT", label: "Overweight", rangeText: "25 - 29.5" };
  }

  if (bmi < 35) {
    return { key: "OBESE", label: "Obesity (Class 01)", rangeText: "30 - 35" };
  }

  if (bmi < 40) {
    return { key: "OBESE", label: "Obesity (Class 02)", rangeText: "35 - 40" };
  }

  return { key: "OBESE", label: "Obesity (Class 03)", rangeText: "Above 40" };
}

function renderGuidance(items) {
  elGuidanceList.innerHTML = "";
  items.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    elGuidanceList.appendChild(li);
  });
}

function sanitizeName(input) {
  return input.trim().replace(/\s+/g, " ");
}

// ======= Print helpers: swap footer image to campaign.png only for PDF =======
function setFooterForPrint() {
  if (footerImg) footerImg.src = PRINT_FOOTER_SRC;
}
function resetFooterAfterPrint() {
  if (footerImg) footerImg.src = SCREEN_FOOTER_SRC;
}

// Most browsers support these events
window.addEventListener("beforeprint", setFooterForPrint);
window.addEventListener("afterprint", resetFooterAfterPrint);

// Fallback for some browsers where beforeprint/afterprint are unreliable
const mq = window.matchMedia && window.matchMedia("print");
if (mq && mq.addEventListener) {
  mq.addEventListener("change", (e) => {
    if (e.matches) setFooterForPrint();
    else resetFooterAfterPrint();
  });
}

// ======= Events =======
elBtnCalc.addEventListener("click", () => {
  clearError();

  const name = sanitizeName(elName.value);
  const height = Number(elHeight.value);
  const weight = Number(elWeight.value);

  if (!name) {
    showError("Please enter your name.");
    return;
  }

  if (!height || !weight) {
    showError("Please enter both height and weight.");
    return;
  }

  if (height < 50 || height > 250) {
    showError("Please enter a valid height in cm (50 - 250).");
    return;
  }

  if (weight < 10 || weight > 300) {
    showError("Please enter a valid weight in kg (10 - 300).");
    return;
  }

  const bmi = calculateBMI(height, weight);
  const bmiRounded = round1(bmi);
  const cat = getBMICategory(bmi);

  elUserName.textContent = name;
  elUserHeight.textContent = `${height} cm`;
  elUserWeight.textContent = `${weight} kg`;

  elBmiValue.textContent = bmiRounded.toFixed(1);
  elBmiCategory.textContent = cat.label;
  elBmiRange.textContent = cat.rangeText;

  renderGuidance(GUIDANCE[cat.key]);

  elResultArea.classList.remove("hidden");
  elResultArea.scrollIntoView({ behavior: "smooth", block: "start" });
});

elBtnReset.addEventListener("click", () => {
  clearError();
  elName.value = "";
  elHeight.value = "";
  elWeight.value = "";
  elResultArea.classList.add("hidden");
});

elBtnEdit.addEventListener("click", () => {
  clearError();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

elBtnPrint.addEventListener("click", () => {
  if (elResultArea.classList.contains("hidden")) {
    showError("Please calculate your BMI first.");
    return;
  }
  clearError();

  // Ensure footer image switches before print dialog opens
  setFooterForPrint();
  window.print();
});