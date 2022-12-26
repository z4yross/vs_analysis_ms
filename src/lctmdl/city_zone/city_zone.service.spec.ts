import { Test, TestingModule } from '@nestjs/testing';
import { CityZoneService } from './city_zone.service';

describe('CityZoneService', () => {
  let service: CityZoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CityZoneService],
    }).compile();

    service = module.get<CityZoneService>(CityZoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
