"use server";

import { fetcher, poster, deleter, updater } from "@/lib/base.api";
import type { Experience } from "@/types/experience";
import type { FormData } from "@/components/dashboard/experience/constants";
import { formatYear } from "@/lib/utils/date";

export async function getExperiences(): Promise<Experience[]> {
  try {
    const rawData = await fetcher<Experience[]>("/experiences");

    if (!Array.isArray(rawData)) {
      return [];
    }

    return rawData.map((item): Experience => {
      return {
        ...item,
        from_year: formatYear(item.from_year),
        to_year: formatYear(item.to_year),
      };
    });
  } catch (error) {
    console.error("Error in getExperiences server action:", error);
    return [];
  }
}

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createExperience(
  data: FormData,
): Promise<ActionResult<Experience>> {
  try {
    const response = await poster<Experience>("/experiences", data);

    // Support both wrapped and unwrapped NestJS API responses
    const rawExperience = response?.data || response;

    // If the backend returns the created experience document, parse and return it
    if (rawExperience && rawExperience._id) {
      return {
        success: true,
        data: {
          ...rawExperience,
          from_year: formatYear(rawExperience.from_year),
          to_year: formatYear(rawExperience.to_year),
        },
      };
    }

    // If response succeeded but did not return the document body (e.g. empty 201), return success: true without data
    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error in createExperience server action:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while creating experience.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function deleteExperience(
  id: string,
): Promise<ActionResult<void>> {
  try {
    await deleter<void>(`/experiences/${id}`);
    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error in deleteExperience server action:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete experience record.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function updateExperience(
  id: string,
  data: FormData,
): Promise<ActionResult<Experience>> {
  try {
    const response = await updater<Experience>(`/experiences/${id}`, data);

    // Support both wrapped and unwrapped NestJS API responses
    const rawExperience = response?.data || response;

    if (rawExperience && rawExperience._id) {
      return {
        success: true,
        data: {
          ...rawExperience,
          from_year: formatYear(rawExperience.from_year),
          to_year: formatYear(rawExperience.to_year),
        },
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error in updateExperience server action:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update experience record.";
    return {
      success: false,
      error: message,
    };
  }
}
