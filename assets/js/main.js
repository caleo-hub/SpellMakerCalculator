import { createSpellBuilderTable } from './spellBuilder.js';
import { initializeSpellStats, updateSpellStats } from './spellStats.js';
import { createSkillTable } from './skillTable.js';

// 1. Monta Skill Table
createSkillTable(
    ['Alteration','Conjuration','Destruction','Illusion','Mysticism','Restoration','Luck'],
    'skillsTable'
);

// 2. Monta Spell Builder
await createSpellBuilderTable("spellBuilderContainer","data/spells.json");

// 3. Inicializa Spell Stats (estrutura vazia)
initializeSpellStats("spellStatsContainer");

// 4. Dispara cálculo inicial
updateSpellStats();

// 5. Observers para recálculo automático
const builder = document.getElementById("spellBuilderContainer");
const skills  = document.getElementById("skillsTable");

// Sempre que adicionar/remover linhas:
new MutationObserver(() => updateSpellStats())
    .observe(builder, { childList: true, subtree: true });
new MutationObserver(() => updateSpellStats())
    .observe(skills, { childList: true, subtree: true });

// Sempre que mudar valor em inputs ou selects:
[builder, skills].forEach(container => {
    container.addEventListener("input",  () => updateSpellStats());
    container.addEventListener("change", () => updateSpellStats());
});