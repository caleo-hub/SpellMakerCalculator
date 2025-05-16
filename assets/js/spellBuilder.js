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
            <th><strong>School</strong></th>
            <th><strong>Effect</strong></th>
            <th><strong>Magnitude</strong></th>
            <th><strong>Area</strong></th>
            <th><strong>Duration</strong></th>
            <th><strong>Actions</strong></th>
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

        // 4.1 Select de School (sm)
        const schoolCell = document.createElement('td');
        schoolCell.setAttribute('data-label', 'School');
        const schoolSelect = document.createElement('select');
        schoolSelect.className = 'form-select form-select-sm';
        schoolSelect.innerHTML = `<option value="">Select School...</option>`;
        schools.forEach(s => {
            const o = document.createElement('option');
            o.value = s; o.textContent = s;
            schoolSelect.appendChild(o);
        });
        schoolCell.appendChild(schoolSelect);

        // 4.2 Select de Effect (sm)
        const effectCell = document.createElement('td');
        effectCell.setAttribute('data-label', 'Effect');
        const effectSelect = document.createElement('select');
        effectSelect.className = 'form-select form-select-sm';
        effectSelect.disabled = true;
        effectSelect.innerHTML = `<option value="">Select Effect...</option>`;
        effectCell.appendChild(effectSelect);

        // 4.3 Magnitude (sm)
        const magCell = document.createElement('td');
        magCell.setAttribute('data-label', 'Magnitude');
        const magInput = document.createElement('input');
        magInput.type = 'number';
        magInput.className = 'form-control form-control-sm';
        magInput.min = 0;
        magInput.placeholder = '0';
        magCell.appendChild(magInput);

        // 4.4 Area (sm)
        const areaCell = document.createElement('td');
        areaCell.setAttribute('data-label', 'Area');
        const areaInput = document.createElement('input');
        areaInput.type = 'number';
        areaInput.className = 'form-control form-control-sm';
        areaInput.min = 0;
        areaInput.placeholder = '0';
        areaCell.appendChild(areaInput);

        // 4.5 Duration (sm)
        const durCell = document.createElement('td');
        durCell.setAttribute('data-label', 'Duration');
        const durInput = document.createElement('input');
        durInput.type = 'number';
        durInput.className = 'form-control form-control-sm';
        durInput.min = 0;
        durInput.placeholder = '0';
        durCell.appendChild(durInput);

        // 4.6 Actions: botão remover
        const actionCell = document.createElement('td');
        actionCell.setAttribute('data-label', 'Actions');
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '−';
        removeBtn.className = 'btn btn-sm btn-outline-danger';
        removeBtn.onclick = () => row.remove();
        actionCell.appendChild(removeBtn);

        // 4.7 Monta a linha
        row.append(
            schoolCell,
            effectCell,
            magCell,
            areaCell,
            durCell,
            actionCell
        );
        tbody.appendChild(row);

        // 5. Popula efeitos ao mudar escola
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
