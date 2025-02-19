// simple swagger aggregator for api-gateway

export interface AggregatedSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: Record<string, any>;
  components: {
    schemas?: Record<string, any>;
    securitySchemes?: Record<string, any>;
  };
}

const services = [
  { name: "auth", url: "http://auth-service:4001/docs-json" },
];

export async function aggregateSwaggerSpec(): Promise<AggregatedSpec> {
  const aggregatedSpec: AggregatedSpec = {
    openapi: "3.0.0",
    info: {
      title: "Notate API",
      version: "1.0.0",
      description: "Aggregated API documentation from all Notate services",
    },
    paths: {},
    components: {
      schemas: {},
      securitySchemes: {},
    },
  };

  for (const service of services) {
    try {
      const response = await fetch(service.url);
      if (!response.ok) {
        console.error(
          `Failed to fetch spec from ${service.name}: ${response.statusText}`
        );
        continue;
      }
      const serviceSpec = await response.json();

      aggregatedSpec.paths = {
        ...aggregatedSpec.paths,
        ...serviceSpec.paths,
      };

      if (serviceSpec.components?.schemas) {
        aggregatedSpec.components.schemas = {
          ...aggregatedSpec.components.schemas,
          ...serviceSpec.components.schemas,
        };
      }

      if (serviceSpec.components?.securitySchemes) {
        aggregatedSpec.components.securitySchemes = {
          ...aggregatedSpec.components.securitySchemes,
          ...serviceSpec.components.securitySchemes,
        };
      }
    } catch (error) {
      console.error(`Error aggregating spec from ${service.name}:`, error);
    }
  }

  return aggregatedSpec;
}
