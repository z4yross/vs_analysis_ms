import { Test, TestingModule } from '@nestjs/testing';
import { CityZoneController } from './city_zone.controller';

describe('CityZoneController', () => {
  let controller: CityZoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityZoneController],
    }).compile();

    controller = module.get<CityZoneController>(CityZoneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
