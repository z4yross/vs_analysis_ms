import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceContigService } from './reference_contig.service';

describe('ReferenceContigService', () => {
  let service: ReferenceContigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferenceContigService],
    }).compile();

    service = module.get<ReferenceContigService>(ReferenceContigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
