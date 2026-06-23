# processo-IA — tecnoaging-front

> Como aplicar **testes com IA, code review com IA e automação** neste repositório.
> Documento de orientação (o "como"). **Não contém código.** Task: [86e1tmk1q](https://app.clickup.com/t/86e1tmk1q).

## 1. Contexto do repo

- **Stack:** Next.js 15 + React 19 (App Router, TypeScript) · **Package manager:** npm.
- **Teste hoje:** Vitest 4 **configurado**, mas com **`environment: node`** e `include: src/utils/**`.
  **1 teste** na branch `test/ai-util-tests` (`src/utils/format.test.ts`).
- **Scripts:** `test`, `test:cov`, `lint` (`next lint`), `build` (`next build`), `dev`.
  **Não há `typecheck` dedicado.**
- **Cobertura:** provider v8, hoje só `src/utils/**`. Threshold-alvo do produto: **40%**.
- **CI:** **não há** `.github/workflows/`. Há Docker (compose/dev) para subir o app.
- **Riscos de config a documentar:** `next.config.js` usa `ignoreBuildErrors: true` e
  `ignoreDuringBuilds: true` → erros de tipo/lint são silenciados no build.

## 2. Testes unitários / de componente com IA

Framework: **Vitest**. Gerar via [`generate-tests`](https://github.com/lifesystemsufpr/ai-toolkit/blob/main/source/skills/generate-tests.md)
(AAA + adversarial, regra [`60-testing`](https://github.com/lifesystemsufpr/ai-toolkit/blob/main/source/rules/60-testing.md)).

**Alvos prioritários:**

| Prioridade | Alvo | Como testar |
|---|---|---|
| 1 | `src/utils/format.ts` | Iniciado — CPF, telefone (10/11 díg.), idade (aniversário não chegado), datas, gênero. |
| 2 (sensível) | `src/utils/analytics.ts` | **TUG/5TSTS** — ver guard-rail (§5). Testes de fronteira nas faixas etárias. |
| 3 | `src/services/*` (apiPerson, apiEvaluations, apiHealthUnit) | Mock do client HTTP; mapeamento de resposta, erro de rede. |
| 4 | `src/components/ui/*` e `src/components/form/*` | **Exige env jsdom** — ver nota abaixo. Render acessível + validação de formulário. |

> **Nota de config (documentar como passo, não fazer agora):** para testar componentes React, o Vitest
> precisa de **`environment: jsdom`** + `@testing-library/react`. Hoje o env é `node` e o `include`
> cobre só `utils`. Ampliar isso é um ajuste de **config de teste** (permitido), a ser feito em PR próprio.

**Validação de runtime (navegador) — ver [validacoes-automaticas.md](https://github.com/lifesystemsufpr/devops-hub/blob/main/docs/processo-ia/validacoes-automaticas.md):**
- **Camada 1 (gate e2e determinístico):** specs `@playwright/test` de login (NextAuth) + abrir cada home
  por papel + abrir um teste 5TSTS/30STS, no CI (bloqueiam merge).
- **Camada 2 (nav-check por LLM):** skill [`nav-check`](https://github.com/lifesystemsufpr/ai-toolkit/blob/main/source/skills/nav-check.md) sobe
  `next dev` (`http://localhost:3000`) e varre as rotas por papel: `(auth)/login`, `(admin)/*`,
  `(manager)/*`, `(researcher)/*`, `(tests)/5tsts/[id]`, `(tests)/30sts/[id]`, `/profile`.
- **POC ainda não feito aqui** — rodar a primeira varredura por papel e gerar o relatório p/ ClickUp.

## 3. Code review com IA

- [`review-pr`](https://github.com/lifesystemsufpr/ai-toolkit/blob/main/source/skills/review-pr.md) + regra
  [`75-code-review`](https://github.com/lifesystemsufpr/ai-toolkit/blob/main/source/rules/75-code-review.md): correção, acessibilidade,
  contrato com backend, e — específico daqui — sinalizar PRs que dependem do `ignoreBuildErrors`.
- **Revisão humana obrigatória:** mudanças em `src/utils/analytics.ts` (algoritmos de avaliação física)
  e em auth (NextAuth/middleware) → [`review-clinical-change`](https://github.com/lifesystemsufpr/ai-toolkit/blob/main/source/skills/review-clinical-change.md).

## 4. Automação / CI

- **Falta CI:** aplicar **`ci-node-frontend.yml`** via bootstrap (documentar; executar só com OK).
- Como **não há `typecheck`** e o build ignora erros, documentar a recomendação de **adicionar
  `"typecheck": "tsc --noEmit"`** para o CI ter um gate de tipos real (ajuste de config, em PR próprio).
- **Gate pré-PR local:** [`pre-pr-gate`](https://github.com/lifesystemsufpr/ai-toolkit/blob/main/source/skills/pre-pr-gate.md).

## 5. Guard-rails específicos (clínico)

- **`src/utils/analytics.ts` contém lógica clínica:** `classificarTempoPorIdade`, `calcularIndicadores`
  (potência/fadiga/simetria a partir de acelerômetro), `classificarDesempenhoGeral`, `calcularIdadeAnos`.
- As **tabelas normativas (TUG/5TSTS por faixa etária ± DP)** são dados de referência — **não alterar
  sem citação da fonte e validação**. Testes só **verificam** o comportamento existente (fronteira), não mudam fórmula.
- Dado de saúde/PII (CPF, sensores) nunca em fixture/log/URL.

## 6. Passo a passo "como fazer"

1. Completar `generate-tests` em `utils/format.ts` e demais utils puros.
2. `utils/analytics.ts`: só testes de fronteira nas faixas etárias; PR `area:clinical` → revisão humana.
3. Documentar/abrir PR de config para `environment: jsdom` + `@testing-library/react` (habilita testes de componente).
4. Testar `services/*` com client mockado.
5. Rodar `nav-check` por papel; relatório p/ ClickUp.
6. Documentar adição de `typecheck` e bootstrap do `ci-node-frontend` (com OK).
7. `pre-pr-gate` → PR → `review-pr`; **merge só com OK humano**.
