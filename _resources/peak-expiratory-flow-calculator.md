---
title: "Peak Expiratory Flow Calculator "
title_ur: " عروجی اخراجی بہاؤ محتسب"
description: 'Peak flow meter readings are taken to assess "variability", one of
  the defining features of Asthma as compared with other obstructive lung
  diseases. Input your 2 week peak flow readings to assess of variability is
  present or not. Useful for both patients and doctors. '
description_ur: '"عروجی اخراجی بہاؤ کا حساب اس میں " تغیر"  دیکھنے کیلیے لگا یا
  جاتا ہے۔ بمقابلہ دیگر انسدادی بیماریوں کے، یہ تغیر دمہ کا خاصّہ ہے۔ اپنی دو
  ہفتوں کی صبح شام کے عروجی بہاؤ کی مقداروں کا اندراج کیجئے اور دیکھیے کہ تغیر
  موجود ہے یا نہیں۔ یہ محتسب دونوں ڈاکٹر اور مریض کیلیے فایدہ مند رہے گا۔ '
resource_kind: interactive
resource_type: null
interactive_html: >-
  <!DOCTYPE html>

  <html lang="en">

  <head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">


  <title>PEF Variability Calculator | HELP</title>


  <style>
      :root {
      --help-primary: #2e7d32;
      --help-primary-dark: #256628;
      --help-secondary: #edf7ee;
      --help-dark: #183b20;
      --help-border: #d5e4d7;
      --help-success: #287a4d;
      --help-warning: #9a6500;
      --help-danger: #a33a3a;
      --help-background: #f7faf7;
      }

      * {
          box-sizing: border-box;
      }

      body {
          margin: 0;
          font-family: Arial, "Noto Sans", sans-serif;
          background: var(--help-background);
          color: var(--help-dark);
          line-height: 1.6;
      }

      .pef-container {
          width: min(100% - 24px, 950px);
          margin: 20px auto 40px;
      }

      .pef-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 3px 15px rgba(0,0,0,0.07);
          margin-bottom: 20px;
      }

      .pef-title {
          color: var(--help-primary);
          margin: 0 0 8px;
          font-size: clamp(1.5rem, 4vw, 2rem);
      }

      .pef-subtitle {
          margin-top: 0;
          color: #52676d;
      }

      .privacy-note {
          background: var(--help-secondary);
          border-left: 4px solid var(--help-primary);
          padding: 14px 16px;
          border-radius: 8px;
          margin: 18px 0;
          font-size: 0.95rem;
      }

      .instruction {
          margin-bottom: 20px;
      }

      .field-label {
          display: block;
          font-weight: bold;
          margin-bottom: 7px;
      }

      .age-field {
          max-width: 260px;
      }

      input[type="number"] {
          width: 100%;
          padding: 12px 13px;
          border: 1px solid var(--help-border);
          border-radius: 8px;
          font-size: 1rem;
          background: white;
      }

      input[type="number"]:focus {
          outline: 2px solid rgba(23,107,135,0.2);
          border-color: var(--help-primary);
      }

      .unit {
          display: block;
          margin-top: 5px;
          color: #65777c;
          font-size: 0.88rem;
      }

      .table-wrapper {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin-top: 20px;
      }

      .pef-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 520px;
      }

      .pef-table th {
          background: var(--help-primary);
          color: white;
          padding: 11px 8px;
          text-align: center;
          font-size: 0.95rem;
      }

      .pef-table td {
          border-bottom: 1px solid var(--help-border);
          padding: 8px;
          text-align: center;
      }

      .pef-table tr:nth-child(even) {
          background: #fafcfc;
      }

      .day-number {
          font-weight: bold;
          white-space: nowrap;
      }

      .pef-input {
          width: 120px !important;
          text-align: center;
      }

      .buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 24px;
      }

      button {
          border: none;
          border-radius: 9px;
          padding: 12px 20px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
      }

      button:hover {
          opacity: 0.9;
      }

      button:active {
          transform: translateY(1px);
      }

      .calculate-button {
          background: var(--help-primary);
          color: white;
          flex: 1;
          min-width: 180px;
      }

      .clear-button {
          background: #e8edef;
          color: var(--help-dark);
      }

      .result-card {
          display: none;
      }

      .result-card.show {
          display: block;
      }

      .result-number {
          font-size: clamp(2rem, 7vw, 3.2rem);
          font-weight: bold;
          color: var(--help-primary);
          margin: 8px 0;
      }

      .result-label {
          color: #60757b;
          margin-bottom: 16px;
      }

      .interpretation {
          padding: 16px;
          border-radius: 10px;
          margin-top: 16px;
      }

      .interpretation.suggestive {
          background: #fff4df;
          border-left: 5px solid var(--help-warning);
      }

      .interpretation.not-suggestive {
          background: #edf8f1;
          border-left: 5px solid var(--help-success);
      }

      .interpretation strong {
          display: block;
          margin-bottom: 7px;
      }

      .calculation-note {
          margin-top: 14px;
          font-size: 0.9rem;
          color: #65777c;
      }

      .missing-message {
          display: none;
          background: #fff4df;
          border-left: 5px solid var(--help-warning);
          padding: 15px;
          border-radius: 8px;
          margin-top: 18px;
      }

      .missing-message.show {
          display: block;
      }

      .missing-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 12px;
      }

      .complete-button {
          background: var(--help-primary);
          color: white;
      }

      .anyway-button {
          background: #e8edef;
          color: var(--help-dark);
      }

      .error-message {
          color: var(--help-danger);
          margin-top: 8px;
          display: none;
          font-size: 0.9rem;
      }

      .error-message.show {
          display: block;
      }

      .required-note {
          color: #65777c;
          font-size: 0.9rem;
      }

      .rtl {
          direction: rtl;
          text-align: right;
          font-family: "Noto Nastaliq Urdu", "Noto Sans Arabic", Arial, sans-serif;
      }

      .rtl .pef-table th,
      .rtl .pef-table td {
          text-align: center;
      }

      .rtl .privacy-note,
      .rtl .interpretation,
      .rtl .missing-message {
          border-left: none;
          border-right: 5px solid var(--help-primary);
      }

      .rtl .interpretation.suggestive {
          border-right-color: var(--help-warning);
      }

      .rtl .interpretation.not-suggestive {
          border-right-color: var(--help-success);
      }

      @media (max-width: 600px) {

          .pef-container {
              width: min(100% - 14px, 950px);
              margin-top: 10px;
          }

          .pef-card {
              padding: 17px 13px;
              border-radius: 12px;
          }

          .pef-table {
              min-width: 480px;
          }

          .pef-table th,
          .pef-table td {
              padding: 7px 5px;
              font-size: 0.88rem;
          }

          .pef-input {
              width: 105px !important;
              padding: 10px 7px !important;
          }

          .buttons button {
              width: 100%;
          }
      }
  </style>

  </head>


  <body>


  <div class="pef-container">

      <!-- INTRODUCTION -->
      <div class="pef-card">

          <h1 class="pef-title" data-i18n="title">
              Peak Expiratory Flow Variability Calculator
          </h1>

          <p class="pef-subtitle" data-i18n="subtitle">
              Use your peak flow readings over 14 days to assess daily PEF variability.
          </p>

          <div class="privacy-note">
              <strong data-i18n="privacyTitle">Privacy:</strong>
              <span data-i18n="privacyText">
                  This calculator does not ask for your name, phone number, email address,
                  CNIC or other identifying information. Your readings are submitted
                  anonymously for calculation and monitoring purposes.
              </span>
          </div>

          <p class="instruction" data-i18n="instruction">
              Enter your age and your morning and evening peak flow readings for each day.
              Peak flow should be entered in L/min.
          </p>

          <!-- AGE -->
          <div class="age-field">

              <label class="field-label" for="age" data-i18n="ageLabel">
                  Age (years)
              </label>

              <input
                  type="number"
                  id="age"
                  min="1"
                  max="120"
                  step="1"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  autocomplete="off"
                  placeholder="e.g. 35"
                  data-i18n-placeholder="agePlaceholder"
              >

              <span class="unit" data-i18n="ageUnit">
                  Enter age in completed years.
              </span>

              <div id="ageError" class="error-message" data-i18n="ageError">
                  Please enter a valid age in years.
              </div>

          </div>

      </div>


      <!-- READINGS -->
      <div class="pef-card">

          <h2 data-i18n="readingsTitle">
              Peak Flow Readings
          </h2>

          <p class="required-note" data-i18n="readingsInstruction">
              Enter peak flow in L/min. Record the highest of three readings each time.
          </p>

          <div class="table-wrapper">

              <table class="pef-table">

                  <thead>
                      <tr>
                          <th data-i18n="day">Day</th>
                          <th data-i18n="morning">Morning</th>
                          <th data-i18n="evening">Evening</th>
                      </tr>
                  </thead>

                  <tbody id="readingsBody">
                      <!-- Rows generated by JavaScript -->
                  </tbody>

              </table>

          </div>


          <!-- Missing readings message -->
          <div id="missingMessage" class="missing-message">

              <strong data-i18n="missingTitle">
                  Some readings are missing.
              </strong>

              <div id="missingText" data-i18n="missingText">
                  Please complete the missing readings before calculating.
              </div>

              <div class="missing-buttons">

                  <button
                      type="button"
                      class="complete-button"
                      id="completeButton"
                      data-i18n="completeButton">
                      Complete Missing Readings
                  </button>

                  <button
                      type="button"
                      class="anyway-button"
                      id="anywayButton"
                      data-i18n="anywayButton">
                      Calculate Anyway
                  </button>

              </div>

          </div>


          <div class="buttons">

              <button
                  type="button"
                  class="calculate-button"
                  id="calculateButton"
                  data-i18n="calculateButton">
                  Calculate PEF Variability
              </button>

              <button
                  type="button"
                  class="clear-button"
                  id="clearButton"
                  data-i18n="clearButton">
                  Clear
              </button>

          </div>

      </div>


      <!-- RESULT -->
      <div class="pef-card result-card" id="resultCard">

          <h2 data-i18n="resultTitle">
              Your Result
          </h2>

          <div class="result-label" data-i18n="averageLabel">
              Average daily PEF variability
          </div>

          <div class="result-number">
              <span id="resultValue">—</span>%
          </div>

          <div id="interpretation" class="interpretation">

              <strong id="interpretationHeading"></strong>

              <div id="interpretationText"></div>

          </div>

          <div id="calculationNote" class="calculation-note"></div>

      </div>

  </div>



  <script>


  /* ============================================================
     HELP PEF VARIABILITY CALCULATOR
     ============================================================ */


  /* ------------------------------------------------------------
     GOOGLE APPS SCRIPT URL
     ------------------------------------------------------------

     After you deploy the Google Apps Script, paste its Web App URL
     between the quotation marks below.

  ------------------------------------------------------------ */


  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwVIw7nMk8GXhcwcTL50BYkZnYlP5nlfG7l-02LNosdDK_PwR1IZmuRYZYvIwqqypM/exec";



  /* ------------------------------------------------------------
     TRANSLATIONS
  ------------------------------------------------------------ */


  const translations = {

      en: {

          title: "Peak Expiratory Flow Variability Calculator",

          subtitle:
              "Use your peak flow readings over 14 days to assess daily PEF variability.",

          privacyTitle: "Privacy:",

          privacyText:
              "This calculator does not ask for your name, phone number, email address, CNIC or other identifying information. Your readings are submitted anonymously for calculation and monitoring purposes.",

          instruction:
              "Enter your age and your morning and evening peak flow readings for each day. Peak flow should be entered in L/min.",

          ageLabel: "Age (years)",

          agePlaceholder: "e.g. 35",

          ageUnit:
              "Enter age in completed years.",

          ageError:
              "Please enter a valid age in years.",

          readingsTitle:
              "Peak Flow Readings",

          readingsInstruction:
              "Enter peak flow in L/min. Record the highest of three readings each time.",

          day: "Day",

          morning: "Morning",

          evening: "Evening",

          calculateButton:
              "Calculate PEF Variability",

          clearButton:
              "Clear",

          missingTitle:
              "Some readings are missing.",

          missingText:
              "Please complete the missing readings before calculating, or choose Calculate Anyway.",

          completeButton:
              "Complete Missing Readings",

          anywayButton:
              "Calculate Anyway",

          resultTitle:
              "Your Result",

          averageLabel:
              "Average daily PEF variability",

          suggestiveHeading:
              "Result is suggestive of asthma",

          suggestiveText:
              "Your average daily PEF variability is above the threshold used for your age group. This result is suggestive of asthma based on the PEF variability criterion. PEF variability alone does not establish a diagnosis of asthma. Please discuss the result with a qualified healthcare professional.",

          notSuggestiveHeading:
              "Result is not suggestive of asthma",

          notSuggestiveText:
              "Your average daily PEF variability is below the threshold used for your age group. This result is not suggestive of asthma based on this PEF variability criterion. A result below this threshold does not completely rule out asthma.",

          partialCalculation:
              "This result was calculated from {days} complete day(s) because some readings were missing. It should not be considered equivalent to a complete 14-day assessment.",

          fullCalculation:
              "This result was calculated from all 14 days of readings.",

          threshold13:
              "For people aged 13 years or older, the threshold is greater than 10%.",

          threshold12:
              "For people aged 12 years or younger, the threshold is greater than 13%."
      },


      ur: {

          title:
              "عروجی اخراجی بہاؤ کے روزانہ کے تغیر کا کیلکولیٹر",

          subtitle:
              "14 دن کے عروجی بہاؤ کی ریڈنگز استعمال کرکے روزانہ کے تغیر کا اندازہ لگائیں۔",

          privacyTitle:
              "رازداری:",

          privacyText:
              "یہ کیلکولیٹر آپ کا نام، فون نمبر، ای میل، شناختی کارڈ نمبر یا کوئی دوسری شناختی معلومات نہیں مانگتا۔ آپ کی ریڈنگز حساب اور نگرانی کے مقصد کے لیے گمنام طور پر جمع کی جاتی ہیں۔",

          instruction:
              "اپنی عمر اور ہر دن صبح اور شام کی عروجی بہاؤ کی ریڈنگ درج کریں۔ عروجی بہاؤ L/min میں درج کریں۔",

          ageLabel:
              "عمر (سال)",

          agePlaceholder:
              "مثلاً 35",

          ageUnit:
              "عمر مکمل شدہ سالوں میں درج کریں۔",

          ageError:
              "براہ کرم عمر سالوں میں درست درج کریں۔",

          readingsTitle:
              "عروجی بہاؤ کی ریڈنگز",

          readingsInstruction:
              "عروجی بہاؤ L/min میں درج کریں۔ ہر مرتبہ تین ریڈنگز میں سے سب سے زیادہ ریڈنگ درج کریں۔",

          day:
              "دن",

          morning:
              "صبح",

          evening:
              "شام",

          calculateButton:
              "عروجی بہاؤ کے تغیر کا حساب کریں",

          clearButton:
              "صاف کریں",

          missingTitle:
              "کچھ ریڈنگز موجود نہیں ہیں۔",

          missingText:
              "حساب کرنے سے پہلے نامکمل ریڈنگز مکمل کریں، یا 'پھر بھی حساب کریں' کا انتخاب کریں۔",

          completeButton:
              "نامکمل ریڈنگز مکمل کریں",

          anywayButton:
              "پھر بھی حساب کریں",

          resultTitle:
              "آپ کا نتیجہ",

          averageLabel:
              "روزانہ کے عروجی بہاؤ کے تغیر کی اوسط",

          suggestiveHeading:
              "نتیجہ دمہ کی طرف اشارہ کرتا ہے",

          suggestiveText:
              "آپ کے روزانہ کے عروجی بہاؤ کے تغیر کی اوسط آپ کی عمر کے لیے مقررہ حد سے زیادہ ہے۔ یہ نتیجہ عروجی بہاؤ کے تغیر کے معیار کے مطابق دمہ کی طرف اشارہ کرتا ہے۔ صرف عروجی بہاؤ کا تغیر دمہ کی تشخیص ثابت نہیں کرتا۔ براہ کرم اس نتیجے پر کسی مستند طبی ماہر سے مشورہ کریں۔",

          notSuggestiveHeading:
              "نتیجہ دمہ کی طرف اشارہ نہیں کرتا",

          notSuggestiveText:
              "آپ کے روزانہ کے عروجی بہاؤ کے تغیر کی اوسط آپ کی عمر کے لیے مقررہ حد سے کم ہے۔ اس معیار کے مطابق یہ نتیجہ دمہ کی طرف اشارہ نہیں کرتا۔ اس حد سے کم نتیجہ دمہ کے امکان کو مکمل طور پر خارج نہیں کرتا۔",

          partialCalculation:
              "یہ نتیجہ {days} مکمل دن کی ریڈنگز کی بنیاد پر نکالا گیا ہے کیونکہ کچھ ریڈنگز موجود نہیں تھیں۔ اسے مکمل 14 دن کے جائزے کے برابر نہیں سمجھنا چاہیے۔",

          fullCalculation:
              "یہ نتیجہ تمام 14 دن کی ریڈنگز کی بنیاد پر نکالا گیا ہے.",

          threshold13:
              "13 سال یا اس سے زیادہ عمر کے افراد کے لیے حد 10% سے زیادہ ہے۔",

          threshold12:
              "12 سال یا اس سے کم عمر کے افراد کے لیے حد 13% سے زیادہ ہے۔"
      }

  };



  /* ------------------------------------------------------------
     CURRENT LANGUAGE
  ------------------------------------------------------------ */


  let currentLanguage = "en";



  /* ------------------------------------------------------------
     CREATE 14 DAYS OF INPUTS
  ------------------------------------------------------------ */


  const readingsBody = document.getElementById("readingsBody");


  for (let day = 1; day <= 14; day++) {

      const row = document.createElement("tr");

      row.innerHTML = `

          <td class="day-number">
              <span class="day-label" data-day="${day}">
                  Day ${day}
              </span>
          </td>

          <td>
              <input
                  type="number"
                  class="pef-input"
                  id="morning-${day}"
                  min="1"
                  max="2000"
                  step="1"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  autocomplete="off"
                  aria-label="Morning PEF Day ${day}"
              >
          </td>

          <td>
              <input
                  type="number"
                  class="pef-input"
                  id="evening-${day}"
                  min="1"
                  max="2000"
                  step="1"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  autocomplete="off"
                  aria-label="Evening PEF Day ${day}"
              >
          </td>

      `;

      readingsBody.appendChild(row);
  }



  /* ------------------------------------------------------------
     NUMERIC VALIDATION
  ------------------------------------------------------------ */


  document.querySelectorAll('input[type="number"]').forEach(input => {

      input.addEventListener("input", function () {

          /*
           * Remove anything that is not a digit.
           * This also helps on mobile keyboards.
           */

          this.value = this.value.replace(/[^0-9]/g, "");

          if (Number(this.value) > 2000) {
              this.value = "2000";
          }

      });

  });



  /* ------------------------------------------------------------
     AGE VALIDATION
  ------------------------------------------------------------ */


  function getAge() {

      const ageInput = document.getElementById("age");

      const age = Number(ageInput.value);

      if (!Number.isInteger(age) || age < 1 || age > 120) {

          document.getElementById("ageError").classList.add("show");

          ageInput.focus();

          return null;
      }

      document.getElementById("ageError").classList.remove("show");

      return age;
  }



  /* ------------------------------------------------------------
     FIND MISSING READINGS
  ------------------------------------------------------------ */


  function getMissingReadings() {

      const missing = [];

      for (let day = 1; day <= 14; day++) {

          const morning =
              document.getElementById(`morning-${day}`).value.trim();

          const evening =
              document.getElementById(`evening-${day}`).value.trim();

          if (!morning) {
              missing.push(
                  `${currentLanguage === "ur" ? "دن" : "Day"} ${day} – ${
                      currentLanguage === "ur" ? "صبح" : "Morning"
                  }`
              );
          }

          if (!evening) {
              missing.push(
                  `${currentLanguage === "ur" ? "دن" : "Day"} ${day} – ${
                      currentLanguage === "ur" ? "شام" : "Evening"
                  }`
              );
          }
      }

      return missing;
  }



  /* ------------------------------------------------------------
     GET COMPLETE DAYS
  ------------------------------------------------------------ */


  function getCompleteDays() {

      const completeDays = [];

      for (let day = 1; day <= 14; day++) {

          const morningValue =
              document.getElementById(`morning-${day}`).value.trim();

          const eveningValue =
              document.getElementById(`evening-${day}`).value.trim();

          if (morningValue && eveningValue) {

              const morning = Number(morningValue);
              const evening = Number(eveningValue);

              if (
                  Number.isFinite(morning) &&
                  Number.isFinite(evening) &&
                  morning > 0 &&
                  evening > 0
              ) {

                  completeDays.push({
                      day: day,
                      morning: morning,
                      evening: evening
                  });

              }
          }
      }

      return completeDays;
  }



  /* ------------------------------------------------------------
     CALCULATE VARIABILITY
  ------------------------------------------------------------ */


  function calculateVariability(completeDays) {

      const dailyVariabilities = [];

      completeDays.forEach(day => {

          const highest = Math.max(
              day.morning,
              day.evening
          );

          const lowest = Math.min(
              day.morning,
              day.evening
          );

          const mean =
              (highest + lowest) / 2;

          const variability =
              ((highest - lowest) / mean) * 100;

          dailyVariabilities.push(variability);
      });


      if (dailyVariabilities.length === 0) {
          return null;
      }


      const sum =
          dailyVariabilities.reduce(
              (total, value) => total + value,
              0
          );

      return sum / dailyVariabilities.length;
  }



  /* ------------------------------------------------------------
     SEND DATA TO GOOGLE APPS SCRIPT
  ------------------------------------------------------------ */


  function sendDataToGoogle(age, completeDays, averageVariability) {

      /*
       * If the Apps Script URL has not yet been entered,
       * simply don't send anything.
       */

      if (!GOOGLE_SCRIPT_URL) {
          return;
      }


      const payload = {

          timestamp:
              new Date().toISOString(),

          age:
              age,

          readings:
              completeDays.map(day => ({
                  day: day.day,
                  morning: day.morning,
                  evening: day.evening
              })),

          averageVariability:
              Number(averageVariability.toFixed(2)),

          completeDays:
              completeDays.length,

          language:
              currentLanguage

      };


      /*
       * "no-cors" avoids browser CORS restrictions for the
       * Google Apps Script endpoint.
       *
       * The sheet receives the data, but the webpage does not
       * need to read the server response.
       */

      fetch(GOOGLE_SCRIPT_URL, {

          method: "POST",

          mode: "no-cors",

          headers: {
              "Content-Type": "text/plain;charset=utf-8"
          },

          body: JSON.stringify(payload)

      }).catch(error => {

          /*
           * Do not interrupt the patient's result if the
           * submission fails.
           */

          console.log("PEF submission error:", error);

      });
  }



  /* ------------------------------------------------------------
     DISPLAY RESULT
  ------------------------------------------------------------ */


  function displayResult(
      age,
      averageVariability,
      completeDaysCount
  ) {

      const resultCard =
          document.getElementById("resultCard");

      const resultValue =
          document.getElementById("resultValue");

      const interpretation =
          document.getElementById("interpretation");

      const heading =
          document.getElementById("interpretationHeading");

      const text =
          document.getElementById("interpretationText");

      const note =
          document.getElementById("calculationNote");


      resultValue.textContent =
          averageVariability.toFixed(1);


      /*
       * Age threshold:
       *
       * Age 13 or more -> >10%
       * Age 12 or less -> >13%
       */

      const threshold =
          age >= 13 ? 10 : 13;


      const suggestive =
          averageVariability > threshold;


      interpretation.classList.remove(
          "suggestive",
          "not-suggestive"
      );


      if (suggestive) {

          interpretation.classList.add("suggestive");

          heading.textContent =
              translations[currentLanguage].suggestiveHeading;

          text.textContent =
              translations[currentLanguage].suggestiveText;

      } else {

          interpretation.classList.add("not-suggestive");

          heading.textContent =
              translations[currentLanguage].notSuggestiveHeading;

          text.textContent =
              translations[currentLanguage].notSuggestiveText;

      }


      if (completeDaysCount < 14) {

          note.textContent =
              translations[currentLanguage]
                  .partialCalculation
                  .replace(
                      "{days}",
                      completeDaysCount
                  );

      } else {

          note.textContent =
              translations[currentLanguage].fullCalculation;

      }


      resultCard.classList.add("show");


      /*
       * Send only after successful calculation.
       */

      const completeDays =
          getCompleteDays();

      sendDataToGoogle(
          age,
          completeDays,
          averageVariability
      );


      /*
       * Move the user to the result.
       */

      resultCard.scrollIntoView({
          behavior: "smooth",
          block: "start"
      });
  }



  /* ------------------------------------------------------------
     CALCULATE BUTTON
  ------------------------------------------------------------ */


  document
      .getElementById("calculateButton")
      .addEventListener("click", function () {

          const age = getAge();

          if (age === null) {
              return;
          }


          const missing =
              getMissingReadings();


          if (missing.length > 0) {

              const missingMessage =
                  document.getElementById("missingMessage");

              const missingText =
                  document.getElementById("missingText");


              if (currentLanguage === "ur") {

                  missingText.textContent =
                      `آپ کی ${missing.length} ریڈنگز موجود نہیں ہیں۔ براہ کرم انہیں مکمل کریں یا "پھر بھی حساب کریں" کا انتخاب کریں۔`;

              } else {

                  missingText.textContent =
                      `${missing.length} reading(s) are missing. Please complete them or choose "Calculate Anyway".`;

              }


              missingMessage.classList.add("show");

              missingMessage.scrollIntoView({
                  behavior: "smooth",
                  block: "center"
              });

              return;
          }


          calculateAndDisplay(age);

      });


  /* ------------------------------------------------------------
     CALCULATE ANYWAY
  ------------------------------------------------------------ */


  document
      .getElementById("anywayButton")
      .addEventListener("click", function () {

          const age = getAge();

          if (age === null) {
              return;
          }


          const completeDays =
              getCompleteDays();


          if (completeDays.length === 0) {

              if (currentLanguage === "ur") {

                  alert(
                      "حساب کرنے کے لیے کم از کم ایک مکمل دن کی صبح اور شام کی ریڈنگ درکار ہے۔"
                  );

              } else {

                  alert(
                      "At least one complete day with both morning and evening readings is required."
                  );

              }

              return;
          }


          document
              .getElementById("missingMessage")
              .classList.remove("show");


          calculateAndDisplay(age);

      });


  /* ------------------------------------------------------------
     CALCULATE AND DISPLAY
  ------------------------------------------------------------ */


  function calculateAndDisplay(age) {

      const completeDays =
          getCompleteDays();


      if (completeDays.length === 0) {
          return;
      }


      const averageVariability =
          calculateVariability(completeDays);


      if (averageVariability === null) {
          return;
      }


      displayResult(
          age,
          averageVariability,
          completeDays.length
      );
  }



  /* ------------------------------------------------------------
     COMPLETE MISSING BUTTON
  ------------------------------------------------------------ */


  document
      .getElementById("completeButton")
      .addEventListener("click", function () {

          document
              .getElementById("missingMessage")
              .classList.remove("show");

          const missing =
              getMissingReadings();

          if (missing.length > 0) {

              /*
               * Focus first missing field.
               */

              for (let day = 1; day <= 14; day++) {

                  const morning =
                      document.getElementById(`morning-${day}`);

                  const evening =
                      document.getElementById(`evening-${day}`);

                  if (!morning.value) {
                      morning.focus();
                      break;
                  }

                  if (!evening.value) {
                      evening.focus();
                      break;
                  }
              }
          }
      });


  /* ------------------------------------------------------------
     CLEAR
  ------------------------------------------------------------ */


  document
      .getElementById("clearButton")
      .addEventListener("click", function () {

          if (currentLanguage === "ur") {

              if (!confirm("کیا آپ تمام ریڈنگز صاف کرنا چاہتے ہیں؟")) {
                  return;
              }

          } else {

              if (!confirm("Clear all readings?")) {
                  return;
              }

          }


          document
              .querySelectorAll('input[type="number"]')
              .forEach(input => {

                  input.value = "";

              });


          document
              .getElementById("resultCard")
              .classList.remove("show");


          document
              .getElementById("missingMessage")
              .classList.remove("show");


          document
              .getElementById("ageError")
              .classList.remove("show");

      });


  /* ------------------------------------------------------------
     LANGUAGE SYSTEM
  ------------------------------------------------------------ */


  /*
   * Your existing HELP language toggle can call:
   *
   * setPEFLanguage("en")
   *
   * or
   *
   * setPEFLanguage("ur")
   *
   * The function is deliberately global so that your existing
   * site-wide language button can control this calculator.
   */

  function setPEFLanguage(language) {

      if (
          language !== "en" &&
          language !== "ur"
      ) {
          return;
      }


      currentLanguage = language;


      const t =
          translations[language];


      document.documentElement.lang =
          language === "ur" ? "ur" : "en";


      const calculator =
          document.querySelector(".pef-container");


      if (language === "ur") {

          calculator.classList.add("rtl");

      } else {

          calculator.classList.remove("rtl");

      }


      /*
       * Translate ordinary elements.
       */

      document
          .querySelectorAll("[data-i18n]")
          .forEach(element => {

              const key =
                  element.getAttribute("data-i18n");

              if (t[key]) {
                  element.textContent = t[key];
              }

          });


      /*
       * Translate placeholders.
       */

      document
          .querySelectorAll("[data-i18n-placeholder]")
          .forEach(element => {

              const key =
                  element.getAttribute(
                      "data-i18n-placeholder"
                  );

              if (t[key]) {
                  element.placeholder = t[key];
              }

          });


      /*
       * Translate Day 1–14.
       */

      document
          .querySelectorAll(".day-label")
          .forEach(element => {

              const day =
                  element.getAttribute("data-day");

              element.textContent =
                  language === "ur"
                      ? `دن ${day}`
                      : `Day ${day}`;

          });


      /*
       * Update input accessibility labels.
       */

      for (let day = 1; day <= 14; day++) {

          const morning =
              document.getElementById(`morning-${day}`);

          const evening =
              document.getElementById(`evening-${day}`);


          if (language === "ur") {

              morning.setAttribute(
                  "aria-label",
                  `دن ${day} صبح کی عروجی بہاؤ کی ریڈنگ`
              );

              evening.setAttribute(
                  "aria-label",
                  `دن ${day} شام کی عروجی بہاؤ کی ریڈنگ`
              );

          } else {

              morning.setAttribute(
                  "aria-label",
                  `Morning PEF Day ${day}`
              );

              evening.setAttribute(
                  "aria-label",
                  `Evening PEF Day ${day}`
              );

          }

      }


      /*
       * If a result is already displayed, recalculate the
       * wording without sending another submission.
       */

      const resultCard =
          document.getElementById("resultCard");

      if (resultCard.classList.contains("show")) {

          const age =
              Number(
                  document.getElementById("age").value
              );

          const completeDays =
              getCompleteDays();

          const average =
              calculateVariability(completeDays);


          if (
              Number.isInteger(age) &&
              average !== null
          ) {

              updateResultLanguage(
                  age,
                  average,
                  completeDays.length
              );

          }

      }

  }



  /* ------------------------------------------------------------
     UPDATE RESULT LANGUAGE
  ------------------------------------------------------------ */


  function updateResultLanguage(
      age,
      averageVariability,
      completeDaysCount
  ) {

      const threshold =
          age >= 13 ? 10 : 13;


      const suggestive =
          averageVariability > threshold;


      const interpretation =
          document.getElementById("interpretation");

      const heading =
          document.getElementById("interpretationHeading");

      const text =
          document.getElementById("interpretationText");

      const note =
          document.getElementById("calculationNote");


      interpretation.classList.remove(
          "suggestive",
          "not-suggestive"
      );


      if (suggestive) {

          interpretation.classList.add("suggestive");

          heading.textContent =
              translations[currentLanguage]
                  .suggestiveHeading;

          text.textContent =
              translations[currentLanguage]
                  .suggestiveText;

      } else {

          interpretation.classList.add("not-suggestive");

          heading.textContent =
              translations[currentLanguage]
                  .notSuggestiveHeading;

          text.textContent =
              translations[currentLanguage]
                  .notSuggestiveText;

      }


      if (completeDaysCount < 14) {

          note.textContent =
              translations[currentLanguage]
                  .partialCalculation
                  .replace(
                      "{days}",
                      completeDaysCount
                  );

      } else {

          note.textContent =
              translations[currentLanguage]
                  .fullCalculation;

      }

  }



  /* ------------------------------------------------------------
     OPTIONAL CONNECTION TO YOUR HELP LANGUAGE TOGGLE
  ------------------------------------------------------------ */


  /*
   * If your main HELP website dispatches a custom event when
   * its language is changed, this calculator can listen to it.
   *
   * Example:
   *
   * window.dispatchEvent(
   *     new CustomEvent("help-language-change", {
   *         detail: { language: "ur" }
   *     })
   * );
   *
   */

  /* ------------------------------------------------------------
     AUTOMATIC CONNECTION TO HELP LANGUAGE TOGGLE
  ------------------------------------------------------------ */


  /*
   * The calculator watches the main website's <html lang="">
   * attribute.
   *
   * When HELP changes:
   *
   *     <html lang="en">
   *
   * to:
   *
   *     <html lang="ur">
   *
   * the calculator automatically changes language.
   */

  function detectHELPanguage() {

      const htmlLanguage =
          document.documentElement.lang
              .toLowerCase()
              .trim();

      if (htmlLanguage.startsWith("ur")) {

          if (currentLanguage !== "ur") {
              setPEFLanguage("ur");
          }

      } else {

          if (currentLanguage !== "en") {
              setPEFLanguage("en");
          }

      }

  }



  /*
   * Check the language when the calculator first loads.
   */

  detectHELPanguage();



  /*
   * Watch for changes to the <html> element.
   *
   * This means your existing HELP language toggle does not
   * need to be modified, provided it changes <html lang="">.
   */

  const languageObserver =
      new MutationObserver(function() {

          detectHELPanguage();

      });


  languageObserver.observe(
      document.documentElement,
      {
          attributes: true,
          attributeFilter: ["lang"]
      }
  );



  /*
   * If the page already has <html lang="ur"> when this
   * calculator loads, automatically use Urdu.
   */

  if (
      document.documentElement.lang
          .toLowerCase()
          .startsWith("ur")
  ) {

      setPEFLanguage("ur");

  }


  </script>


  </body>

  </html>
date: 2026-09-07
published: true
---
