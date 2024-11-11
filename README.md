# Gen AI In Node.js

## AI Models

- Mathematical representations that simulate real-world patterns
- Composed of algorithms that:
  - Train on large datasets
  - Learn to recognize patterns
  - Generate predictions or outputs for new data
- Large Language Models (LLMs):
  - Specialized in processing and generating human language
  - Examples: GPT-4, Claude, LLaMA
- OpenAI Models:
  - GPT-4: Most capable, best for complex tasks
  - GPT-3.5: Good balance of performance and cost
  - DALL-E: Specialized in image generation
- Context window: Maximum input length a model can process at once
  - GPT-4: Up to 32k tokens
  - GPT-3.5: Up to 16k tokens
- Hugging Face: Platform hosting thousands of open-source models
  - Text, image, audio, and multi-modal models
  - Popular for research and smaller applications

## Tokens

- Unit of text processing in LLMs
- Used for:
  - Billing calculation by AI providers
  - Measuring model input/output capacity
- Tokenization process:
  - Text is split into smaller units (tokens)
  - Each token is converted to a numerical value
  - Roughly 1 token = 4 characters in English
  - Special characters and other languages may use more tokens

## OpenAI Chat API Parameters

- Temperature (0-2):
  - Controls randomness in model outputs
  - 0: Focused, deterministic responses
  - 1: Balanced creativity and coherence
  - 2: Maximum creativity, more random
- Top P (0-1):
  - Alternative to temperature
  - Controls diversity of word choices
  - Lower values = more focused responses
- Max Tokens:
  - Limits length of model's response
  - Helps control costs and response size
- n:
  - Number of alternative completions to generate
  - Higher values provide multiple response options
  - Default is 1, max is typically 128
- Frequency Penalty (-2 to 2):
  - Reduces likelihood of repeating words
  - Helps avoid redundant language
- Presence Penalty (-2 to 2):
  - Reduces likelihood of repeating topics
  - Helps avoid repetitive themes
- Seed:
  - Integer value for deterministic outputs
  - Same seed + parameters = same response
  - Useful for:
    - Testing and debugging
    - Reproducible results
    - Consistent user experiences
