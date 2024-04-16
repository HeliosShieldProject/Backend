import { PrismaService } from "@/data/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe("generateTokens", () => {
    it("should return an object with accessToken and refreshToken", async () => {
      const userId = "userId";
      const deviceId = "deviceId";

      const result = await service.generateTokens(userId, deviceId);

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");

      const decodedAccessToken = jwtService.decode(result.accessToken);
      const decodedRefreshToken = jwtService.decode(result.refreshToken);

      expect(decodedAccessToken).toHaveProperty("userId", userId);
      expect(decodedAccessToken).toHaveProperty("deviceId", deviceId);
      expect(decodedAccessToken.userId).toBe(userId);
      expect(decodedAccessToken.deviceId).toBe(deviceId);

      expect(decodedRefreshToken).toHaveProperty("userId", userId);
      expect(decodedRefreshToken).toHaveProperty("deviceId", deviceId);
      expect(decodedRefreshToken.userId).toBe(userId);
      expect(decodedRefreshToken.deviceId).toBe(deviceId);
    });
  });
});
