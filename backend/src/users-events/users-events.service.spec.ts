import { Test, TestingModule } from '@nestjs/testing';
import { UsersEventsService } from './users-events.service';

describe('UsersEventsService', () => {
  let service: UsersEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersEventsService],
    }).compile();

    service = module.get<UsersEventsService>(UsersEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
