import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceGenomeService } from './reference_genome.service';

describe('ReferenceGenomeService', () => {
  let service: ReferenceGenomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferenceGenomeService],
    }).compile();

    service = module.get<ReferenceGenomeService>(ReferenceGenomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
