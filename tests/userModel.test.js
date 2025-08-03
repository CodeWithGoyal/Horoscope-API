const User = require('../models/User');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  let validUserData;
  
  beforeEach(() => {
    validUserData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      birthdate: new Date('1990-01-01')
    };
  });

  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const user = new User(validUserData);
      const savedUser = await user.save();

      expect(savedUser.name).toBe(validUserData.name);
      expect(savedUser.email).toBe(validUserData.email);
      expect(savedUser.birthdate).toEqual(validUserData.birthdate);
      expect(savedUser._id).toBeDefined();
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    it('should hash password before saving', async () => {
      const user = new User(validUserData);
      const savedUser = await user.save();

      expect(savedUser.password).not.toBe(validUserData.password);
      expect(savedUser.password).toMatch(/^\$2[aby]\$\d{1,2}\$[./A-Za-z0-9]{53}$/);
    });

    it('should not hash password if not modified', async () => {
      const user = new User(validUserData);
      const savedUser = await user.save();
      const originalHash = savedUser.password;

      // Update name only
      savedUser.name = 'Updated Name';
      await savedUser.save();

      // Use the already updated instance
      expect(savedUser.password).toBe(originalHash);
    });

    it('should trim name and email', async () => {
      const userDataWithSpaces = {
        ...validUserData,
        name: '  Test User  ',
        email: '  test@example.com  '
      };

      const user = new User(userDataWithSpaces);
      const savedUser = await user.save();

      expect(savedUser.name).toBe('Test User');
      expect(savedUser.email).toBe('test@example.com');
    });

    it('should convert email to lowercase', async () => {
      const userDataWithUppercaseEmail = {
        ...validUserData,
        email: 'TEST@EXAMPLE.COM'
      };

      const user = new User(userDataWithUppercaseEmail);
      const savedUser = await user.save();

      expect(savedUser.email).toBe('test@example.com');
    });
  });

  describe('Password Comparison', () => {
    it('should correctly compare passwords', async () => {
      const user = new User(validUserData);
      const savedUser = await user.save();

      const isCorrectPassword = await savedUser.comparePassword(validUserData.password);
      const isWrongPassword = await savedUser.comparePassword('wrongpassword');

      expect(isCorrectPassword).toBe(true);
      expect(isWrongPassword).toBe(false);
    });
  });

  describe('toJSON Method', () => {
    it('should exclude password from JSON output', async () => {
      const user = new User(validUserData);
      const savedUser = await user.save();

      const userJson = savedUser.toJSON();

      expect(userJson).toHaveProperty('name');
      expect(userJson).toHaveProperty('email');
      expect(userJson).toHaveProperty('birthdate');
      expect(userJson).toHaveProperty('_id');
      expect(userJson).toHaveProperty('createdAt');
      expect(userJson).toHaveProperty('updatedAt');
      expect(userJson).not.toHaveProperty('password');
    });
  });

  describe('Validation', () => {
    it('should require name', async () => {
      const userDataWithoutName = { ...validUserData };
      delete userDataWithoutName.name;

      const user = new User(userDataWithoutName);
      await expect(user.save()).rejects.toThrow();
    });

    it('should require email', async () => {
      const userDataWithoutEmail = { ...validUserData };
      delete userDataWithoutEmail.email;

      const user = new User(userDataWithoutEmail);
      await expect(user.save()).rejects.toThrow();
    });

    it('should require password', async () => {
      const userDataWithoutPassword = { ...validUserData };
      delete userDataWithoutPassword.password;

      const user = new User(userDataWithoutPassword);
      await expect(user.save()).rejects.toThrow();
    });

    it('should require birthdate', async () => {
      const userDataWithoutBirthdate = { ...validUserData };
      delete userDataWithoutBirthdate.birthdate;

      const user = new User(userDataWithoutBirthdate);
      await expect(user.save()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const userDataWithInvalidEmail = { ...validUserData, email: 'invalid-email' };

      const user = new User(userDataWithInvalidEmail);
      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce minimum name length', async () => {
      const userDataWithShortName = { ...validUserData, name: 'A' };

      const user = new User(userDataWithShortName);
      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce maximum name length', async () => {
      const userDataWithLongName = { ...validUserData, name: 'A'.repeat(51) };

      const user = new User(userDataWithLongName);
      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce minimum password length', async () => {
      const userDataWithShortPassword = { ...validUserData, password: '123' };

      const user = new User(userDataWithShortPassword);
      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('Timestamps', () => {
    it('should set createdAt and updatedAt on creation', async () => {
      const user = new User(validUserData);
      const savedUser = await user.save();

      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
      expect(savedUser.createdAt).toEqual(savedUser.updatedAt);
    });

    it('should update updatedAt on modification', async () => {
      const user = new User(validUserData);
      const savedUser = await user.save();
      const originalUpdatedAt = savedUser.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      savedUser.name = 'Updated Name';
      const updatedUser = await savedUser.save();

      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
}); 