import { Injectable, signal, inject } from '@angular/core';
import { TranslationService } from './translation.service';

export interface KnowledgeChunk {
  id: string;
  tags: string[];
  content: string;
  source?: {
    name: string;
    page: number;
    url: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NaveenAiEngineService {
  private ts = inject(TranslationService);
  private contextMemory = signal<string>('');

  private baseKnowledgeBase: KnowledgeChunk[] = [
    {
      id: 'who_is_naveen',
      tags: ['who', 'naveen', 'singh', 'profile', 'summary', 'identity', 'about'],
      content: '',
      source: { name: 'Technical_Dossier_2026.pdf', page: 1, url: 'Naveen_Singh_Resume_Full.pdf' }
    },
    {
      id: 'experience_years',
      tags: ['years', 'experience', 'total', 'how', 'long', 'history', 'duration'],
      content: '',
      source: { name: 'Technical_Dossier_2026.pdf', page: 1, url: 'Naveen_Singh_Resume_Full.pdf' }
    },
    {
      id: 'current_company',
      tags: ['current', 'company', 'now', 'working', 'primus', 'present', 'today', 'where'],
      content: '',
      source: { name: 'Technical_Dossier_2026.pdf', page: 2, url: 'Naveen_Singh_Resume_Full.pdf' }
    },
    {
      id: 'last_company',
      tags: ['last', 'previous', 'before', 'cartel', 'history', 'past', 'company'],
      content: '',
      source: { name: 'Technical_Dossier_2026.pdf', page: 3, url: 'Naveen_Singh_Resume_Full.pdf' }
    },
    {
      id: 'skills_summary',
      tags: ['skills', 'tech', 'stack', 'mastery', 'expertise', 'know', 'can', 'do', 'angular', 'ai'],
      content: '',
      source: { name: 'Technical_Dossier_2026.pdf', page: 1, url: 'Naveen_Singh_Resume_Full.pdf' }
    },
    {
      id: 'angular_core',
      tags: ['angular', 'v19', 'signals', 'zoneless', 'defer', 'internals', 'ivy', 'framework', 'architecture'],
      content: '',
      source: { name: 'Angular_Architecture_Spec.pdf', page: 4, url: 'Naveen_Singh_Resume_Full.pdf' }
    },
    {
      id: 'digigo_platform',
      tags: ['digigo', 'banking', 'platform', '50m', 'regression', 'migration', 'v6', 'v19', 'project', 'work'],
      content: '',
      source: { name: 'Banking_Core_CaseStudy.pdf', page: 2, url: 'Naveen_Singh_Resume_Full.pdf' }
    },
    {
      id: 'rag_idp',
      tags: ['rag', 'ai', 'idp', 'generative', 'llm', 'faiss', 'langchain', 'hallucination', 'compliance', 'project'],
      content: '',
      source: { name: 'GenAI_Implementation_v2.pdf', page: 12, url: 'Naveen_Singh_Resume_Full.pdf' }
    },
    {
      id: 'gitmind_engine',
      tags: ['gitmind', 'code', 'review', 'agent', 'langgraph', 'cost', 'reduction', 'multi-agent'],
      content: '',
      source: { name: 'Agentic_DevOps_Spec.pdf', page: 1, url: 'Naveen_Singh_Resume_Full.pdf' }
    },
    {
      id: 'leadership_metrics',
      tags: ['leadership', 'lead', 'team', 'engineers', 'attrition', 'mentorship', 'squad', 'growth'],
      content: '',
      source: { name: 'Leadership_Dossier.pdf', page: 1, url: 'Naveen_Singh_Resume_Full.pdf' }
    },
    {
      id: 'performance_record',
      tags: ['performance', 'optimization', 'load', 'time', 'reduction', 'micro-frontend', 'mfe'],
      content: '',
      source: { name: 'Performance_Benchmarks.pdf', page: 3, url: 'Naveen_Singh_Resume_Full.pdf' }
    }
  ];

  private stopWords = new Set(['what', 'is', 'the', 'tell', 'me', 'about', 'how', 'do', 'you', 'a', 'an', 'and', 'or', 'can', 'i', 'to', 'for', 'in', 'on', 'with', 'are', 'his', 'have', 'was', 'your']);

  async queryEngine(userInput: string): Promise<{ processLog: string[], answer: string, sources: any[] }> {
    const processLog: string[] = [];
    const sources: any[] = [];
    
    const aiKnowledge = this.ts.translate('naveen_ai.ai_knowledge') as any;
    const processLogTemplates = aiKnowledge.process_log || {};
    
    const logReceiving = (processLogTemplates.receiving || '[System] Receiving query: "{userInput}"').replace('{userInput}', userInput);
    processLog.push(logReceiving);
    await this.delay(200);
    
    // 1. Intent Parsing & Tokenization
    let tokens = userInput.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ')
      .filter(t => t.length > 1 && !this.stopWords.has(t));
      
    // Handle specific intent keywords
    if (userInput.toLowerCase().includes('who')) tokens.push('who', 'naveen', 'profile');
    if (userInput.toLowerCase().includes('skill') || userInput.toLowerCase().includes('tech')) tokens.push('skills');
    if (userInput.toLowerCase().includes('year')) tokens.push('years', 'experience');
    if (userInput.toLowerCase().includes('work') || userInput.toLowerCase().includes('company')) tokens.push('company', 'current', 'last');
    if (userInput.toLowerCase().includes('project')) tokens.push('project');

    if (tokens.length <= 2 && this.contextMemory()) {
      tokens.push(this.contextMemory());
    }

    const uniqueTokens = [...new Set(tokens)];
    const logExtracting = (processLogTemplates.extracting || '[NLP] Extracted keywords: [{uniqueTokens}]').replace('{uniqueTokens}', uniqueTokens.join(', '));
    processLog.push(logExtracting);
    await this.delay(300);

    // 2. Vector Search Simulation
    processLog.push(processLogTemplates.searching || `[FAISS] Searching vector space (IVF-PQ compressed)...`);
    
    // Merge translated content into knowledge base
    const translatedChunks = aiKnowledge.chunks || [];
    const currentKnowledgeBase = this.baseKnowledgeBase.map(baseChunk => {
      const match = translatedChunks.find((tc: any) => tc.id === baseChunk.id);
      return {
        ...baseChunk,
        content: match ? match.content : baseChunk.content
      };
    });

    const scoredChunks = currentKnowledgeBase.map(chunk => {
      let score = 0;
      uniqueTokens.forEach(token => {
        if (chunk.tags.includes(token)) score += 5;
        if (chunk.content.toLowerCase().includes(token)) score += 1;
      });
      return { ...chunk, score };
    }).filter(c => c.score > 0).sort((a, b) => b.score - a.score);

    // 3. Generation
    const logReranking = (processLogTemplates.reranking || '[LLM] Reranking {count} relevant chunks...').replace('{count}', scoredChunks.length.toString());
    processLog.push(logReranking);
    await this.delay(300);

    let answer = '';
    if (scoredChunks.length > 0) {
      const topMatch = scoredChunks[0];
      this.contextMemory.set(topMatch.tags[0]);
      const logSynthesizing = (processLogTemplates.synthesizing || '[LLM] Synthesizing response from chunk: {id}').replace('{id}', topMatch.id);
      processLog.push(logSynthesizing);
      answer = topMatch.content;
      if (topMatch.source) sources.push(topMatch.source);
      
      if (scoredChunks.length > 1 && scoredChunks[1].score >= 3) {
         if (scoredChunks[1].id !== topMatch.id) {
           answer += `<br><br>` + scoredChunks[1].content;
           if (scoredChunks[1].source) sources.push(scoredChunks[1].source);
         }
      }
    } else {
      processLog.push(processLogTemplates.no_context || `[LLM] No grounded context found. Fallback.`);
      answer = aiKnowledge.fallback || `I don't have a specific answer for that, but I can tell you about Naveen's <strong>9+ years of experience</strong>, his current leadership at <strong>Primus Software</strong>, or his <strong>Angular 21 mastery</strong>. What interests you?`;
    }

    await this.delay(200);
    // Remove duplicate sources
    const uniqueSources = Array.from(new Set(sources.map(s => JSON.stringify(s)))).map(s => JSON.parse(s));
    return { processLog, answer, sources: uniqueSources };
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
