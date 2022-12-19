import { Test, TestingModule } from '@nestjs/testing';
import { GeneService } from './gene.service';

describe('GeneService', () => {
  let service: GeneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneService],
    }).compile();

    service = module.get<GeneService>(GeneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
