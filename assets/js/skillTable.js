export function createSkillTable(schools, tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    schools.forEach(school => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = school;
        nameCell.style.fontWeight = 'bold';

        const controlCell = document.createElement('td');
        controlCell.style.fontWeight = 'bold';

        const group = document.createElement('div');
        group.className = 'd-flex justify-content-center align-items-center gap-2';

        const minusBtn = document.createElement('button');
        minusBtn.className = 'btn btn-sm btn-outline-secondary';
        minusBtn.textContent = '−';

        const input = document.createElement('input');
        input.type = 'number';
        input.value = 50;
        input.className = 'form-control skill-input';
        input.min = 0;

        const plusBtn = document.createElement('button');
        plusBtn.className = 'btn btn-sm btn-outline-secondary';
        plusBtn.textContent = '+';

        minusBtn.onclick = () => input.value = Math.max(0, parseInt(input.value || '0') - 1);
        plusBtn.onclick = () => input.value = parseInt(input.value || '0') + 1;

        group.appendChild(minusBtn);
        group.appendChild(input);
        group.appendChild(plusBtn);
        controlCell.appendChild(group);

        row.appendChild(nameCell);
        row.appendChild(controlCell);
        table.appendChild(row);
    });
}
