const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/cart.controller");

router.get("/", auth, controller.getCart);
router.post("/", auth, controller.addToCart);
router.delete("/:itemId", auth, controller.removeFromCart);

module.exports = router;
