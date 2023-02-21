import { Test, TestingModule } from '@nestjs/testing';
import { AssumentsController } from './assuments.controller';

describe('AssumentsController', () => {
  let controller: AssumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssumentsController],
    }).compile();

    controller = module.get<AssumentsController>(AssumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
