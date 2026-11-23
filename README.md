# desafio_teste_campo_minado

Casos de teste em **JavaScript (Jest)** para o **Campo Minado com tabuleiro 18 x 14 e 40 bombas**, testando uma implementação também em JavaScript.

## Colaboradores

- NOME: MARIA EDUARDA FURLAN SCOMPARIN
RA: 24021296-2
GitHub: https://github.com/duudafs

Desafio proposto por: Laura.

## Especificação do desafio

- Casos de teste para testar **campo minado** de tabuleiro **18 x 14** com **40 bombas**.
- Casos de teste em **JavaScript** para testar **JavaScript**.

O tabuleiro tem **18 colunas por 14 linhas** (252 casas). As linhas vão de 0 a 13 e as colunas de 0 a 17. Com 40 bombas, sobram **212 casas seguras**.

## Regras de negócio (RN)

| RN | Regra | Descrição | Casos de teste |
|---|---|---|---|
| RN01 | Tabuleiro | O tabuleiro tem 18 colunas e 14 linhas (252 casas). No início, todas as casas estão fechadas e o jogo está em andamento | CT01, CT02 |
| RN02 | Bombas | O tabuleiro tem exatamente 40 bombas, cada uma em uma casa diferente e dentro do tabuleiro | CT03, CT04, CT05, CT06 |
| RN03 | Primeiro clique seguro | As bombas são sorteadas só no primeiro clique, e nunca ficam na casa clicada nem nas vizinhas dela. Assim, o primeiro clique sempre abre uma área | CT07, CT08, CT09 |
| RN04 | Bombas vizinhas | Cada casa sem bomba mostra quantas bombas existem nas casas vizinhas (de 0 a 8). Nos cantos há 3 vizinhas e nas bordas, 5 | CT10, CT11, CT12, CT13, CT14 |
| RN05 | Revelar casa | Revelar uma casa com bombas vizinhas mostra só o número dela. Revelar uma casa já aberta não altera o jogo | CT15, CT16 |
| RN06 | Abertura em cascata | Revelar uma casa sem bombas vizinhas (0) abre automaticamente as vizinhas, repetindo enquanto houver casas com 0. A cascata para nas casas com número e não abre casas com bandeira | CT17, CT18, CT19 |
| RN07 | Bandeira | O jogador pode marcar e desmarcar bandeira em casas fechadas. Casa com bandeira não é revelada ao clicar. Não é possível marcar casa já revelada | CT20, CT21, CT22 |
| RN08 | Contador de bombas | O contador começa em 40 e mostra bombas menos bandeiras colocadas. Pode ficar negativo se houver bandeiras demais | CT23, CT24, CT25 |
| RN09 | Derrota | Revelar uma casa com bomba encerra o jogo com derrota, e todas as bombas são mostradas | CT26, CT27 |
| RN10 | Vitória | O jogador vence ao revelar todas as 212 casas sem bomba. Não é necessário marcar as bombas com bandeira | CT28, CT29, CT30 |
| RN11 | Fim de jogo | Depois da vitória ou da derrota, não é possível revelar nem marcar casas | CT31, CT32 |
| RN12 | Posições válidas | Só são aceitas posições dentro do tabuleiro (linhas 0 a 13, colunas 0 a 17) | CT33, CT34, CT35 |

## Estrutura

```
desafio_teste_campo_minado/
├── src/
│   └── campoMinado.js         # implementação do jogo
├── tests/
│   └── campoMinado.test.js    # casos de teste (Jest)
├── package.json
└── README.md
```

## Como executar

```
npm install
npm test
```

Com relatório de cobertura:

```
npm run test:coverage
```

O `package.json` exige **100% de cobertura** (linhas, branches, funções e instruções). Se a cobertura cair, o comando falha.

## Casos de teste

Cada caso de teste indica a regra de negócio (RN) que ele verifica. O mesmo código aparece no nome do teste, por exemplo `CT10 [RN04] - casa cercada por 8 bombas mostra 8`.

Na maioria dos testes, as 40 bombas são colocadas em posições conhecidas, para que o resultado seja sempre o mesmo. O tabuleiro padrão dos testes tem as bombas nas linhas 12 e 13 inteiras e nas 4 primeiras casas da linha 11. Os testes do primeiro clique (RN03) usam o sorteio real, e o CT08 repete o sorteio 50 vezes.

O valor de cada casa é consultado com `exibir(linha, coluna)`: `#` para casa fechada, `F` para bandeira, `*` para bomba revelada ou o número de bombas vizinhas.

### Tabuleiro e bombas

| CT | RN | Verificação |
|---|---|---|
| CT01 | RN01 | O tabuleiro tem 18 colunas e 14 linhas (252 casas) |
| CT02 | RN01 | No início todas as casas estão fechadas e o jogo está em andamento |
| CT03 | RN02 | O tabuleiro tem exatamente 40 bombas |
| CT04 | RN02 | Não aceita quantidade de bombas diferente de 40 |
| CT05 | RN02 | Não aceita duas bombas na mesma casa |
| CT06 | RN02 | Não aceita bomba fora do tabuleiro |

### Primeiro clique

| CT | RN | Verificação |
|---|---|---|
| CT07 | RN03 | As bombas só são sorteadas no primeiro clique |
| CT08 | RN03 | O primeiro clique nunca é bomba, nem as casas vizinhas a ele (50 sorteios) |
| CT09 | RN03 | O primeiro clique sempre abre uma área (a casa clicada vale 0) |

### Bombas vizinhas

| CT | RN | Verificação |
|---|---|---|
| CT10 | RN04 | Casa cercada por 8 bombas mostra 8 |
| CT11 | RN04 | Casa sem bombas vizinhas mostra 0 |
| CT12 | RN04 | No canto, só as 3 casas vizinhas existentes são contadas |
| CT13 | RN04 | Na borda, só as 5 casas vizinhas existentes são contadas |
| CT14 | RN04 | Casa no meio do tabuleiro tem 8 vizinhas |

### Revelar e abertura em cascata

| CT | RN | Verificação |
|---|---|---|
| CT15 | RN05 | Casa com bombas vizinhas revela só ela mesma e mostra o número |
| CT16 | RN05 | Revelar uma casa já revelada não muda nada |
| CT17 | RN06 | Casa sem bombas vizinhas abre as vizinhas automaticamente |
| CT18 | RN06 | A cascata para nas casas com número |
| CT19 | RN06 | A cascata não abre casas marcadas com bandeira |

### Bandeira e contador

| CT | RN | Verificação |
|---|---|---|
| CT20 | RN07 | Marcar e desmarcar bandeira em uma casa fechada |
| CT21 | RN07 | Casa com bandeira não é revelada ao clicar |
| CT22 | RN07 | Não é possível colocar bandeira em casa já revelada |
| CT23 | RN08 | O contador começa em 40 |
| CT24 | RN08 | Cada bandeira diminui o contador, e desmarcar aumenta de novo |
| CT25 | RN08 | O contador fica negativo se houver mais bandeiras que bombas |

### Derrota, vitória e fim de jogo

| CT | RN | Verificação |
|---|---|---|
| CT26 | RN09 | Revelar uma bomba encerra o jogo com derrota |
| CT27 | RN09 | Na derrota, todas as 40 bombas são mostradas |
| CT28 | RN10 | Revelar todas as 212 casas sem bomba dá vitória |
| CT29 | RN10 | Não há vitória enquanto faltar alguma casa sem bomba |
| CT30 | RN10 | Não é preciso marcar as bombas com bandeira para vencer |
| CT31 | RN11 | Após a derrota não é possível revelar nem marcar casas |
| CT32 | RN11 | Após a vitória não é possível continuar jogando |

### Posições válidas

| CT | RN | Verificação |
|---|---|---|
| CT33 | RN12 | Não é possível revelar fora do tabuleiro |
| CT34 | RN12 | Não é possível marcar ou consultar fora do tabuleiro |
| CT35 | RN12 | As casas dos cantos (0,0) e (13,17) são válidas |

## Resultado

```
Tests:       35 passed, 35 total

File            | % Stmts | % Branch | % Funcs | % Lines
campoMinado.js  |     100 |      100 |     100 |     100
```