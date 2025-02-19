import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { type Express } from "express";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Notate Submission API",
            version: "1.0.0",
            description: "Notate's public homework submission API",
        },
        servers: [{ url: "http://localhost:4003" }],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
