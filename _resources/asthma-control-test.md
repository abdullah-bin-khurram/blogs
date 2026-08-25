---
title: Asthma Control Test
title_ur: دمہ کنٹرول ٹیسٹ
description: >-
  Asthma Control Test (ACT) — English & Urdu

  Use this five-question Asthma Control Test to assess how well your asthma has been controlled during the past four weeks. The test is available in English and Urdu and provides a score from 5 to 25.
description_ur: دمہ کے قابو کا متحان ۔ انگریزی اور اردو۔ چار ہفتوں کے دوران اپنے
  دمے کے بارے میں پانچ سوالات کے جواب دیں اور اپنا دمہ کنٹرول ٹیسٹ اسکور معلوم
  کریں۔ یہ امتحان دونوں انگریزی اور اردو میں موجود ہیں اور 5 سے 25 تک آپ کے دمہ
  کے درجات بتاتے ہیں۔
resource_kind: interactive
interactive_html: >-
  <!-- ABK HELP - Asthma Control Test (ACT) -->

  <div id="abk-act">
    <style>
      #abk-act {
        --abk-blue: #075985;
        --abk-light-blue: #e0f2fe;
        --abk-border: #bae6fd;
        --abk-text: #163047;
        --abk-muted: #5b7083;
        --abk-green: #166534;
        --abk-green-bg: #dcfce7;
        --abk-orange: #9a3412;
        --abk-orange-bg: #ffedd5;

        font-family: Arial, "Noto Nastaliq Urdu", "Noto Sans Arabic", sans-serif;
        color: var(--abk-text);
        max-width: 760px;
        margin: 20px auto;
        line-height: 1.55;
      }

      #abk-act * {
        box-sizing: border-box;
      }

      .act-card {
        background: #ffffff;
        border: 1px solid var(--abk-border);
        border-radius: 18px;
        padding: 24px;
        box-shadow: 0 4px 18px rgba(0,0,0,0.06);
      }

      .act-header {
        text-align: center;
        margin-bottom: 22px;
      }

      .act-header h2 {
        margin: 0 0 6px;
        color: var(--abk-blue);
        font-size: 27px;
      }

      .act-header p {
        margin: 0;
        color: var(--abk-muted);
        font-size: 15px;
      }

      .act-question {
        margin: 0 0 24px;
        padding: 18px;
        background: #f8fbfd;
        border: 1px solid #e2eef5;
        border-radius: 14px;
      }

      .question-title {
        font-size: 17px;
        font-weight: 700;
        margin-bottom: 14px;
      }

      .question-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--abk-blue);
        color: white;
        margin-right: 8px;
        font-size: 14px;
        flex-shrink: 0;
      }

      .question-text {
        display: inline;
      }

      .options {
        display: grid;
        gap: 9px;
      }

      .option {
        position: relative;
      }

      .option input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }

      .option label {
        display: block;
        padding: 13px 14px;
        background: white;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.15s ease;
        font-size: 15px;
      }

      .option label:hover {
        border-color: var(--abk-blue);
        background: var(--abk-light-blue);
      }

      .option input:checked + label {
        border-color: var(--abk-blue);
        background: var(--abk-light-blue);
        box-shadow: 0 0 0 2px rgba(7,89,133,0.12);
        font-weight: 700;
      }

      .score-area {
        margin-top: 24px;
        text-align: center;
      }

      .calculate-btn,
      .reset-btn {
        border: none;
        border-radius: 10px;
        padding: 13px 24px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
      }

      .calculate-btn {
        background: var(--abk-blue);
        color: white;
        width: 100%;
      }

      .calculate-btn:hover {
        opacity: 0.92;
      }

      .result {
        display: none;
        margin-top: 20px;
        padding: 22px;
        border-radius: 14px;
        text-align: center;
      }

      .result.controlled {
        background: var(--abk-green-bg);
        color: var(--abk-green);
        border: 1px solid #86efac;
      }

      .result.uncontrolled {
        background: var(--abk-orange-bg);
        color: var(--abk-orange);
        border: 1px solid #fdba74;
      }

      .score-number {
        font-size: 38px;
        font-weight: 800;
        margin: 4px 0;
      }

      .result-title {
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 7px;
      }

      .result-text {
        font-size: 15px;
      }

      .reset-btn {
        margin-top: 15px;
        background: white;
        color: var(--abk-blue);
        border: 1px solid var(--abk-blue);
      }

      .act-note {
        margin-top: 20px;
        font-size: 12px;
        color: var(--abk-muted);
        text-align: center;
      }

      .rtl {
        direction: rtl;
        text-align: right;
      }

      .rtl .question-number {
        margin-right: 0;
        margin-left: 8px;
      }

      .rtl .question-title {
        text-align: right;
      }

      .rtl .options {
        text-align: right;
      }

      .rtl .result {
        text-align: center;
      }

      @media (max-width: 600px) {
        #abk-act {
          margin: 10px auto;
        }

        .act-card {
          padding: 16px;
          border-radius: 14px;
        }

        .act-header h2 {
          font-size: 23px;
        }

        .question-title {
          font-size: 16px;
        }

        .option label {
          padding: 12px;
        }
      }
    </style>

    <div class="act-card" id="act-card">

      <div class="act-header">
        <h2 id="act-title">Asthma Control Test</h2>
        <p id="act-subtitle">
          Answer these five questions about your asthma during the past 4 weeks.
        </p>
      </div>

          <form id="act-form">

        <!-- QUESTION 1 -->
        <div class="act-question">
          <div class="question-title">
            <span class="question-number">1</span>
            <span class="question-text" data-en="In the past four weeks, how often did your asthma prevent you from getting as much done at work, school or home?"
              data-ur="پچھلے 4 ہفتوں میں، آپ کی دمہ کی وجہ سے آپ کتنی بار کام، اسکول یا گھر کے کام میں اتنا نہیں کر سکے جتنا آپ کرنا چاہتے تھے؟">
            </span>
          </div>

          <div class="options" data-question="1">
            <div class="option"><input type="radio" name="q1" value="1" id="q1a"><label for="q1a" data-en="All of the time" data-ur="ہمیشہ"></label></div>
            <div class="option"><input type="radio" name="q1" value="2" id="q1b"><label for="q1b" data-en="Most of the time" data-ur="زیادہ تر وقت"></label></div>
            <div class="option"><input type="radio" name="q1" value="3" id="q1c"><label for="q1c" data-en="Some of the time" data-ur="کچھ وقت"></label></div>
            <div class="option"><input type="radio" name="q1" value="4" id="q1d"><label for="q1d" data-en="A little of the time" data-ur="بہت کم وقت"></label></div>
            <div class="option"><input type="radio" name="q1" value="5" id="q1e"><label for="q1e" data-en="Not at all" data-ur="بالکل نہیں"></label></div>
          </div>
        </div>

        <!-- QUESTION 2 -->
        <div class="act-question">
          <div class="question-title">
            <span class="question-number">2</span>
            <span class="question-text" data-en="During the past four weeks, how often have you had shortness of breath?"
              data-ur="پچھلے 4 ہفتوں کے دوران، کتنی بار آپ کو سانس لینے میں دشواری ہوئی؟">
            </span>
          </div>

          <div class="options">
            <div class="option"><input type="radio" name="q2" value="1" id="q2a"><label for="q2a" data-en="More than once a day" data-ur="دن میں ایک بار سے زیادہ"></label></div>
            <div class="option"><input type="radio" name="q2" value="2" id="q2b"><label for="q2b" data-en="Once a day" data-ur="دن میں ایک بار"></label></div>
            <div class="option"><input type="radio" name="q2" value="3" id="q2c"><label for="q2c" data-en="3 to 6 times a week" data-ur="ہفتے میں 3 سے 6 بار"></label></div>
            <div class="option"><input type="radio" name="q2" value="4" id="q2d"><label for="q2d" data-en="Once or twice a week" data-ur="ہفتے میں ایک یا دو بار"></label></div>
            <div class="option"><input type="radio" name="q2" value="5" id="q2e"><label for="q2e" data-en="Not at all" data-ur="بالکل نہیں"></label></div>
          </div>
        </div>

        <!-- QUESTION 3 -->
        <div class="act-question">
          <div class="question-title">
            <span class="question-number">3</span>
            <span class="question-text" data-en="During the past four weeks, how often did your asthma symptoms (wheezing, coughing, shortness of breath, chest tightness or pain) wake you up at night or earlier than usual in the morning?"
              data-ur="پچھلے 4 ہفتوں کے دوران، کتنی بار آپ کی دمہ کی علامات (سانس میں سیٹی، کھانسی، سانس کی تنگی، سینے میں جکڑن یا درد) نے آپ کو رات کو یا صبح معمول سے پہلے جگایا؟">
            </span>
          </div>

          <div class="options">
            <div class="option"><input type="radio" name="q3" value="1" id="q3a"><label for="q3a" data-en="4 or more times a week" data-ur="ہفتے میں 4 یا اس سے زیادہ بار"></label></div>
            <div class="option"><input type="radio" name="q3" value="2" id="q3b"><label for="q3b" data-en="2 to 3 nights a week" data-ur="ہفتے میں 2 سے 3 راتیں"></label></div>
            <div class="option"><input type="radio" name="q3" value="3" id="q3c"><label for="q3c" data-en="Once a week" data-ur="ہفتے میں ایک رات"></label></div>
            <div class="option"><input type="radio" name="q3" value="4" id="q3d"><label for="q3d" data-en="Less than 1 night a week" data-ur="ہفتے میں ایک رات سے بھی کم"></label></div>
            <div class="option"><input type="radio" name="q3" value="5" id="q3e"><label for="q3e" data-en="Not at all" data-ur="بالکل نہیں"></label></div>
          </div>
        </div>

        <!-- QUESTION 4 -->
        <div class="act-question">
          <div class="question-title">
            <span class="question-number">4</span>
            <span class="question-text" data-en="During the past four weeks, how often have you used your reliever medication (such as rescue inhaler)?"
              data-ur="پچھلے 4 ہفتوں کے دوران، آپ نے کتنی بار اپنی فوری آرام دینے والی دوا (مثلاً ریسکیو انہیلر) استعمال کی؟">
            </span>
          </div>

          <div class="options">
            <div class="option"><input type="radio" name="q4" value="1" id="q4a"><label for="q4a" data-en="3 or more times a day" data-ur="دن میں 3 یا اس سے زیادہ بار"></label></div>
            <div class="option"><input type="radio" name="q4" value="2" id="q4b"><label for="q4b" data-en="1 or 2 times a day" data-ur="دن میں 1 یا 2 بار"></label></div>
            <div class="option"><input type="radio" name="q4" value="3" id="q4c"><label for="q4c" data-en="2 or 3 times a week" data-ur="ہفتے میں 2 یا 3 بار"></label></div>
            <div class="option"><input type="radio" name="q4" value="4" id="q4d"><label for="q4d" data-en="Once a week or less" data-ur="ہفتے میں ایک بار یا اس سے کم"></label></div>
            <div class="option"><input type="radio" name="q4" value="5" id="q4e"><label for="q4e" data-en="Not at all" data-ur="بالکل نہیں"></label></div>
          </div>
        </div>

        <!-- QUESTION 5 -->
        <div class="act-question">
          <div class="question-title">
            <span class="question-number">5</span>
            <span class="question-text" data-en="How would you rate your asthma control during the past four weeks?"
              data-ur="پچھلے 4 ہفتوں کے دوران آپ اپنی دمہ کی کیفیت کو کس طرح بیان کریں گے؟">
            </span>
          </div>

          <div class="options">
            <div class="option"><input type="radio" name="q5" value="1" id="q5a"><label for="q5a" data-en="Not controlled" data-ur="بالکل قابو میں نہیں"></label></div>
            <div class="option"><input type="radio" name="q5" value="2" id="q5b"><label for="q5b" data-en="Poorly controlled" data-ur="خراب کنٹرول"></label></div>
            <div class="option"><input type="radio" name="q5" value="3" id="q5c"><label for="q5c" data-en="Somewhat controlled" data-ur="کسی حد تک قابو میں"></label></div>
            <div class="option"><input type="radio" name="q5" value="4" id="q5d"><label for="q5d" data-en="Well controlled" data-ur="اچھی طرح قابو میں"></label></div>
            <div class="option"><input type="radio" name="q5" value="5" id="q5e"><label for="q5e" data-en="Completely controlled" data-ur="مکمل طور پر قابو میں"></label></div>
          </div>
        </div>

        <div class="score-area">
          <button type="button" class="calculate-btn" id="calculate-btn">
            Calculate My Score
          </button>

          <div id="act-result" class="result">
            <div id="score-label">Your ACT Score</div>
            <div class="score-number" id="score-number"></div>
            <div class="result-title" id="result-title"></div>
            <div class="result-text" id="result-text"></div>
            <button type="button" class="reset-btn" id="reset-btn">
              Start Again
            </button>
          </div>
        </div>

      </form>

      <div class="act-note" id="act-note">
        This questionnaire is a screening tool and does not replace medical assessment.
      </div>

    </div>

    <script>
      (function () {

        const root = document.getElementById("abk-act");
        const card = document.getElementById("act-card");

        let language = "en";

        const translations = {
          en: {
            title: "Asthma Control Test",
            subtitle: "Answer these five questions about your asthma during the past 4 weeks.",
            calculate: "Calculate My Score",
            score: "Your ACT Score",
            controlledTitle: "Your asthma appears to be controlled.",
            controlledText: "Well done. Your score is 20–25. However, this test does not replace a medical assessment.",
            uncontrolledTitle: "Your asthma may be uncontrolled or only partly controlled.",
            uncontrolledText: "Your score is 19 or less. Please discuss your asthma symptoms and treatment with a healthcare professional.",
            incomplete: "Please answer all five questions before calculating your score.",
            reset: "Start Again",
            note: "This questionnaire is a screening tool and does not replace medical assessment."
          },

          ur: {
            title: "دمہ کنٹرول ٹیسٹ",
            subtitle: "پچھلے 4 ہفتوں کے دوران اپنی دمہ کی کیفیت کے بارے میں ان پانچ سوالات کے جواب دیں۔",
            calculate: "میرا اسکور معلوم کریں",
            score: "آپ کا ACT اسکور",
            controlledTitle: "آپ کا دمہ بظاہر قابو میں ہے۔",
            controlledText: "بہت خوب۔ آپ کا اسکور 20–25 ہے۔ تاہم یہ ٹیسٹ طبی معائنے کا متبادل نہیں ہے۔",
            uncontrolledTitle: "آپ کا دمہ ممکنہ طور پر قابو میں نہیں یا جزوی طور پر قابو میں ہے۔",
            uncontrolledText: "آپ کا اسکور 19 یا اس سے کم ہے۔ اپنی علامات اور علاج کے بارے میں کسی ماہرِ صحت سے مشورہ کریں۔",
            incomplete: "اسکور معلوم کرنے سے پہلے براہِ کرم پانچوں سوالات کے جواب دیں۔",
            reset: "دوبارہ شروع کریں",
            note: "یہ سوالنامہ صرف ایک جائزہ لینے کا ذریعہ ہے اور طبی معائنے کا متبادل نہیں ہے۔"
          }
        };

        function updateLanguage() {
          const t = translations[language];

          document.getElementById("act-title").textContent = t.title;
          document.getElementById("act-subtitle").textContent = t.subtitle;
          document.getElementById("calculate-btn").textContent = t.calculate;
          document.getElementById("reset-btn").textContent = t.reset;
          document.getElementById("score-label").textContent = t.score;
          document.getElementById("act-note").textContent = t.note;

          root.querySelectorAll("[data-en]").forEach(function (element) {
            element.textContent = element.getAttribute(
              language === "en" ? "data-en" : "data-ur"
            );
          });

          if (language === "ur") {
            card.classList.add("rtl");
            card.setAttribute("dir", "rtl");
          } else {
            card.classList.remove("rtl");
            card.setAttribute("dir", "ltr");
          }

          const result = document.getElementById("act-result");

          if (result.style.display === "block") {
            const score = Number(
              document.getElementById("score-number").textContent.split("/")[0].trim()
            );
            showResult(score);
          }
        }

        function showResult(score) {
          const t = translations[language];
          const result = document.getElementById("act-result");

          result.style.display = "block";

          document.getElementById("score-number").textContent =
            score + " / 25";

          result.classList.remove("controlled", "uncontrolled");

          if (score >= 20) {
            result.classList.add("controlled");
            document.getElementById("result-title").textContent =
              t.controlledTitle;
            document.getElementById("result-text").textContent =
              t.controlledText;
          } else {
            result.classList.add("uncontrolled");
            document.getElementById("result-title").textContent =
              t.uncontrolledTitle;
            document.getElementById("result-text").textContent =
              t.uncontrolledText;
          }

          result.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }

        document.getElementById("calculate-btn").addEventListener("click", function () {

          let total = 0;
          let complete = true;

          for (let i = 1; i <= 5; i++) {
            const answer = document.querySelector(
              'input[name="q' + i + '"]:checked'
            );

            if (!answer) {
              complete = false;
              break;
            }

            total += Number(answer.value);
          }

          if (!complete) {
            alert(translations[language].incomplete);
            return;
          }

          showResult(total);
        });

        document.getElementById("reset-btn").addEventListener("click", function () {
          document.getElementById("act-form").reset();

          const result = document.getElementById("act-result");
          result.style.display = "none";
          result.classList.remove("controlled", "uncontrolled");

          window.scrollTo({
            top: root.offsetTop,
            behavior: "smooth"
          });
        });

        window.addEventListener("message", function (event) {
          if (
            event.source !== window.parent ||
            !event.data ||
            event.data.type !== "abk-language"
          ) {
            return;
          }

          language = event.data.language === "ur" ? "ur" : "en";
          updateLanguage();
        });

        function reportHeight() {
          window.requestAnimationFrame(function () {
            window.parent.postMessage({
              type: "abk-tool-height",
              height: document.documentElement.scrollHeight
            }, "*");
          });
        }

        if ("ResizeObserver" in window) {
          new ResizeObserver(reportHeight).observe(document.documentElement);
        }

        window.addEventListener("load", reportHeight);
        window.parent.postMessage({ type: "abk-tool-ready" }, "*");
        updateLanguage();

      })();
    </script>
  </div>
date: 2026-08-25
published: true
---
