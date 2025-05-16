async function createSpellBuilderTable(containerId, spellsJsonPath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. Carrega o JSON agrupado por escola
    const resp = await fetch(spellsJsonPath);
    const spellsBySchool = await resp.json();
    const schools = Object.keys(spellsBySchool).sort();

    // 2. Cria wrapper, tabela e cabeçalho
    const wrapper = document.createElement('div');
    const table = document.createElement('table');
    table.className = 'table table-bordered align-middle text-center';

    const thead = document.createElement('thead');
    thead.className = 'table-light';
    thead.innerHTML = `
        <tr>
            <th>School</th>
            <th>Effect</th>
            <th>Type</th>
            <th>Magnitude</th>
            <th>Area</th>
            <th>Duration</th>
            <th>Actions</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    wrapper.appendChild(table);

    // 3. Botão “Add Effect”
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Effect';
    addBtn.className = 'btn btn-success mb-3';
    addBtn.onclick = () => addRow();
    wrapper.appendChild(addBtn);

    container.appendChild(wrapper);

    // 4. Função de adicionar linha
    function addRow() {
        const row = document.createElement('tr');

        // 4.1 Select de School
        const schoolCell = document.createElement('td');
        schoolCell.setAttribute('data-label', 'School');
        const schoolSelect = document.createElement('select');
        schoolSelect.className = 'form-select';
        schoolSelect.innerHTML = `<option value="">Select School...</option>`;
        schools.forEach(s => {
            const o = document.createElement('option');
            o.value = s;
            o.textContent = s;
            schoolSelect.appendChild(o);
        });
        schoolCell.appendChild(schoolSelect);

        // 4.2 Select de Effect (inicial desabilitado)
        const effectCell = document.createElement('td');
        effectCell.setAttribute('data-label', 'Effect');
        const effectSelect = document.createElement('select');
        effectSelect.className = 'form-select';
        effectSelect.disabled = true;
        effectSelect.innerHTML = `<option value="">Select Effect...</option>`;
        effectCell.appendChild(effectSelect);

        // 4.3 Type (placeholder)
        const typeCell = document.createElement('td');
        typeCell.setAttribute('data-label', 'Type');
        typeCell.textContent = '—';

        // 4.4 Magnitude
        const magCell = document.createElement('td');
        magCell.setAttribute('data-label', 'Magnitude');
        const magInput = document.createElement('input');
        magInput.type = 'number';
        magInput.className = 'form-control';
        magInput.min = 0;
        magInput.placeholder = '0';
        magCell.appendChild(magInput);

        // 4.5 Area
        const areaCell = document.createElement('td');
        areaCell.setAttribute('data-label', 'Area');
        const areaInput = document.createElement('input');
        areaInput.type = 'number';
        areaInput.className = 'form-control';
        areaInput.min = 0;
        areaInput.placeholder = '0';
        areaCell.appendChild(areaInput);

        // 4.6 Duration
        const durCell = document.createElement('td');
        durCell.setAttribute('data-label', 'Duration');
        const durInput = document.createElement('input');
        durInput.type = 'number';
        durInput.className = 'form-control';
        durInput.min = 0;
        durInput.placeholder = '0';
        durCell.appendChild(durInput);

        // 4.7 Actions: botão remover
        const actionCell = document.createElement('td');
        actionCell.setAttribute('data-label', 'Actions');
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '−';
        removeBtn.className = 'btn btn-sm btn-outline-danger';
        removeBtn.onclick = () => row.remove();
        actionCell.appendChild(removeBtn);

        // 4.8 Monta a linha
        row.append(
            schoolCell,
            effectCell,
            typeCell,
            magCell,
            areaCell,
            durCell,
            actionCell
        );
        tbody.appendChild(row);

        // 5. Quando muda a escola, popula os efeitos
        schoolSelect.onchange = () => {
            const school = schoolSelect.value;
            effectSelect.innerHTML = `<option value="">Select Effect...</option>`;
            if (school && spellsBySchool[school]) {
                Object.keys(spellsBySchool[school])
                    .sort()
                    .forEach(effectName => {
                        const opt = document.createElement('option');
                        opt.value = effectName;
                        opt.textContent = effectName;
                        effectSelect.appendChild(opt);
                    });
                effectSelect.disabled = false;
            } else {
                effectSelect.disabled = true;
            }
        };
    }

    // Linha inicial
    addRow();
}
