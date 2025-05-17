# Spellmaking Altar Calculator

A personal web tool to craft and calculate custom spells in **The Elder Scrolls IV: Oblivion**. Built as a community fan project to make the spellmaking system more accessible and transparent. This project started as a way to practice JavaScript and web development skills, and is now fully functional and online.

🔗 **Live Site:** [https://spellmakingaltarcalculator.netlify.app/](https://spellmakingaltarcalculator.netlify.app/)

---

## 🧙‍♂️ What It Does

This calculator allows players to:

- Build spells using effects from all magic schools.
- Input skill levels and attributes.
- Instantly calculate the **magicka cost**, **gold cost**, and **spell level**.
- Save and load characters and spells using Firebase Auth.
- Install the site as a PWA (Progressive Web App) on desktop or mobile.
- Use a mobile-first interface with responsive layout and touch-friendly buttons.
- Monetization via AdSense.

---

## ⚙️ Logic Behind Calculations

1. **Base Cost Lookup:**
   - Each spell effect has a base cost from the official formula (via `spells.json`).
   - Loaded by category (Alteration, Destruction, etc.).

2. **User Input:**
   - The user selects effect, range (`Touch`, `Target`, `Self`), and sets `Magnitude`, `Area`, `Duration`.

3. **Raw Cost Calculation:**
   - Formula:
     ```
     cost = baseCost * 0.1 * magnitude^1.28 * max(duration,1) * max(area*0.15,1)
     * modifier (1.5 if range is Target)
     ```

4. **Skill Adjustment:**
   - Every school is adjusted using:
     ```
     adjustedSkill = original + ((Luck - 50) * 0.4)
     ```
   - Final magicka cost:
     ```
     adjustedCost = baseCost * (1.4 - 0.012 * adjustedSkill)
     ```

5. **Final Outputs:**
   - **Total Magicka Cost**
   - **Total Gold Cost** = 3× raw cost
   - **Spell Level**: Based on thresholds
     - <26 = Novice
     - <63 = Apprentice
     - <150 = Journeyman
     - <400 = Expert
     - ≥400 = Master

---

## ✅ What Has Been Completed

- ✅ Full spell cost logic (base + skill-adjusted)
- ✅ Skill table with +10/−10 buttons
- ✅ Spell builder with dynamic rows
- ✅ Responsive layout (mobile-first)
- ✅ Firebase Auth + Firestore CRUD (save/load characters & spells)
- ✅ PWA manifest + Service Worker
- ✅ Google AdSense integration
- ✅ English-only interface
- ✅ Privacy & Terms documents

---

## 🔧 Technologies Used

- **Frontend:** HTML, CSS, JavaScript (modular ES6)
- **Backend (data):** Firebase Authentication + Firestore
- **Design:** Bootstrap 5
- **PWA:** Manifest + Service Worker
- **Ads:** Google AdSense


---

## 📜 Disclaimer

This is an **unofficial** fan-made tool. It is **not affiliated with Bethesda** or ZeniMax. All game-related content belongs to their respective owners.

If you find bugs or would like to contribute ideas, feel free to open an issue or reach out at **spellmakingaltarcalculator@gmail.com**.

