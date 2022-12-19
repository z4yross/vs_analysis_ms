import { Test, TestingModule } from '@nestjs/testing';
import { ProteinService } from './protein.service';

describe('ProteinService', () => {
  let service: ProteinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProteinService],
    }).compile();

    service = module.get<ProteinService>(ProteinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
