export interface IClayfulCustomer {
  /**
   * 회원가입
   */
  createMe(payload: { email: string; password: string });

  /**
   * 로그인
   */
  authenticate(payload: { email: string; password: string }): {
    status: number;
    data: {
      /**
       * 고유 아이디
       */
      customer: string;
      /**
       * 토큰
       */
      token: string;
      /**
       * 토큰 유효 기한
       */
      expiresIn: number;
    };
  };

  /**
   * 소셜 회원가입/로그인
   */
  authenticateBy3rdParty(
    platform: string,
    payload: { token: string }
  ): {
    status: number;
    data: {
      /**
       * 회원가입:register, 로그인:login
       */
      action: "register" | "login";
      /**
       * 고유 아이디
       */
      customer: string;
      /**
       * 클레이풀 토큰
       */
      token: string;
      /**
       * 토큰 유효 기한
       */
      expiresIn: number;
    };
  };

  /**
   * 이메일 인증 이메일 전송
   */
  requestVerificationEmail(payload: {
    email: string;
    expiresIn: number;
    scope: "verification";
  }): void;

  /**
   * 이메일 인증
   */
  verify(
    customerId: string,
    payload: { secret: string }
  ): {
    status: number;
    data: {
      verified: true;
    };
  };
}
