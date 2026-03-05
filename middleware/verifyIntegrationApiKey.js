export const verifyIntegrationApiKey = (req, res, next) => {
  const providedKey = req.headers["x-api-key"];
  const expectedKey = process.env.INTEGRATION_API_KEY;

  if (!expectedKey) {
    return res.status(503).json({
      success: false,
      message: "Integration API key is not configured",
    });
  }

  if (!providedKey || providedKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      message: "Invalid API key",
    });
  }

  next();
};

