import { authService } from '../services';

const authController = {
  async getEmailByToken(req, res, next) {
    const { token } = req.headers;

    const { email, isAdmin } = await authService.getUserEmailByToken(token);

    res.json({ email, isAdmin });
  },

  async userLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      const userToken = await authService.getUserToken(email, password);

      const isEmailValid = await authService.checkEmailValid(email);

      const isPasswordReset = await authService.checkPasswordReset(email);

      if (isEmailValid !== true) {
        res.json({ token: userToken, isEmailValid: false, isPasswordReset });

        return;
      }

      res.json({ token: userToken, isEmailValid, isPasswordReset });
    } catch (err) {
      next(err);
    }
  },

  async sendValidationEmail(req, res, next) {
    const { email } = req.headers;

    try {
      await authService.sendValidEmail(email);

      res.json({ result: 'success' });
    } catch (err) {
      next(err);
    }
  },

  async emailValidation(req, res, next) {
    try {
      const { email, inputCode } = req.body;

      const validCode = await authService.checkEmailValid(email);

      if (inputCode !== validCode) {
        throw new Error('인증 코드가 일치하지 않습니다.');
      }

      const result = await authService.makeEmailValid(email);

      if (result !== 'valid') {
        throw new Error('이메일 인증에 실패하였습니다.');
      }

      res.json({ result: 'success' });
    } catch (err) {
      next(err);
    }
  },

  async passwordReset(req, res, next) {
    try {
      const { email, koreanName } = req.body;

      const isPasswordReset = await authService.resetUserPassword(email, koreanName);

      if (!isPasswordReset) {
        throw new Error('비밀번호 초기화에 실패하였습니다.');
      }

      res.json({ result: 'sucess' });
    } catch (err) {
      next(err);
    }
  },

  async passwordCheck(req, res, next) {
    try {
      const { email } = req;

      const { password } = req.body;

      const { isPasswordCorrect } = await authService.checkPasswordAndAdmin(
        email,
        password
      );

      if (!isPasswordCorrect) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      res.json({ result: 'success' });
    } catch (err) {
      next(err);
    }
  },

  async userLogout(req, res, next) {
    try {
      if (req.email) {
        res.json({ result: 'success' });
      }
    } catch (err) {
      next(err);
    }
  },
};

export { authController };
