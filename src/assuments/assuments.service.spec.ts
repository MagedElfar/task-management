import { Test, TestingModule } from '@nestjs/testing';
import { AssumentsService } from './assuments.service';

describe('AssumentsService', () => {
  let service: AssumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssumentsService],
    }).compile();

    service = module.get<AssumentsService>(AssumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
