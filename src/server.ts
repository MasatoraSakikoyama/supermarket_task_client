/**
 * Express server for serving API documentation
 *
 * This server provides:
 * - /openapi.json - OpenAPI specification
 * - /docs - Swagger UI documentation
 * - /redoc - ReDoc documentation
 */

import express from "express";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

// Load OpenAPI specification
const openapiPath = path.join(__dirname, "..", "public", "openapi.json");
const openApiSpec = JSON.parse(fs.readFileSync(openapiPath, "utf-8"));

// Serve OpenAPI JSON
app.get("/openapi.json", (_req, res) => {
  res.json(openApiSpec);
});

// Swagger UI setup
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Supermarket Task API - Swagger UI",
  })
);

// ReDoc HTML page
const redocHtml = `
<!DOCTYPE html>
<html>
  <head>
    <title>Supermarket Task API - ReDoc</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <redoc spec-url='/openapi.json'></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
</html>
`;

app.get("/redoc", (_req, res) => {
  res.send(redocHtml);
});

// Root endpoint
app.get("/", (_req, res) => {
  res.json({
    message: "Supermarket Task Client API Documentation Server",
    endpoints: {
      openapi: "/openapi.json",
      swagger: "/docs",
      redoc: "/redoc",
    },
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`- OpenAPI spec: http://localhost:${PORT}/openapi.json`);
    console.log(`- Swagger UI: http://localhost:${PORT}/docs`);
    console.log(`- ReDoc: http://localhost:${PORT}/redoc`);
  });
}

export default app;
