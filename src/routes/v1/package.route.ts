import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { packageController, packageValidation } from '../../modules/package';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('createPackage'), validate(packageValidation.createPackage), packageController.createPackage)
  .get(auth('getPackages'), validate(packageValidation.getPackages), packageController.getPackages);

router
  .route('/:packageId')
  .get(validate(packageValidation.getPackage), packageController.trackPackage)
  .put(auth('updatePackage'), validate(packageValidation.updatePackage), packageController.updatePackage)
  .delete(auth('deletePackage'), validate(packageValidation.deletePackage), packageController.deletePackage);

export default router;

/**
 * @swagger
 * tags:
 *   name: Package
 *   description: >
 *    Package management and retrieval.
 */
/**
 * @swagger
 * /package:
 *   post:
 *     summary: Create new package
 *     description: Admin can create a package.
 *     tags: [Package]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - from_name
 *               - from_address
 *               - from_location
 *               - to_name
 *               - to_location
 *               - to_address
 *               - height
 *               - depth
 *               - width
 *             properties:
 *               description:
 *                 type: string
 *                 description: Detailed description of the package.
 *               from_name:
 *                 type: string
 *                 description: Name of the sender.
 *               from_address:
 *                 type: string
 *                 description: Address of the sender.
 *               from_location:
 *                 type: object
 *                 required:
 *                   - lat
 *                   - lng
 *                 properties:
 *                   lat:
 *                     type: number
 *                     description: Latitude of the sender's location.
 *                   lng:
 *                     type: number
 *                     description: Longitude of the sender's location.
 *                 description: Location of the sender.
 *               to_name:
 *                 type: string
 *                 description: Name of the recipient.
 *               to_address:
 *                 type: string
 *                 description: Address of the recipient.
 *               to_location:
 *                 type: object
 *                 required:
 *                   - lat
 *                   - lng
 *                 properties:
 *                   lat:
 *                     type: number
 *                     description: Latitude of the recipient's location.
 *                   lng:
 *                     type: number
 *                     description: Longitude of the recipient's location.
 *                 description: Location of the recipient.
 *               height:
 *                 type: number
 *                 default: 0
 *                 description: Height of the package.
 *               depth:
 *                 type: number
 *                 default: 0
 *                 description: Depth of the package.
 *               width:
 *                 type: number
 *                 default: 0
 *                 description: Width of the package.
 *             example:
 *               description: "A package containing fragile items."
 *               from_name: "John Doe"
 *               from_address: "123 Elm Street"
 *               from_location:
 *                 lat: 40.7128
 *                 lng: -74.0060
 *               to_name: "Jane Smith"
 *               to_address: "456 Oak Avenue"
 *               to_location:
 *                 lat: 34.0522
 *                 lng: -118.2437
 *               height: 10
 *               depth: 5
 *               width: 8
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /package:
 *   get:
 *     summary: Get all packages
 *     description: Retrieve all packages with optional filters.
 *     tags: [Package]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: active_delivery_id
 *         schema:
 *           type: string
 *         description: Filter by active delivery ID.
 *       - in: query
 *         name: from_name
 *         schema:
 *           type: string
 *         description: Filter by sender's name.
 *       - in: query
 *         name: to_name
 *         schema:
 *           type: string
 *         description: Filter by recipient's name.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by query in the form of field:desc/asc (e.g., createdAt:desc).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 20
 *         description: Maximum number of packages to return.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number.
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Package'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /package/{packageId}:
 *   get:
 *     summary: Track a single package
 *     description: Retrieve the details of a specific package using its unique package ID.
 *     tags: [Package]
 *     parameters:
 *      - in: path
 *        name: packageId
 *        required: true
 *        description: The unique identifier of the package to retrieve.
 *        schema:
 *          type: string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       "404":
 *         description: Package not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /package/{packageId}:
 *   put:
 *     summary: Update a package
 *     description: Update the details of a specific package using its unique package ID.
 *     tags: [Package]
 *     parameters:
 *      - in: path
 *        name: packageId
 *        required: true
 *        description: The unique identifier of the package to update.
 *        schema:
 *          type: string
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               active_delivery_id:
 *                 type: string
 *                 description: The ID of the active delivery associated with the package.
 *               description:
 *                 type: string
 *                 description: Detailed description of the package.
 *               from_name:
 *                 type: string
 *                 description: Name of the sender.
 *               from_address:
 *                 type: string
 *                 description: Address of the sender.
 *               from_location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     description: Latitude of the sender's location.
 *                   lng:
 *                     type: number
 *                     description: Longitude of the sender's location.
 *                 description: Location of the sender.
 *               to_name:
 *                 type: string
 *                 description: Name of the recipient.
 *               to_address:
 *                 type: string
 *                 description: Address of the recipient.
 *               to_location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     description: Latitude of the recipient's location.
 *                   lng:
 *                     type: number
 *                     description: Longitude of the recipient's location.
 *                 description: Location of the recipient.
 *               height:
 *                 type: number
 *                 description: Height of the package.
 *               depth:
 *                 type: number
 *                 description: Depth of the package.
 *               width:
 *                 type: number
 *                 description: Width of the package.
 *             example:
 *               active_delivery_id: "DEL123456"
 *               description: "A package containing electronic items."
 *               from_name: "Alice Johnson"
 *               from_address: "789 Pine Street"
 *               from_location:
 *                 lat: 37.7749
 *                 lng: -122.4194
 *               to_name: "Bob Brown"
 *               to_address: "101 Maple Avenue"
 *               to_location:
 *                 lat: 40.7306
 *                 lng: -73.9352
 *               height: 15
 *               depth: 10
 *               width: 20
 *     responses:
 *       "200":
 *         description: Successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Package not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /package/{packageId}:
 *   delete:
 *     summary: Delete a package
 *     description: Delete a specific package using its unique package ID.
 *     tags: [Package]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the package to delete.
 *     responses:
 *       "200":
 *         description: Package successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Package successfully deleted"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
