"use server";

import { fetcher, poster, deleter, updater } from "@/lib/base.api";
import type { CaseStudy } from "@/types/caseStudy";
import type { FormData } from "@/components/dashboard/case-studies/constants";

export async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    const rawData = await fetcher<CaseStudy[]>("/case-studies");

    if (!Array.isArray(rawData)) {
      return [];
    }

    return rawData.map((item): CaseStudy => {
      return {
        ...item,
        id: item._id || (item as any).id || "",
      };
    });
  } catch (error) {
    console.error("Error in getCaseStudies server action:", error);
    return [];
  }
}

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createCaseStudy(
  data: FormData,
): Promise<ActionResult<CaseStudy>> {
  try {
    // Map tech (comma-separated string) to string[]
    const techArray = data.tech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: data.title,
      tag: data.tag,
      description: data.description,
      longDescription: data.description, // Satisfy backend DTO requirement
      tech: techArray,
      githubUrl: data.githubUrl?.trim() || undefined,
      demoUrl: data.demoUrl?.trim() || undefined,
    };

    const response = await poster<CaseStudy>("/case-studies", payload);
    const rawCaseStudy = response?.data || response;

    if (rawCaseStudy && (rawCaseStudy._id || (rawCaseStudy as any).id)) {
      return {
        success: true,
        data: {
          ...rawCaseStudy,
          id: rawCaseStudy._id || (rawCaseStudy as any).id || "",
        },
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error in createCaseStudy server action:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while creating case study.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function deleteCaseStudy(id: string): Promise<ActionResult<void>> {
  try {
    await deleter<void>(`/case-studies/${id}`);
    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error in deleteCaseStudy server action:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete case study.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function updateCaseStudy(
  id: string,
  data: FormData,
): Promise<ActionResult<CaseStudy>> {
  try {
    // Map tech (comma-separated string) to string[]
    const techArray = data.tech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: data.title,
      tag: data.tag,
      description: data.description,
      longDescription: data.description, // Satisfy backend DTO requirement
      tech: techArray,
      githubUrl: data.githubUrl?.trim() || undefined,
      demoUrl: data.demoUrl?.trim() || undefined,
    };

    const response = await updater<CaseStudy>(`/case-studies/${id}`, payload);
    const rawCaseStudy = response?.data || response;

    if (rawCaseStudy && (rawCaseStudy._id || (rawCaseStudy as any).id)) {
      return {
        success: true,
        data: {
          ...rawCaseStudy,
          id: rawCaseStudy._id || (rawCaseStudy as any).id || "",
        },
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error in updateCaseStudy server action:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update case study.";
    return {
      success: false,
      error: message,
    };
  }
}
