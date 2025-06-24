import { Router } from 'express';
import { userController } from '../../controllers/user-controller';
import { authMiddleware } from '../../utils/auth';

const router = Router();

router
	.route('/')
	.post(userController.createUser)
	.put(authMiddleware, userController.saveBook);
router.route('/login').post(userController.login);
router.route('/me').get(authMiddleware, userController.getSingleUser);
router
	.route('/books/:bookId')
	.delete(authMiddleware, userController.deleteBook);

export default router;
