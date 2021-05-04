const res = ['plank', 'skin', 'ore', 'plank_price', 'skin_price', 'ore_price', 'tech_1_price', 'tech_2_price', 'tech_3_price', 'box_1_sell', 'box_1_cost', 'box_2_sell', 'box_2_cost', 'box_3_sell'];
const chk = ['tech_1_rep', 'tech_2_rep', 'tech_3_rep'];

res.forEach( el => {
  document.getElementById(el).addEventListener('change', () => {
    checkValue(el);

    const box_1 = ['plank', 'plank_price', 'tech_1_price', 'box_1_sell', 'tech_1_rep'];
    box_1.forEach( item => {
      item === el ? calcBoxes('plank', 1) : '';
    });

    const box_2 = ['skin', 'skin_price', 'tech_2_price', 'box_2_sell', 'tech_2_rep'];
    box_2.forEach( item => {
      item === el ? calcBoxes('skin', 2) : '';
    });

    const box_3 = ['ore', 'ore_price', 'tech_3_price', 'box_3_sell', 'tech_3_rep'];
    box_3.forEach( item => {
      item === el ? calcBoxes('ore', 3) : '';
    });

  });
});

for (let i = 0; i < 3; i++) {
  document.getElementById(res[i]).addEventListener('change', () => {
    calcWeight(res[i]);
  });
};

// меняем цену чертежей
chk.forEach( el => {
  document.getElementById(el).addEventListener('change', () => {
    changeTechPrice(el);
    switch (el) {
      case 'tech_1_rep':
        calcBoxes('plank', 1);
        break;
      case 'tech_2_rep':
        calcBoxes('skin', 2);
        break;
      default:
        calcBoxes('ore', 3);
        break;
    }
  })
});

// оставляем в ценах и количествах только цифры
function checkValue(el) {
  let val = parseFloat(document.getElementById(el).value);
  (val < 0 || val === '' || isNaN(val) ) ? document.getElementById(el).value = 0 : document.getElementById(el).value = parseFloat(document.getElementById(el).value);
}

// меняем цену на чертежи
function changeTechPrice(el) {
  const tech = el.slice(0, 6);
  const price = [
    {
      'tech_1_price': 30,
      'tech_2_price': 50,
      'tech_3_price': 75
    },
    {
      'tech_1_price': 26,
      'tech_2_price': 43,
      'tech_3_price': 64
    }
  ];

  let price_type = +document.getElementById(el).checked;
  document.getElementById(`${tech}_price`).value = price[price_type][`${tech}_price`];
  price_type ? document.getElementById(`${tech}_price`).nextSibling.data = ' реп.' : document.getElementById(`${tech}_price`).nextSibling.data = ' пс.';
}

// считаем вес купленных ресурсов
function calcWeight(el) {
  const weight = {
    'plank': 12,
    'skin': 5,
    'ore': 1
  }

  document.getElementById(`${el}_w`).value = document.getElementById(el).value * weight[el];
}

// считаем эту всю лабуду
function calcBoxes(resType , boxType) {
  switch (resType) {
    case 'plank':
      if (document.getElementById(resType).value % 2 !== 0) {
        showMsg('Кол-во досок должно быть кратно <b>2</b>.');
        document.getElementById(resType).value = document.getElementById(resType).value - 1;
        calcBoxes('plank' , 1);
      }
      break;
  
    case 'ore':
      if (document.getElementById(resType).value % 30 !== 0) {
        showMsg('Кол-во руды должно быть кратно <b>30</b>.');
        document.getElementById(resType).value = document.getElementById(resType).value - 1;
        calcBoxes('ore' , 3);
      }
      break;
  }
  
  const resObj = {
    1: document.getElementById(resType).value / 2,
    2: document.getElementById(resType).value,
    3: document.getElementById(resType).value / 30,
    'box_1': 20,
    'box_2': 24,
    'box_3': 50,
    'plank': 'Прочный ящик',
    'skin': 'Сундук',
    'ore': 'Сундук с товаром'
  };

  // кол-во ящиков
  document.getElementById(`box_${boxType}_q`).innerHTML = resObj[boxType] + ' шт.';
  // цена потраченных ресов
  document.getElementById(`${resType}_${boxType}_cost`).innerHTML = document.getElementById(resType).value * document.getElementById(`${resType}_price`).value + ' пс.';
  // если покупаем чертеж за репутацию
  let currency = ' реп.';
  let tech_ps_cost = 0;

  if (!document.getElementById(`tech_${boxType}_rep`).checked) {
    currency =  ' пс.';
    tech_ps_cost = resObj[boxType] * document.getElementById(`tech_${boxType}_price`).value;
  }
  // затраты на чертежи
  document.getElementById(`tech_${boxType}_cost`).innerHTML =  resObj[boxType] * document.getElementById(`tech_${boxType}_price`).value + currency;
  // очков работы
  let wp = 0;
  switch (boxType) {
    case 1:
      wp = 6;
      break;
    case 2:
      wp = 5;
      break;
    default:
      wp = 4;
      break;
  }
  document.getElementById(`wp_${boxType}_cost`).innerHTML = resObj[boxType] * wp;
  // вес
  let box_w = resObj[boxType] * resObj['box_' + boxType];
  box_w > 900 ? showMsg(`Максимальная вместимость трюма каравеллы <b>900</b> ед.<br>Довезем <b>${resObj[resType]} (${resObj[boxType]} шт.)</b> за <b>${Math.ceil(box_w / 900)}</b> раз.`): '';
  document.getElementById(`box_${boxType}_w`).innerHTML = `${box_w} ед.` ;
  // итог
  let res = 0;
  if (resType === 'plank') {
    res = (resObj[boxType] * document.getElementById(`box_${boxType}_sell`).value - document.getElementById(resType).value * document.getElementById(`${resType}_price`).value - tech_ps_cost).toFixed(2);
  } else {
    res = ( resObj[boxType] * document.getElementById(`box_${boxType}_sell`).value - resObj[boxType] * document.getElementById(`box_${boxType - 1}_cost`).value - document.getElementById(resType).value * document.getElementById(`${resType}_price`).value - tech_ps_cost).toFixed(2);
  }
  document.getElementById(`result_${boxType}`).innerHTML = `<b><u>${res} пс. <br>${ isNaN(res / (res * wp) ) ? '0.00' : ( res / (resObj[boxType] * wp) ).toFixed(2)} пс. за 1 ОР</u></b>`;
  chainCalcBoxes(document.getElementById(`plank`).value, document.getElementById(`skin`).value, document.getElementById(`ore`).value, document.getElementById(`tech_1_rep`).checked, document.getElementById(`tech_2_rep`).checked, document.getElementById(`tech_3_rep`).checked);
}

function chainCalcBoxes(pl_c, sk_c, ore_c, rep1, rep2, rep3) {
  // кол-во ящиков
  let box_count = 0;
  
  // 1 chain
  if (pl_c > 0 && sk_c > 0) {
    // кол-во ящиков
    if ((pl_c / 2) <= sk_c) {
      box_count = pl_c / 2;
    } else {
      box_count = sk_c;
    }
    // затраты на доски
    let pl_cost = box_count * 2 * document.getElementById(`plank_price`).value;
    // затраты на кожу
    let sk_cost = box_count * document.getElementById(`skin_price`).value;
    // затраты на доски
    document.getElementById(`chain_plank_1_cost`).innerHTML = pl_cost + ` пс.  (расход ${box_count * 2} шт.)`;
    // затраты на кожу
    document.getElementById(`chain_skin_1_cost`).innerHTML = sk_cost + ` пс. (расход ${box_count} шт.)`;
    // затраты на чертежи
    let tech_ps = 0;
    if (rep1 && rep2) {
      //  если два за репутацию
      document.getElementById(`chain_tech_1_cost`).innerHTML = document.getElementById(`tech_1_price`).value * box_count + document.getElementById(`tech_2_price`).value * box_count + ` реп.`;
    } else if (rep1 && !rep2) {
      tech_ps = document.getElementById(`tech_2_price`).value * box_count;
      document.getElementById(`chain_tech_1_cost`).innerHTML = document.getElementById(`tech_1_price`).value * box_count + ` реп. и ` + tech_ps + ` пс.`;
    } else if (!rep1 && rep2) {
      tech_ps = document.getElementById(`tech_1_price`).value * box_count;
      document.getElementById(`chain_tech_1_cost`).innerHTML = tech_ps + ` пс. и ` + document.getElementById(`tech_2_price`).value * box_count + ` реп.`;
    } else {
      // если два за пиастры
      tech_ps = document.getElementById(`tech_1_price`).value * box_count + document.getElementById(`tech_2_price`).value * box_count;
      document.getElementById(`chain_tech_1_cost`).innerHTML = tech_ps + ` пс.`;
    }
    // затраты на очки работы
    let wp = box_count * 6 + box_count * 5;
    document.getElementById(`chain_wp_1_cost`).innerHTML = wp;
    // прибыль
    let res = (document.getElementById(`box_2_sell`).value * box_count - pl_cost - sk_cost - tech_ps).toFixed(2);
    document.getElementById(`chain_result_1`).innerHTML = `<b><u>${res} пс. за ${box_count} сундуков.<br>${(res / wp).toFixed(2)} пс. за 1 ОР</u></b>`;
  }

  // 2 chain & 3 chain
  if (sk_c > 0 && ore_c > 0) {
    if ((pl_c / 2) <= sk_c && (pl_c / 2) <= (ore_c / 30)) {
      // если досок меньше всего
      box_count = pl_c / 2;
    } else if(sk_c <= (pl_c / 2) && sk_c <= (ore_c / 30)) {
      // если шкуры меньше всего
      box_count = sk_c;
    } else {
      // если руды
      box_count = ore_c / 30;
    }
    // затраты на прочные ящики
    let bx2_cost = box_count * document.getElementById(`box_1_cost`).value;
    document.getElementById(`chain_box_1_cost`).innerHTML = bx2_cost + ` пс. (${box_count} шт.)`
    // затраты на шкуру
    let sk2_cost = box_count * document.getElementById(`skin_price`).value;
    document.getElementById(`chain_skin_2_cost`).innerHTML = sk2_cost + ` пс.  (расход ${box_count} шт.)`;
    // затраты на руду
    let ore2_cost = box_count * 30 * document.getElementById(`ore_price`).value;
    document.getElementById(`chain_ore_2_cost`).innerHTML = ore2_cost + ` пс.  (расход ${box_count * 30} шт.)`;
    // затраты на чертежи (2)
    let tech2_ps = 0;
    if(rep2 && rep3) {
      // если оба за репутацию
      document.getElementById(`chain_tech_2_cost`).innerHTML = document.getElementById(`tech_2_price`).value * box_count + document.getElementById(`tech_3_price`).value * box_count + ` реп.`;
    } else if (rep2 && !rep3) {
      tech2_ps = document.getElementById(`tech_3_price`).value * box_count;
      document.getElementById(`chain_tech_2_cost`).innerHTML = document.getElementById(`tech_2_price`).value * box_count + ` реп. и ` + tech2_ps + ` пс.`;
    } else if (!rep2 && rep3) {
      tech2_ps = document.getElementById(`tech_2_price`).value * box_count;
      document.getElementById(`chain_tech_2_cost`).innerHTML = tech2_ps + ` пс. и ` + document.getElementById(`tech_3_price`).value * box_count + ` реп.`;
    } else {
      // если два за пиастры
      tech2_ps = document.getElementById(`tech_2_price`).value * box_count + document.getElementById(`tech_3_price`).value * box_count;
      document.getElementById(`chain_tech_2_cost`).innerHTML = tech2_ps + ` пс.`;
    }
    // затраты на очки работы
    let wp2 = box_count * 5 + box_count * 4;
    document.getElementById(`chain_wp_2_cost`).innerHTML = wp2;
    // прибыль
    let res2 = (document.getElementById(`box_3_sell`).value * box_count - document.getElementById(`box_1_cost`).value * box_count - sk2_cost - ore2_cost - tech2_ps).toFixed(2);
    document.getElementById(`chain_result_2`).innerHTML = `<b><u>${res2} пс. за ${box_count} сундуков c товаром.<br>${(res2 / wp2).toFixed(2)} пс. за 1 ОР</u></b>`;

    // chain 3
    // затраты на доски
    let pl3_cost = box_count * 2 * document.getElementById(`plank_price`).value;
    document.getElementById(`chain_plank_2_cost`).innerHTML = pl3_cost + ` пс.  (расход ${box_count * 2} шт.)`;
    // затраты на шкуру
    let sk3_cost = box_count * document.getElementById(`skin_price`).value;
    document.getElementById(`chain_skin_3_cost`).innerHTML = sk3_cost + ` пс.  (расход ${box_count} шт.)`;
    // затраты на руду
    let ore3_cost = box_count * 30 * document.getElementById(`ore_price`).value;
    document.getElementById(`chain_ore_3_cost`).innerHTML = ore3_cost + ` пс.  (расход ${box_count * 30} шт.)`;
    // затраты на чертежи (3)
    let tech3_ps = 0;
    if(rep1 && rep2 && rep3) {
      // если 3 за репутацию
      document.getElementById(`chain_tech_3_cost`).innerHTML = document.getElementById(`tech_1_price`).value * box_count * document.getElementById(`tech_2_price`).value * box_count + document.getElementById(`tech_3_price`).value * box_count + ` реп.`;
    } else if (rep1 && !rep2 && !rep3) {
      tech3_ps = document.getElementById(`tech_2_price`).value * box_count + document.getElementById(`tech_3_price`).value * box_count;
      document.getElementById(`chain_tech_3_cost`).innerHTML = document.getElementById(`tech_1_price`).value * box_count + ` реп. и ` + tech3_ps + ` пс.`;
    } else if (!rep1 && rep2 && !rep3) {
      tech3_ps = document.getElementById(`tech_1_price`).value * box_count + document.getElementById(`tech_3_price`).value * box_count;
      document.getElementById(`chain_tech_3_cost`).innerHTML = document.getElementById(`tech_2_price`).value * box_count + ` реп. и ` + tech3_ps + ` пс.`;
    } else if (!rep1 && !rep2 && rep3) {
      tech3_ps = document.getElementById(`tech_1_price`).value * box_count + document.getElementById(`tech_2_price`).value * box_count;
      document.getElementById(`chain_tech_3_cost`).innerHTML = document.getElementById(`tech_3_price`).value * box_count + ` реп. и ` + tech3_ps + ` пс.`;
    } else {
      // если 3 за пиастры
      tech3_ps = document.getElementById(`tech_1_price`).value * box_count + document.getElementById(`tech_2_price`).value * box_count + document.getElementById(`tech_3_price`).value * box_count;
      document.getElementById(`chain_tech_3_cost`).innerHTML = tech3_ps + ` пс.`;
    }
    // затраты на очки работы
    let wp3 = box_count * 6 + box_count * 5 + box_count * 4;
    document.getElementById(`chain_wp_3_cost`).innerHTML = wp3;
    // прибыль
    let res3 = (document.getElementById(`box_3_sell`).value * box_count - pl3_cost - sk3_cost - ore3_cost - tech3_ps).toFixed(2);
    document.getElementById(`chain_result_3`).innerHTML = `<b><u>${res3} пс. за ${box_count} сундуков c товаром.<br>${(res3 / wp3).toFixed(2)} пс. за 1 ОР</u></b>`;
  }


}


function showMsg(msg, delay = 5) {
  const msgBox = document.getElementById('msg');
  msgBox.innerHTML = msg;
  
  msgBox.style.display = 'block';
  msgBox.classList.remove('hide');

  setTimeout(() => {
    msgBox.classList.add('hide');
  }, delay * 1000);
}