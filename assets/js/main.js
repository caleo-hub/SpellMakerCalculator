// assets/js/main.js
// -----------------

import {
  deleteCharacter,
  deleteSpell,
  getUserUID,
  initFirebase,
  loadCharacters,
  loadSpells,
  loginWithGoogle,
  logout,
  onAuthStateChangedListener,
  saveCharacter,
  saveSpell
} from './authentication.js';

import { createSkillTable } from './skillTable.js';
import { createSpellBuilderTable } from './spellBuilder.js';
import { initializeSpellStats, updateSpellStats } from './spellStats.js';

(async function() {
  // ===== 1) Inicializa Firebase =====
  const firebaseConfig = {
    apiKey: "AIzaSyD-rmzktDrVT4rjO3NNoV90sw7Pw7LrtkY",
    authDomain: "spellmakeraltar-calculator.firebaseapp.com",
    projectId: "spellmakeraltar-calculator",
    storageBucket: "spellmakeraltar-calculator.firebasestorage.app",
    messagingSenderId: "891889688622",
    appId: "1:891889688622:web:0b24c5d0e6b19c5be63fbf",
    measurementId: "G-0E9FC09P7R"
  };
  initFirebase(firebaseConfig);

  // ===== 2) Referências de UI =====
  const btnLogin       = document.getElementById('btnGoogleLogin');
  const btnLogout      = document.getElementById('btnLogout');
  const charSelect     = document.getElementById('charSelect');
  const charNameInput  = document.getElementById('charName');
  const btnSaveChar    = document.getElementById('btnSaveChar');
  const btnDeleteChar  = document.getElementById('btnDeleteChar');

  const spellSelect    = document.getElementById('spellSelect');
  const spellNameInput = document.getElementById('spellName');
  const btnSaveSpell   = document.getElementById('btnSaveSpell');
  const btnDeleteSpell = document.getElementById('btnDeleteSpell');

  const skillsTableContainer    = 'skillsTable';
  const spellBuilderContainer   = 'spellBuilderContainer';
  const spellStatsContainer     = 'spellStatsContainer';

  // ===== 3) Login / Logout =====
  btnLogin .addEventListener('click',  () => loginWithGoogle().catch(console.error));
  btnLogout.addEventListener('click',  () => logout().catch(console.error));

  // ===== 4) Quando muda estado de auth =====
  onAuthStateChangedListener(async user => {
    if (user) {
      // habilita UI
      btnLogin.classList.add('d-none');
      btnLogout.classList.remove('d-none');

      [ charNameInput, charSelect, btnSaveChar, btnDeleteChar,
        spellSelect, spellNameInput, btnSaveSpell, btnDeleteSpell
      ].forEach(el => el.disabled = false);

      const uid = getUserUID();

      // popula personagens
      const chars = await loadCharacters(uid);
      populateDropdown(charSelect, chars);

      charSelect.onchange = async () => {
        const id = charSelect.value;
        if (!id) return;
        const all = await loadCharacters(uid);
        const sel = all.find(c => c.id === id);
        charNameInput.value = sel.name;
        if (sel.skills) {
          applySkillData(sel.skills);
          updateSpellStats();
        }
      };

      // popula magias
      const spells = await loadSpells(uid);
      populateDropdown(spellSelect, spells);

      spellSelect.onchange = async () => {
        const id = spellSelect.value;
        if (!id) return;
        const all = await loadSpells(uid);
        const sel = all.find(s => s.id === id);
        spellNameInput.value = sel.name;
        if (sel.effects) {
          applySpellData(sel.effects);
          updateSpellStats();
        }
      };

    } else {
      // desabilita UI
      btnLogin.classList.remove('d-none');
      btnLogout.classList.add('d-none');

      [ charNameInput, charSelect, btnSaveChar, btnDeleteChar,
        spellSelect, spellNameInput, btnSaveSpell, btnDeleteSpell
      ].forEach(el => { 
        el.disabled = true;
        if (el.tagName === 'SELECT') clearDropdown(el);
        if (el.tagName === 'INPUT') el.value = '';
      });
    }
  });

  // ===== 5) Handlers de salvar/deletar =====

  // salva personagem (nome + skills)
  btnSaveChar.addEventListener('click', async () => {
    const uid  = getUserUID();
    const name = charNameInput.value.trim();
    if (!name) return alert('Enter the character name');
    const skills = extractSkillData();
    const data = { name, skills, updatedAt: Date.now() };
    await saveCharacter(uid, data, charSelect.value || null);
    const updated = await loadCharacters(uid);
    populateDropdown(charSelect, updated);
    charNameInput.value = '';
  });

  // delete character
  btnDeleteChar.addEventListener('click', async () => {
    const uid = getUserUID();
    const id  = charSelect.value;
    if (!id) return alert('Select a character');
    if (!confirm('Delete this character?')) return;
    await deleteCharacter(uid, id);
    const updated = await loadCharacters(uid);
    populateDropdown(charSelect, updated);
    charNameInput.value = '';
  });

  // salva magia (nome + effects)
  btnSaveSpell.addEventListener('click', async () => {
    const uid  = getUserUID();
    const name = spellNameInput.value.trim();
    if (!name) return alert('Enter the spell name');
    const effects = extractSpellData();
    const data = { name, effects, updatedAt: Date.now() };
    await saveSpell(uid, data, spellSelect.value || null);
    const updated = await loadSpells(uid);
    populateDropdown(spellSelect, updated);
    spellNameInput.value = '';
  });

  // deleta magia
  btnDeleteSpell.addEventListener('click', async () => {
    const uid = getUserUID();
    const id  = spellSelect.value;
    if (!id) return alert('Select a spell');
    if (!confirm('Delete this spell?')) return;
    await deleteSpell(uid, id);
    const updated = await loadSpells(uid);
    populateDropdown(spellSelect, updated);
    spellNameInput.value = '';
  });

  // ===== 6) Inicializa tabelas e observers =====

  // 6.1) Skill Table
  createSkillTable(
    ['Alteration','Conjuration','Destruction','Illusion','Mysticism','Restoration','Luck'],
    skillsTableContainer
  );

  // 6.2) Spell Builder
  await createSpellBuilderTable(spellBuilderContainer, 'data/spells.json');

  // 6.3) Spell Stats
  initializeSpellStats(spellStatsContainer);
  updateSpellStats();

  // 6.4) Observers para recálculo
  const builderEl = document.getElementById(spellBuilderContainer);
  const skillsEl  = document.getElementById(skillsTableContainer);

  new MutationObserver(updateSpellStats)
    .observe(builderEl, { childList: true, subtree: true });
  new MutationObserver(updateSpellStats)
    .observe(skillsEl,  { childList: true, subtree: true });

  [builderEl, skillsEl].forEach(el => {
    el.addEventListener('input',  updateSpellStats);
    el.addEventListener('change', updateSpellStats);
  });

  // ===== Funções auxiliares =====

  // lê levels da skill table
  function extractSkillData() {
    const rows = document.querySelectorAll('#skillsTable tr');
    const skills = {};
    rows.forEach(row => {
      const [nameCell, lvlCell] = row.querySelectorAll('td');
      const skill = nameCell.textContent.trim();
      const val   = parseInt(lvlCell.querySelector('input.skill-input').value) || 0;
      skills[skill] = val;
    });
    return skills;
  }

  // aplica levels na skill table
  function applySkillData(data) {
    document.querySelectorAll('#skillsTable tr').forEach(row => {
      const name = row.querySelector('td:first-child').textContent.trim();
      const inp  = row.querySelector('input.skill-input');
      if (data[name] != null) inp.value = data[name];
    });
  }

  // lê efeitos da spell builder
  function extractSpellData() {
    const tbody = document.querySelector('#spellBuilderContainer table tbody');
    if (!tbody) return [];
    return Array.from(tbody.rows).map(row => {
      const [schoolC, effectC, rangeC, magC, areaC, durC] = row.cells;
      return {
        school:    schoolC.querySelector('select').value,
        effect:    effectC.querySelector('select').value,
        range:     rangeC.querySelector('select').value,
        magnitude: parseFloat(magC.querySelector('input').value) || 0,
        area:      parseFloat(areaC.querySelector('input').value) || 0,
        duration:  parseFloat(durC.querySelector('input').value) || 0
      };
    });
  }

  // aplica efeitos na spell builder
  function applySpellData(effects) {
    const tbody  = document.querySelector('#spellBuilderContainer table tbody');
    const addBtn = document.querySelector('#spellBuilderContainer button.btn-success');
    tbody.innerHTML = '';
    effects.forEach(e => {
      addBtn.click();
      const row = tbody.rows[tbody.rows.length - 1];
      const [sC, eC, rC, mC, aC, dC] = row.cells;
      const sSel = sC.querySelector('select');
      sSel.value = e.school;
      sSel.dispatchEvent(new Event('change'));
      eC.querySelector('select').value = e.effect;
      rC.querySelector('select').value = e.range;
      mC.querySelector('input').value  = e.magnitude;
      aC.querySelector('input').value  = e.area;
      dC.querySelector('input').value  = e.duration;
    });
  }

  // popula um <select> com opções
  function populateDropdown(sel, items) {
    sel.innerHTML = '<option value="">— select —</option>';
    items.forEach(({ id, name }) => {
      const o = document.createElement('option');
      o.value = id;
      o.textContent = name;
      o.dataset.name = name;
      sel.appendChild(o);
    });
  }

  // limpa um <select>
  function clearDropdown(sel) {
    sel.innerHTML = '';
  }

})();
