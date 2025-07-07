const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");
const controller = require("../controllers/product.controller");

router.get("/", controller.getAll);
router.post("/", auth, checkRole("admin"), controller.add);
router.put("/:id", auth, checkRole("admin"), controller.update);
router.delete("/:id", auth, checkRole("admin"), controller.delete);

module.exports = router;
