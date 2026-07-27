"use server";

import { fetcher, poster, deleter, updater } from "@/lib/base.api";
import type { Education } from "@/types/education";
import type { FormData } from "@/components/dashboard/education/constants";
import { formatYear } from "@/lib/utils/date";

interface RawEducation {
  _id?: string;
  id?: string;
  university: string;
  degree: string;
  major: string;
  start_year: string;
  end_year: string;
  descr?: string;
}

export async function getEducations(): Promise<Education[]> {
  try {
    const rawData = await fetcher<RawEducation[]>("/educations");

    if (!Array.isArray(rawData)) {
      return [];
    }

    return rawData.map((item): Education => {
      return {
        ...item,
        id: item._id || item.id || "",
        start_year: formatYear(item.start_year),
        end_year: formatYear(item.end_year),
      };
    });
  } catch (error) {
    console.error("Error in getEducations server action:", error);
    return [];
  }
}

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createEducation(
  data: FormData,
): Promise<ActionResult<Education>> {
  try {
    const response = await poster<RawEducation>("/educations", data);
    const rawEducation = response?.data || response;

    if (rawEducation && (rawEducation.id || rawEducation._id)) {
      return {
        success: true,
        data: {
          ...rawEducation,
          id: rawEducation._id || rawEducation.id || "",
          start_year: formatYear(rawEducation.start_year),
          end_year: formatYear(rawEducation.end_year),
        },
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error in createEducation server action:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while creating education record.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function deleteEducation(id: string): Promise<ActionResult<void>> {
  try {
    await deleter<void>(`/educations/${id}`);
    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error in deleteEducation server action:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete education record.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function updateEducation(
  id: string,
  data: FormData,
): Promise<ActionResult<Education>> {
  try {
    const response = await updater<RawEducation>(`/educations/${id}`, data);
    const rawEducation = response?.data || response;

    if (rawEducation && (rawEducation.id || rawEducation._id)) {
      return {
        success: true,
        data: {
          ...rawEducation,
          id: rawEducation._id || rawEducation.id || "",
          start_year: formatYear(rawEducation.start_year),
          end_year: formatYear(rawEducation.end_year),
        },
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error in updateEducation server action:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update education record.";
    return {
      success: false,
      error: message,
    };
  }
}
