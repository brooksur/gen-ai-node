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

## OpenAI Tools

- Function calling capability for AI models
  - Allows models to interact with external functions
  - Enables real-time data access and modifications
  - Supports complex workflows and automation
- Common use cases:
  - Real-time data retrieval (weather, time, stocks)
  - Database operations (query, update, delete)
  - API interactions
  - File system operations
  - External service integration
- Implementation components:
  - Function definitions: JSON schema describing available tools
  - Function parameters: Input requirements for each tool
  - Return values: Expected output format
- Supported models:
  - GPT-4 and GPT-4 Turbo
  - GPT-3.5 Turbo
  - Claude (via Anthropic)
- Benefits:
  - Enhanced AI capabilities beyond training data
  - Real-world interaction and data manipulation
  - Automated decision-making and actions
  - Customizable tool integration
- Best practices:
  - Clear function documentation
  - Input validation and error handling
  - Rate limiting for external services
  - Security considerations for sensitive operations
  - Logging and monitoring of tool usage

## Images

- DALL-E API capabilities:
  - Image generation from text prompts
  - Image variations from existing images
  - Image editing with masks and prompts
- Key parameters:
  - model: DALL-E version (e.g., 'dall-e-2')
  - size: Output dimensions (e.g., '1024x1024')
  - style: Image style ('natural' or 'vivid')
  - n: Number of images to generate
  - response_format: Output format ('url' or 'b64_json')
- Common operations:
  - Generate new images from text descriptions
  - Create variations of existing images
  - Edit images using masks and prompts
  - Save and manage image outputs
- Implementation considerations:
  - Base64 encoding for image data
  - File system operations for saving images
  - Error handling for failed generations
  - Input validation for image files
- Best practices:
  - Store API key securely in environment variables
  - Handle large image files efficiently
  - Implement proper error handling
  - Use appropriate file formats (PNG recommended)
  - Validate input images and masks
- Cost considerations:
  - Pricing varies by image size
  - Different rates for generation vs editing
  - Multiple images increase costs linearly
  - Consider caching for repeated requests

## Audio and Speech

- OpenAI Audio API capabilities:
  - Text-to-Speech (TTS) generation
  - Speech-to-Text transcription
  - Audio translation to English
- Speech models and features:
  - TTS-1: Text-to-speech model
  - Whisper-1: Speech recognition model
  - Voice options: alloy, echo, fable, onyx, nova, shimmer
  - Multiple audio format support (mp3, opus, aac, flac)
- Key operations:
  - Generate speech from text input
  - Transcribe audio files to text
  - Translate foreign language audio to English text
  - Save and process audio files
- Implementation components:
  - File system operations for audio handling
  - Stream processing for large files
  - Buffer manipulation for audio data
  - Format conversion and storage
- Best practices:
  - Handle audio files efficiently
  - Validate input text and audio files
  - Implement proper error handling
  - Use appropriate audio formats
  - Consider file size limitations
- Cost considerations:
  - TTS pricing per character
  - Transcription/translation pricing per minute
  - Different rates for different models
  - Input length limitations

## Embeddings

- OpenAI Embeddings API capabilities:
  - Generate embeddings for text input
  - Support for multiple embedding models
  - Batch processing of text inputs
  - Semantic search and similarity matching
- Embedding models and features:
  - text-embedding-3-large: Latest text embedding model
  - text-embedding-3-small: Smaller, faster model
  - Legacy models: text-embedding-ada-002
  - Dimensionality options for different use cases
- Key operations:
  - Generate embeddings from text
  - Calculate similarity between embeddings
  - Perform semantic search
  - Store and query embedding vectors
- Implementation components:
  - Vector storage and indexing
  - Similarity calculation functions
  - Batch processing for efficiency
  - Embedding caching strategies
- Best practices:
  - Choose appropriate model for use case
  - Batch inputs when possible
  - Implement efficient vector storage
  - Consider dimensionality tradeoffs
  - Cache frequently used embeddings
- Cost considerations:
  - Pricing per 1K tokens
  - Different rates for different models
  - Batch processing more cost effective
  - Storage costs for embedding vectors

## Vectors

- Vector databases for AI applications:
  - Store and query high-dimensional embeddings
  - Enable semantic search and similarity matching
  - Examples: ChromaDB, Pinecone, Weaviate
- ChromaDB features:
  - Local and cloud deployment options
  - Built-in OpenAI embedding support
  - Collection-based organization
  - Efficient similarity search
- Key operations:
  - Create and manage collections
  - Add documents with embeddings
  - Query similar documents
  - Update and delete vectors
- Implementation components:
  - Embedding generation
  - Collection management
  - Query processing
  - Document storage
- Best practices:
  - Batch operations for efficiency
  - Index optimization
  - Proper error handling
  - Regular maintenance
  - Backup strategies
- Use cases:
  - Semantic search engines
  - Recommendation systems
  - Document similarity
  - Knowledge bases
  - Question answering systems

### Running ChromaDB with Docker

- Quick setup with Docker:
  - Pull official ChromaDB image:
    ```bash
    docker pull chromadb/chroma
    ```
  - Run container with persistent storage:
    ```bash
    docker run -d \
      -p 8000:8000 \
      -v $(pwd)/chroma_data:/chroma/chroma \
      chromadb/chroma
    ```
  - Container exposes port 8000 for API access

### Pinecone

- Cloud-based vector database service:
  - Serverless deployment options (AWS, GCP)
  - High-performance similarity search
  - Scalable vector storage
  - Real-time updates and queries
- Key features:
  - Index management with dimension specification
  - Namespace organization
  - Metadata storage with vectors
  - Cosine similarity metrics
  - Top-K nearest neighbor search
- Implementation components:
  - Index creation and configuration:
    ```typescript
    const pc = new Pinecone({
      name: 'index-name',
      dimension: 1536,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      }
    })
    ```
  - Vector operations:
    - Upsert vectors with metadata
    - Query vectors by similarity
    - Namespace management
    - Batch operations
- Best practices:
  - Use appropriate dimension size (1536 for OpenAI embeddings)
  - Include relevant metadata with vectors
  - Batch vector operations when possible
  - Implement proper error handling
  - Monitor API usage and costs
- Common use cases:
  - Semantic search applications
  - Document similarity matching
  - Recommendation systems
  - Knowledge base querying
  - AI-powered chatbots

## LangChain

- LangChain is a framework for building LLM based applications
- LangChain libraries:
  - Interface and integration for components
- Implement Abstractions:
  - Chains - chain commands
  - Agents - use an LLM to make decisions
- Agents:
  - Decide: identify decision path
  - Web: (Google, wiki, sport site)
  - Unstructured answer
  - LLM
