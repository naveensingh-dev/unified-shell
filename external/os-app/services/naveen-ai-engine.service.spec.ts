import { TestBed } from '@angular/core/testing';
import { NaveenAiEngineService } from './naveen-ai-engine.service';
import { TranslationService } from './translation.service';

describe('NaveenAiEngineService', () => {
  let service: NaveenAiEngineService;
  let translationServiceSpy: jasmine.SpyObj<TranslationService>;

  const mockAiKnowledge = {
    chunks: [
      {
        id: 'who_is_naveen',
        content: 'Naveen is an Angular Architect.'
      }
    ],
    fallback: 'I dont know about that.',
    process_log: {
      receiving: 'Receiving: {userInput}',
      extracting: 'Extracting: {uniqueTokens}',
      searching: 'Searching...',
      reranking: 'Reranking {count} chunks...',
      synthesizing: 'Synthesizing: {id}'
    }
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TranslationService', ['translate']);
    spy.translate.and.returnValue(mockAiKnowledge);

    TestBed.configureTestingModule({
      providers: [
        NaveenAiEngineService,
        { provide: TranslationService, useValue: spy }
      ]
    });
    service = TestBed.inject(NaveenAiEngineService);
    translationServiceSpy = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return answer for matching query', async () => {
    const result = await service.queryEngine('Who is Naveen?');
    expect(result.answer).toContain('Angular Architect');
    expect(result.processLog.length).toBeGreaterThan(0);
  });

  it('should return fallback if no match found', async () => {
    // Override mock to return no chunks for this test if needed, 
    // but here we just test mismatch
    const result = await service.queryEngine('Tell me a joke');
    expect(result.answer).toBe(mockAiKnowledge.fallback);
  });
});
