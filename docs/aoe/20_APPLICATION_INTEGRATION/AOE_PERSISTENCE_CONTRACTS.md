# AOE Persistence Contracts

Ports definidos:

- DecisionRepository.
- DecisionTraceRepository.
- HumanReviewRepository.
- IdempotencyRepository.
- UnitOfWork.

Adaptadores em memória são determinísticos, isolados por instância e usam cópias defensivas. Não há banco real nesta versão.
