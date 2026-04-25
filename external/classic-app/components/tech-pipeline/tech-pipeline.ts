import { Component } from '@angular/core';

@Component({
  selector: 'app-tech-pipeline',
  standalone: true,
  imports: [],
  templateUrl: './tech-pipeline.html',
  styleUrl: './tech-pipeline.css',
})
export class TechPipeline {
  activeStep = 0;
  steps = [
    {
      title: '📄 Document Ingestion Pipeline',
      body: 'PDF/DOCX/HTML parsing with pypdf2 + unstructured.io. Semantic chunking using sentence transformers to detect topic boundaries (not naive token splitting). Each chunk enriched with document metadata — source, version, compliance tags, effective date. Chunking strategy tuned per document type: regulatory text uses smaller chunks (256 tokens), reference manuals use larger (512 tokens) for better context preservation.',
      tags: ['pypdf2', 'unstructured.io', 'Semantic Chunking', 'Metadata Tagging', 'Document Versioning']
    },
    {
      title: '🔢 High-Dimensional Embedding',
      body: 'Dense vector representation using OpenAI text-embedding-3-small or BGE-M3 models. Dimensionality reduction and quantization (IVF-PQ) via FAISS to maintain sub-100ms retrieval on 100k+ chunks. Multi-vector indexing for complex tables and images within documents using CLIP.',
      tags: ['OpenAI BGE', 'FAISS IVF-PQ', 'CLIP', 'Dimensionality Reduction']
    },
    {
      title: '🔍 Hybrid Retrieval Layer',
      body: 'Two-stage retrieval: Initial search combines semantic similarity (FAISS) with keyword matching (BM25) to catch specific regulatory terms. Second-stage reranking using Cross-Encoders (Cohere/BGE-Reranker) to ensure the top 5 chunks are truly relevant to the user query before passing to the LLM.',
      tags: ['BM25', 'Cross-Encoders', 'Semantic Search', 'Reranking']
    },
    {
      title: '🛡 Hallucination Guardrails',
      body: '5-layer mitigation pipeline: 1. Prompt Injection Filter. 2. Self-Consistency checking (3 parallel outputs). 3. Source Grounding (verifying LLM claims against retrieved chunks). 4. Confidence Scoring (LLM-as-Judge). 5. Human-in-the-Loop review queue for low-confidence outputs.',
      tags: ['Self-Consistency', 'Source Grounding', 'HITL', 'LLM-as-Judge']
    },
    {
      title: '💬 Generative Response',
      body: 'Final response generation with strict source attribution (Citations). SSE (Server-Sent Events) token streaming for near-zero perceived latency. Multi-turn context management with summarized history to stay within token budgets while maintaining deep conversation coherence.',
      tags: ['SSE Streaming', 'Citations', 'Context Window Mgmt', 'Audit Trail']
    }
  ];

  setStep(index: number) {
    this.activeStep = index;
    const steps = document.querySelectorAll('.rag-step');
    steps.forEach((s, i) => {
      if (i === index) s.classList.add('active');
      else s.classList.remove('active');
    });
  }
}
