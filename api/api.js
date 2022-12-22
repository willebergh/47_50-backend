const express = require("express");
const reqAuthMiddleware = require("../middleware/reqAuth");
const useOrgMiddleware = require("../middleware/useOrg");

const router = express.Router();

/**
 * Creating routes for all functions under /auth
 */
router.use("/auth/login", require("./auth/login"));
router.use("/auth/register", require("./auth/register"));
router.use("/auth/logout", reqAuthMiddleware, require("./auth/logout"));

/**
 * Routes for user functions
 */

router.use("/user/me", reqAuthMiddleware, require("./user/me"));

/**
 * Creating routes for the client side. For the players to use
 */

router.use("/player", require("./player"));

/**
 * Creating routes for all functions under /org with reqAuthMiddleware!
 */
router.param("org_id", (req, res, next) => {
	req.org_id = req.params.org_id;
	next();
});
router.use("/org/:org_id/info", useOrgMiddleware, require("./org/info"));
router.use("/org/:org_id/event", useOrgMiddleware, require("./org/event"));
router.use("/org/:org_id/update", useOrgMiddleware, require("./org/update"));
router.use("/org/:org_id/image", require("./org/image"));

/**
 * Creating routes for all functions under /callback
 */
router.use("/callback/purchaseSuccess", require("./callback/purchaseSuccess"));

module.exports = router;
