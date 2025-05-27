// assets/js/spellStats.js

let spellsBySchool = null;

// Load spells.json once
async function loadSpells(path = 'data/spells.json') {
    if (!spellsBySchool) {
        const resp = await fetch(path);
        spellsBySchool = await resp.json();
    }
    //console.log('[loadSpells] spellsBySchool:', spellsBySchool);
}

// 1. Read the current skills table and compute adjusted skill values
function getAdjustedSkillsInfo() {
    const rows = document.querySelectorAll('#skillsTable tr');
    let luckValue = 0;
    const skills = {};

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const school = cells[0].textContent.trim();
        const val = parseFloat(cells[1].querySelector('input').value) || 0;
        if (school === 'Luck') {
            luckValue = val;
        }
        skills[school] = val;
    });

    
    const factor = (luckValue - 50) * 0.4;
    const adjusted = Object.entries(skills)
        .filter(([school]) => school !== 'Luck')
        .map(([school, oldVal]) => ({
            school,
            adjusted: Math.min((oldVal + factor),100)
        }));

    console.log('[getAdjustedSkillsInfo] adjusted:', adjusted);
    return adjusted; // [ {school: 'Alteration', adjusted: 12.3}, ... ]
}

// 2. Read the spell builder table and extract each effect row
function getSpellEffectsInfo() {
    const tbody = document.querySelector('#spellBuilderContainer table tbody');
    if (!tbody) {
        console.log('[getSpellEffectsInfo] No tbody found, returning []');
        return [];
    }

    const effects = Array.from(tbody.rows).map(row => {
        const cells = row.cells;
        const school   = cells[0].querySelector('select').value;
        const effect   = cells[1].querySelector('select').value;
        const range    = cells[2].querySelector('select').value;
        const magnitude= parseFloat(cells[3].querySelector('input').value) || 0;
        const area     = parseFloat(cells[4].querySelector('input').value) || 0;
        const duration = parseFloat(cells[5].querySelector('input').value) || 0;

        // look up baseCost from spellsBySchool
        const baseCost = (spellsBySchool[school] && spellsBySchool[school][effect]?.baseCost) ?? 0;

        return { school, effect, range, magnitude, area, duration, baseCost };
    });

    console.log('[getSpellEffectsInfo] effects:', effects);
    return effects;
}

// 3. Calculate base cost for each effect
function calculateBaseCost(effects) {
    const result = effects.map(e => {
        const targetModifier = e.range === 'Target' ? 1.5 : 1;
        // clamp helpers
        const mMag = Math.max(Math.pow(e.magnitude, 1.28), 1);
        const mDur = Math.max(e.duration, 1);
        const mArea= Math.max(e.area * 0.15, 1);

        const cost = (e.baseCost * 0.1) * mMag * mDur * mArea * targetModifier;
        return {
            ...e,
            cost
        };
    });
    console.log('[calculateBaseCost] result:', result);
    return result;
}

// 4. Combine base costs with adjusted skills to get final magicka cost, pick highest
function calculateAdjustedCost(baseCosts, adjustedSkills) {
    let totalCost = 0;
    let totalCostRaw = 0;
    let highest = { cost: 0, school: '', effect: '', range: '' };

    baseCosts.forEach(item => {
        const adj = adjustedSkills.find(s => s.school === item.school)?.adjusted ?? 0;
        const weighted = Math.floor(item.cost * (1.4 - 0.012 * adj));
        totalCostRaw += Math.floor(item.cost);
        totalCost += weighted;

        if (totalCostRaw > highest.cost) {
            highest = { cost: totalCostRaw, school: item.school, effect: item.effect, range: item.range };
        }
    });

    const magickaCost = totalCost.toFixed(0);
    const magickaCostRaw = totalCostRaw;
    const goldCost = (totalCostRaw * 3).toFixed(0);

    const result = {
        magickaCost,
        magickaCostRaw,
        goldCost,
        highestSchool: highest.school,
        highestEffect: highest.effect,
        highestRange: highest.range,
        highestCost: highest.cost
    };
    console.log('[calculateAdjustedCost] result:', result);
    return result;
}

// 5. Derive spell level from magicka cost
function getSpellLevel(magicka) {
    let level;
    if (magicka < 26) level = 'Novice';
    else if (magicka < 63) level = 'Apprentice';
    else if (magicka < 150) level = 'Journeyman';
    else if (magicka < 400) level = 'Expert';
    else level = 'Master';
    console.log('[getSpellLevel] magicka:', magicka, 'level:', level);
    return level;
}

// Initialize table structure
export function initializeSpellStats(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const table = document.createElement('table');
    table.className = 'table table-bordered text-center table-sm mt-4';

    const thead = document.createElement('thead');
    thead.className = 'table-light';
    thead.innerHTML = `
        <tr>
            <th><b>Magicka Cost</b></th>
            <th><b>Gold Cost</b></th>
            <th><b>School</b></th>
            <th><b>Level</b></th>
        </tr>
    `;
    const tbody = document.createElement('tbody');
    tbody.id = 'spellStatsBody';

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);

    // run once on load
    updateSpellStats();
}

// Update stats on every change
export async function updateSpellStats() {
    await loadSpells();                      // ensure spells.json is loaded
    const tbody = document.getElementById('spellStatsBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Gather data
    const adjustedSkills = getAdjustedSkillsInfo();
    const effectsInfo    = getSpellEffectsInfo();
    const baseCosts      = calculateBaseCost(effectsInfo);
    const finalStats     = calculateAdjustedCost(baseCosts, adjustedSkills);
    const level          = getSpellLevel(finalStats.magickaCostRaw);

    // Render one row
    const row = document.createElement('tr');

    const mkCell = document.createElement('td');
    mkCell.textContent = finalStats.magickaCost;
    mkCell.setAttribute('data-label', 'Magicka Cost');

    const goldCell = document.createElement('td');
    goldCell.textContent = finalStats.goldCost;
    goldCell.setAttribute('data-label', 'Gold Cost');

    const schCell = document.createElement('td');
    schCell.textContent = finalStats.highestSchool;
    schCell.setAttribute('data-label', 'School');

    const lvlCell = document.createElement('td');
    lvlCell.textContent = level;
    lvlCell.setAttribute('data-label', 'Level');

    row.append(mkCell, goldCell, schCell, lvlCell);
    tbody.appendChild(row);

    console.log('[updateSpellStats] row rendered:', {
        magickaCost: finalStats.magickaCost,
        goldCost: finalStats.goldCost,
        highestSchool: finalStats.highestSchool,
        highestEffect: finalStats.highestEffect,
        level
    });
}
