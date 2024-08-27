import express, { Router } from 'express';
import { validate } from '../../modules/validate';
// import { auth } from '../../modules/auth';
import { deliveryController, deliveryValidation } from '../../modules/delivery';

const router: Router = express.Router();

router
  .route('/')
  .post(validate(deliveryValidation.createDelivery), deliveryController.createDelivery)
  .get(validate(deliveryValidation.getDeliveries), deliveryController.getDeliverys);

router
  .route('/:deliveryId')
  .get(validate(deliveryValidation.getDelivery), deliveryController.trackDelivery)
  .put(validate(deliveryValidation.updateDelivery), deliveryController.updateDelivery)
  .delete(validate(deliveryValidation.deleteDelivery), deliveryController.deleteDelivery);

export default router;

/**
 * @swagger
 * tags:
 *   name: Delivery
 *   description: >
 *    Delivery management and retrieval.
 */

/**
 * @swagger
 * /delivery:
 *   post:
 *     summary: Create a new delivery
 *     description: Allows the creation of a new delivery entry, including package information, pickup, start, and end times, location details, and status.
 *     tags: [Delivery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - package_id
 *             properties:
 *               package_id:
 *                 type: string
 *                 description: ID of the package associated with the delivery.
 *             example:
 *               package_id: "DELA17244"
 *     responses:
 *       "201":
 *         description: Delivery created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       "400":
 *         description: Bad request due to invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /delivery:
 *   get:
 *     summary: Get all deliveries
 *     description: Retrieves a list of all deliveries with optional filtering, sorting, and pagination.
 *     tags: [Delivery]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - Open
 *             - PickUp
 *             - InTransit
 *             - Delivered
 *             - Failed
 *         description: Filter deliveries by status.
 *       - in: query
 *         name: package_id
 *         schema:
 *           type: string
 *         description: Filter deliveries by package ID.
 *       - in: query
 *         name: pickup_time
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter deliveries by pickup time.
 *       - in: query
 *         name: start_time
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter deliveries by start time.
 *       - in: query
 *         name: end_time
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter deliveries by end time.
 *       - in: query
 *         name: from_location[lat]
 *         schema:
 *           type: number
 *         description: Latitude of the location to filter deliveries from.
 *       - in: query
 *         name: from_location[lng]
 *         schema:
 *           type: number
 *         description: Longitude of the location to filter deliveries from.
 *       - in: query
 *         name: to_location[lat]
 *         schema:
 *           type: number
 *         description: Latitude of the location to filter deliveries to.
 *       - in: query
 *         name: to_location[lng]
 *         schema:
 *           type: number
 *         description: Longitude of the location to filter deliveries to.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           description: Field by which to sort the results.
 *       - in: query
 *         name: projectBy
 *         schema:
 *           type: string
 *           description: Fields to include or exclude in the results.
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *           description: Populate related fields.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           format: int32
 *           description: Number of deliveries to return per page.
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           format: int32
 *           description: Page number for pagination.
 *     responses:
 *       "200":
 *         description: Successfully retrieved list of deliveries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Delivery'
 *                 page:
 *                   type: number
 *                   description: Current page number.
 *                 limit:
 *                   type: number
 *                   description: Number of results per page.
 *                 totalPages:
 *                   type: number
 *                   description: Total number of pages.
 *                 totalResults:
 *                   type: number
 *                   description: Total number of results.
 *             example:
 *               results:
 *                 - delivery_id: "d12345"
 *                   package_id: "p12345"
 *                   pickup_time: "2024-08-25T10:00:00Z"
 *                   start_time: "2024-08-25T10:15:00Z"
 *                   end_time: "2024-08-25T11:00:00Z"
 *                   location:
 *                     lat: 40.7128
 *                     lng: -74.0060
 *                   status: InTransit
 *               page: 1
 *               limit: 20
 *               totalPages: 5
 *               totalResults: 100
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /delivery/{deliveryId}:
 *   get:
 *     summary: Track a single delivery
 *     description: Retrieves details of a specific delivery by its ID.
 *     tags: [Delivery]
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the delivery to retrieve.
 *     responses:
 *       "200":
 *         description: Successfully retrieved delivery details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *             example:
 *               delivery_id: "d12345"
 *               package_id: "p12345"
 *               pickup_time: "2024-08-25T10:00:00Z"
 *               start_time: "2024-08-25T10:15:00Z"
 *               end_time: "2024-08-25T11:00:00Z"
 *               location:
 *                 lat: 40.7128
 *                 lng: -74.0060
 *               status: InTransit
 *       "400":
 *         description: Invalid delivery ID supplied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 code: 400
 *                 message: "Invalid delivery ID supplied"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Delivery not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 code: 404
 *                 message: "Delivery not found"
 */

/**
 * @swagger
 * /delivery/{deliveryId}:
 *   put:
 *     summary: Update a delivery
 *     description: Updates the details of a specific delivery using its unique delivery ID.
 *     tags: [Delivery]
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the delivery to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               package_id:
 *                 type: string
 *                 description: ID of the associated package.
 *               pickup_time:
 *                 type: string
 *                 format: date-time
 *                 description: Time when the delivery was picked up.
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: Time when the delivery started.
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 description: Time when the delivery ended.
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     format: float
 *                     description: Latitude of the delivery location.
 *                   lng:
 *                     type: number
 *                     format: float
 *                     description: Longitude of the delivery location.
 *                 description: Location coordinates of the delivery.
 *               status:
 *                 type: string
 *                 enum:
 *                   - Open
 *                   - PickUp
 *                   - InTransit
 *                   - Delivered
 *                   - Failed
 *                 description: Current status of the delivery.
 *             example:
 *               package_id: "p12345"
 *               pickup_time: "2024-08-25T10:00:00Z"
 *               start_time: "2024-08-25T10:15:00Z"
 *               end_time: "2024-08-25T11:00:00Z"
 *               location:
 *                 lat: 40.7128
 *                 lng: -74.0060
 *               status: InTransit
 *     responses:
 *       "200":
 *         description: Successfully updated delivery details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *             example:
 *               delivery_id: "d12345"
 *               package_id: "p12345"
 *               pickup_time: "2024-08-25T10:00:00Z"
 *               start_time: "2024-08-25T10:15:00Z"
 *               end_time: "2024-08-25T11:00:00Z"
 *               location:
 *                 lat: 40.7128
 *                 lng: -74.0060
 *               status: InTransit
 *       "400":
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 code: 400
 *                 message: "Invalid request parameters"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Delivery not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 code: 404
 *                 message: "Delivery not found"
 */

/**
 * @swagger
 * /delivery/{deliveryId}:
 *   delete:
 *     summary: Delete a delivery
 *     description: Delete a specific delivery using its unique package ID.
 *     tags: [Delivery]
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the delivery to delete.
 *     responses:
 *       "200":
 *         description: Delivery successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delivery successfully deleted"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
