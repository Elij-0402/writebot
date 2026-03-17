# Provider Setup

## Supported Input Shape

- Provider Profile 名称
- Adapter 类型
- Protocol (`chat`, `completions`, `responses`)
- Base URL
- API Key
- 模型名称

## OpenAI-Compatible Example

- profile name: `openai-compatible-local`
- base URL: `http://localhost:11434/v1`
- protocol: `responses`

## Validation Rules

- Base URL is required for `openai-compatible`
- Protocol must be one of `chat`, `completions`, or `responses`
- API key and model are required before save
