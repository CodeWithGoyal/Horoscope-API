const { signupSchema, loginSchema } = require('../validation/schemas');

describe('Validation Schemas', () => {
  describe('Signup Schema', () => {
    const validSignupData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      birthdate: '1990-01-01'
    };

    it('should validate correct signup data', () => {
      const { error, value } = signupSchema.validate(validSignupData);
      expect(error).toBeUndefined();
      expect(value.name).toBe(validSignupData.name);
      expect(value.email).toBe(validSignupData.email);
      expect(value.password).toBe(validSignupData.password);
      expect(value.birthdate).toBeInstanceOf(Date);
    });

    it('should reject missing name', () => {
      const dataWithoutName = { ...validSignupData };
      delete dataWithoutName.name;
      
      const { error } = signupSchema.validate(dataWithoutName);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('Name is required');
    });

    it('should reject short name', () => {
      const dataWithShortName = { ...validSignupData, name: 'A' };
      
      const { error } = signupSchema.validate(dataWithShortName);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('Name must be at least 2 characters long');
    });

    it('should reject long name', () => {
      const dataWithLongName = { ...validSignupData, name: 'A'.repeat(51) };
      
      const { error } = signupSchema.validate(dataWithLongName);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('Name must not exceed 50 characters');
    });

    it('should reject missing email', () => {
      const dataWithoutEmail = { ...validSignupData };
      delete dataWithoutEmail.email;
      
      const { error } = signupSchema.validate(dataWithoutEmail);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('Email is required');
    });

    it('should reject invalid email', () => {
      const dataWithInvalidEmail = { ...validSignupData, email: 'invalid-email' };
      
      const { error } = signupSchema.validate(dataWithInvalidEmail);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('Please enter a valid email address');
    });

    it('should reject missing password', () => {
      const dataWithoutPassword = { ...validSignupData };
      delete dataWithoutPassword.password;
      
      const { error } = signupSchema.validate(dataWithoutPassword);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('Password is required');
    });

    it('should reject short password', () => {
      const dataWithShortPassword = { ...validSignupData, password: '123' };
      
      const { error } = signupSchema.validate(dataWithShortPassword);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('Password must be at least 6 characters long');
    });

    it('should reject missing birthdate', () => {
      const dataWithoutBirthdate = { ...validSignupData };
      delete dataWithoutBirthdate.birthdate;
      
      const { error } = signupSchema.validate(dataWithoutBirthdate);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('Birthdate is required');
    });

    it('should reject future birthdate', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const dataWithFutureBirthdate = { ...validSignupData, birthdate: futureDate.toISOString().split('T')[0] };
      
      const { error } = signupSchema.validate(dataWithFutureBirthdate);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('Birthdate cannot be in the future');
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@example.com'
      ];

      validEmails.forEach(email => {
        const dataWithValidEmail = { ...validSignupData, email };
        const { error } = signupSchema.validate(dataWithValidEmail);
        expect(error).toBeUndefined();
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user..name@example.com'
      ];

      invalidEmails.forEach(email => {
        const dataWithInvalidEmail = { ...validSignupData, email };
        const { error } = signupSchema.validate(dataWithInvalidEmail);
        expect(error).toBeDefined();
        expect(error.details[0].message).toBe('Please enter a valid email address');
      });
    });
  });

  describe('Login Schema', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    it('should validate correct login data', () => {
      const { error, value } = loginSchema.validate(validLoginData);
      expect(error).toBeUndefined();
      expect(value).toEqual(validLoginData);
    });

    it('should reject missing email', () => {
      const dataWithoutEmail = { ...validLoginData };
      delete dataWithoutEmail.email;
      
      const { error } = loginSchema.validate(dataWithoutEmail);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('"email" is required');
    });

    it('should reject missing password', () => {
      const dataWithoutPassword = { ...validLoginData };
      delete dataWithoutPassword.password;
      
      const { error } = loginSchema.validate(dataWithoutPassword);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('"password" is required');
    });

    it('should reject invalid email format', () => {
      const dataWithInvalidEmail = { ...validLoginData, email: 'invalid-email' };
      
      const { error } = loginSchema.validate(dataWithInvalidEmail);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('"email" must be a valid email');
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ];

      validEmails.forEach(email => {
        const dataWithValidEmail = { ...validLoginData, email };
        const { error } = loginSchema.validate(dataWithValidEmail);
        expect(error).toBeUndefined();
      });
    });
  });
}); 