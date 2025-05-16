export function initializeSpellStats(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const table = document.createElement('table');
    table.className = 'table table-bordered text-center table-sm mt-4';

    const thead = document.createElement('thead');
    thead.className = 'table-light';
    thead.innerHTML = `
        <tr>
            <th>Magicka Cost</th>
            <th>Master Cost</th>
            <th>Gold Cost</th>
            <th>School</th>
            <th>Level</th>
        </tr>
    `;
    const tbody = document.createElement('tbody');
    tbody.id = 'spellStatsBody';

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);

    updateSpellStats(); // inicializa vazio
}

export function updateSpellStats() {
    const tbody = document.getElementById('spellStatsBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    // TODO: lógica de cálculo com base nas entradas
    const mockData = {
        magickaCost: 32,
        masterCost: 12,
        goldCost: 87,
        school: 'Destruction',
        level: 'Expert'
    };

    const row = document.createElement('tr');

    const magickaCell = document.createElement('td');
    magickaCell.textContent = mockData.magickaCost;
    magickaCell.setAttribute('data-label', 'Magicka Cost');

    const masterCell = document.createElement('td');
    masterCell.textContent = mockData.masterCost;
    masterCell.setAttribute('data-label', 'Master Cost');

    const goldCell = document.createElement('td');
    goldCell.textContent = mockData.goldCost;
    goldCell.setAttribute('data-label', 'Gold Cost');

    const schoolCell = document.createElement('td');
    schoolCell.textContent = mockData.school;
    schoolCell.setAttribute('data-label', 'School');

    const levelCell = document.createElement('td');
    levelCell.textContent = mockData.level;
    levelCell.setAttribute('data-label', 'Level');

    row.append(magickaCell, masterCell, goldCell, schoolCell, levelCell);
    tbody.appendChild(row);
}


