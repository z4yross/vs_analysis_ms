import { Test, TestingModule } from '@nestjs/testing';
import { UtrService } from './utr.service';

describe('UtrService', () => {
  let service: UtrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtrService],
    }).compile();

    service = module.get<UtrService>(UtrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
