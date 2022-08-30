export const config = {
  urls: [
    {
      url: 'specs/inventory/openapi/inventoryApi/v1.yml',
      name: 'InventoryApiV1',
      boundedContext: 'inventory',
    },
    {
      url: 'specs/inventory/openapi/inventoryApi/v2.yml',
      name: 'InventoryApiV2',
      boundedContext: 'inventory',
    },
    {
      url: 'specs/nrs/openapi/nrsApi/v1.yml',
      name: 'NrsApiV1',
      boundedContext: 'nrs',
    },
    {
      url: 'specs/nrs/openapi/nrsApi/v2.yml',
      name: 'NrsApiV2',
      boundedContext: 'nrs',
    },
    {
      url: 'specs/pet/openapi/petApi/v1.yml',
      name: 'PetApiV1',
      boundedContext: 'pet',
    },
    {
      url: 'specs/planet/openapi/planetApi/v1.yml',
      name: 'PlanetApiV1',
      boundedContext: 'planet',
    },
  ],
}
