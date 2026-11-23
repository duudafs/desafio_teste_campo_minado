const { CampoMinado, COLUNAS, LINHAS, TOTAL_BOMBAS } = require('../src/campoMinado');

// ---------- Auxiliares ----------

const b = (linha, coluna) => ({ linha, coluna });

// 40 bombas nas últimas linhas: linhas 12 e 13 inteiras (36) + linha 11, colunas 0 a 3 (4)
const BOMBAS_EMBAIXO = [
  ...Array.from({ length: COLUNAS }, (_, c) => b(13, c)),
  ...Array.from({ length: COLUNAS }, (_, c) => b(12, c)),
  b(11, 0), b(11, 1), b(11, 2), b(11, 3),
];

// Coloca as bombas indicadas e completa até 40 com casas das últimas linhas
function comBombas(posicoes) {
  const chaves = new Set(posicoes.map(({ linha, coluna }) => `${linha},${coluna}`));
  const complemento = BOMBAS_EMBAIXO.filter(({ linha, coluna }) => !chaves.has(`${linha},${coluna}`));
  return [...posicoes, ...complemento.slice(0, TOTAL_BOMBAS - posicoes.length)];
}

function contarCasas(jogo, condicao) {
  return jogo.tabuleiro.flat().filter(condicao).length;
}

// ---------- RN01 - Tabuleiro ----------

describe('RN01 - Tabuleiro 18 x 14', () => {
  test('CT01 [RN01] - o tabuleiro tem 18 colunas e 14 linhas (252 casas)', () => {
    const jogo = new CampoMinado();
    expect(COLUNAS).toBe(18);
    expect(LINHAS).toBe(14);
    expect(jogo.tabuleiro).toHaveLength(14);
    jogo.tabuleiro.forEach((linha) => expect(linha).toHaveLength(18));
    expect(jogo.tabuleiro.flat()).toHaveLength(252);
  });

  test('CT02 [RN01] - no início todas as casas estão fechadas e o jogo está em andamento', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    expect(contarCasas(jogo, (casa) => casa.revelada)).toBe(0);
    expect(jogo.exibir(0, 0)).toBe('#');
    expect(jogo.estado).toBe('jogando');
  });
});

// ---------- RN02 - Bombas ----------

describe('RN02 - 40 bombas', () => {
  test('CT03 [RN02] - o tabuleiro tem exatamente 40 bombas', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    expect(TOTAL_BOMBAS).toBe(40);
    expect(contarCasas(jogo, (casa) => casa.bomba)).toBe(40);
  });

  test('CT04 [RN02] - não aceita quantidade de bombas diferente de 40', () => {
    expect(() => new CampoMinado({ bombas: BOMBAS_EMBAIXO.slice(0, 39) }))
      .toThrow('O tabuleiro deve ter exatamente 40 bombas');
  });

  test('CT05 [RN02] - não aceita duas bombas na mesma casa', () => {
    const repetidas = [...BOMBAS_EMBAIXO.slice(0, 39), BOMBAS_EMBAIXO[0]];
    expect(() => new CampoMinado({ bombas: repetidas })).toThrow('Não pode haver duas bombas na mesma casa');
  });

  test('CT06 [RN02] - não aceita bomba fora do tabuleiro', () => {
    const foraDoTabuleiro = [...BOMBAS_EMBAIXO.slice(0, 39), b(14, 0)];
    expect(() => new CampoMinado({ bombas: foraDoTabuleiro })).toThrow('Posição fora do tabuleiro');
  });
});

// ---------- RN03 - Primeiro clique seguro ----------

describe('RN03 - Primeiro clique seguro', () => {
  test('CT07 [RN03] - as bombas só são sorteadas no primeiro clique', () => {
    const jogo = new CampoMinado();
    expect(contarCasas(jogo, (casa) => casa.bomba)).toBe(0);
    jogo.revelar(7, 9);
    expect(contarCasas(jogo, (casa) => casa.bomba)).toBe(40);
  });

  test('CT08 [RN03] - o primeiro clique nunca é bomba, nem as casas vizinhas a ele', () => {
    for (let partida = 0; partida < 50; partida++) {
      const jogo = new CampoMinado();
      jogo.revelar(7, 9);
      expect(jogo.estado).not.toBe('derrota');
      expect(jogo.tabuleiro[7][9].bomba).toBe(false);
      jogo.vizinhos(7, 9).forEach(([l, c]) => expect(jogo.tabuleiro[l][c].bomba).toBe(false));
    }
  });

  test('CT09 [RN03] - o primeiro clique sempre abre uma área (a casa clicada vale 0)', () => {
    const jogo = new CampoMinado();
    jogo.revelar(0, 0);
    expect(jogo.exibir(0, 0)).toBe(0);
    expect(contarCasas(jogo, (casa) => casa.revelada)).toBeGreaterThan(1);
  });
});

// ---------- RN04 - Número de bombas vizinhas ----------

describe('RN04 - Número de bombas vizinhas', () => {
  test('CT10 [RN04] - casa cercada por 8 bombas mostra 8', () => {
    const cerco = [b(1, 1), b(1, 2), b(1, 3), b(2, 1), b(2, 3), b(3, 1), b(3, 2), b(3, 3)];
    const jogo = new CampoMinado({ bombas: comBombas(cerco) });
    jogo.revelar(2, 2);
    expect(jogo.exibir(2, 2)).toBe(8);
  });

  test('CT11 [RN04] - casa sem bombas vizinhas mostra 0', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    expect(jogo.tabuleiro[0][0].vizinhas).toBe(0);
  });

  test('CT12 [RN04] - no canto, só as 3 casas vizinhas existentes são contadas', () => {
    const jogo = new CampoMinado({ bombas: comBombas([b(0, 1), b(1, 0), b(1, 1)]) });
    expect(jogo.vizinhos(0, 0)).toHaveLength(3);
    expect(jogo.tabuleiro[0][0].vizinhas).toBe(3);
  });

  test('CT13 [RN04] - na borda, só as 5 casas vizinhas existentes são contadas', () => {
    const jogo = new CampoMinado({ bombas: comBombas([b(0, 4), b(0, 6), b(1, 4), b(1, 5), b(1, 6)]) });
    expect(jogo.vizinhos(0, 5)).toHaveLength(5);
    expect(jogo.tabuleiro[0][5].vizinhas).toBe(5);
  });

  test('CT14 [RN04] - casa no meio do tabuleiro tem 8 vizinhas', () => {
    const jogo = new CampoMinado();
    expect(jogo.vizinhos(5, 5)).toHaveLength(8);
  });
});

// ---------- RN05 - Revelar casa ----------

describe('RN05 - Revelar casa', () => {
  test('CT15 [RN05] - casa com bombas vizinhas revela só ela mesma e mostra o número', () => {
    const jogo = new CampoMinado({ bombas: comBombas([b(0, 1)]) });
    jogo.revelar(0, 0);
    expect(jogo.exibir(0, 0)).toBe(1);
    expect(contarCasas(jogo, (casa) => casa.revelada)).toBe(1);
  });

  test('CT16 [RN05] - revelar uma casa já revelada não muda nada', () => {
    const jogo = new CampoMinado({ bombas: comBombas([b(0, 1)]) });
    jogo.revelar(0, 0);
    jogo.revelar(0, 0);
    expect(jogo.reveladas).toBe(1);
    expect(jogo.estado).toBe('jogando');
  });
});

// ---------- RN06 - Abertura em cascata ----------

describe('RN06 - Abertura em cascata', () => {
  test('CT17 [RN06] - casa sem bombas vizinhas abre as vizinhas automaticamente', () => {
    const jogo = new CampoMinado({ bombas: comBombas([b(0, 5), b(1, 5), b(2, 5), b(3, 5), b(3, 4), b(3, 3), b(3, 2), b(3, 1), b(3, 0)]) });
    jogo.revelar(0, 0);
    // a área das linhas 0 a 2, colunas 0 a 4, fica isolada pelas bombas
    expect(jogo.exibir(0, 0)).toBe(0);
    expect(jogo.exibir(2, 4)).not.toBe('#');
    expect(jogo.reveladas).toBe(15);
  });

  test('CT18 [RN06] - a cascata para nas casas com número', () => {
    const jogo = new CampoMinado({ bombas: comBombas([b(0, 5), b(1, 5), b(2, 5), b(3, 5), b(3, 4), b(3, 3), b(3, 2), b(3, 1), b(3, 0)]) });
    jogo.revelar(0, 0);
    expect(jogo.exibir(0, 4)).toBe(2);
    expect(jogo.exibir(0, 6)).toBe('#'); // do outro lado da barreira de bombas
  });

  test('CT19 [RN06] - a cascata não abre casas marcadas com bandeira', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    jogo.alternarBandeira(5, 5);
    jogo.revelar(0, 0);
    expect(jogo.exibir(5, 5)).toBe('F');
    expect(jogo.tabuleiro[5][5].revelada).toBe(false);
  });
});

// ---------- RN07 - Bandeira ----------

describe('RN07 - Bandeira', () => {
  test('CT20 [RN07] - marcar e desmarcar bandeira em uma casa fechada', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    jogo.alternarBandeira(13, 0);
    expect(jogo.exibir(13, 0)).toBe('F');
    jogo.alternarBandeira(13, 0);
    expect(jogo.exibir(13, 0)).toBe('#');
  });

  test('CT21 [RN07] - casa com bandeira não é revelada ao clicar', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    jogo.alternarBandeira(13, 0);
    jogo.revelar(13, 0); // é bomba, mas está protegida pela bandeira
    expect(jogo.estado).toBe('jogando');
    expect(jogo.exibir(13, 0)).toBe('F');
  });

  test('CT22 [RN07] - não é possível colocar bandeira em casa já revelada', () => {
    const jogo = new CampoMinado({ bombas: comBombas([b(0, 1)]) });
    jogo.revelar(0, 0);
    expect(() => jogo.alternarBandeira(0, 0)).toThrow('Não é possível marcar uma casa já revelada');
  });
});

// ---------- RN08 - Contador de bombas ----------

describe('RN08 - Contador de bombas', () => {
  test('CT23 [RN08] - o contador começa em 40', () => {
    const jogo = new CampoMinado();
    expect(jogo.bombasRestantes).toBe(40);
  });

  test('CT24 [RN08] - cada bandeira diminui o contador e desmarcar aumenta de novo', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    jogo.alternarBandeira(13, 0);
    jogo.alternarBandeira(13, 1);
    expect(jogo.bombasRestantes).toBe(38);
    jogo.alternarBandeira(13, 1);
    expect(jogo.bombasRestantes).toBe(39);
  });

  test('CT25 [RN08] - o contador fica negativo se houver mais bandeiras que bombas', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    for (let coluna = 0; coluna < COLUNAS; coluna++) {
      for (let linha = 0; linha < 3; linha++) jogo.alternarBandeira(linha, coluna); // 54 bandeiras
    }
    expect(jogo.bombasRestantes).toBe(-14);
  });
});

// ---------- RN09 - Derrota ----------

describe('RN09 - Derrota', () => {
  test('CT26 [RN09] - revelar uma bomba encerra o jogo com derrota', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    jogo.revelar(13, 5);
    expect(jogo.estado).toBe('derrota');
    expect(jogo.exibir(13, 5)).toBe('*');
  });

  test('CT27 [RN09] - na derrota, todas as 40 bombas são mostradas', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    jogo.revelar(13, 5);
    expect(contarCasas(jogo, (casa) => casa.bomba && casa.revelada)).toBe(40);
  });
});

// ---------- RN10 - Vitória ----------

describe('RN10 - Vitória', () => {
  test('CT28 [RN10] - revelar todas as 212 casas sem bomba dá vitória', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    jogo.revelar(0, 0); // a cascata abre todas as casas seguras de uma vez
    expect(jogo.reveladas).toBe(212);
    expect(jogo.estado).toBe('vitoria');
  });

  test('CT29 [RN10] - não há vitória enquanto faltar alguma casa sem bomba', () => {
    const jogo = new CampoMinado({ bombas: comBombas([b(0, 1)]) });
    jogo.revelar(0, 0);
    expect(jogo.estado).toBe('jogando');
  });

  test('CT30 [RN10] - não é preciso marcar as bombas com bandeira para vencer', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    jogo.revelar(0, 0);
    expect(jogo.bandeiras).toBe(0);
    expect(jogo.estado).toBe('vitoria');
  });
});

// ---------- RN11 - Fim de jogo ----------

describe('RN11 - Fim de jogo', () => {
  test('CT31 [RN11] - após a derrota não é possível revelar nem marcar casas', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    jogo.revelar(13, 5);
    expect(() => jogo.revelar(0, 0)).toThrow('O jogo já terminou');
    expect(() => jogo.alternarBandeira(0, 0)).toThrow('O jogo já terminou');
  });

  test('CT32 [RN11] - após a vitória não é possível continuar jogando', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    jogo.revelar(0, 0);
    expect(() => jogo.revelar(13, 0)).toThrow('O jogo já terminou');
  });
});

// ---------- RN12 - Posições válidas ----------

describe('RN12 - Posições válidas', () => {
  test('CT33 [RN12] - não é possível revelar fora do tabuleiro', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    expect(() => jogo.revelar(-1, 0)).toThrow('Posição fora do tabuleiro');
    expect(() => jogo.revelar(0, 18)).toThrow('Posição fora do tabuleiro');
    expect(() => jogo.revelar(14, 0)).toThrow('Posição fora do tabuleiro');
  });

  test('CT34 [RN12] - não é possível marcar ou consultar fora do tabuleiro', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    expect(() => jogo.alternarBandeira(0, -1)).toThrow('Posição fora do tabuleiro');
    expect(() => jogo.exibir(20, 20)).toThrow('Posição fora do tabuleiro');
  });

  test('CT35 [RN12] - as casas dos cantos (0,0) e (13,17) são válidas', () => {
    const jogo = new CampoMinado({ bombas: BOMBAS_EMBAIXO });
    expect(() => jogo.exibir(0, 0)).not.toThrow();
    expect(() => jogo.exibir(13, 17)).not.toThrow();
  });
});