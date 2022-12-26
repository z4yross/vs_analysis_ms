import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceBaseService } from './reference_base.service';

describe('ReferenceBaseService', () => {
  let service: ReferenceBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferenceBaseService],
    }).compile();

    service = module.get<ReferenceBaseService>(ReferenceBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
