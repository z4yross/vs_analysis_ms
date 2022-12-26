import { Test, TestingModule } from '@nestjs/testing';
import { HumanVariantService } from './human_variant.service';

describe('HumanVariantService', () => {
  let service: HumanVariantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HumanVariantService],
    }).compile();

    service = module.get<HumanVariantService>(HumanVariantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
