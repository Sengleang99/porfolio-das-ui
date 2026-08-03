"use server";

import { fetcher } from "@/lib/base.api";

export interface DashboardCounts {
  caseStudies: number;
  techStacks: number;
  messages: number;       
}

export async function getDashboardCounts(): Promise<DashboardCounts> {
  try {
    const rawData = await fetcher<any>("/dashboard/count");
    const data = rawData?.data || rawData;
    return {
      caseStudies: data?.caseStudies ?? 0,
      techStacks: data?.techStacks ?? 0,
      messages: data?.messages ?? 0,
    };
  } catch (error: any) {
    if (
      error?.digest === "DYNAMIC_SERVER_USAGE" ||
      error?.message?.includes("DYNAMIC_SERVER_USAGE")
    ) {
      throw error;
    }
    console.error("Error fetching dashboard counts:", error);
    return {
      caseStudies: 0,
      techStacks: 0,
      messages: 0,
    };
  }
}
