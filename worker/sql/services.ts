export const serviceSelectSql = `
  SELECT
    Services.ID AS id,
    Services.Name AS name,
    Statuses.Description AS status,
    Services.Description AS description,
    Services.CreatedAt AS createdAt,
    Services.UpdatedAt AS updatedAt
  FROM Services
  JOIN Statuses ON Services.Status = Statuses.ID
`;
