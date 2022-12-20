import { Test, TestingModule } from '@nestjs/testing';
import { VirusService } from './virus.service';

describe('VirusService', () => {
  let service: VirusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VirusService],
    }).compile();

    service = module.get<VirusService>(VirusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
