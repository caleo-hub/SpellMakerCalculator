export function createSkillTable(schools, tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  schools.forEach(school => {
    const row = document.createElement('tr');

    // Nome da escola
    const nameCell = document.createElement('td');
    nameCell.textContent = school;
    nameCell.style.fontWeight = 'bold';

    // Container dos controles
    const controlCell = document.createElement('td');
    controlCell.style.fontWeight = 'bold';

    const group = document.createElement('div');
    group.className = 'd-flex justify-content-center align-items-center gap-1';

    // Botão -10
    const minus10 = document.createElement('button');
    minus10.className = 'btn btn-sm btn-outline-secondary';
    minus10.textContent = '-10';
    minus10.onclick = () => {
      const v = parseInt(input.value || '0') - 10;
      input.value = Math.max(0, v);
    };

    // Botão -1
    const minus1 = document.createElement('button');
    minus1.className = 'btn btn-sm btn-outline-secondary';
    minus1.textContent = '−1';
    minus1.onclick = () => {
      const v = parseInt(input.value || '0') - 1;
      input.value = Math.max(0, v);
    };

    // Campo numérico
    const input = document.createElement('input');
    input.type = 'number';
    input.value = 0;
    input.className = 'form-control skill-input';
    input.min = 0;

    // Limpa ao focar
    input.addEventListener('focus', () => {
      input.value = '';
    });

    // Botão +1
    const plus1 = document.createElement('button');
    plus1.className = 'btn btn-sm btn-outline-secondary';
    plus1.textContent = '+1';
    plus1.onclick = () => {
      const v = parseInt(input.value || '0') + 1;
      input.value = v;
    };

    // Botão +10
    const plus10 = document.createElement('button');
    plus10.className = 'btn btn-sm btn-outline-secondary';
    plus10.textContent = '+10';
    plus10.onclick = () => {
      const v = parseInt(input.value || '0') + 10;
      input.value = v;
    };

    // Montagem dos controles
    [minus10, minus1, input, plus1, plus10].forEach(el => group.appendChild(el));
    controlCell.appendChild(group);

    // Adiciona linha à tabela
    row.appendChild(nameCell);
    row.appendChild(controlCell);
    table.appendChild(row);
  });
}
