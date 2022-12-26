import { Test, TestingModule } from '@nestjs/testing';
import { AssemblyBaseService } from './assembly_base.service';

describe('AssemblyBaseService', () => {
  let service: AssemblyBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssemblyBaseService],
    }).compile();

    service = module.get<AssemblyBaseService>(AssemblyBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
