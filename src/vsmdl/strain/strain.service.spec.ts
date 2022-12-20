import { Test, TestingModule } from '@nestjs/testing';
import { StrainService } from './strain.service';

describe('StrainService', () => {
  let service: StrainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StrainService],
    }).compile();

    service = module.get<StrainService>(StrainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
