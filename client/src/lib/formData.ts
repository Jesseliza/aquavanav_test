import { Project } from "@shared/schema";

export function createProjectFormData(
  project: Partial<Project>,
  vesselImage: File | null,
): FormData {
  const formData = new FormData();

  // Append all project fields to formData
  for (const key in project) {
    if (Object.prototype.hasOwnProperty.call(project, key)) {
      const value = project[key as keyof typeof project];
      if (value === null || value === undefined) {
        continue;
      }
      if (key === "locations" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (typeof value === "boolean") {
        formData.append(key, value.toString());
      } else if (typeof value !== "string") {
        formData.append(key, String(value));
      } else {
        formData.append(key, value);
      }
    }
  }

  // Append the vessel image if it exists
  if (vesselImage) {
    formData.append("vesselImage", vesselImage);
  }

  return formData;
}
