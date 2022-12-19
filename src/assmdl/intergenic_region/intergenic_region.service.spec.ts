import { Test, TestingModule } from '@nestjs/testing';
import { IntergenicRegionService } from './intergenic_region.service';

describe('IntergenicRegionService', () => {
  let service: IntergenicRegionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntergenicRegionService],
    }).compile();

    service = module.get<IntergenicRegionService>(IntergenicRegionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
