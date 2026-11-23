// Campo Minado — tabuleiro 18 x 14 (18 colunas por 14 linhas) com 40 bombas

const COLUNAS = 18;
const LINHAS = 14;
const TOTAL_BOMBAS = 40;

class CampoMinado {
  // bombas: lista opcional de posições [{ linha, coluna }] (usada nos testes para um tabuleiro conhecido)
  // aleatorio: função que devolve um número entre 0 e 1 (padrão: Math.random)
  constructor({ bombas = null, aleatorio = Math.random } = {}) {
    this.aleatorio = aleatorio;
    this.estado = 'jogando';
    this.bandeiras = 0;
    this.reveladas = 0;
    this.bombasPosicionadas = false;
    this.tabuleiro = Array.from({ length: LINHAS }, () =>
      Array.from({ length: COLUNAS }, () => ({ bomba: false, revelada: false, bandeira: false, vizinhas: 0 }))
    );

    if (bombas) {
      this.posicionarBombas(bombas);
    }
  }

  posicionarBombas(bombas) {
    if (bombas.length !== TOTAL_BOMBAS) {
      throw new Error(`O tabuleiro deve ter exatamente ${TOTAL_BOMBAS} bombas`);
    }
    const unicas = new Set(bombas.map(({ linha, coluna }) => `${linha},${coluna}`));
    if (unicas.size !== TOTAL_BOMBAS) {
      throw new Error('Não pode haver duas bombas na mesma casa');
    }
    bombas.forEach(({ linha, coluna }) => {
      this.validarPosicao(linha, coluna);
      this.tabuleiro[linha][coluna].bomba = true;
    });
    this.calcularVizinhas();
    this.bombasPosicionadas = true;
  }

  // Sorteia as 40 bombas no primeiro clique, deixando livres a casa clicada e as vizinhas dela
  sortearBombas(linhaSegura, colunaSegura) {
    const protegidas = new Set(
      [[linhaSegura, colunaSegura], ...this.vizinhos(linhaSegura, colunaSegura)].map(([l, c]) => `${l},${c}`)
    );
    const candidatas = [];
    for (let linha = 0; linha < LINHAS; linha++) {
      for (let coluna = 0; coluna < COLUNAS; coluna++) {
        if (!protegidas.has(`${linha},${coluna}`)) candidatas.push({ linha, coluna });
      }
    }
    for (let i = candidatas.length - 1; i > 0; i--) {
      const j = Math.floor(this.aleatorio() * (i + 1));
      [candidatas[i], candidatas[j]] = [candidatas[j], candidatas[i]];
    }
    this.posicionarBombas(candidatas.slice(0, TOTAL_BOMBAS));
  }

  vizinhos(linha, coluna) {
    const lista = [];
    for (let dl = -1; dl <= 1; dl++) {
      for (let dc = -1; dc <= 1; dc++) {
        const l = linha + dl;
        const c = coluna + dc;
        if ((dl !== 0 || dc !== 0) && this.dentroDoTabuleiro(l, c)) lista.push([l, c]);
      }
    }
    return lista;
  }

  calcularVizinhas() {
    for (let linha = 0; linha < LINHAS; linha++) {
      for (let coluna = 0; coluna < COLUNAS; coluna++) {
        this.tabuleiro[linha][coluna].vizinhas = this.vizinhos(linha, coluna)
          .filter(([l, c]) => this.tabuleiro[l][c].bomba).length;
      }
    }
  }

  revelar(linha, coluna) {
    this.validarJogoEmAndamento();
    this.validarPosicao(linha, coluna);
    if (!this.bombasPosicionadas) this.sortearBombas(linha, coluna);

    const casa = this.tabuleiro[linha][coluna];
    if (casa.revelada || casa.bandeira) return;

    if (casa.bomba) {
      casa.revelada = true;
      this.estado = 'derrota';
      this.revelarTodasAsBombas();
      return;
    }

    this.abrirArea(linha, coluna);
    if (this.reveladas === LINHAS * COLUNAS - TOTAL_BOMBAS) {
      this.estado = 'vitoria';
    }
  }

  // Revela a casa; se ela não tiver bombas vizinhas, abre as vizinhas em cascata
  abrirArea(linha, coluna) {
    const pilha = [[linha, coluna]];
    while (pilha.length > 0) {
      const [l, c] = pilha.pop();
      const casa = this.tabuleiro[l][c];
      if (casa.revelada || casa.bandeira) continue;
      casa.revelada = true;
      this.reveladas++;
      if (casa.vizinhas === 0) pilha.push(...this.vizinhos(l, c));
    }
  }

  revelarTodasAsBombas() {
    this.tabuleiro.flat().filter((casa) => casa.bomba).forEach((casa) => { casa.revelada = true; });
  }

  alternarBandeira(linha, coluna) {
    this.validarJogoEmAndamento();
    this.validarPosicao(linha, coluna);
    const casa = this.tabuleiro[linha][coluna];
    if (casa.revelada) throw new Error('Não é possível marcar uma casa já revelada');
    casa.bandeira = !casa.bandeira;
    this.bandeiras += casa.bandeira ? 1 : -1;
  }

  // Contador exibido no jogo: bombas menos bandeiras colocadas (pode ficar negativo)
  get bombasRestantes() {
    return TOTAL_BOMBAS - this.bandeiras;
  }

  // Como a casa aparece para o jogador: '#' fechada, 'F' bandeira, '*' bomba, ou o número de bombas vizinhas
  exibir(linha, coluna) {
    this.validarPosicao(linha, coluna);
    const casa = this.tabuleiro[linha][coluna];
    if (!casa.revelada) return casa.bandeira ? 'F' : '#';
    return casa.bomba ? '*' : casa.vizinhas;
  }

  dentroDoTabuleiro(linha, coluna) {
    return linha >= 0 && linha < LINHAS && coluna >= 0 && coluna < COLUNAS;
  }

  validarPosicao(linha, coluna) {
    if (!this.dentroDoTabuleiro(linha, coluna)) throw new Error('Posição fora do tabuleiro');
  }

  validarJogoEmAndamento() {
    if (this.estado !== 'jogando') throw new Error('O jogo já terminou');
  }
}

module.exports = { CampoMinado, COLUNAS, LINHAS, TOTAL_BOMBAS };