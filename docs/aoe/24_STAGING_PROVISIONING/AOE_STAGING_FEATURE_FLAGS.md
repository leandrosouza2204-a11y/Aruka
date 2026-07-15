# AOE Staging Feature Flags

Required names for staging runtime validation:

- `AOE_ENABLED`
- `AOE_PILOT_ENABLED`
- `AOE_DECISION_WRITE_ENABLED`
- `AOE_HUMAN_REVIEW_ENABLED`
- `AOE_TRACE_READ_ENABLED`
- `AOE_INFRA_TEST_ENV`

For technical staging validation, each AOE feature flag should be set to `true` and `AOE_INFRA_TEST_ENV` should be `staging`.

Reports list presence only, never secret values.
