# SpellMaker Calculator for Oblivion *(working title)*

A web tool for crafting and optimizing custom spells in **The Elder Scrolls IV: Oblivion**. Designed to be fast, intuitive, and fully integrated with character stats and spell parameters.

---

## 🧙‍♂️ Features

### 🔹 Instant Access Interface
- When users open the site, they land directly on the main page.
- At the top: input fields for character attributes (e.g. Willpower, Destruction skill).
- Below: an interactive spell calculator displayed in a table with:
  - **Effect** (e.g. Fire Damage, Chameleon)
  - **Type**
  - **Magnitude**
  - **Area**
  - **Duration**

### 🔹 Save & Load System
- Save and load **characters** and **spells**.
- Integrated with **Firebase authentication and storage** for persistent access from any device.

### 🔹 Spell Maximization Tool
- Choose which spell effects to optimize.
- Lock specific parameters (e.g. Area and Duration) and maximize a third (e.g. Magnitude).
- Works for one or multiple effects. If no parameters are locked, all selected effects are maximized together.

Example:

- Selected Effects: Shock Damage, Fire Damage
- Locked: Area and Duration
- Maximized: Magnitude

### 🔹 Additional Features
- **English interface**
- **PWA support** – installable and offline-capable
- **AdSense integration** for monetization

---

## 🚧 Roadmap
- [ ] UI/UX Design
- [ ] Spell formula logic implementation
- [ ] Firebase authentication and data storage
- [ ] Optimization algorithm
- [ ] PWA setup
- [ ] AdSense configuration

---

## 📦 Technologies (planned)
- **Frontend:** HTML and pure JavaScript
- **Backend:** Firebase (Auth, Firestore)
- **PWA:** Service Workers, Web Manifest
- **Ads:** Google AdSense


spellmaker-oblivion/
├── index.html
├── /assets
│   ├── /css
│   │   └── style.css
│   └── /js
│       └── main.js
├── /data
│   └── spells.json          ← (opcional, para efeitos ou magias base)
├── /img                     ← (opcional, ícones ou logos)
│   └── logo.png
├── /lib                     ← (opcional, libs externas locais se não usar CDN)
│   └── bootstrap.min.css
├── /docs                    ← (opcional, para README, anotações ou documentação futura)
│   └── README.md
└── manifest.json            ← (para PWA no futuro)