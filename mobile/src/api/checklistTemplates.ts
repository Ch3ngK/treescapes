import { API_BASE_URL } from "./config";

export type ChecklistItem = {
    id: number;
    code: string;
    description: string;
    max_points: number;
    display_order: number; 
};

export type ChecklistSection = {
  id: number;
  code: string;
  title: string;
  max_points: number;
  display_order: number;
  items: ChecklistItem[];
};

export type ChecklistTemplate = {
  id: number;
  name: string;
  description: string | null;
  version: string | null;
  is_active: boolean;
  sections: ChecklistSection[];
};

export async function getActiveChecklistTemplate(
    token: string
): Promise<ChecklistTemplate> {
    const response = await fetch(`${API_BASE_URL}/checklist-templates/active`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to load checklist template.")
    }

    return response.json();
}