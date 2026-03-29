const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const mockUser = { id: 1, email: 'test@example.com', passwordHash: await bcrypt.hash('password123', 10), role: 'SUPPLIER' };

  if (email !== mockUser.email || !(await bcrypt.compare(password, mockUser.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: mockUser.id, email: mockUser.email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};