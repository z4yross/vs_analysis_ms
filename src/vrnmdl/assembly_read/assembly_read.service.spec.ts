import { Test, TestingModule } from '@nestjs/testing';
import { AssemblyReadService } from './assembly_read.service';

describe('AssemblyReadService', () => {
  let service: AssemblyReadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssemblyReadService],
    }).compile();

    service = module.get<AssemblyReadService>(AssemblyReadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
